/* baixar-imagens-externas.mjs — traz para a API as imagens que o conteúdo ainda carrega de sites externos
 * (Pixabay e artes de divulgação de eventos publicadas no Luma).
 *
 * Por quê: imagem apontando para o site de terceiros quebra se ele mudar o link ou bloquear o acesso.
 * Copiada para media/, ela passa a ser servida pela própria API em /media/... (licença do Pixabay; artes do Luma são divulgação pública do evento, com crédito nas fontes).
 *
 * O que faz:
 *   1. procura em content/**\/*.json todas as URLs https://cdn.pixabay.com/... e https://images.lumacdn.com/...;
 *   2. baixa cada uma: Pixabay para media/learn-tech/imagens/pixabay-<nome>; Luma para media/bootcamps/eventos/luma/<nome>;
 *   3. troca a URL pelo caminho /media/... nos JSON (texto bruto, sem reformatar o arquivo);
 *   4. faz o mesmo na cópia manual de programas do learn-tech (src/constants/programsData.js),
 *      lá com a URL absoluta da API, porque o site não serve /media.
 *
 * Uso (precisa de internet; rode na sua máquina, na raiz do learntech-content):
 *   node scripts/baixar-imagens-externas.mjs            # baixa e troca
 *   node scripts/baixar-imagens-externas.mjs --listar   # só lista o que seria trocado
 * Depois: npm run validar && npm run copias
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const API_PUBLICA = "https://learntech-content.douglasabnovato.workers.dev";
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(RAIZ, "content");
const COPIA_PROGRAMAS = path.resolve(RAIZ, "..", "learn-tech", "src", "constants", "programsData.js");
const URL_EXTERNA = /https:\/\/(?:cdn\.pixabay\.com\/photo\/[\w/.-]+|images\.lumacdn\.com\/cdn-cgi\/image\/[^/\s"]+\/[\w/.-]+)\.(?:jpe?g|png|webp)/g;
const listar = process.argv.includes("--listar");

/* Todos os .json de content/, recursivamente. */
function arquivosJson(pasta) {
  return fs.readdirSync(pasta, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(pasta, e.name);
    return e.isDirectory() ? arquivosJson(p) : e.name.endsWith(".json") ? [p] : [];
  });
}

/* Pixabay: .../coding-924920_1280.jpg -> /media/learn-tech/imagens/pixabay-coding-924920_1280.jpg
   Luma:    .../event-covers/4h/b019eb7f-....png -> /media/bootcamps/eventos/luma/b019eb7f-....png */
function destinoLocal(url) {
  const nome = path.basename(new URL(url).pathname).toLowerCase().replace(/\.jpeg$/, ".jpg");
  return url.includes("lumacdn.com") ? `/media/bootcamps/eventos/luma/${nome}` : `/media/learn-tech/imagens/pixabay-${nome}`;
}

const arquivos = arquivosJson(CONTENT);
if (fs.existsSync(COPIA_PROGRAMAS)) arquivos.push(COPIA_PROGRAMAS);
const urls = new Set(arquivos.flatMap((a) => fs.readFileSync(a, "utf8").match(URL_EXTERNA) ?? []));
console.log(`${urls.size} imagem(ns) externa(s) em ${arquivos.length} arquivo(s).`);
if (listar) { for (const u of urls) console.log(` - ${u} -> ${destinoLocal(u)}`); process.exit(0); }

const baixadas = new Map();
for (const url of urls) {
  const destino = destinoLocal(url);
  const alvo = path.join(RAIZ, destino.slice(1));
  const nome = path.relative(RAIZ, alvo);
  fs.mkdirSync(path.dirname(alvo), { recursive: true });
  if (!fs.existsSync(alvo)) {
    /* Accept fixo: o Luma converte o formato pelo Accept (format=auto) e o arquivo precisa bater com a extensão. */
    const r = await fetch(url, { headers: { "User-Agent": "learntech-content/1.0", Accept: "image/png,image/jpeg;q=0.9" } });
    if (!r.ok) { console.error(`x ${url}: HTTP ${r.status} (mantida a URL original)`); continue; }
    fs.writeFileSync(alvo, Buffer.from(await r.arrayBuffer()));
    console.log(`+ ${nome}`);
  }
  baixadas.set(url, destino);
}

for (const arquivo of arquivos) {
  const ehCopia = arquivo === COPIA_PROGRAMAS;
  const original = fs.readFileSync(arquivo, "utf8");
  const novo = original.replace(URL_EXTERNA, (u) => (baixadas.has(u) ? (ehCopia ? API_PUBLICA : "") + baixadas.get(u) : u));
  if (novo !== original) { fs.writeFileSync(arquivo, novo); console.log(`~ ${path.relative(path.resolve(RAIZ, ".."), arquivo)}`); }
}
console.log("Pronto. Rode: npm run validar && npm run copias");

/* Fim de baixar-imagens-externas.mjs */
