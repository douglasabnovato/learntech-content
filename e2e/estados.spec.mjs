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

/* Falha de carga de um pedaço no learn-tech (learn-tech#157-4, cenário B da revisão R19 do #156): o arquivo da Home
   não chega (rede instável, ou uma aba aberta antes de um deploy). Em vez de tela branca, aparece "Algo não carregou"
   com "Recarregar"; o menu continua funcionando, e navegar para outra página tira o erro.
   O LimiteDeErro só existe a partir do learn-tech#156: enquanto ele não estiver no endereço testado (a produção vem da
   main, que o autor atualiza), o teste é pulado com o motivo. Depois do deploy, ele passa a valer na próxima rodada
   do e2e.yml (segundas, 09h23 UTC) ou num disparo manual (workflow_dispatch): o e2e não roda no deploy nem no PR.
   Depois que a produção tiver o LimiteDeErro, o pulo vira um expect (revisão R19 do Esp QA, ressalva 2). */
test.describe("learn-tech — falha de carga de uma página", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("a página que não carrega mostra 'Recarregar', e o menu recupera a navegação", async ({ page, request }) => {
    const html = await (await request.get(base("learn-tech") + "/")).text();
    const entrada = html.match(/src="(\/assets\/index-[^"]+\.js)"/)?.[1];
    const js = entrada ? await (await request.get(base("learn-tech") + entrada)).text() : "";
    test.skip(!js.includes("Algo não carregou"), "o LimiteDeErro (learn-tech#156) ainda não está neste endereço");

    await page.route(/\/assets\/Home-[^/]+\.js$/, (rota) => rota.abort());
    await page.goto(base("learn-tech") + "/");
    await expect(page.getByRole("heading", { name: "Algo não carregou" })).toBeVisible();
    await expect(page.getByRole("alert")).toBeVisible();
    const recarregar = page.getByRole("button", { name: "Recarregar" });
    await expect(recarregar).toBeVisible();
    expect((await recarregar.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(40);

    await page.getByRole("link", { name: "Programas", exact: true }).first().click();
    await expect(page).toHaveURL(/\/programs$/);
    await expect(page.getByRole("heading", { name: "Algo não carregou" })).toHaveCount(0);
    await expect(page.getByText(/49 treinamentos/i).first()).toBeVisible();
  });
});

/* O pedaço do "Voltar ao topo" (ScrollToTop, sob demanda desde o learn-tech#170) não baixa: só o botão some, e a
   página continua (sem LimiteDeErro em volta dele, o erro desmontava o app inteiro: R19 do #170, nota 3).
   O teste conta os bloqueios e FALHA se nenhum pedaço for bloqueado (R19 do Esp QA do #67): sem isso, passaria calado
   num endereço sem o pedaço. Por isso ele só vale contra o learn-tech com o #170 (a developer-mvp-2026, ou a produção
   depois do deploy de quinta); o e2e.yml roda segunda às 09h23 UTC, depois que a developer daqui chegar à main. */
test("learn-tech — sem o pedaço do 'Voltar ao topo', a página continua", async ({ page }) => {
  const erros = [];
  page.on("pageerror", (e) => erros.push(e.message));
  let bloqueados = 0;
  await page.route(/\/assets\/ScrollToTop-[^/]+\.js$/, (rota) => {
    bloqueados += 1;
    return rota.abort();
  });
  await page.goto(base("learn-tech") + "/");
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.locator("#navbar")).toBeVisible();
  await page.mouse.wheel(0, 1500);
  await expect(page.locator("h1").first()).toBeAttached();
  expect(erros, erros.join(" | ")).toEqual([]);
  expect(bloqueados, "nenhum pedaço ScrollToTop-*.js foi bloqueado: o endereço testado não tem o learn-tech#170").toBeGreaterThan(0);
});

/* Guarda do cabeçalho do tools com fonte grande (tools#71, reduzida pela medida de 24/11/2026, refeita com a escala de
   verdade): a 320 e 360 px, com o texto a 125% aplicado antes da 1ª pintura por adoptedStyleSheets (o documentElement
   ainda é null no init script; um style nele não pegava, R19 do Esp QA do #69), confere que a fonte raiz é 20 px, que
   o CLS fica em 0,1 ou menos (medido: 0,007 a 320 px e 0,064 a 360 px) e que a marca, as abas e o tema do cabeçalho
   têm 44 px. */
for (const largura of [320, 360]) {
  test(`tools — cabeçalho estável a ${largura} px com o texto a 125%`, async ({ page }) => {
    await page.setViewportSize({ width: largura, height: 800 });
    await page.addInitScript(() => {
      globalThis.__cls = 0;
      new globalThis.PerformanceObserver((lista) => {
        for (const e of lista.getEntries()) if (!e.hadRecentInput) globalThis.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
      const folha = new globalThis.CSSStyleSheet();
      folha.replaceSync("html { font-size: 125%; }");
      globalThis.document.adoptedStyleSheets = [...globalThis.document.adoptedStyleSheets, folha];
    });
    await page.goto(base("tools") + "/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const doc = globalThis.document;
      const cabecalho = doc.querySelector("header, .site-header");
      const alvos = cabecalho ? [".brand", ".tab", "#alternar-tema"].flatMap((s) => [...cabecalho.querySelectorAll(s)]) : [];
      const pequenos = alvos
        .map((e) => ({ nome: e.getAttribute("aria-label") || e.textContent.trim(), c: e.getBoundingClientRect() }))
        .filter((a) => a.c.width < 44 || a.c.height < 44)
        .map((a) => `${a.nome} ${a.c.width.toFixed(1)}x${a.c.height.toFixed(1)}`);
      return {
        fonte: globalThis.getComputedStyle(doc.documentElement).fontSize,
        cls: globalThis.__cls,
        alvos: alvos.length,
        pequenos,
      };
    });
    expect(r.fonte, "a escala de 125% não foi aplicada").toBe("20px");
    expect(r.alvos, "a marca, as abas e o tema do cabeçalho não foram achados").toBeGreaterThanOrEqual(4);
    expect(r.cls, `CLS do tools a ${largura} px com 125%: ${r.cls.toFixed(3)}`).toBeLessThanOrEqual(0.1);
    expect(r.pequenos, r.pequenos.join(" | ")).toEqual([]);
  });
}

/* Fim de estados.spec.mjs */
