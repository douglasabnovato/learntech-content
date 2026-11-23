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
 *   node scripts/hd-inventariar.mjs --saida <pasta>  # grava o mapa e o cache nessa pasta, e nada no hd (#42)
 *   node scripts/hd-inventariar.mjs --ignorar a,b/c  # pastas do hd que nem são abertas (caminho relativo ao hd)
 *
 * Arquivos gerados fora do repositório (não vão para o git):
 *   .acervo-local.json   mapa ID → caminhos locais, usado na triagem.
 *   .hash-cache.json     cache de hash por caminho+tamanho+data, para não reler arquivos grandes.
 * Sem --saida, os dois ficam na raiz do hd e somem junto com ele. Para um hd só de leitura (hd-codes),
 * use --saida .hd-local (pasta ignorada pelo git na raiz do learntech-content).
 *
 * Agrupamento: um item por pasta de até dois níveis (ex.: "6-tech_community/gdg_jf").
 * Sem dependências: só Node 20+.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { hojeLocal } from "./lib/data-local.mjs";
import { listar, classificar, pastasIgnoradas, arquivosLocais } from "./lib/hd-inventario.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARQ_ACERVO = path.join(RAIZ, "content", "acervo.json");
const argv = process.argv.slice(2);
const registrar = argv.includes("--registrar");
const iHd = argv.indexOf("--hd");
const HD = path.resolve(iHd >= 0 ? argv[iHd + 1] : path.join(RAIZ, "..", "hd"));
const valorDe = (opcao) => {
  const i = argv.indexOf(opcao);
  return i >= 0 ? argv[i + 1] : undefined;
};
const IGNORAR = pastasIgnoradas(valorDe("--ignorar"));
const LOCAL = arquivosLocais(HD, valorDe("--saida"));

if (!fs.existsSync(HD)) {
  console.error(`hd não encontrado em ${HD}`);
  process.exit(1);
}
const dentroDoHd = path.relative(HD, LOCAL.pasta);
if (LOCAL.pasta !== HD && (dentroDoHd === "" || !dentroDoHd.startsWith(".."))) {
  console.error(`--saida não pode ficar dentro do hd (${LOCAL.pasta}): com --saida, nada é escrito no hd.`);
  process.exit(1);
}
fs.mkdirSync(LOCAL.pasta, { recursive: true });

/* SHA-256 em streaming (vídeos de centenas de MB não vão para a memória). */
function sha256(arquivo) {
  return new Promise((ok, erro) => {
    const h = crypto.createHash("sha256");
    fs.createReadStream(arquivo)
      .on("data", (b) => h.update(b))
      .on("end", () => ok(h.digest("hex")))
      .on("error", erro);
  });
}

const ler = (p, padrao) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : padrao);
const acervo = ler(ARQ_ACERVO, { atualizadoEm: "", itens: [] });
const ARQ_CACHE = LOCAL.cache;
const cache = ler(ARQ_CACHE, {});

const arquivos = listar(HD, { ignorar: IGNORAR });
console.log(`hd: ${arquivos.length} arquivo(s) em ${HD}`);
if (IGNORAR.size) console.log(`  pastas não abertas (--ignorar): ${[...IGNORAR].join(", ")}`);
if (LOCAL.pasta !== HD) console.log(`  mapa e cache em ${LOCAL.pasta} (--saida); nada é escrito no hd`);
let calculados = 0;
for (const a of arquivos) {
  const st = fs.statSync(a.abs);
  const chave = `${a.rel}|${st.size}|${Math.round(st.mtimeMs)}`;
  a.bytes = st.size;
  a.ext =
    path
      .extname(a.rel)
      .slice(1)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "sem-extensao";
  a.sha256 = cache[chave] ?? (cache[chave] = await sha256(a.abs));
  if (++calculados % 200 === 0) {
    fs.writeFileSync(ARQ_CACHE, JSON.stringify(cache));
    console.log(`  ${calculados}/${arquivos.length}`);
  }
}
fs.writeFileSync(ARQ_CACHE, JSON.stringify(cache));

const { porHash, registrados, novos, copias, removidos } = classificar(arquivos, acervo);

console.log(
  `\nJá registrados no acervo: ${[...registrados.values()].reduce((a, b) => a + b, 0)} arquivo(s) em ${registrados.size} item(ns)`,
);
for (const [id, n] of registrados) {
  const it = acervo.itens.find((x) => x.id === id);
  console.log(`  = ${id} (${it.estado}) ${n} arquivo(s)`);
}
console.log(
  `\nNovos: ${[...novos.values()].reduce((a, b) => a + b.length, 0)} arquivo(s) em ${novos.size} grupo(s); ${copias} cópia(s) idêntica(s) ignorada(s)`,
);
for (const [g, lista] of novos) console.log(`  + ${g}: ${lista.length}`);
console.log(`\nItens do acervo cujos arquivos já saíram do hd (baixa concluída): ${removidos.length}`);

/* Mapa local ID → caminhos (fora do git: no hd ou na pasta do --saida). */
const mapaLocal = ler(LOCAL.mapa, {});
for (const a of arquivos) {
  const it = porHash.get(a.sha256);
  if (!it) continue;
  const lista = (mapaLocal[it.id] ??= []);
  if (!lista.includes(a.rel)) lista.push(a.rel);
}

if (registrar && novos.size) {
  const hoje = hojeLocal();
  let n = Math.max(0, ...acervo.itens.filter((i) => i.id.startsWith("HD-")).map((i) => Number(i.id.slice(3))));
  for (const [g, lista] of [...novos].sort(([a], [b]) => a.localeCompare(b))) {
    const id = `HD-${String(++n).padStart(4, "0")}`;
    const exts = Object.entries(lista.reduce((c, a) => ((c[a.ext] = (c[a.ext] ?? 0) + 1), c), {}))
      .sort((a, b) => b[1] - a[1])
      .map(([e, q]) => `${q} ${e}`)
      .join(", ");
    acervo.itens.push({
      id,
      lote: hoje,
      origem: `hd/${g.split("/")[0]}`,
      descricao: `A triar: ${lista.length} arquivo(s) (${exts}).`,
      direitos: "a-triar",
      estado: "novo",
      destinos: [],
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
fs.writeFileSync(LOCAL.mapa, JSON.stringify(mapaLocal, null, 2));

/* Fim de hd-inventariar.mjs */
