/* capturas.spec.mjs — capturas de tela por breakpoint para revisar a responsividade.
   Grava e2e/relatorios/capturas/<site>-<pagina>-<largura>.png e acusa rolagem horizontal (conteúdo mais largo que a tela). */
import path from "node:path";
import { test, expect } from "@playwright/test";
import { PAGINAS, url } from "./sites.mjs";

const LARGURAS = [360, 768, 1024, 1440];

for (const p of PAGINAS) {
  for (const largura of LARGURAS) {
    test(`${p.site} — ${p.nome} — ${largura}px`, async ({ page }) => {
      await page.setViewportSize({ width: largura, height: 900 });
      await page.goto(url(p));
      await page.waitForLoadState("networkidle");
      await page.screenshot({ path: path.join(import.meta.dirname, "relatorios", "capturas", `${p.site}-${p.nome}-${largura}.png`), fullPage: true });
      const excesso = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(excesso, "rolagem horizontal na página").toBeLessThanOrEqual(1);
    });
  }
}
