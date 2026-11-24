/* acessibilidade.spec.mjs — verificação automática WCAG 2.2 A/AA (axe-core) nas páginas representativas.
   Grava e2e/relatorios/acessibilidade.json. Falha só com violação "critical"; as demais entram no relatório para correção. */
import fs from "node:fs";
import path from "node:path";
import { test, expect } from "./visitante.mjs";
import AxeBuilder from "@axe-core/playwright";
import { PAGINAS, SITES, url } from "./sites.mjs";

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

/* Alvos de toque de 44 px, a regra da casa (learn-tech#162, #163 e #164). Medidos a 360 px: os botões do menu
   no cabeçalho e as abas do Enroll do programa 1 (que tem cópia local, então roda também sem API). O axe confere só o mínimo do AA (24 px); este teste fixa os 44 px.
   Contra a produção, passa depois que a main do learn-tech receber o #163 e o deploy chegar. */
test.describe("learn-tech — alvos de 44 px a 360 px", () => {
  test.use({ viewport: { width: 360, height: 800 } });
  const base = SITES["learn-tech"].replace(/\/$/, "");
  /* Valor cru, sem arredondar: os alvos medem exatamente 44 px, e um arredondamento aprovaria 43,5 (R19 do Esp QA).
     Espera o alvo aparecer antes de medir, para um boundingBox nulo não virar "Received: 0". */
  const medir = async (alvo) => {
    await expect(alvo).toBeVisible();
    const caixa = await alvo.boundingBox();
    return { largura: caixa?.width ?? 0, altura: caixa?.height ?? 0 };
  };

  test("Abrir menu e Fechar menu", async ({ page }) => {
    await page.goto(base + "/");
    const abrir = page.getByRole("button", { name: "Abrir menu" });
    const a = await medir(abrir);
    expect(a.largura, "largura de Abrir menu").toBeGreaterThanOrEqual(44);
    expect(a.altura, "altura de Abrir menu").toBeGreaterThanOrEqual(44);
    await abrir.click();
    const f = await medir(page.getByRole("button", { name: "Fechar menu" }));
    expect(f.largura, "largura de Fechar menu").toBeGreaterThanOrEqual(44);
    expect(f.altura, "altura de Fechar menu").toBeGreaterThanOrEqual(44);
  });

  test("abas do Enroll", async ({ page }) => {
    await page.goto(base + "/program/web/1/enroll");
    const abas = page.getByRole("tab");
    await expect(abas.first()).toBeVisible({ timeout: 15_000 });
    const n = await abas.count();
    for (let i = 0; i < n; i++) {
      const { altura } = await medir(abas.nth(i));
      expect(altura, `altura da aba ${i + 1} de ${n}`).toBeGreaterThanOrEqual(44);
    }
  });
});
