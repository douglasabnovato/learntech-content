/* lcp.mjs — mede o LCP no celular (Lighthouse, cache frio) N vezes por endereço e dá a mediana, o elemento do LCP
   e as fases (TTFB, atraso de carga, carga e atraso de renderização). Serve para medir antes e depois de uma correção.
   Uso: npm run ux:lcp -- <url> [<url> ...] [--vezes=3]
   Ex.: npm run ux:lcp -- http://localhost:4173/ https://learn-tech-pied.vercel.app/
   Precisa de Chrome; nesta máquina use CHROME_PATH com o Chrome instalado. */
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const vezes = Number(args.find((a) => a.startsWith("--vezes="))?.split("=")[1] ?? 3);
const urls = args.filter((a) => !a.startsWith("--"));
if (!urls.length) {
  console.error("Uso: npm run ux:lcp -- <url> [<url> ...] [--vezes=3]");
  process.exit(1);
}

const mediana = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const s = (ms) => (ms / 1000).toFixed(1).replace(".", ",") + " s";

const chrome = await chromeLauncher.launch({
  chromePath: process.env.CHROME_PATH ?? chromium.executablePath(),
  chromeFlags: ["--headless=new", "--no-sandbox"],
});
for (const url of urls) {
  const rodadas = [];
  for (let i = 0; i < vezes; i++) {
    const r = await lighthouse(url, { port: chrome.port, logLevel: "error", formFactor: "mobile", onlyCategories: ["performance"] });
    const a = r.lhr.audits;
    const fases = Object.fromEntries((a["lcp-breakdown-insight"]?.details?.items?.[0]?.items ?? []).map((x) => [x.subpart, x.duration]));
    const elemento =
      a["lcp-breakdown-insight"]?.details?.items?.find((x) => x.type === "node") ??
      a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node;
    rodadas.push({
      lcp: a["largest-contentful-paint"].numericValue,
      nota: Math.round(r.lhr.categories.performance.score * 100),
      fases,
      elemento: elemento?.snippet ?? elemento?.nodeLabel ?? "?",
    });
  }
  const lcps = rodadas.map((x) => x.lcp);
  console.log(`\n${url}`);
  console.log(`  LCP: ${lcps.map(s).join(" / ")} → mediana ${s(mediana(lcps))}; performance ${rodadas.map((x) => x.nota).join(" / ")}`);
  const m = rodadas.find((x) => x.lcp === mediana(lcps));
  console.log(`  elemento: ${String(m.elemento).slice(0, 160)}`);
  console.log(
    `  fases: ${
      Object.entries(m.fases)
        .map(([k, v]) => `${k} ${Math.round(v)} ms`)
        .join(", ") || "?"
    }`,
  );
}
await chrome.kill();

/* Fim de lcp.mjs */
