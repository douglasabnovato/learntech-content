/* acessibilidade.spec.mjs — verificação automática WCAG 2.2 A/AA (axe-core) nas páginas representativas.
   Grava e2e/relatorios/acessibilidade.json. Falha só com violação "critical"; as demais entram no relatório para correção. */
import fs from "node:fs";
import path from "node:path";
import { test, expect } from "./visitante.mjs";
import AxeBuilder from "@axe-core/playwright";
import { PAGINAS, url } from "./sites.mjs";

const resultados = [];
test.afterAll(() => {
  const destino = path.join(import.meta.dirname, "relatorios", "acessibilidade.json");
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, JSON.stringify(resultados, null, 2));
});

for (const p of PAGINAS) {
  test(`${p.site} — ${p.nome}`, async ({ page }) => {
    await page.goto(url(p));
    await page.waitForLoadState("networkidle");
    /* Os iframes (player do YouTube) são de terceiros: o site não controla o HTML de dentro deles. */
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).exclude("iframe").analyze();
    const violacoes = r.violations.map((v) => ({ id: v.id, impacto: v.impact, descricao: v.help, ocorrencias: v.nodes.length, ajuda: v.helpUrl }));
    resultados.push({ site: p.site, pagina: p.nome, url: url(p), violacoes });
    expect(violacoes.filter((v) => v.impacto === "critical"), JSON.stringify(violacoes, null, 2)).toEqual([]);
  });
}
