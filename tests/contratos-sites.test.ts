/* contratos-sites.test.ts — o que os quatro sites leem da API continua lá (#28).
   A API alimenta learn-tech, bootcamps, career e tools ao mesmo tempo: um campo removido ou renomeado
   quebra os quatro de uma vez, e o site cai na cópia local sem avisar. Este teste monta os recursos
   como o build (montarRecursos) e confere, para cada endpoint, a forma da resposta e os campos que o
   código de cada site lê sem proteção. Levantado no código dos sites em 12/11/2026 (branches de integração).

   Sintaxe dos campos:
   - "a"        obrigatório (não pode faltar nem ser vazio)
   - "a[].b"    "a" é lista e todo elemento tem "b"
   - "a?.b"     se "a" existir, precisa ter "b"
   - "a?[].b"   se "a" existir, é lista e todo elemento tem "b"

   Campo novo que um site passar a ler sem proteção entra aqui. Mudança que quebre uma linha
   deste teste é mudança de contrato: segue a ADR 3 (/v2 ou migração dos sites antes). */
import path from "node:path";
import { describe, expect, it } from "vitest";
import { carregarConteudo, montarRecursos } from "../scripts/lib/conteudo";

const RAIZ = path.resolve(import.meta.dirname, "..");
const { conteudo, erros } = carregarConteudo(path.join(RAIZ, "content"));
const recursos = new Map(montarRecursos(conteudo).map((r) => [r.caminho, r.dados]));

type Forma = "lista" | "objeto" | "itens";
interface Contrato {
  site: string;
  /* Caminho do recurso, ou expressão para recursos com parâmetro (um por id ou slug). */
  caminho: string | RegExp;
  forma: Forma;
  campos: string[];
  /* Regra extra sobre cada item (valor, tipo ou enum), com mensagem do que o site espera. */
  regra?: (item: Record<string, unknown>) => string | undefined;
}

const vazio = (v: unknown) => v === undefined || v === null || v === "";

/* Confere um caminho de campo num item; devolve as falhas. */
function conferirCampo(item: unknown, campo: string): string[] {
  const [cabeca, ...resto] = campo.split(/\.(.*)/s).filter(Boolean);
  const opcional = cabeca!.includes("?");
  const lista = cabeca!.endsWith("[]");
  const nome = cabeca!.replace(/\?|\[\]/g, "");
  const valor = (item as Record<string, unknown> | null)?.[nome];
  if (vazio(valor)) return opcional ? [] : [nome];
  if (!resto.length) return [];
  if (lista) {
    if (!Array.isArray(valor)) return [`${nome} (não é lista)`];
    return valor.flatMap((el, i) => conferirCampo(el, resto[0]!).map((f) => `${nome}[${i}].${f}`));
  }
  return conferirCampo(valor, resto[0]!).map((f) => `${nome}.${f}`);
}

const ARTIGO_CARD = ["id", "blogURL", "img", "title", "tag"];

const CONTRATOS: Contrato[] = [
  /* learn-tech: src/services/api.js, conteudo.js, ProgramsCard.jsx, Detail.jsx, CategoriesAll.jsx e páginas */
  {
    site: "learn-tech",
    caminho: "learn-tech/programas.json",
    forma: "lista",
    campos: ["id", "title", "category", "categoryFilter", "lessons", "duration", "access"],
    regra: (p) => (typeof p.id === "number" ? undefined : "id precisa ser número (Detail compara com Number(param))"),
  },
  {
    site: "learn-tech",
    caminho: /^learn-tech\/programas\/\d+\.json$/,
    forma: "objeto",
    campos: [
      "id",
      "title",
      "description",
      "category",
      "categoryFilter",
      "duration",
      "lessons",
      "level",
      "whyNow?.paragraphs",
      "appliedIn?.items",
      "forWho?.profiles",
      "galeria?[].url",
      "sources?[].url",
      "modules?[].id",
      "modules?[].title",
      "quiz?[].question",
      "quiz?[].options",
      "enrollDetails?.introductionParagraphs",
    ],
  },
  {
    site: "learn-tech",
    caminho: "learn-tech/areas.json",
    forma: "lista",
    campos: ["id", "title", "subtitle", "paragraphs"],
    regra: (a) => (Array.isArray(a.cards) ? undefined : "cards precisa ser lista (CategoriesAll lê cards.length)"),
  },
  { site: "learn-tech", caminho: "learn-tech/paginas/navegacao.json", forma: "itens", campos: ["id", "name", "path"] },
  { site: "learn-tech", caminho: "learn-tech/paginas/faq.json", forma: "itens", campos: ["id", "question", "answer"] },
  { site: "learn-tech", caminho: "learn-tech/paginas/blog.json", forma: "itens", campos: ARTIGO_CARD },
  { site: "learn-tech", caminho: "learn-tech/paginas/categorias.json", forma: "itens", campos: ["slug", "title", "description"] },
  { site: "learn-tech", caminho: "learn-tech/paginas/estatisticas.json", forma: "itens", campos: ["count", "description"] },
  {
    site: "learn-tech",
    caminho: "learn-tech/paginas/sobre.json",
    forma: "objeto",
    campos: ["heroContent.title", "processSteps[].title", "processSteps[].description", "philosophyQuote", "differentiators[].title"],
  },
  {
    site: "learn-tech",
    caminho: "learn-tech/paginas/aprender.json",
    forma: "objeto",
    campos: ["heroContent.title", "techniques[].title", "techniques[].description", "closingQuote"],
  },
  {
    site: "learn-tech",
    caminho: "learn-tech/paginas/carreira.json",
    forma: "objeto",
    campos: ["heroContent.title", "planningPoints[].title", "platforms[].name", "closingText"],
  },
  {
    site: "learn-tech",
    caminho: "learn-tech/paginas/privacidade.json",
    forma: "objeto",
    campos: ["lastUpdated", "sections[].id", "sections[].title", "sections[].content"],
  },
  {
    site: "learn-tech",
    caminho: "learn-tech/paginas/termos.json",
    forma: "objeto",
    campos: ["lastUpdated", "sections[].id", "sections[].title", "sections[].content"],
  },
  {
    site: "learn-tech",
    caminho: "learn-tech/paginas/mentorias.json",
    forma: "objeto",
    campos: ["mentoriasData[].id", "mentoriasData[].youtubeId", "mentoriasData[].title", "softSkillsData[].youtubeId"],
  },
  {
    site: "learn-tech",
    caminho: "learn-tech/paginas/conheca.json",
    forma: "objeto",
    campos: ["seo.titulo", "hero.title", "numeros.itens", "projetos.itens[].nome", "comoFeito.itens", "autor.nome", "fechamento.cta"],
  },
  /* /v1/index.json (contagens do learn-tech) é montado no build.ts e coberto por tests/indice.test.ts. */

  /* bootcamps: src/entities/event/api/eventApi.ts, EventCard.tsx, Detail.tsx */
  {
    site: "bootcamps",
    caminho: "bootcamps/eventos.json",
    forma: "lista",
    campos: ["id", "slug", "title", "institution", "description", "coverImage", "altText"],
    regra: (e) =>
      !["frontend", "backend", "fullstack", "mobile", "outros"].includes(String(e.category))
        ? `category "${e.category}" fora de frontend|backend|fullstack|mobile|outros (o filtro some com o item)`
        : !["concluido", "desejado"].includes(String(e.status))
          ? `status "${e.status}" fora de concluido|desejado (o item some das duas listas)`
          : undefined,
  },
  {
    site: "bootcamps",
    caminho: /^bootcamps\/eventos\/[^/]+\.json$/,
    forma: "objeto",
    campos: [
      "slug",
      "title",
      "description",
      "coverImage",
      "altText",
      "content",
      "content.curriculum",
      "content.gallery?[].url",
      "content.editions?[].highlight",
      "content.relacionados?[].tipo",
    ],
    regra: (e) =>
      Array.isArray((e.content as { curriculum?: unknown })?.curriculum)
        ? undefined
        : "content.curriculum precisa ser lista (eventApi.ts:75)",
  },

  /* career: js/catalog.js, app.js, detalhe.js, banner-data.js */
  ...(["empresas", "vagas", "perfis"] as const).map((r): Contrato => ({
    site: "career",
    caminho: `career/${r}.json`,
    forma: "lista",
    campos: ["title", "site_url", "detalhe?.imagens?[].url", "detalhe?.imagens?[].alt"],
    regra: (i) => (i.detalhe && !i.slug ? "item com detalhe precisa de slug (detalhe.html procura pelo slug)" : undefined),
  })),
  { site: "career", caminho: "career/destaques.json", forma: "objeto", campos: ["vaga", "empresa", "perfil"] },
  { site: "career", caminho: "career/modelos-curriculo.json", forma: "lista", campos: [] },

  /* tools: main.js e js/utils.js (validação), js/renderer.js, js/detalhe.js */
  ...(["ferramentas", "hospedagens"] as const).map((r): Contrato => ({
    site: "tools",
    caminho: `tools/${r}.json`,
    forma: "lista",
    campos: ["title", "site_url", "thumb", "description", "category", "pricing", "detalhe?.imagens?[].url", "detalhe?.imagens?[].alt"],
    regra: (i) => (i.detalhe && !i.slug ? "item com detalhe precisa de slug (detalhe.html procura pelo slug)" : undefined),
  })),
];

/* Os itens de um recurso conforme a forma esperada pelo site; devolve erro de forma, se houver. */
function itensDe(dados: unknown, forma: Forma): { itens: Record<string, unknown>[]; erro?: string } {
  if (forma === "lista") return Array.isArray(dados) && dados.length ? { itens: dados } : { itens: [], erro: "esperava lista não vazia" };
  if (forma === "itens") {
    const itens = (dados as { itens?: unknown })?.itens;
    return Array.isArray(itens) && itens.length ? { itens } : { itens: [], erro: "esperava { itens: [...] } não vazio" };
  }
  return dados && typeof dados === "object" && !Array.isArray(dados)
    ? { itens: [dados as Record<string, unknown>] }
    : { itens: [], erro: "esperava objeto" };
}

describe("contrato da API com os quatro sites", () => {
  /* Item que falha no schema é descartado do recurso; sem esta conferência, o contrato passaria à toa. */
  it("nenhum item foi descartado no carregamento", () => {
    expect(erros).toEqual([]);
  });

  for (const c of CONTRATOS) {
    it(`${c.site}: ${String(c.caminho)}`, () => {
      const caminhos = typeof c.caminho === "string" ? [c.caminho] : [...recursos.keys()].filter((k) => (c.caminho as RegExp).test(k));
      expect(caminhos.length, "nenhum recurso com esse caminho").toBeGreaterThan(0);
      const falhas: string[] = [];
      for (const caminho of caminhos) {
        expect(recursos.has(caminho), `recurso ${caminho} sumiu`).toBe(true);
        const { itens, erro } = itensDe(recursos.get(caminho), c.forma);
        if (erro) falhas.push(`${caminho}: ${erro}`);
        itens.forEach((item, i) => {
          const rotulo = `${caminho}[${(item.id ?? item.slug ?? i) as string}]`;
          for (const campo of c.campos) for (const f of conferirCampo(item, campo)) falhas.push(`${rotulo}: falta ${f}`);
          const r = c.regra?.(item);
          if (r) falhas.push(`${rotulo}: ${r}`);
        });
      }
      expect(falhas).toEqual([]);
    });
  }

  it("a conferência acusa campo removido (o teste não passa à toa)", () => {
    const programa = { ...(recursos.get("learn-tech/programas.json") as Record<string, unknown>[])[0] };
    delete programa.categoryFilter;
    expect(conferirCampo(programa, "categoryFilter")).toEqual(["categoryFilter"]);
    expect(conferirCampo({ whyNow: { title: "x" } }, "whyNow?.paragraphs")).toEqual(["whyNow.paragraphs"]);
    expect(conferirCampo({}, "whyNow?.paragraphs")).toEqual([]);
    expect(conferirCampo({ imagens: [{ url: "u" }] }, "imagens?[].alt")).toEqual(["imagens[0].alt"]);
  });
});

/* Fim de contratos-sites.test.ts */
