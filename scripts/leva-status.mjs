/* leva-status.mjs — diz se uma leva de conteúdo pode ser fechada (e o hd liberado).
 *
 * Regra (docs/processo/README.md, ◆A3): o autor só remove arquivos do hd quando
 *   1. todo item do lote está fechado: estado "publicado", "exibido" ou "referencia", com pelo menos um destino e sem `pendencias`;
 *      os demais ("novo", "extraido", "triado", "planejado", "produzido", "publicado-em-parte", "nao-publicavel") contam como abertos;
 *   2. nenhum arquivo do hd está fora do inventário (cópia idêntica de arquivo inventariado conta como inventariada);
 *   3. o relatório do lote (docs/processo/lotes/<lote>*.md) tem a linha "Aprovado pelo autor em: AAAA-MM-DD".
 *
 * Uso:  node scripts/leva-status.mjs            # todos os lotes
 *       node scripts/leva-status.mjs 2026-10-30  # um lote
 * Sai com código 1 enquanto houver pendência. Não há "leva concluída" sem este script dizer que está.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HD = path.resolve(RAIZ, "..", "hd");
const LOTES = path.join(RAIZ, "docs", "processo", "lotes");
const FECHADOS = new Set(["publicado", "exibido", "referencia"]);
const filtro = process.argv[2];

const acervo = JSON.parse(fs.readFileSync(path.join(RAIZ, "content", "acervo.json"), "utf8"));
const lotes = [...new Set(acervo.itens.map((i) => i.lote))].filter((l) => !filtro || l === filtro).sort();
let pendente = false;

for (const lote of lotes) {
  const itens = acervo.itens.filter((i) => i.lote === lote);
  const abertos = itens.filter((i) => !FECHADOS.has(i.estado) || i.destinos.length === 0 || i.pendencias?.length);
  const relatorios = fs.existsSync(LOTES) ? fs.readdirSync(LOTES).filter((f) => f.startsWith(lote)) : [];
  const aprovacao = relatorios
    .map((f) => fs.readFileSync(path.join(LOTES, f), "utf8").match(/Aprovado pelo autor em:\s*(\d{4}-\d{2}-\d{2})/))
    .find(Boolean);
  const fechado = abertos.length === 0 && aprovacao;
  if (!fechado) pendente = true;
  console.log(`\nLote ${lote}: ${itens.length} itens, ${itens.length - abertos.length} fechados, ${abertos.length} abertos`);
  for (const i of abertos) {
    console.log(`  aberto  ${i.id} [${i.estado}${i.destinos.length ? "" : ", sem destino"}] ${i.descricao.slice(0, 70)}`);
    for (const p of i.pendencias ?? []) console.log(`          pendência: ${p}`);
  }
  if (!relatorios.length) console.log("  falta   relatório do lote em docs/processo/lotes/");
  console.log(aprovacao ? `  aprovado pelo autor em ${aprovacao[1]}` : "  falta   aprovação do autor (linha \"Aprovado pelo autor em: AAAA-MM-DD\" no relatório)");
  console.log(fechado ? "  => LEVA FECHADA: os arquivos deste lote podem sair do hd." : "  => LEVA ABERTA: não remover arquivos do hd.");
}

/* Arquivos do hd fora do inventário (mesma lógica de cópias do hd-inventariar). */
const mapaLocal = path.join(HD, ".acervo-local.json");
const cache = path.join(HD, ".hash-cache.json");
if (fs.existsSync(mapaLocal) && fs.existsSync(cache)) {
  const mapeados = new Set(Object.values(JSON.parse(fs.readFileSync(mapaLocal, "utf8"))).flat());
  const hashPorCaminho = new Map(Object.entries(JSON.parse(fs.readFileSync(cache, "utf8"))).map(([k, v]) => [k.split("|")[0], v]));
  const hashesMapeados = new Set([...mapeados].map((p) => hashPorCaminho.get(p)));
  const todos = [];
  (function andar(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if ((dir === HD && e.name.startsWith(".")) || ["desktop.ini", ".ds_store", "thumbs.db"].includes(e.name.toLowerCase())) continue; /* arquivos de sistema */
      const p = path.join(dir, e.name);
      if (e.isDirectory()) andar(p);
      else todos.push(path.relative(HD, p).split(path.sep).join("/"));
    }
  })(HD);
  const fora = todos.filter((p) => !mapeados.has(p) && !hashesMapeados.has(hashPorCaminho.get(p)));
  console.log(`\nhd: ${todos.length} arquivos, ${fora.length} fora do inventário${fora.length ? " (rode npm run hd:inventariar)" : ""}`);
  fora.slice(0, 20).forEach((p) => console.log(`  novo    ${p}`));
  if (fora.length) pendente = true;
}

process.exit(pendente ? 1 : 0);

/* Fim de leva-status.mjs */
