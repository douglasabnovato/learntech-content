/* estados.spec.mjs — estados de carregamento, vazio e falha da API nos quatro sites (critério 6 do MVP: falhas tratadas).
   A API é interceptada pelo Playwright: "lenta" atrasa as respostas em 6 s e "fora" derruba as conexões.
   As listas têm a cópia de reserva gerada por `npm run copias`, então devem mostrar o conteúdo sem esperar a API.
   Os detalhes do career e do tools buscam na API: mostram "carregando" e, sem API, uma mensagem honesta com "Tentar novamente". */
import { test, expect } from "./visitante.mjs";
import { SITES } from "./sites.mjs";

const API = /learntech-content\.douglasabnovato\.workers\.dev\/(v1|media)\//;
const base = (s) => SITES[s].replace(/\/$/, "");

async function api(page, modo) {
  await page.route(API, async (rota) => {
    if (modo === "fora") return rota.abort();
    await new Promise((ok) => setTimeout(ok, 6_000));
    return rota.continue().catch(() => {});
  });
}

/* Listas: com a API lenta ou fora, o conteúdo vem da cópia de reserva. */
const LISTAS = [
  { site: "learn-tech", caminho: "/programs", texto: /49 treinamentos/i },
  { site: "bootcamps", caminho: "/", texto: /Concluídos/i },
  { site: "career", caminho: "/", texto: /Empresas Legais/i },
  { site: "tools", caminho: "/", texto: /Ferramentas que valeram o tempo/i },
];

for (const modo of ["lenta", "fora"]) {
  for (const l of LISTAS) {
    test(`${l.site} — lista com a API ${modo} mostra a cópia de reserva`, async ({ page }) => {
      await api(page, modo);
      await page.goto(base(l.site) + l.caminho);
      await expect(page.getByText(l.texto).first()).toBeVisible({ timeout: 4_000 });
    });
  }
}

/* Detalhes que dependem da API. */
const DETALHES = [
  {
    site: "career",
    caminho: "/detalhe.html#tipo=empresas&id=abc-da-construcao",
    carregando: /Carregando/i,
    falha: /Não foi possível carregar/i,
  },
  { site: "tools", caminho: "/detalhe.html#id=figma", carregando: /Carregando detalhes/i, falha: /Detalhes indisponíveis/i },
];

for (const d of DETALHES) {
  test(`${d.site} — detalhe com a API lenta mostra o carregamento`, async ({ page }) => {
    await api(page, "lenta");
    await page.goto(base(d.site) + d.caminho);
    await expect(page.getByText(d.carregando).first()).toBeVisible({ timeout: 4_000 });
  });

  test(`${d.site} — detalhe com a API fora mostra a falha e o Tentar novamente`, async ({ page }) => {
    await api(page, "fora");
    await page.goto(base(d.site) + d.caminho);
    await expect(page.getByText(d.falha).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Tentar novamente/i })).toBeVisible();
  });
}

/* Detalhes que vêm da cópia: com a API fora, a página abre igual. */
const DETALHES_COPIA = [
  { site: "learn-tech", caminho: "/program/marketing-crm/1104", texto: /Operação Diária de CRM/i },
  { site: "bootcamps", caminho: "/event/hackathon-inovacao-social-jf", texto: /Hackathon de Inovação Social/i },
];

for (const d of DETALHES_COPIA) {
  test(`${d.site} — detalhe com a API fora abre pela cópia de reserva`, async ({ page }) => {
    await api(page, "fora");
    await page.goto(base(d.site) + d.caminho);
    await expect(page.getByText(d.texto).first()).toBeVisible();
  });
}

/* Vazio: uma busca sem resultado mostra a mensagem e o caminho de volta. */
const BUSCAS = [
  { site: "bootcamps", caminho: "/", campo: 'input[type="search"], input[placeholder*="Buscar"]', pronto: /Concluídos/i },
  { site: "career", caminho: "/", campo: "#search-input", pronto: /Empresas Legais/i },
  { site: "tools", caminho: "/", campo: "#busca", pronto: /Exibindo \d+ de/i },
];

for (const b of BUSCAS) {
  test(`${b.site} — busca sem resultado mostra o estado vazio`, async ({ page }) => {
    await page.goto(base(b.site) + b.caminho);
    await expect(page.getByText(b.pronto).first()).toBeVisible();
    await page.locator(b.campo).first().fill("zzzz-sem-resultado");
    await expect(page.getByText(/nenhum|nada encontrado|sem resultado/i).first()).toBeVisible();
  });
}

/* Fim de estados.spec.mjs */
