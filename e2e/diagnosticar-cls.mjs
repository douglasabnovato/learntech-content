/* diagnosticar-cls.mjs — lista cada layout-shift de uma página com os elementos que se moveram (sources),
   nas mesmas condições do estabilidade.spec.mjs (Moto G4, 150 ms, cerca de 1,6 Mbit/s, visitante já identificado).
   Serve para achar a causa quando o teste de estabilidade falha. Achou o rodapé saltando em learn-tech#142,
   bootcamps#79 e tools#64 (12/11/2026).

   Uso (na raiz do learntech-content; CAMINHOS separados por vírgula, "home" vale "/"):
     CAMINHOS="home,/blog/um-artigo" node e2e/diagnosticar-cls.mjs https://learn-tech-pied.vercel.app
   No Git Bash, use MSYS_NO_PATHCONV=1 para o caminho "/" não virar pasta do Windows. */
/* global window, localStorage, sessionStorage */
import { chromium, devices } from "@playwright/test";
const base = process.argv[2];
if (!base) {
  console.error("Informe o endereço do site, por exemplo https://learn-tech-pied.vercel.app");
  process.exit(1);
}
const caminhos = (process.env.CAMINHOS || "home").split(",").map((c) => (c === "home" ? "/" : c));
const browser = await chromium.launch();
for (const c of caminhos) {
  const ctx = await browser.newContext({ ...devices["Moto G4"] });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    try {
      localStorage.setItem("learntech:identificacao", JSON.stringify({ nome: "Visitante de Teste", email: "e2e@example.com" }));
      for (const p of ["learn-tech","bootcamps","career","tools"]) sessionStorage.setItem(`learntech:sessao:${p}`, "1");
    } catch {
      /* sem armazenamento: o modal aparece e a medição mostra */
    }
    window.__shifts = [];
    const nome = (n) => (n && n.nodeType === 1 ? `${n.tagName.toLowerCase()}${n.id ? "#" + n.id : ""}.${String(n.className).split(" ").slice(0, 4).join(".")}` : String(n?.nodeName));
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__shifts.push({ t: Math.round(e.startTime), v: +e.value.toFixed(4), fontes: (e.sources || []).map((s) => `${nome(s.node)} y ${Math.round(s.previousRect.y)}→${Math.round(s.currentRect.y)} h ${Math.round(s.previousRect.height)}→${Math.round(s.currentRect.height)}`) });
    }).observe({ type: "layout-shift", buffered: true });
  });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 94_000 });
  await page.goto(base + c, { waitUntil: "load", timeout: 60_000 });
  await page.waitForTimeout(5000);
  const s = await page.evaluate(() => window.__shifts);
  console.log(`\n== ${c} total ${s.reduce((a, b) => a + b.v, 0).toFixed(3)}`);
  for (const x of s.filter((x) => x.v > 0.005)) console.log(x.t, x.v, x.fontes.join(" | "));
  await ctx.close();
}
await browser.close();

/* Fim de diagnosticar-cls.mjs */
