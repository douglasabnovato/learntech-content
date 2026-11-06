/* repositorio-d1.test.ts — SQL real dos adaptadores D1 (acessos e mensagens) contra SQLite com as migrações aplicadas.
 * O D1 é simulado por tests/apoio/d1-sqlite.ts; os limites dessa simulação estão descritos lá. */
import { describe, it, expect, beforeEach } from "vitest";
import type { DatabaseSync } from "node:sqlite";
import { repositorioD1 } from "../src/acessos/repositorio-d1";
import { repositorioMensagensD1 } from "../src/mensagens/repositorio-d1";
import type { RepositorioAcessos } from "../src/acessos/repositorio";
import type { RepositorioMensagens } from "../src/mensagens/repositorio";
import { d1EmMemoria } from "./apoio/d1-sqlite";

let sqlite: DatabaseSync;
let acessos: RepositorioAcessos;
let mensagens: RepositorioMensagens;

beforeEach(() => {
  const banco = d1EmMemoria();
  sqlite = banco.sqlite;
  acessos = repositorioD1(banco.d1);
  mensagens = repositorioMensagensD1(banco.d1);
});

/* Acesso com valores padrão, sobrescritos por campo. */
const acesso = (c: Partial<Parameters<RepositorioAcessos["inserir"]>[0]> = {}) => ({
  nome: "Maria da Silva", email: "maria@exemplo.com", projeto: "learn-tech", pagina: "/programs", criadoEm: "2026-09-27T12:00:00.000Z", ...c,
});

/* Mensagem com valores padrão, sobrescritos por campo. */
const mensagem = (c: Partial<Parameters<RepositorioMensagens["inserir"]>[0]> = {}) => ({
  criadoEm: "2026-09-27T12:00:00.000Z", projeto: "learn-tech", motivo: "duvida-programa", nome: "Maria da Silva",
  email: "maria@exemplo.com", mensagem: "Olá!", pagina: null, ...c,
});

describe("repositório D1 de acessos", () => {
  it("insere, devolve ids crescentes e lista do mais recente para o mais antigo", async () => {
    const a = await acessos.inserir(acesso());
    const b = await acessos.inserir(acesso({ email: "joao@exemplo.com", criadoEm: "2026-09-28T08:00:00.000Z", pagina: null }));
    expect(b).toBeGreaterThan(a);
    const linhas = await acessos.listar({ limite: 10 });
    expect(linhas.map((l) => l.id)).toEqual([b, a]);
    expect(linhas[0]).toEqual({ id: b, nome: "Maria da Silva", email: "joao@exemplo.com", projeto: "learn-tech", pagina: null, criadoEm: "2026-09-28T08:00:00.000Z" });
  });

  it("existeDesde considera e-mail, projeto e horário", async () => {
    await acessos.inserir(acesso());
    expect(await acessos.existeDesde("maria@exemplo.com", "learn-tech", "2026-09-27T11:30:00.000Z")).toBe(true);
    expect(await acessos.existeDesde("maria@exemplo.com", "learn-tech", "2026-09-27T12:00:00.001Z")).toBe(false);
    expect(await acessos.existeDesde("maria@exemplo.com", "career", "2026-09-27T11:30:00.000Z")).toBe(false);
    expect(await acessos.existeDesde("outra@exemplo.com", "learn-tech", "2026-09-27T11:30:00.000Z")).toBe(false);
  });

  it("listar filtra por projeto e data e respeita o limite", async () => {
    await acessos.inserir(acesso({ criadoEm: "2026-09-01T10:00:00.000Z" }));
    await acessos.inserir(acesso({ projeto: "career", criadoEm: "2026-09-20T10:00:00.000Z" }));
    await acessos.inserir(acesso({ criadoEm: "2026-09-25T10:00:00.000Z" }));
    expect(await acessos.listar({ projeto: "learn-tech", limite: 10 })).toHaveLength(2);
    expect(await acessos.listar({ desde: "2026-09-15", limite: 10 })).toHaveLength(2);
    expect(await acessos.listar({ projeto: "learn-tech", desde: "2026-09-15", limite: 10 })).toHaveLength(1);
    expect(await acessos.listar({ limite: 1 })).toHaveLength(1);
  });

  it("resumir conta total, pessoas, por projeto e por dia a partir da data", async () => {
    await acessos.inserir(acesso({ criadoEm: "2026-08-01T10:00:00.000Z" }));
    await acessos.inserir(acesso({ criadoEm: "2026-09-27T10:00:00.000Z" }));
    await acessos.inserir(acesso({ email: "joao@exemplo.com", projeto: "tools", criadoEm: "2026-09-27T11:00:00.000Z" }));
    const r = await acessos.resumir("2026-09-01");
    expect(r.total).toBe(3);
    expect(r.pessoas).toBe(2);
    expect(r.porProjeto).toEqual([{ projeto: "learn-tech", acessos: 2, pessoas: 1 }, { projeto: "tools", acessos: 1, pessoas: 1 }]);
    expect(r.porDia).toEqual([{ dia: "2026-09-27", acessos: 2 }]);
  });

  it("resumir com a tabela vazia devolve zeros", async () => {
    expect(await acessos.resumir("2026-09-01")).toEqual({ total: 0, pessoas: 0, porProjeto: [], porDia: [] });
  });

  it("apaga por e-mail e antes de uma data, devolvendo quantos saíram", async () => {
    await acessos.inserir(acesso({ criadoEm: "2025-01-01T00:00:00.000Z" }));
    await acessos.inserir(acesso());
    await acessos.inserir(acesso({ email: "joao@exemplo.com" }));
    expect(await acessos.apagarAntesDe("2026-01-01T00:00:00.000Z")).toBe(1);
    expect(await acessos.apagarPorEmail("maria@exemplo.com")).toBe(1);
    expect(await acessos.apagarPorEmail("ninguem@exemplo.com")).toBe(0);
    expect((await acessos.listar({ limite: 10 })).map((l) => l.email)).toEqual(["joao@exemplo.com"]);
  });

  it("o CHECK da migração recusa projeto inválido", async () => {
    await expect(acessos.inserir(acesso({ projeto: "outro-site" }))).rejects.toThrow(/CHECK/i);
    expect(sqlite.prepare("SELECT COUNT(*) AS n FROM acessos").get()).toEqual({ n: 0 });
  });
});

describe("repositório D1 de mensagens", () => {
  it("insere e lista com todos os campos", async () => {
    const id = await mensagens.inserir(mensagem({ pagina: "/falaae" }));
    expect(await mensagens.listar({ limite: 10 })).toEqual([{ id, ...mensagem({ pagina: "/falaae" }) }]);
  });

  it("existeIgualDesde exige mesmo e-mail, mesmo texto e horário dentro da janela", async () => {
    await mensagens.inserir(mensagem());
    expect(await mensagens.existeIgualDesde("maria@exemplo.com", "Olá!", "2026-09-27T11:50:00.000Z")).toBe(true);
    expect(await mensagens.existeIgualDesde("maria@exemplo.com", "Outro texto", "2026-09-27T11:50:00.000Z")).toBe(false);
    expect(await mensagens.existeIgualDesde("maria@exemplo.com", "Olá!", "2026-09-27T12:10:00.000Z")).toBe(false);
  });

  it("listar filtra por projeto, motivo, e-mail e data", async () => {
    await mensagens.inserir(mensagem({ criadoEm: "2026-09-01T10:00:00.000Z" }));
    await mensagens.inserir(mensagem({ motivo: "privacidade", criadoEm: "2026-09-20T10:00:00.000Z" }));
    await mensagens.inserir(mensagem({ email: "joao@exemplo.com", projeto: "career", criadoEm: "2026-09-25T10:00:00.000Z" }));
    expect(await mensagens.listar({ projeto: "career", limite: 10 })).toHaveLength(1);
    expect(await mensagens.listar({ motivo: "privacidade", limite: 10 })).toHaveLength(1);
    expect(await mensagens.listar({ email: "maria@exemplo.com", limite: 10 })).toHaveLength(2);
    expect(await mensagens.listar({ email: "maria@exemplo.com", desde: "2026-09-15", limite: 10 })).toHaveLength(1);
  });

  it("apaga por e-mail e antes de uma data", async () => {
    await mensagens.inserir(mensagem({ criadoEm: "2025-01-01T00:00:00.000Z" }));
    await mensagens.inserir(mensagem());
    await mensagens.inserir(mensagem({ email: "joao@exemplo.com" }));
    expect(await mensagens.apagarAntesDe("2026-01-01T00:00:00.000Z")).toBe(1);
    expect(await mensagens.apagarPorEmail("maria@exemplo.com")).toBe(1);
    expect(await mensagens.listar({ limite: 10 })).toHaveLength(1);
  });

  it("o CHECK da migração recusa projeto inválido", async () => {
    await expect(mensagens.inserir(mensagem({ projeto: "outro-site" }))).rejects.toThrow(/CHECK/i);
  });
});

/* Fim de repositorio-d1.test.ts */
