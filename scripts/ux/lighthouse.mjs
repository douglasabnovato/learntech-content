/* lighthouse.mjs — mede performance, acessibilidade, boas práticas e SEO das páginas representativas (mobile).
   Uso: npm run ux:lighthouse   (precisa de Chrome ou Chromium instalado; o Playwright já baixa um)
   Saída: e2e/relatorios/lighthouse/<site>-<pagina>.html|json e um resumo em docs/engenharia/relatorios/lighthouse-AAAA-MM-DD.md */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "@playwright/test";
import { PAGINAS, url } from "../../e2e/sites.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SAIDA = path.join(RAIZ, "e2e", "relatorios", "lighthouse");
fs.mkdirSync(SAIDA, { recursive: true });

const chrome = await chromeLauncher.launch({ chromePath: process.env.CHROME_PATH ?? chromium.executablePath(), chromeFlags: ["--headless=new", "--no-sandbox"] });
const linhas = [];
for (const p of PAGINAS) {
  const r = await lighthouse(url(p), { port: chrome.port, output: ["html", "json"], logLevel: "error", formFactor: "mobile" });
  const [html, json] = r.report;
  const nome = `${p.site}-${p.nome}`;
  fs.writeFileSync(path.join(SAIDA, `${nome}.html`), html);
  fs.writeFileSync(path.join(SAIDA, `${nome}.json`), json);
  const c = r.lhr.categories;
  const nota = (k) => Math.round((c[k]?.score ?? 0) * 100);
  const a = r.lhr.audits;
  linhas.push(`| ${p.site} | ${p.nome} | ${nota("performance")} | ${nota("accessibility")} | ${nota("best-practices")} | ${nota("seo")} | ${a["largest-contentful-paint"]?.displayValue ?? "-"} | ${a["cumulative-layout-shift"]?.displayValue ?? "-"} | ${a["total-blocking-time"]?.displayValue ?? "-"} |`);
  console.log(`ok ${nome}`);
}
await chrome.kill();

const hoje = new Date().toISOString().slice(0, 10);
const resumo = path.join(RAIZ, "docs", "engenharia", "relatorios", `lighthouse-${hoje}.md`);
fs.mkdirSync(path.dirname(resumo), { recursive: true });
fs.writeFileSync(resumo, `# Lighthouse (mobile), ${hoje}\n\nMetas do MVP: performance ≥ 80, acessibilidade ≥ 90, boas práticas ≥ 90, SEO ≥ 90; LCP ≤ 2,5 s, CLS ≤ 0,1, TBT ≤ 200 ms.\n\n| Site | Página | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |\n|---|---|---|---|---|---|---|---|---|\n${linhas.join("\n")}\n\nRelatórios completos em e2e/relatorios/lighthouse/.\n`);
console.log(`Resumo: ${path.relative(RAIZ, resumo)}`);

/* Fim de lighthouse.mjs */
