/* conteudo.ts — carrega a pasta content/, valida schema e integridade e gera os recursos publicados em dist/v1. */
import fs from "node:fs";
import path from "node:path";
import type { z } from "zod";
import { programaSchema, paginaSchema, PAGINAS, CAMPOS_RESUMO, type Programa } from "../../src/schemas/learn-tech";
import { eventoSchema, type Evento } from "../../src/schemas/bootcamps";
import { empresaSchema, vagaOuPerfilSchema, destaquesSchema, ferramentaSchema } from "../../src/schemas/career-tools";
import { coberturaSchema, type Cobertura } from "../../src/schemas/cobertura";

export interface Conteudo {
  programas: Programa[];
  paginas: Record<string, Record<string, unknown>>;
  eventos: Evento[];
  empresas: z.infer<typeof empresaSchema>[];
  vagas: z.infer<typeof vagaOuPerfilSchema>[];
  perfis: z.infer<typeof vagaOuPerfilSchema>[];
  destaques: z.infer<typeof destaquesSchema>;
  ferramentas: z.infer<typeof ferramentaSchema>[];
  hospedagens: z.infer<typeof ferramentaSchema>[];
  cobertura: Cobertura;
}

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
    eventos,
    empresas: lista("career/empresas.json", empresaSchema),
    vagas: lista("career/vagas.json", vagaOuPerfilSchema),
    perfis: lista("career/perfis.json", vagaOuPerfilSchema),
    destaques: conferir(destaquesSchema, lerJson(c("career/destaques.json"), erros), "career/destaques.json", erros) ?? { vaga: "", empresa: "", perfil: "" },
    ferramentas: lista("tools/ferramentas.json", ferramentaSchema),
    hospedagens: lista("tools/hospedagens.json", ferramentaSchema),
    cobertura: conferir(coberturaSchema, lerJson(c("cobertura.json"), erros), "cobertura.json", erros) ?? { atualizadoEm: "", referencias: [], itens: [] },
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

  repetidos(c.eventos.map((e) => e.id)).forEach((id) => erros.push(`evento id ${id}: repetido`));
  repetidos(c.eventos.map((e) => e.slug)).forEach((s) => erros.push(`evento ${s}: slug repetido`));

  const listas = { empresas: c.empresas, vagas: c.vagas, perfis: c.perfis, ferramentas: c.ferramentas, hospedagens: c.hospedagens };
  for (const [nome, itens] of Object.entries(listas)) {
    repetidos(itens.map((i) => i.title.toLowerCase())).forEach((t) => erros.push(`${nome}: título "${t}" repetido`));
    repetidos(itens.flatMap((i) => (i.slug ? [i.slug] : []))).forEach((s) => erros.push(`${nome}: slug "${s}" repetido`));
    for (const i of itens) if (i.detalhe && !i.slug) erros.push(`${nome}: "${i.title}" tem detalhe mas não tem slug`);
  }
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

/* Recorta do programa só os campos que os cards usam. */
function resumoPrograma(p: Programa): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  for (const campo of CAMPOS_RESUMO) if (campo in p) r[campo] = (p as Record<string, unknown>)[campo];
  r.modulesCount = p.modules?.length ?? 0;
  r.hasQuiz = Array.isArray(p.quiz) && p.quiz.length > 0;
  return r;
}

/* Monta a lista de recursos publicados (caminho relativo a /v1 e o dado de cada um). */
export function montarRecursos(c: Conteudo): Recurso[] {
  const r: Recurso[] = [
    { caminho: "learn-tech/programas.json", descricao: "Catálogo de programas (campos de card)", dados: c.programas.map(resumoPrograma) },
    ...c.programas.map((p) => ({ caminho: `learn-tech/programas/${p.id}.json`, descricao: `Programa ${p.id} completo (módulos e quiz)`, dados: p })),
    ...Object.entries(c.paginas).map(([nome, dados]) => ({ caminho: `learn-tech/paginas/${nome}.json`, descricao: `Página ${nome}`, dados })),
    { caminho: "bootcamps/eventos.json", descricao: "Eventos, bootcamps e formações", dados: c.eventos },
    ...c.eventos.map((e) => ({ caminho: `bootcamps/eventos/${e.slug}.json`, descricao: `Evento ${e.slug}`, dados: e })),
    { caminho: "career/empresas.json", descricao: "Empresas para acompanhar", dados: c.empresas },
    { caminho: "career/vagas.json", descricao: "Plataformas de vagas", dados: c.vagas },
    { caminho: "career/perfis.json", descricao: "Perfis de devs para seguir", dados: c.perfis },
    { caminho: "career/destaques.json", descricao: "Seleção do carrossel de destaques", dados: c.destaques },
    { caminho: "tools/ferramentas.json", descricao: "Ferramentas", dados: c.ferramentas },
    { caminho: "tools/hospedagens.json", descricao: "Hospedagens", dados: c.hospedagens },
    { caminho: "cobertura.json", descricao: "Matriz de cobertura do acervo", dados: c.cobertura },
  ];
  return r;
}

/* Fim de conteudo.ts */
