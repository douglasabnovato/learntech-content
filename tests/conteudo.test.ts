/* conteudo.test.ts — o conteúdo real de content/ passa nos schemas e nas regras de integridade, e as regras detectam erro plantado. */
import path from "node:path";
import { describe, it, expect } from "vitest";
import { carregarConteudo, verificarIntegridade, montarRecursos } from "../scripts/lib/conteudo";
import { gerarOpenApi } from "../scripts/lib/openapi";
import { detalheSchema, modeloCurriculoSchema } from "../src/schemas/career-tools";

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

  it("publica modelos de currículo fictícios", () => {
    expect(conteudo.modelosCurriculo.length).toBeGreaterThanOrEqual(3);
    for (const m of conteudo.modelosCurriculo) expect(m.ficticio).toBe(true);
  });

  it("publica as áreas de atuação com fontes", () => {
    expect(conteudo.areas.length).toBeGreaterThanOrEqual(5);
    for (const a of conteudo.areas) expect(a.sources.length).toBeGreaterThan(0);
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

  it("acusa edição repetida, fora do ano ou fora de ordem", () => {
    const c = copia();
    const e = c.eventos.find((x) => x.slug === "capivara-tech-juiz-de-fora")!;
    const [a, b] = e.content.editions!;
    e.content.editions = [b!, { ...a!, data: "2025-01-01" }, { ...b! }];
    const msg = verificarIntegridade(c, path.join(RAIZ, "media")).join();
    expect(msg).toMatch(/fora do ano/);
    expect(msg).toMatch(/repetida/);
    expect(msg).toMatch(/fora de ordem/);
  });

  it("acusa evento que relaciona conteúdo inexistente e publica o relacionado resolvido", () => {
    const c = copia();
    const e = c.eventos.find((x) => x.slug === "hackathon-inovacao-social-jf")!;
    e.content.relacionados = [{ tipo: "programas", id: "999999" }];
    expect(verificarIntegridade(c, path.join(RAIZ, "media")).join()).toMatch(/evento hackathon-inovacao-social-jf: relaciona programas "999999"/);
    e.content.relacionados = [{ tipo: "programas", id: "901" }];
    const publicado = montarRecursos(c).find((r) => r.caminho === "bootcamps/eventos/hackathon-inovacao-social-jf.json")!.dados as typeof e;
    expect(publicado.content.relacionados![0]!.url).toMatch(/\/program\/.+\/901$/);
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

  it("acusa slug repetido numa lista", () => {
    const c = copia();
    c.ferramentas[0]!.slug = "mesmo-slug";
    c.ferramentas[1]!.slug = "mesmo-slug";
    expect(verificarIntegridade(c, path.join(RAIZ, "media")).join()).toMatch(/slug "mesmo-slug" repetido/);
  });

  it("acusa detalhe sem slug", () => {
    const c = copia();
    delete c.empresas[0]!.slug;
    c.empresas[0]!.detalhe = { resumo: "r", paragrafos: ["p"], atualizadoEm: "2026-10-28" };
    expect(verificarIntegridade(c, path.join(RAIZ, "media")).join()).toMatch(/tem detalhe mas não tem slug/);
  });

  it("modelo de currículo recusa contato real", () => {
    const m = structuredClone(conteudo.modelosCurriculo[0]!);
    m.contato.email = "pessoa@gmail.com";
    expect(modeloCurriculoSchema.safeParse(m).success).toBe(false);
    const n = structuredClone(conteudo.modelosCurriculo[0]!) as Record<string, unknown> & { contato: Record<string, string> };
    n.contato.telefone = "(32) 99999-1234";
    expect(modeloCurriculoSchema.safeParse(n).success).toBe(false);
  });

  it("o schema recusa vídeo que não é embed do YouTube", () => {
    const r = detalheSchema.safeParse({ resumo: "r", paragrafos: ["p"], video: "https://vimeo.com/123", atualizadoEm: "2026-10-28" });
    expect(r.success).toBe(false);
  });

  it("acusa área com categoria que não é de nenhum programa", () => {
    const c = copia();
    c.areas[0]!.categorias = ["categoria-inexistente"];
    expect(verificarIntegridade(c, path.join(RAIZ, "media")).join()).toMatch(/categoria "categoria-inexistente" não é categoryFilter/);
  });

  it("acusa relacionado que não existe", () => {
    const c = copia();
    c.empresas[0]!.slug = "empresa-teste";
    c.empresas[0]!.detalhe = { resumo: "r", paragrafos: ["p"], relacionados: [{ tipo: "programas", id: "99999" }], atualizadoEm: "2026-10-29" };
    expect(verificarIntegridade(c, path.join(RAIZ, "media")).join()).toMatch(/relaciona programas "99999", que não existe/);
  });

  it("acusa tempo de leitura diferente do calculado", () => {
    const c = copia();
    const blog = c.paginas.blog as { itens: { readingTime: string }[] };
    blog.itens[0]!.readingTime = "99 min";
    expect(verificarIntegridade(c, path.join(RAIZ, "media")).join()).toMatch(/readingTime "99 min" deveria ser/);
  });

  it("acusa frase sobre o processo de pesquisa no texto publicado", () => {
    const c = copia();
    const f = c.ferramentas.find((x) => x.detalhe)!;
    f.detalhe!.paragrafos.push("O site oficial não pôde ser aberto nesta revisão.");
    expect(verificarIntegridade(c, path.join(RAIZ, "media")).join()).toMatch(/frase sobre o processo de pesquisa/);
  });

  it("exige fontes de 2 domínios no detalhe, salvo página em revisão", () => {
    const c = copia();
    const f = c.ferramentas.find((x) => x.detalhe)!;
    f.detalhe!.fontes = [{ label: "a", url: "https://exemplo.com/a" }, { label: "b", url: "https://www.exemplo.com/b" }];
    expect(verificarIntegridade(c, path.join(RAIZ, "media")).join()).toMatch(/pelo menos 2 domínios/);
    f.detalhe!.paragrafos.push("Página em revisão: as informações acima são básicas e serão completadas em breve.");
    expect(verificarIntegridade(c, path.join(RAIZ, "media")).join()).not.toMatch(/pelo menos 2 domínios/);
  });

  it("acusa o mesmo arquivo do hd em dois itens do acervo", () => {
    const c = copia();
    const arq = { sha256: "a".repeat(64), ext: "pdf", bytes: 1 };
    c.acervo.itens.push(
      { id: "HD-9001", lote: "2026-10-30", origem: "hd/teste", descricao: "x", direitos: "a-triar", estado: "novo", destinos: [], arquivos: [arq] },
      { id: "HD-9002", lote: "2026-10-30", origem: "hd/teste", descricao: "y", direitos: "a-triar", estado: "novo", destinos: [], arquivos: [arq] },
    );
    expect(verificarIntegridade(c, path.join(RAIZ, "media")).join()).toMatch(/mesmo arquivo .* HD-9001 e HD-9002/);
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

  it("o resumo de programas publica o status do card quando o programa tem", () => {
    const c = structuredClone(conteudo);
    const programa = c.programas[0]!;
    programa.status = "novidade";
    const lista = montarRecursos(c).find((r) => r.caminho === "learn-tech/programas.json")!.dados as Record<string, unknown>[];
    expect(lista.find((p) => p.id === programa.id)).toHaveProperty("status", "novidade");
  });

  it("cada programa e cada evento tem recurso próprio", () => {
    for (const p of conteudo.programas) expect(recursos.some((r) => r.caminho === `learn-tech/programas/${p.id}.json`)).toBe(true);
    for (const e of conteudo.eventos) expect(recursos.some((r) => r.caminho === `bootcamps/eventos/${e.slug}.json`)).toBe(true);
  });

  it("publica relacionados com título e URL prontos", () => {
    const c = structuredClone(conteudo);
    const f = c.ferramentas.find((x) => x.slug && x.detalhe)!;
    f.detalhe!.relacionados = [{ tipo: "programas", id: "901" }];
    const lista = montarRecursos(c).find((r) => r.caminho === "tools/ferramentas.json")!.dados as typeof c.ferramentas;
    const rel = lista.find((x) => x.slug === f.slug)!.detalhe!.relacionados![0]!;
    expect(rel.projeto).toBe("learn-tech");
    expect(rel.url).toMatch(/^https:\/\/learn-tech-pied\.vercel\.app\/program\/.+\/901$/);
    expect(rel.titulo).toBeTruthy();
  });

  it("o OpenAPI é gerado com os caminhos principais", () => {
    const doc = gerarOpenApi("teste") as { paths: Record<string, unknown> };
    expect(Object.keys(doc.paths)).toEqual(expect.arrayContaining(["/v1/acessos", "/v1/learn-tech/programas.json", "/v1/bootcamps/eventos.json"]));
    expect(() => JSON.stringify(doc)).not.toThrow();
  });

  it("o OpenAPI documenta o 429 das escritas e o DELETE com e-mail no corpo (?email= obsoleto)", () => {
    type Op = { responses: Record<string, unknown>; parameters?: { name: string; deprecated?: boolean }[]; requestBody?: unknown };
    const doc = gerarOpenApi("teste") as { paths: Record<string, Record<string, Op>> };
    for (const rota of ["/v1/acessos", "/v1/mensagens"]) {
      expect(doc.paths[rota]!.post!.responses).toHaveProperty("429");
      const del = doc.paths[rota]!.delete!;
      expect(del.requestBody).toBeTruthy();
      expect(del.parameters?.find((p) => p.name === "email")?.deprecated).toBe(true);
    }
  });
});

/* Fim de conteudo.test.ts */
