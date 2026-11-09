/* hd-inventariar.mjs — etapa 2 do processo de levas: inventário do hd com hash.
 *
 * O hd (pasta irmã ../hd) recebe o material bruto do autor; depois que uma leva vira conteúdo,
 * os arquivos são apagados. O registro permanente fica em content/acervo.json, identificado por
 * SHA-256 — nunca pelo nome do arquivo (nomes podem ter dados de pessoas e clientes).
 *
 * Uso (na raiz do learntech-content):
 *   node scripts/hd-inventariar.mjs                  # relatório: novos, já registrados, removidos
 *   node scripts/hd-inventariar.mjs --registrar      # cria itens HD-0000 (estado "novo") para os arquivos novos
 *   node scripts/hd-inventariar.mjs --hd <pasta>     # outra pasta de acervo
 *
 * Arquivos gerados fora do repositório (não vão para o git):
 *   <hd>/.acervo-local.json   mapa ID → caminhos locais, usado na triagem; some junto com o hd.
 *   <hd>/.hash-cache.json     cache de hash por caminho+tamanho+data, para não reler arquivos grandes.
 *
 * Agrupamento: um item por pasta de até dois níveis (ex.: "6-tech_community/gdg_jf").
 * Sem dependências: só Node 20+.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARQ_ACERVO = path.join(RAIZ, "content", "acervo.json");
const argv = process.argv.slice(2);
const registrar = argv.includes("--registrar");
const iHd = argv.indexOf("--hd");
const HD = path.resolve(iHd >= 0 ? argv[iHd + 1] : path.join(RAIZ, "..", "hd"));
const IGNORAR = new Set([".acervo-local.json", ".hash-cache.json", ".imagens-publicadas.json", ".dhash-cache.json", "desktop.ini", "Thumbs.db", ".DS_Store"]);

if (!fs.existsSync(HD)) { console.error(`hd não encontrado em ${HD}`); process.exit(1); }

/* Lista todos os arquivos do hd, com caminho relativo em barras normais e NFC. */
function listar(pasta, base = pasta) {
  return fs.readdirSync(pasta, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(pasta, e.name);
    if (e.isDirectory()) return e.name === ".extraido" ? [] : listar(p, base); /* .extraido: saída do hd:extrair */
    if (IGNORAR.has(e.name)) return [];
    return [{ abs: p, rel: path.relative(base, p).split(path.sep).join("/").normalize("NFC") }];
  });
}

/* SHA-256 em streaming (vídeos de centenas de MB não vão para a memória). */
function sha256(arquivo) {
  return new Promise((ok, erro) => {
    const h = crypto.createHash("sha256");
    fs.createReadStream(arquivo).on("data", (b) => h.update(b)).on("end", () => ok(h.digest("hex"))).on("error", erro);
  });
}

const ler = (p, padrao) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : padrao);
const acervo = ler(ARQ_ACERVO, { atualizadoEm: "", itens: [] });
const ARQ_CACHE = path.join(HD, ".hash-cache.json");
const cache = ler(ARQ_CACHE, {});

const arquivos = listar(HD);
console.log(`hd: ${arquivos.length} arquivo(s) em ${HD}`);
let calculados = 0;
for (const a of arquivos) {
  const st = fs.statSync(a.abs);
  const chave = `${a.rel}|${st.size}|${Math.round(st.mtimeMs)}`;
  a.bytes = st.size;
  a.ext = path.extname(a.rel).slice(1).toLowerCase().replace(/[^a-z0-9]/g, "") || "sem-extensao";
  a.sha256 = cache[chave] ?? (cache[chave] = await sha256(a.abs));
  if (++calculados % 200 === 0) { fs.writeFileSync(ARQ_CACHE, JSON.stringify(cache)); console.log(`  ${calculados}/${arquivos.length}`); }
}
fs.writeFileSync(ARQ_CACHE, JSON.stringify(cache));

/* Hash → item do acervo que já o registrou. */
const porHash = new Map();
for (const it of acervo.itens) for (const f of it.arquivos ?? []) porHash.set(f.sha256, it);

const grupo = (rel) => rel.split("/").slice(0, -1).slice(0, 2).join("/") || "(raiz)";
const novos = new Map();
const registrados = new Map();
const vistos = new Map(); /* hash novo → primeiro caminho (cópias idênticas entram uma vez só) */
let copias = 0;
for (const a of arquivos) {
  const it = porHash.get(a.sha256);
  if (it) { registrados.set(it.id, (registrados.get(it.id) ?? 0) + 1); continue; }
  if (vistos.has(a.sha256)) { copias++; continue; }
  vistos.set(a.sha256, a.rel);
  const g = grupo(a.rel);
  if (!novos.has(g)) novos.set(g, []);
  novos.get(g).push(a);
}
const noHd = new Set(arquivos.map((a) => a.sha256));
const removidos = acervo.itens.filter((it) => it.arquivos?.length && it.arquivos.every((f) => !noHd.has(f.sha256)));

console.log(`\nJá registrados no acervo: ${[...registrados.values()].reduce((a, b) => a + b, 0)} arquivo(s) em ${registrados.size} item(ns)`);
for (const [id, n] of registrados) { const it = acervo.itens.find((x) => x.id === id); console.log(`  = ${id} (${it.estado}) ${n} arquivo(s)`); }
console.log(`\nNovos: ${[...novos.values()].reduce((a, b) => a + b.length, 0)} arquivo(s) em ${novos.size} grupo(s); ${copias} cópia(s) idêntica(s) ignorada(s)`);
for (const [g, lista] of novos) console.log(`  + ${g}: ${lista.length}`);
console.log(`\nItens do acervo cujos arquivos já saíram do hd (baixa concluída): ${removidos.length}`);

/* Mapa local ID → caminhos (fica no hd, fora do git). */
const mapaLocal = ler(path.join(HD, ".acervo-local.json"), {});
for (const a of arquivos) { const it = porHash.get(a.sha256); if (!it) continue; const lista = (mapaLocal[it.id] ??= []); if (!lista.includes(a.rel)) lista.push(a.rel); }

if (registrar && novos.size) {
  const hoje = new Date().toISOString().slice(0, 10);
  let n = Math.max(0, ...acervo.itens.filter((i) => i.id.startsWith("HD-")).map((i) => Number(i.id.slice(3))));
  for (const [g, lista] of [...novos].sort(([a], [b]) => a.localeCompare(b))) {
    const id = `HD-${String(++n).padStart(4, "0")}`;
    const exts = Object.entries(lista.reduce((c, a) => ((c[a.ext] = (c[a.ext] ?? 0) + 1), c), {})).sort((a, b) => b[1] - a[1]).map(([e, q]) => `${q} ${e}`).join(", ");
    acervo.itens.push({
      id, lote: hoje, origem: `hd/${g.split("/")[0]}`,
      descricao: `A triar: ${lista.length} arquivo(s) (${exts}).`,
      direitos: "a-triar", estado: "novo", destinos: [],
      arquivos: lista.map((a) => ({ sha256: a.sha256, ext: a.ext, bytes: a.bytes })),
    });
    mapaLocal[id] = lista.map((a) => a.rel);
    console.log(`  registrado ${id} ← ${g}`);
  }
  acervo.atualizadoEm = hoje;
  fs.writeFileSync(ARQ_ACERVO, (JSON.stringify(acervo, null, 2) + "\n").replace(/\n/g, "\r\n"));
  console.log(`\nacervo.json atualizado. Próximo passo: triagem (docs/processo/README.md, etapa 3).`);
} else if (novos.size) {
  console.log(`\nRode com --registrar para criar os itens HD-0000 dos arquivos novos.`);
}
fs.writeFileSync(path.join(HD, ".acervo-local.json"), JSON.stringify(mapaLocal, null, 2));

/* Fim de hd-inventariar.mjs */
