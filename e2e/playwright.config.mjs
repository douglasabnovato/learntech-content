/* playwright.config.mjs — testes de ponta a ponta dos quatro sites (fluxos principais, acessibilidade e capturas).
   Uso: npm run e2e  |  só um grupo: npx playwright test -c e2e/playwright.config.mjs --project=fluxos
   Relatórios: e2e/relatorios/ (HTML do Playwright, JSON e capturas de tela). */
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  timeout: 45_000,
  retries: 1,
  outputDir: "relatorios/artefatos",
  reporter: [["list"], ["html", { outputFolder: "relatorios/html", open: "never" }], ["json", { outputFile: "relatorios/resultado.json" }]],
  use: { ...devices["Desktop Chrome"], locale: "pt-BR", trace: "retain-on-failure" },
  projects: [
    { name: "fluxos", testMatch: /fluxos\.spec\.mjs/ },
    { name: "acessibilidade", testMatch: /acessibilidade\.spec\.mjs/ },
    { name: "capturas", testMatch: /capturas\.spec\.mjs/ },
    { name: "estabilidade", testMatch: /estabilidade\.spec\.mjs/ },
  ],
});
