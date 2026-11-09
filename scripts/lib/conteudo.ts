/* conteudo.ts — carrega a pasta content/, valida schema e integridade e gera os recursos publicados em dist/v1. */
import fs from "node:fs";
import path from "node:path";
import type { z } from "zod";
import { programaSchema, paginaSchema, PAGINAS, CAMPOS_RESUMO, areaSchema, type Programa, type Area } from "../../src/schemas/learn-tech";
import { eventoSchema, type Evento } from "../../src/schemas/bootcamps";
import { empresaSchema, vagaOuPerfilSchema, destaquesSchema, ferramentaSchema, modeloCurriculoSchema } from "../../src/schemas/career-tools";
import { coberturaSchema, type Cobertura } from "../../src/schemas/cobertura";
import { acervoSchema, type Acervo } from "../../src/schemas/acervo";

export interface Conteudo {
  programas: Programa[];
  paginas: Record<string, Record<string, unknown>>;
  areas: Area[];
  eventos: Evento[];
  empresas: z.infer<typeof empresaSchema>[];
  vagas: z.infer<typeof vagaOuPerfilSchema>[];
  perfis: z.infer<typeof vagaOuPerfilSchema>[];
  destaques: z.infer<typeof destaquesSchema>;
  modelosCurriculo: z.infer<typeof modeloCurriculoSchema>[];
  ferramentas: z.infer<typeof ferramentaSchema>[];
  hospedagens: z.infer<typeof ferramentaSchema>[];
  cobertura: Cobertura;
  acervo: Acervo;
}

/* Endereço público de cada site: usado para montar a URL pronta dos itens relacionados. */
export const SITES = {
  "learn-tech": "https://learn-tech-pied.vercel.app",
  bootcamps: "https://bootcamps-dun.vercel.app",
  career: "https://douglasabnovato.github.io/career",
  tools: "https://douglasabnovato.github.io/tools",
} as const;

/* Palavras por minuto usadas no tempo de leitura dos artigos. */
export const PALAVRAS_POR_MINUTO = 200;

export interface Recurso {
  caminho: string;
  descricao: string;
  dados: unknown;
}

/* Lê um JSON e devolve o valor bruto; erros de sintaxe viram mensagem com o nome do arquivo. */
function lerJson(arquivo: string, erros: string[]): unknown {
  try {
    return JSON.parse(fs.readFileSync(arquivo, "utf8"));
  } catch (e) {
    erros.push(`${arquivo}: JSON inválido (${(e as Error).message})`);
    return undefined;
  }
}

/* Valida um valor contra o schema e acumula as mensagens de erro com o caminho do campo. */
function conferir<T>(schema: z.ZodType<T>, valor: unknown, origem: string, erros: string[]): T | undefined {
  const r = schema.safeParse(valor);
  if (r.success) return r.data;
  for (const issue of r.error.issues) {
    erros.push(`${origem} → ${issue.path.join(".") || "(raiz)"}: ${issue.message}`);
  }
  return undefined;
}

/* Lê todos os arquivos de uma pasta de itens (um JSON por item), em ordem alfabética. */
function lerPasta(pasta: string): string[] {
  if (!fs.existsSync(pasta)) return [];
  return fs.readdirSync(pasta).filter((f) => f.endsWith(".json")).sort().map((f) => path.join(pasta, f));
}

/* Carrega e valida o schema de todo o conteúdo; devolve o conteúdo tipado e os erros encontrados. */
export function carregarConteudo(raiz: string): { conteudo: Conteudo; erros: string[] } {
  const erros: string[] = [];
  const c = (rel: string) => path.join(raiz, rel);

  const programas: Programa[] = [];
  for (const arq of lerPasta(c("learn-tech/programas"))) {
    const p = conferir(programaSchema, lerJson(arq, erros), path.relative(raiz, arq), erros);
    if (!p) continue;
    if (path.basename(arq, ".json") !== String(p.id)) erros.push(`${path.relative(raiz, arq)}: nome do arquivo deve ser o id (${p.id}).json`);
    programas.push(p);
  }
  programas.sort((a, b) => a.id - b.id);

  const paginas: Record<string, Record<string, unknown>> = {};
  for (const nome of PAGINAS) {
    const arq = c(`learn-tech/paginas/${nome}.json`);
    if (!fs.existsSync(arq)) { erros.push(`learn-tech/paginas/${nome}.json: página obrigatória ausente`); continue; }
    const p = conferir(paginaSchema, lerJson(arq, erros), `learn-tech/paginas/${nome}.json`, erros);
    if (p) paginas[nome] = p;
  }

  const eventos: Evento[] = [];
  for (const arq of lerPasta(c("bootcamps/eventos"))) {
    const e = conferir(eventoSchema, lerJson(arq, erros), path.relative(raiz, arq), erros);
    if (!e) continue;
    if (path.basename(arq, ".json") !== e.slug) erros.push(`${path.relative(raiz, arq)}: nome do arquivo deve ser o slug (${e.slug}).json`);
    eventos.push(e);
  }
  eventos.sort((a, b) => Number(a.id) - Number(b.id));

  const lista = <T>(rel: string, schema: z.ZodType<T>): T[] => {
    const bruto = lerJson(c(rel), erros);
    if (!Array.isArray(bruto)) { erros.push(`${rel}: deve ser uma lista`); return []; }
    return bruto.map((item, i) => conferir(schema, item, `${rel}[${i}]`, erros)).filter((x): x is T => x !== undefined);
  };

  const conteudo: Conteudo = {
    programas,
    paginas,
    areas: lista("learn-tech/areas.json", areaSchema),
    eventos,
    empresas: lista("career/empresas.json", empresaSchema),
    vagas: lista("career/vagas.json", vagaOuPerfilSchema),
    perfis: lista("career/perfis.json", vagaOuPerfilSchema),
    destaques: conferir(destaquesSchema, lerJson(c("career/destaques.json"), erros), "career/destaques.json", erros) ?? { vaga: "", empresa: "", perfil: "" },
    modelosCurriculo: lista("career/modelos-curriculo.json", modeloCurriculoSchema),
    ferramentas: lista("tools/ferramentas.json", ferramentaSchema),
    hospedagens: lista("tools/hospedagens.json", ferramentaSchema),
    cobertura: conferir(coberturaSchema, lerJson(c("cobertura.json"), erros), "cobertura.json", erros) ?? { atualizadoEm: "", referencias: [], itens: [] },
    acervo: conferir(acervoSchema, lerJson(c("acervo.json"), erros), "acervo.json", erros) ?? { atualizadoEm: "", itens: [] },
  };
  return { conteudo, erros };
}

/* Soma os passos de todas as seções de um módulo (regra herdada do dados.test.js do learn-tech). */
function passosDe(modulo: { sections?: { subsections?: unknown[] }[] }): number {
  return (modulo.sections ?? []).reduce((t, s) => t + (s.subsections ?? []).length, 0);
}

/* Aponta ids repetidos numa lista. */
function repetidos(valores: (string | number)[]): (string | number)[] {
  const vistos = new Set<string | number>();
  return valores.filter((v) => (vistos.has(v) ? true : (vistos.add(v), false)));
}

/* Percorre qualquer valor e devolve todas as strings que referenciam /media/. */
function referenciasMidia(valor: unknown, achados: Set<string> = new Set()): Set<string> {
  if (typeof valor === "string" && valor.startsWith("/media/")) achados.add(valor);
  else if (Array.isArray(valor)) valor.forEach((v) => referenciasMidia(v, achados));
  else if (valor && typeof valor === "object") Object.values(valor).forEach((v) => referenciasMidia(v, achados));
  return achados;
}

interface ItemBlog { id: string; title: string; blogURL?: string; tag?: string; readingTime?: string; lead?: string; body?: string[]; quote?: string; bodyContinued?: string[]; highlights?: { label?: string; description?: string }[] }

/* Itens do blog (paginas/blog.json). */
export function itensBlog(c: Conteudo): ItemBlog[] {
  return ((c.paginas.blog as { itens?: ItemBlog[] } | undefined)?.itens ?? []);
}

/* Tempo de leitura de um artigo: todas as palavras do texto ÷ PALAVRAS_POR_MINUTO, arredondado para cima. */
export function tempoDeLeitura(post: ItemBlog): string {
  const partes = [post.lead, post.quote, ...(post.body ?? []), ...(post.bodyContinued ?? []), ...(post.highlights ?? []).flatMap((h) => [h.label, h.description])];
  const palavras = partes.filter((t): t is string => typeof t === "string").join(" ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(palavras / PALAVRAS_POR_MINUTO))} min`;
}

interface Alvo { projeto: string; titulo: string; url: string }

/* Índice "tipo:id" → projeto, título e URL pública de tudo que pode ser relacionado. */
export function indiceDoEcossistema(c: Conteudo): Map<string, Alvo> {
  const m = new Map<string, Alvo>();
  for (const p of c.programas) m.set(`programas:${p.id}`, { projeto: "learn-tech", titulo: p.title, url: `${SITES["learn-tech"]}/program/${p.categoryFilter}/${p.id}` });
  for (const b of itensBlog(c)) m.set(`blog:${b.id}`, { projeto: "learn-tech", titulo: b.title, url: `${SITES["learn-tech"]}/blog/${b.id}` });
  for (const e of c.eventos) m.set(`eventos:${e.slug}`, { projeto: "bootcamps", titulo: e.title, url: `${SITES.bootcamps}/event/${e.slug}` });
  const listas = [["empresas", c.empresas, "career"], ["vagas", c.vagas, "career"], ["perfis", c.perfis, "career"], ["ferramentas", c.ferramentas, "tools"], ["hospedagens", c.hospedagens, "tools"]] as const;
  for (const [tipo, itens, projeto] of listas) {
    for (const i of itens as { title: string; slug?: string; site_url: string; detalhe?: unknown }[]) {
      if (!i.slug) continue;
      const pagina = projeto === "career" ? `${SITES.career}/detalhe.html?tipo=${tipo}&id=${i.slug}` : `${SITES.tools}/detalhe.html?id=${i.slug}`;
      m.set(`${tipo}:${i.slug}`, { projeto, titulo: i.title, url: i.detalhe ? pagina : i.site_url });
    }
  }
  return m;
}

/* Todas as listas que aceitam página de detalhe, com o nome do tipo. */
function listasComDetalhe(c: Conteudo) {
  return { empresas: c.empresas, vagas: c.vagas, perfis: c.perfis, ferramentas: c.ferramentas, hospedagens: c.hospedagens };
}

/* Frases sobre o processo de pesquisa que não podem aparecer em texto publicado (vão só nas observações do lote). */
export const FRASES_PROIBIDAS: RegExp[] = [
  /n[ãa]o p[ôo]de ser (aberto|aberta|verificad[oa]|confirmad[oa])/i,
  /nesta revis[ãa]o/i,
  /n[ãa]o consegui (abrir|confirmar|verificar|acessar)/i,
  /fora da lista de (sites|urls) permitid/i,
  /n[ãa]o acess[íi]vel na revis[ãa]o/i,
];

/* Nas páginas de detalhe, "card" é o card do próprio catálogo: falar dele é falar do processo. */
export const FRASE_CARD = /\b(o|do|no) card (aponta|diz|classific|indica|informa|mostra)|\b(link|endereço|url|site_url|título|categoria|rótulo|página indicada) (do|no) card\b/i;

/* Aviso que libera uma página simples sem fontes (o autor completa depois). */
export const MARCA_EM_REVISAO = "Página em revisão";

/* Percorre o valor e devolve [caminho, texto] de cada string. */
function textos(valor: unknown, caminho = "", saida: [string, string][] = []): [string, string][] {
  if (typeof valor === "string") saida.push([caminho, valor]);
  else if (Array.isArray(valor)) valor.forEach((v, i) => textos(v, `${caminho}[${i}]`, saida));
  else if (valor && typeof valor === "object") for (const [k, v] of Object.entries(valor)) textos(v, caminho ? `${caminho}.${k}` : k, saida);
  return saida;
}

/* Domínio sem "www.", para contar fontes independentes. */
const dominio = (url: string) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; } };

/* Regras de integridade entre arquivos: ids, módulos, quiz, destaques, mídia e cobertura. */
export function verificarIntegridade(c: Conteudo, pastaMidia: string): string[] {
  const erros: string[] = [];

  repetidos(c.programas.map((p) => p.id)).forEach((id) => erros.push(`programa ${id}: id repetido`));
  const filtroPorCategoria = new Map<string, string>();
  for (const p of c.programas) {
    const f = filtroPorCategoria.get(p.category);
    if (f && f !== p.categoryFilter) erros.push(`programa ${p.id}: categoria "${p.category}" usa filtros diferentes (${f} e ${p.categoryFilter})`);
    filtroPorCategoria.set(p.category, p.categoryFilter);

    const mods = p.modules ?? [];
    const conteudos = p.moduleContents ?? [];
    if (conteudos.length > 0) {
      for (const m of mods) {
        const conteudo = conteudos.find((x) => x.id === m.id);
        if (!conteudo) { erros.push(`programa ${p.id}, módulo ${m.id}: sem conteúdo`); continue; }
        if (conteudo.title !== m.title) erros.push(`programa ${p.id}, módulo ${m.id}: título diverge entre modules e moduleContents`);
        if (m.lessonsCount !== passosDe(conteudo)) erros.push(`programa ${p.id}, módulo ${m.id}: lessonsCount ${m.lessonsCount} ≠ ${passosDe(conteudo)} passos`);
        const ementa = (p as { enrollDetails?: { moduleOverviews?: { moduleId: number; title: string }[] } }).enrollDetails?.moduleOverviews?.find((o) => o.moduleId === m.id);
        if (ementa && !ementa.title.includes(m.title)) erros.push(`programa ${p.id}, módulo ${m.id}: título da ementa não contém "${m.title}"`);
      }
      for (const x of conteudos) {
        if (!mods.some((m) => m.id === x.id)) erros.push(`programa ${p.id}: conteúdo ${x.id} sem módulo na lista`);
        const numeros = x.sections.flatMap((s) => s.subsections.map((sub) => sub.number));
        if (numeros.some((n, i) => n !== i + 1)) erros.push(`programa ${p.id}, módulo ${x.id}: passos devem ser numerados de 1 em diante`);
      }
    }
    if (p.quiz) {
      repetidos(p.quiz.map((q) => q.id)).forEach((id) => erros.push(`programa ${p.id}: questão ${id} repetida`));
      for (const q of p.quiz) {
        if (!mods.some((m) => m.id === q.moduleId)) erros.push(`programa ${p.id}, questão ${q.id}: módulo ${q.moduleId} inexistente`);
        if (q.options.filter((o) => o.isCorrect).length !== 1) erros.push(`programa ${p.id}, questão ${q.id}: precisa de exatamente uma alternativa correta`);
      }
    }
  }

  repetidos(c.areas.map((a) => a.id)).forEach((id) => erros.push(`área ${id}: id repetido`));
  repetidos(c.modelosCurriculo.map((m) => m.slug)).forEach((s) => erros.push(`modelo de currículo ${s}: slug repetido`));
  const filtros = new Set(c.programas.map((p) => p.categoryFilter));
  const itensCategorias = (c.paginas.categorias as { itens?: { slug?: string }[] } | undefined)?.itens ?? [];
  const slugsCategorias = new Set(itensCategorias.map((i) => i.slug).filter((s): s is string => typeof s === "string"));
  for (const a of c.areas) {
    for (const f of a.categorias) if (!filtros.has(f)) erros.push(`área ${a.id}: categoria "${f}" não é categoryFilter de nenhum programa`);
    for (const card of a.cards) if (card.categoria && !slugsCategorias.has(card.categoria)) erros.push(`área ${a.id}: card "${card.title}" aponta para a categoria "${card.categoria}", que não existe em paginas/categorias.json`);
  }

  repetidos(c.eventos.map((e) => e.id)).forEach((id) => erros.push(`evento id ${id}: repetido`));
  repetidos(c.eventos.map((e) => e.slug)).forEach((s) => erros.push(`evento ${s}: slug repetido`));
  /* Edições: data dentro do ano informado, número único por formato e ordem cronológica. */
  for (const e of c.eventos) {
    const eds = e.content.editions ?? [];
    for (const ed of eds) if (ed.data && !ed.data.startsWith(ed.year)) erros.push(`evento ${e.slug}: edição ${ed.data} fora do ano ${ed.year}`);
    repetidos(eds.filter((ed) => ed.numero).map((ed) => `${ed.formato ?? ""}#${ed.numero}`)).forEach((n) => erros.push(`evento ${e.slug}: edição ${n} repetida`));
    const chaves = eds.map((ed) => ed.data ?? `${ed.year}-99-99`);
    if (chaves.some((k, i) => i > 0 && k < chaves[i - 1]!)) erros.push(`evento ${e.slug}: edições fora de ordem cronológica`);
  }

  const listas = { empresas: c.empresas, vagas: c.vagas, perfis: c.perfis, ferramentas: c.ferramentas, hospedagens: c.hospedagens };
  for (const [nome, itens] of Object.entries(listas)) {
    repetidos(itens.map((i) => i.title.toLowerCase())).forEach((t) => erros.push(`${nome}: título "${t}" repetido`));
    repetidos(itens.flatMap((i) => (i.slug ? [i.slug] : []))).forEach((s) => erros.push(`${nome}: slug "${s}" repetido`));
    for (const i of itens) if (i.detalhe && !i.slug) erros.push(`${nome}: "${i.title}" tem detalhe mas não tem slug`);
  }
  const indice = indiceDoEcossistema(c);
  for (const [nome, itens] of Object.entries(listasComDetalhe(c))) {
    for (const i of itens) {
      for (const r of i.detalhe?.relacionados ?? []) {
        if (!indice.has(`${r.tipo}:${r.id}`)) erros.push(`${nome}: "${i.title}" relaciona ${r.tipo} "${r.id}", que não existe (ou não tem slug)`);
        if (r.tipo === nome && r.id === i.slug) erros.push(`${nome}: "${i.title}" relaciona a si mesmo`);
      }
    }
  }
  for (const e of c.eventos) {
    for (const r of e.content.relacionados ?? []) {
      if (!indice.has(`${r.tipo}:${r.id}`)) erros.push(`evento ${e.slug}: relaciona ${r.tipo} "${r.id}", que não existe (ou não tem slug)`);
      if (r.tipo === "eventos" && r.id === e.slug) erros.push(`evento ${e.slug}: relaciona a si mesmo`);
    }
  }
  for (const b of itensBlog(c)) {
    const esperado = tempoDeLeitura(b);
    if (b.readingTime !== esperado) erros.push(`blog ${b.id}: readingTime "${b.readingTime}" deveria ser "${esperado}" (${PALAVRAS_POR_MINUTO} palavras/min)`);
  }

  /* Qualidade editorial do que é publicado. */
  const publicado: [string, unknown][] = [
    ...c.programas.map((p) => [`programa ${p.id}`, p] as [string, unknown]),
    ...c.eventos.map((e) => [`evento ${e.slug}`, e] as [string, unknown]),
    ...Object.entries(c.paginas).map(([n, p]) => [`página ${n}`, p] as [string, unknown]),
    ...Object.entries(listasComDetalhe(c)).flatMap(([n, itens]) => itens.map((i) => [`${n} "${i.title}"`, i] as [string, unknown])),
  ];
  for (const [origem, valor] of publicado) {
    for (const [campo, texto] of textos(valor)) {
      const regras = origem.startsWith("programa") || origem.startsWith("evento") || origem.startsWith("página") ? FRASES_PROIBIDAS : [...FRASES_PROIBIDAS, FRASE_CARD];
      const f = regras.find((r) => r.test(texto));
      if (f) erros.push(`${origem} → ${campo}: frase sobre o processo de pesquisa ("${texto.match(f)![0]}"); isso vai só nas observações do lote`);
    }
  }
  for (const [nome, itens] of Object.entries(listasComDetalhe(c))) {
    for (const i of itens) {
      const d = i.detalhe;
      if (!d) continue;
      const emRevisao = d.paragrafos.some((p) => p.includes(MARCA_EM_REVISAO));
      const dominios = new Set((d.fontes ?? []).map((f) => dominio(f.url)));
      if (!emRevisao && dominios.size < 2) erros.push(`${nome}: "${i.title}" precisa de fontes de pelo menos 2 domínios diferentes (tem ${dominios.size}) ou do aviso "${MARCA_EM_REVISAO}"`);
    }
  }

  /* Acervo do hd: ids únicos e cada arquivo (hash) em um só item. */
  repetidos(c.acervo.itens.map((i) => i.id)).forEach((id) => erros.push(`acervo ${id}: id repetido`));
  const donoDoHash = new Map<string, string>();
  for (const it of c.acervo.itens) {
    for (const f of it.arquivos) {
      const dono = donoDoHash.get(f.sha256);
      if (dono && dono !== it.id) erros.push(`acervo: o mesmo arquivo (${f.sha256.slice(0, 12)}…) está em ${dono} e ${it.id}`);
      donoDoHash.set(f.sha256, it.id);
    }
  }
  /* Arquivo "similar" aponta para um arquivo "exibido" do acervo. */
  const usoDoHash = new Map(c.acervo.itens.flatMap((it) => it.arquivos.map((f) => [f.sha256, f.uso] as const)));
  for (const it of c.acervo.itens) {
    for (const f of it.arquivos) {
      if (f.similarA && usoDoHash.get(f.similarA) !== "exibido") erros.push(`acervo ${it.id}: arquivo ${f.sha256.slice(0, 12)}… é similar a um arquivo que não está exibido`);
    }
  }

  /* Destino do acervo: sempre "projeto/recurso/id", e o id existe no content/ (ADR 11, issue #18). */
  for (const e of errosDestinos(c)) erros.push(e);

  if (!c.vagas.some((v) => v.title === c.destaques.vaga)) erros.push(`destaques: vaga "${c.destaques.vaga}" não existe em vagas.json`);
  if (!c.empresas.some((v) => v.title === c.destaques.empresa)) erros.push(`destaques: empresa "${c.destaques.empresa}" não existe em empresas.json`);
  if (!c.perfis.some((v) => v.title === c.destaques.perfil)) erros.push(`destaques: perfil "${c.destaques.perfil}" não existe em perfis.json`);

  for (const ref of referenciasMidia(c)) {
    if (!fs.existsSync(path.join(pastaMidia, ref.replace(/^\/media\//, "")))) erros.push(`mídia ausente: ${ref}`);
  }

  const ids: Record<string, Set<string>> = {
    programas: new Set(c.programas.map((p) => String(p.id))),
    eventos: new Set(c.eventos.map((e) => e.slug)),
    empresas: new Set(c.empresas.map((e) => e.title)),
    vagas: new Set(c.vagas.map((e) => e.title)),
    perfis: new Set(c.perfis.map((e) => e.title)),
    ferramentas: new Set(c.ferramentas.map((e) => e.title)),
    hospedagens: new Set(c.hospedagens.map((e) => e.title)),
    paginas: new Set(Object.keys(c.paginas)),
  };
  for (const item of c.cobertura.itens) {
    for (const d of item.destinos) {
      const conhecidos = ids[d.recurso];
      if (!conhecidos) { erros.push(`cobertura "${item.pasta}": recurso "${d.recurso}" desconhecido`); continue; }
      for (const id of d.ids ?? []) {
        if (!conhecidos.has(id)) erros.push(`cobertura "${item.pasta}": ${d.recurso} "${id}" não existe`);
      }
    }
  }
  return erros;
}

/* Ids de cada recurso, na forma usada pelos destinos do acervo ("projeto/recurso/id"). */
function idsPorRecurso(c: Conteudo): Record<string, Set<string>> {
  const chave = (x: { slug?: string; id?: string | number }) => String(x.slug ?? x.id ?? "");
  return {
    "learn-tech/programas": new Set(c.programas.map((p) => String(p.id))),
    "learn-tech/blog": new Set(itensBlog(c).map((b) => b.id)),
    "learn-tech/areas": new Set(c.areas.map((a) => a.id)),
    "bootcamps/eventos": new Set(c.eventos.map((e) => e.slug)),
    "career/empresas": new Set(c.empresas.map(chave)),
    "career/vagas": new Set(c.vagas.map(chave)),
    "career/perfis": new Set(c.perfis.map(chave)),
    "career/modelos-curriculo": new Set(c.modelosCurriculo.map((m) => m.slug)),
    "tools/ferramentas": new Set(c.ferramentas.map(chave)),
    "tools/hospedagens": new Set(c.hospedagens.map(chave)),
  };
}

/* Confere cada destino dos itens do acervo: formato completo e alvo existente. */
export function errosDestinos(c: Conteudo): string[] {
  const ids = idsPorRecurso(c);
  const erros: string[] = [];
  for (const it of c.acervo.itens) {
    for (const d of it.destinos) {
      const m = /^([a-z-]+\/[a-z-]+)\/(.+)$/.exec(d);
      const conhecidos = m ? ids[m[1]!] : undefined;
      if (!m || !conhecidos) erros.push(`acervo ${it.id}: destino "${d}" fora do formato projeto/recurso/id`);
      else if (!conhecidos.has(m[2]!)) erros.push(`acervo ${it.id}: destino "${d}" não existe no content/`);
    }
  }
  return erros;
}

/* Recorta do programa só os campos que os cards usam. */
function resumoPrograma(p: Programa): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  for (const campo of CAMPOS_RESUMO) if (campo in p) r[campo] = (p as Record<string, unknown>)[campo];
  r.modulesCount = p.modules?.length ?? 0;
  r.hasQuiz = Array.isArray(p.quiz) && p.quiz.length > 0;
  return r;
}

/* Copia a lista trocando cada relacionado { tipo, id } pelo alvo completo (projeto, título e URL). */
function resolverRelacionados<T extends { detalhe?: { relacionados?: { tipo: string; id: string }[] } }>(itens: T[], indice: Map<string, Alvo>): T[] {
  return itens.map((i) => {
    if (!i.detalhe?.relacionados?.length) return i;
    const relacionados = i.detalhe.relacionados.flatMap((r) => {
      const alvo = indice.get(`${r.tipo}:${r.id}`);
      return alvo ? [{ tipo: r.tipo, id: r.id, ...alvo }] : [];
    });
    return { ...i, detalhe: { ...i.detalhe, relacionados } };
  });
}

/* Monta a lista de recursos publicados (caminho relativo a /v1 e o dado de cada um). */
export function montarRecursos(conteudoBruto: Conteudo): Recurso[] {
  const indice = indiceDoEcossistema(conteudoBruto);
  const c: Conteudo = {
    ...conteudoBruto,
    empresas: resolverRelacionados(conteudoBruto.empresas, indice),
    vagas: resolverRelacionados(conteudoBruto.vagas, indice),
    perfis: resolverRelacionados(conteudoBruto.perfis, indice),
    ferramentas: resolverRelacionados(conteudoBruto.ferramentas, indice),
    hospedagens: resolverRelacionados(conteudoBruto.hospedagens, indice),
    eventos: conteudoBruto.eventos.map((e) => {
      if (!e.content.relacionados?.length) return e;
      const relacionados = e.content.relacionados.flatMap((r) => {
        const alvo = indice.get(`${r.tipo}:${r.id}`);
        return alvo ? [{ tipo: r.tipo, id: r.id, ...alvo }] : [];
      });
      return { ...e, content: { ...e.content, relacionados } };
    }),
  };
  const r: Recurso[] = [
    { caminho: "learn-tech/programas.json", descricao: "Catálogo de programas (campos de card)", dados: c.programas.map(resumoPrograma) },
    ...c.programas.map((p) => ({ caminho: `learn-tech/programas/${p.id}.json`, descricao: `Programa ${p.id} completo (módulos e quiz)`, dados: p })),
    ...Object.entries(c.paginas).map(([nome, dados]) => ({ caminho: `learn-tech/paginas/${nome}.json`, descricao: `Página ${nome}`, dados })),
    { caminho: "learn-tech/areas.json", descricao: "Áreas de atuação em tecnologia (com fontes)", dados: c.areas },
    { caminho: "bootcamps/eventos.json", descricao: "Eventos, bootcamps e formações", dados: c.eventos },
    ...c.eventos.map((e) => ({ caminho: `bootcamps/eventos/${e.slug}.json`, descricao: `Evento ${e.slug}`, dados: e })),
    { caminho: "career/empresas.json", descricao: "Empresas para acompanhar", dados: c.empresas },
    { caminho: "career/vagas.json", descricao: "Plataformas de vagas", dados: c.vagas },
    { caminho: "career/perfis.json", descricao: "Perfis de devs para seguir", dados: c.perfis },
    { caminho: "career/destaques.json", descricao: "Seleção do carrossel de destaques", dados: c.destaques },
    { caminho: "career/modelos-curriculo.json", descricao: "Modelos de currículo fictícios, com dicas e fontes", dados: c.modelosCurriculo },
    { caminho: "tools/ferramentas.json", descricao: "Ferramentas", dados: c.ferramentas },
    { caminho: "tools/hospedagens.json", descricao: "Hospedagens", dados: c.hospedagens },
    { caminho: "cobertura.json", descricao: "Matriz de cobertura do acervo", dados: c.cobertura },
  ];
  return r;
}

/* Fim de conteudo.ts */
