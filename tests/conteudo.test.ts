/* conteudo.test.ts — o conteúdo real de content/ passa nos schemas e nas regras de integridade, e as regras detectam erro plantado. */
import path from "node:path";
import { describe, it, expect } from "vitest";
import { carregarConteudo, verificarIntegridade, montarRecursos } from "../scripts/lib/conteudo";
import { gerarOpenApi } from "../scripts/lib/openapi";

const RAIZ = path.resolve(__dirname, "..");
const { conteudo, erros } = carregarConteudo(path.join(RAIZ, "content"));

describe("conteúdo publicado", () => {
  it("todos os arquivos passam no schema", () => {
    expect(erros).toEqual([]);
  });

  it("não há erro de integridade entre arquivos", () => {
    expect(verificarIntegridade(conteudo, path.join(RAIZ, "media"))).toEqual([]);
  });

  it("tem conteúdo nos quatro projetos", () => {
    expect(conteudo.programas.length).toBeGreaterThan(30);
    expect(conteudo.eventos.length).toBeGreaterThan(15);
    expect(conteudo.ferramentas.length).toBeGreaterThan(40);
    expect(conteudo.empresas.length).toBeGreaterThan(10);
  });

  it("o programa piloto 901 tem módulos, passos e quiz consistentes", () => {
    const p = conteudo.programas.find((x) => x.id === 901);
    expect(p).toBeDefined();
    expect(p!.modules!.length).toBe(4);
    expect(p!.quiz!.length).toBeGreaterThanOrEqual(8);
  });

  it("a matriz de cobertura só aponta para itens existentes", () => {
    expect(conteudo.cobertura.itens.length).toBeGreaterThan(10);
    expect(conteudo.cobertura.itens.filter((i) => i.status === "publicado").length).toBeGreaterThan(5);
  });
});

describe("regras de integridade", () => {
  /* Cópia profunda para plantar erros sem afetar os outros testes. */
  const copia = () => structuredClone(conteudo);

  it("acusa lessonsCount diferente do número de passos", () => {
    const c = copia();
    c.programas.find((p) => p.id === 901)!.modules![0]!.lessonsCount = 99;
    expect(verificarIntegridade(c, path.join(RAIZ, "media")).join()).toMatch(/lessonsCount 99/);
  });

  it("acusa questão com duas alternativas corretas", () => {
    const c = copia();
    c.programas.find((p) => p.id === 901)!.quiz![0]!.options.forEach((o) => (o.isCorrect = true));
    expect(verificarIntegridade(c, path.join(RAIZ, "media")).join()).toMatch(/exatamente uma alternativa/);
  });

  it("acusa mídia que não existe", () => {
    const c = copia();
    c.eventos[0]!.coverImage = "/media/bootcamps/nao-existe.webp";
    expect(verificarIntegridade(c, path.join(RAIZ, "media")).join()).toMatch(/mídia ausente/);
  });

  it("acusa destaque que saiu do catálogo", () => {
    const c = copia();
    c.destaques.empresa = "Empresa Inexistente";
    expect(verificarIntegridade(c, path.join(RAIZ, "media")).join()).toMatch(/destaques: empresa/);
  });
});

describe("recursos gerados", () => {
  const recursos = montarRecursos(conteudo);

  it("o resumo de programas não carrega módulos nem quiz", () => {
    const lista = recursos.find((r) => r.caminho === "learn-tech/programas.json")!.dados as Record<string, unknown>[];
    expect(lista[0]).not.toHaveProperty("moduleContents");
    expect(lista[0]).not.toHaveProperty("quiz");
    expect(lista[0]).toHaveProperty("modulesCount");
  });

  it("cada programa e cada evento tem recurso próprio", () => {
    for (const p of conteudo.programas) expect(recursos.some((r) => r.caminho === `learn-tech/programas/${p.id}.json`)).toBe(true);
    for (const e of conteudo.eventos) expect(recursos.some((r) => r.caminho === `bootcamps/eventos/${e.slug}.json`)).toBe(true);
  });

  it("o OpenAPI é gerado com os caminhos principais", () => {
    const doc = gerarOpenApi("teste") as { paths: Record<string, unknown> };
    expect(Object.keys(doc.paths)).toEqual(expect.arrayContaining(["/v1/acessos", "/v1/learn-tech/programas.json", "/v1/bootcamps/eventos.json"]));
    expect(() => JSON.stringify(doc)).not.toThrow();
  });
});

/* Fim de conteudo.test.ts */
