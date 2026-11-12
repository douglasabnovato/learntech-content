/* Diagnóstico de CLS: lista cada layout-shift com os elementos que se moveram (sources). */
import { chromium, devices } from "@playwright/test";
const base = process.argv[2];
const caminhos = (process.env.CAMINHOS || "home").split(",").map((c) => (c === "home" ? "/" : c));
const browser = await chromium.launch();
for (const c of caminhos) {
  const ctx = await browser.newContext({ ...devices["Moto G4"] });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    try {
      localStorage.setItem("learntech:identificacao", JSON.stringify({ nome: "Visitante de Teste", email: "e2e@example.com" }));
      for (const p of ["learn-tech","bootcamps","career","tools"]) sessionStorage.setItem(`learntech:sessao:${p}`, "1");
    } catch {}
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
