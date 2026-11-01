/* cobertura-projetos.mjs — mostra até onde cada item do acervo chegou nos quatro projetos.
 *
 * Por quê: a regra do autor é que todo conteúdo do hd apareça no máximo de projetos que o tema permitir
 * (learn-tech: programas, artigos e áreas; bootcamps: eventos; career: empresas, vagas, perfis e currículos;
 * tools: ferramentas e hospedagens). Esta checagem torna isso mensurável a cada remessa.
 *
 * O que faz, para os itens do acervo (todos ou de um lote):
 *   1. lê os destinos de cada item e agrupa por projeto;
 *   2. confere se cada destino existe no conteúdo publicado (id, slug ou título);
 *   3. lista os itens que chegam a um projeto só, para avaliar se o tema cabe em outro;
 *   4. resume quantos itens alcançam 1, 2, 3 ou 4 projetos.
 *
 * Uso:  node scripts/cobertura-projetos.mjs [lote]      (ex.: 2026-10-30)
 * Sai com código 1 se algum destino não existir.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const C = path.join(RAIZ, "content");
const ler = (p) => JSON.parse(fs.readFileSync(path.join(C, p), "utf8"));
const lista = (v) => (Array.isArray(v) ? v : Object.values(v).find(Array.isArray) ?? []);
const chaves = (itens) => new Set(itens.flatMap((i) => [i.slug, i.id, i.title].filter(Boolean).map(String)));
const arquivos = (pasta) => new Set(fs.readdirSync(path.join(C, pasta)).map((f) => f.replace(/\.json$/, "")));

const existentes = {
  "learn-tech/programas": arquivos("learn-tech/programas"),
  "learn-tech/blog": chaves(lista(ler("learn-tech/paginas/blog.json"))),
  "learn-tech/areas": chaves(lista(ler("learn-tech/areas.json"))),
  "bootcamps/eventos": arquivos("bootcamps/eventos"),
  "career/empresas": chaves(lista(ler("career/empresas.json"))),
  "career/vagas": chaves(lista(ler("career/vagas.json"))),
  "career/perfis": chaves(lista(ler("career/perfis.json"))),
  "career/modelos-curriculo": chaves(lista(ler("career/modelos-curriculo.json"))),
  "tools/ferramentas": chaves(lista(ler("tools/ferramentas.json"))),
  "tools/hospedagens": chaves(lista(ler("tools/hospedagens.json"))),
};
/* Destinos antigos (leva 1) às vezes omitem o projeto ("blog/x", "eventos/x"). */
const PROJETO_DO_RECURSO = { programas: "learn-tech", blog: "learn-tech", areas: "learn-tech", eventos: "bootcamps", empresas: "career", vagas: "career", perfis: "career", "modelos-curriculo": "career", ferramentas: "tools", hospedagens: "tools" };

const lote = process.argv[2];
const itens = ler("acervo.json").itens.filter((i) => !lote || i.lote === lote);
const faixas = { 0: [], 1: [], 2: [], 3: [], 4: [] };
const quebrados = [];
for (const it of itens) {
  const projetos = new Set();
  for (const d of it.destinos) {
    let partes = d.replace(/\s*\(.*\)$/, "").split("/");
    if (PROJETO_DO_RECURSO[partes[0]]) partes = [PROJETO_DO_RECURSO[partes[0]], ...partes];
    const [proj, rec, ...resto] = partes;
    const id = resto.join("/");
    projetos.add(proj);
    const base = existentes[`${proj}/${rec}`];
    if (base && id && !base.has(id)) quebrados.push(`${it.id}: destino "${d}" não existe`);
  }
  faixas[Math.min(projetos.size, 4)].push({ it, projetos: [...projetos] });
}

console.log(`Itens: ${itens.length}${lote ? ` (lote ${lote})` : ""}`);
for (const n of [0, 1, 2, 3, 4]) console.log(`  ${n} projeto(s): ${faixas[n].length}`);
if (faixas[1].length) {
  console.log("\nChegam a um projeto só (avaliar se o tema cabe em outro):");
  for (const { it, projetos } of faixas[1]) console.log(`  ${it.id} [${projetos[0]}] ${it.descricao.slice(0, 80)}`);
}
if (faixas[0].length) {
  console.log("\nSem destino:");
  for (const { it } of faixas[0]) console.log(`  ${it.id} [${it.estado}] ${it.descricao.slice(0, 80)}`);
}
if (quebrados.length) { console.log("\nDestinos inexistentes:"); quebrados.forEach((q) => console.log("  " + q)); }
process.exit(quebrados.length ? 1 : 0);

/* Fim de cobertura-projetos.mjs */
