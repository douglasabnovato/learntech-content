/* disciplina.test.ts — tipo "disciplina" (#47, ADR 14): referência no formato fixo, ano "a confirmar" e o exemplo da DCC013. */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { disciplinaSchema, montarReferencia, ANO_A_CONFIRMAR } from "../src/schemas/disciplina";
import { carregarConteudo, montarRecursos } from "../scripts/lib/conteudo";

const RAIZ = path.resolve(__dirname, "..");
const dcc013 = () => JSON.parse(fs.readFileSync(path.join(__dirname, "apoio", "disciplina-dcc013.json"), "utf8"));

describe("tipo disciplina", () => {
  it("o exemplo da DCC013 passa no schema", () => {
    const r = disciplinaSchema.safeParse(dcc013());
    expect(r.success, JSON.stringify(r.error?.issues)).toBe(true);
  });

  it("a referência segue o formato fixo do autor", () => {
    expect(
      montarReferencia({
        nome: "Estrutura de Dados I",
        codigo: "DCC013",
        curso: "Ciência da Computação",
        grau: "Bacharelado",
        instituicao: "UFJF",
        ano: "2009",
      }),
    ).toBe(
      "Conteúdo criado a partir do trabalho da disciplina de Estrutura de Dados I (DCC013) do curso de Ciência da Computação do Bacharelado da UFJF em 2009.",
    );
  });

  it("a referência é obrigatória e precisa bater com os campos", () => {
    const { referencia: _r, ...semReferencia } = dcc013();
    expect(disciplinaSchema.safeParse(semReferencia).success).toBe(false);
    expect(disciplinaSchema.safeParse({ ...dcc013(), referencia: "Conteúdo da disciplina." }).success).toBe(false);
  });

  it('o ano aceita 4 dígitos ou "a confirmar", e nada além disso', () => {
    const com = (ano: string) => {
      const d = { ...dcc013(), ano };
      return disciplinaSchema.safeParse({ ...d, referencia: montarReferencia(d) }).success;
    };
    expect(com(ANO_A_CONFIRMAR)).toBe(true);
    expect(com("2009")).toBe(true);
    expect(com("")).toBe(false);
    expect(com("200?")).toBe(false);
    expect(com("por volta de 2009")).toBe(false);
  });

  it("exige exatamente 3 usos práticos com fonte", () => {
    const d = dcc013();
    expect(disciplinaSchema.safeParse({ ...d, usosPraticos: d.usosPraticos.slice(0, 2) }).success).toBe(false);
    const semFonte = d.usosPraticos.map((u: object) => ({ ...u, fontes: [] }));
    expect(disciplinaSchema.safeParse({ ...d, usosPraticos: semFonte }).success).toBe(false);
  });

  it("a API publica a lista e um recurso por disciplina", () => {
    const { conteudo } = carregarConteudo(path.join(RAIZ, "content"));
    const recursos = montarRecursos({ ...conteudo, disciplinas: [disciplinaSchema.parse(dcc013())] });
    const lista = recursos.find((r) => r.caminho === "learn-tech/disciplinas.json");
    expect((lista?.dados as unknown[]).length).toBe(1);
    expect(recursos.some((r) => r.caminho === "learn-tech/disciplinas/dcc013-estrutura-de-dados-i.json")).toBe(true);
  });
});

/* Fim de disciplina.test.ts */
