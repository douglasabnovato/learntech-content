/* fluxos.spec.mjs — fluxos principais: abrir a home, abrir um card, ver o detalhe e usar a busca ou os filtros. */
import { test, expect } from "@playwright/test";
import { SITES } from "./sites.mjs";

const base = (s) => SITES[s].replace(/\/$/, "");

test.describe("learn-tech", () => {
  test("home lista programas e abre um programa", async ({ page }) => {
    await page.goto(base("learn-tech") + "/programs");
    const link = page.locator('a[href^="/program/"]').first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/program\/[^/]+\/\d+/);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("programa 1104 publicado pela API", async ({ page }) => {
    await page.goto(base("learn-tech") + "/program/marketing-crm/1104");
    await expect(page.getByText(/Operação Diária de CRM/i).first()).toBeVisible();
  });

  test("artigo novo abre pelo blog", async ({ page }) => {
    await page.goto(base("learn-tech") + "/blog/bastidores-de-um-hackathon-de-comunidade");
    await expect(page.getByText(/Bastidores de um hackathon/i).first()).toBeVisible();
  });

  test("página de áreas mostra Marketing Tech e CRM", async ({ page }) => {
    await page.goto(base("learn-tech") + "/category");
    await expect(page.getByText("Marketing Tech e CRM").first()).toBeVisible();
  });
});

test.describe("bootcamps", () => {
  test("home lista eventos e abre o detalhe", async ({ page }) => {
    await page.goto(base("bootcamps") + "/");
    const card = page.locator('a[href*="/event/"]').first();
    await expect(card).toBeVisible();
    await card.click();
    await expect(page).toHaveURL(/\/event\//);
  });

  test("evento mostra Veja também no ecossistema", async ({ page }) => {
    await page.goto(base("bootcamps") + "/event/hackathon-inovacao-social-jf");
    await expect(page.getByRole("heading", { name: /Veja também no ecossistema/i })).toBeVisible();
  });
});

test.describe("career", () => {
  test("busca filtra o catálogo", async ({ page }) => {
    await page.goto(base("career") + "/");
    const contador = page.locator("#items-counter");
    await expect(contador).toBeVisible();
    const antes = await contador.textContent();
    await page.locator("#search-input").fill("zzzz-sem-resultado");
    await expect(contador).not.toHaveText(antes ?? "");
  });

  test("página de detalhe da empresa", async ({ page }) => {
    await page.goto(base("career") + "/detalhe.html#tipo=empresas&id=abc-da-construcao");
    await expect(page.getByText("ABC da Construção").first()).toBeVisible();
  });
});

test.describe("tools", () => {
  test("busca encontra uma ferramenta", async ({ page }) => {
    await page.goto(base("tools") + "/");
    await expect(page.locator("#catalogo")).toBeVisible();
    await page.locator("#busca").fill("figma");
    await expect(page.locator("#catalogo").getByText(/Figma/i).first()).toBeVisible();
  });

  test("página de detalhe da ferramenta", async ({ page }) => {
    await page.goto(base("tools") + "/detalhe.html#id=figma");
    await expect(page.getByText(/Figma/).first()).toBeVisible();
  });
});
