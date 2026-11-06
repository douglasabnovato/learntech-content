/* visitante.mjs — `test` do Playwright com um visitante já identificado.
   Os quatro sites mostram o modal obrigatório de /sdk/identificacao.js na primeira visita, e ele cobre a página
   (intercepta os cliques). O e2e testa a navegação de quem já se identificou: grava uma identificação fictícia
   (@example.com) e marca a sessão como registrada, para não criar acessos de teste no D1 de produção. */
import { test as base } from "@playwright/test";

const PROJETOS = ["learn-tech", "bootcamps", "career", "tools"];

export const test = base.extend({
  page: async ({ page }, usar) => {
    await page.addInitScript((projetos) => {
      try {
        localStorage.setItem("learntech:identificacao", JSON.stringify({ nome: "Visitante de Teste", email: "e2e@example.com" }));
        for (const p of projetos) sessionStorage.setItem(`learntech:sessao:${p}`, "1");
      } catch {
        /* sem armazenamento: o modal aparece e o teste mostra */
      }
    }, PROJETOS);
    await usar(page);
  },
});

export { expect } from "@playwright/test";

/* Fim de visitante.mjs */
