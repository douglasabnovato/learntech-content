/* gerar-sitemaps.mjs — gera o sitemap.xml de cada site (e o robots.txt dos sites no Vercel) a partir do conteúdo da API.
 *
 * Por quê: os buscadores precisam da lista de páginas, inclusive programas, artigos, eventos e páginas de detalhe,
 * que só existem como rotas do JavaScript. Gerar a partir de content/ mantém o sitemap igual ao que a API publica.
 *
 * Onde grava (pastas vizinhas, como o exportar-copias):
 *   learn-tech/public/sitemap.xml e robots.txt   (Vercel serve public/ na raiz)
 *   bootcamps/public/sitemap.xml e robots.txt
 *   career/sitemap.xml e tools/sitemap.xml        (GitHub Pages de projeto: o robots.txt só valeria na raiz do domínio)
 * Páginas de detalhe da career e do tools usam ?tipo=&id= e ?id= (o # não é indexado; os dois sites aceitam a query).
 *
 * Uso: npm run sitemaps   (rode depois de mudar conteúdo, junto com npm run copias)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const C = path.join(RAIZ, "content");
const VIZINHOS = path.resolve(RAIZ, "..");
const SITES = {
  "learn-tech": "https://learn-tech-pied.vercel.app",
  bootcamps: "https://bootcamps-dun.vercel.app",
  career: "https://douglasabnovato.github.io/career",
  tools: "https://douglasabnovato.github.io/tools",
};
const ler = (p) => JSON.parse(fs.readFileSync(path.join(C, p), "utf8"));
const lista = (v) => (Array.isArray(v) ? v : Object.values(v).find(Array.isArray) ?? []);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const hoje = new Date().toISOString().slice(0, 10);
const xml = (urls) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${esc(u)}</loc><lastmod>${hoje}</lastmod></url>`).join("\n")}\n</urlset>\n`;
const robots = (base) => `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;

const programas = fs.readdirSync(path.join(C, "learn-tech/programas")).map((f) => ler(`learn-tech/programas/${f}`));
const blog = lista(ler("learn-tech/paginas/blog.json"));
const eventos = fs.readdirSync(path.join(C, "bootcamps/eventos")).map((f) => ler(`bootcamps/eventos/${f}`));
const comDetalhe = (arq) => lista(ler(arq)).filter((i) => i.slug && i.detalhe);

const saidas = {
  "learn-tech/public": [
    ...["/", "/programs", "/blogs", "/category", "/about", "/aprender", "/careers", "/softskills", "/mentorias", "/resources", "/falaae", "/privacy", "/terms"].map((r) => SITES["learn-tech"] + r),
    ...programas.map((p) => `${SITES["learn-tech"]}/program/${p.categoryFilter}/${p.id}`),
    ...blog.map((b) => `${SITES["learn-tech"]}/blog/${b.id}`),
  ],
  "bootcamps/public": [SITES.bootcamps + "/", ...eventos.map((e) => `${SITES.bootcamps}/event/${e.slug}`)],
  career: [
    SITES.career + "/",
    ...["empresas", "vagas", "perfis"].flatMap((t) => comDetalhe(`career/${t}.json`).map((i) => `${SITES.career}/detalhe.html?tipo=${t}&id=${i.slug}`)),
  ],
  tools: [SITES.tools + "/", ...comDetalhe("tools/ferramentas.json").map((i) => `${SITES.tools}/detalhe.html?id=${i.slug}`)],
};

for (const [pasta, urls] of Object.entries(saidas)) {
  const destino = path.join(VIZINHOS, pasta);
  if (!fs.existsSync(destino)) { console.warn(`- ${pasta} não encontrado, pulei`); continue; }
  fs.writeFileSync(path.join(destino, "sitemap.xml"), xml(urls));
  if (pasta.endsWith("/public")) fs.writeFileSync(path.join(destino, "robots.txt"), robots(SITES[pasta.split("/")[0]]));
  console.log(`+ ${pasta}/sitemap.xml (${urls.length} URLs)`);
}

/* Fim de gerar-sitemaps.mjs */
