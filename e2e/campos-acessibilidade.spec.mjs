/* campos-acessibilidade.spec.mjs — a borda dos campos e o foco da busca nos quatro sites, a 360 px, nos 2 temas.
   Entra no projeto "acessibilidade" (o testMatch pega o fim do nome).
   - Borda (WCAG 1.4.11): o limite visual de cada campo (a borda, ou o fundo do campo) tem 3:1 contra o fundo de trás.
     O estudo de 24/11/2026 achou 7 de 8 campos abaixo (1,23 a 1,91:1); as correções são o learn-tech#178, o
     learntech-content#71 (o modal, já medido no acessibilidade.spec.mjs), o career#49, o tools#72 e o bootcamps#88.
   - Foco (WCAG 2.4.7): a busca, focada pelo teclado, mostra um indicador de 2 px ou mais (contorno ou anel de
     box-shadow), com 3:1 contra o fundo de trás, e que NÃO existe sem o foco (um anel fixo não é indicador de foco).
     Só a troca da cor da borda não basta: era 1,17:1 no career e 1,06:1 no tools (R19 do Esp UX/UI, nota 3).
   - O fundo de trás é a pilha dos fundos dos ancestrais sobre a cor da tela: branca, ou #121212 quando a página
     declara color-scheme escuro. Um ancestral com background-image não é medido: o teste falha e pede a medida à mão.
   Guarda de N: cada página tem um mínimo de campos, e a busca e o filtro são achados pelo seletor deles; com a
   marcação mudada e 0 campos, as listas viriam vazias e passariam.
   Contra a produção, o vermelho é esperado até o deploy de cada site (o do autor): o test.fail por site, só contra a
   produção, deixa o run verde com a anotação. Quando o deploy sair, o Playwright marca "passou, mas devia falhar" e
   o run fica vermelho: aí é só tirar o site de PENDENTE (R19 do Esp QA do #74, severidade 3). */
import { test, expect } from "./visitante.mjs";
import { SITES } from "./sites.mjs";

const PAGINAS = [
  {
    site: "learn-tech",
    caminho: "/programs",
    campos: 2,
    busca: 'input[type="search"], input[placeholder*="Buscar"]',
    filtro: "select",
  },
  { site: "bootcamps", caminho: "/", campos: 1, busca: 'input[type="search"], input[placeholder*="Buscar"]' },
  { site: "career", caminho: "/", campos: 2, busca: "#search-input", filtro: ".category-filter select" },
  { site: "tools", caminho: "/", campos: 1, busca: "#busca" },
];

/* Vermelho esperado na produção até o deploy. Tire a linha quando o deploy do site sair. */
const PENDENTE = {
  "learn-tech": "learn-tech#178",
  bootcamps: "bootcamps#88",
  career: "career#49",
  tools: "tools#72",
};
/* O sites.mjs testa a produção quando a variável do site não está definida. */
const VARIAVEL = { "learn-tech": "E2E_LEARN_TECH", bootcamps: "E2E_BOOTCAMPS", career: "E2E_CAREER", tools: "E2E_TOOLS" };
const contraProducao = (site) => !process.env[VARIAVEL[site]];

/* Roda na página: as cores pintadas num canvas de 1 px (aceita oklch e alfa) e o contraste WCAG. */
const medir = (busca) => {
  const doc = globalThis.document;
  const cv = doc.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const pintar = (camadas) => {
    cv.clearRect(0, 0, 1, 1);
    for (const c of camadas) {
      cv.fillStyle = c;
      cv.fillRect(0, 0, 1, 1);
    }
    return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3);
  };
  const lum = (a) =>
    a
      .map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      })
      .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ct = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
  const nome = (e) => (e.getAttribute("aria-label") || e.placeholder || e.name || e.id || e.tagName).trim().slice(0, 30);
  /* A cor da tela: o Chromium pinta #121212 quando a página declara color-scheme escuro e o tema pede escuro. */
  const esquema = globalThis.getComputedStyle(doc.documentElement).colorScheme;
  const escuro = /dark/.test(esquema) && (!/light/.test(esquema) || globalThis.matchMedia("(prefers-color-scheme: dark)").matches);
  const tela = escuro ? "#121212" : "#ffffff";
  /* O fundo de trás: a cor da tela e os fundos dos ancestrais, de fora para dentro. */
  const pilha = (e) => {
    const camadas = [];
    let imagem = null;
    for (let q = e.parentElement; q; q = q.parentElement) {
      const st = globalThis.getComputedStyle(q);
      if (st.backgroundImage !== "none" && !imagem) imagem = q.tagName.toLowerCase() + (q.id ? "#" + q.id : "");
      if (st.backgroundColor !== "rgba(0, 0, 0, 0)") camadas.unshift(st.backgroundColor);
    }
    return { camadas: [tela, ...camadas], imagem };
  };

  const campos = [...doc.querySelectorAll("input:not([type=hidden]):not([type=checkbox]):not([type=radio]), select, textarea")].filter(
    (e) => {
      const c = e.getBoundingClientRect();
      return c.width > 1 && c.height > 1 && globalThis.getComputedStyle(e).visibility !== "hidden";
    },
  );
  const fracos = campos.flatMap((e) => {
    const st = globalThis.getComputedStyle(e);
    const { camadas: atras, imagem } = pilha(e);
    if (imagem) return [`fundo com imagem em ${imagem}, atrás de "${nome(e)}": medir à mão`];
    const fora = pintar(atras);
    const borda = parseFloat(st.borderBottomWidth) > 0 ? ct(pintar([...atras, st.borderBottomColor]), fora) : 0;
    const fundo = ct(pintar([...atras, st.backgroundColor]), fora);
    const c = Math.max(borda, fundo);
    return c < 3 ? [`borda de "${nome(e)}" ${c.toFixed(2)}:1`] : [];
  });

  /* O foco: o contorno, ou os anéis do box-shadow (o ring do Tailwind). */
  const e = doc.querySelector(busca);
  const st = e ? globalThis.getComputedStyle(e) : null;
  const indicadores = [];
  if (st && st.outlineStyle !== "none" && parseFloat(st.outlineWidth) > 0)
    indicadores.push({ tipo: "contorno", largura: parseFloat(st.outlineWidth), cor: st.outlineColor });
  if (st && st.boxShadow !== "none") {
    const re =
      /((?:rgba?|oklch|oklab|lab|lch|color|hsla?)\([^)]*\)|#[0-9a-f]+)\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px/gi;
    /* O ring do Tailwind empilha o anel de recuo (spread = recuo) sob o anel (spread = recuo + largura): a largura
       visível de cada anel é o spread dele menos o do anel de baixo. */
    const aneis = [...st.boxShadow.matchAll(re)].map((m) => ({ cor: m[1], spread: +m[5] })).filter((a) => a.spread > 0);
    aneis.sort((a, b) => a.spread - b.spread);
    aneis.forEach((a, i) => indicadores.push({ tipo: "anel", largura: a.spread - (i ? aneis[i - 1].spread : 0), cor: a.cor }));
  }
  const { camadas: atras } = e ? pilha(e) : { camadas: [tela] };
  const fora = pintar(atras);
  const foco = indicadores.map((i) => ({ ...i, c: +ct(pintar([...atras, i.cor]), fora).toFixed(2) }));
  return {
    medidos: campos.length,
    fracos,
    busca: { achada: !!e, focada: doc.activeElement === e, focoVisivel: !!e?.matches(":focus-visible"), foco },
  };
};

const igual = (a, b) => a.tipo === b.tipo && a.largura === b.largura && a.cor === b.cor;

/* A guarda de N fora do test.fail (R19 do Esp QA do #78, severidade 2): o test.fail aceita qualquer falha, então
   uma busca que sumisse da produção contaria como "a falha esperada" e o run seguiria verde. Este teste não tem
   test.fail e roda também contra a produção: a busca e o filtro existem, e a busca recebe o foco do teclado. */
for (const p of PAGINAS) {
  test(`${p.site} — a busca${p.filtro ? " e o filtro existem, e a busca" : " existe e"} recebe o foco do teclado a 360 px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(SITES[p.site].replace(/\/$/, "") + p.caminho);
    const busca = page.locator(p.busca).first();
    await expect(busca, `a busca (${p.busca}) não está na página`).toBeVisible();
    if (p.filtro) await expect(page.locator(p.filtro).first(), `o filtro (${p.filtro}) não está na página`).toBeVisible();
    await busca.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(busca, "a busca não recebe o foco do teclado").toBeFocused();
  });
}

for (const esquema of ["light", "dark"]) {
  for (const p of PAGINAS) {
    test(`${p.site} — borda dos campos e foco da busca a 360 px (${esquema})`, async ({ page }) => {
      test.fail(contraProducao(p.site) && !!PENDENTE[p.site], `deploy pendente: ${PENDENTE[p.site]}`);
      await page.emulateMedia({ colorScheme: esquema });
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(SITES[p.site].replace(/\/$/, "") + p.caminho);
      const busca = page.locator(p.busca).first();
      await expect(busca, `a busca (${p.busca}) não está na página`).toBeVisible();
      if (p.filtro) await expect(page.locator(p.filtro).first(), `o filtro (${p.filtro}) não está na página`).toBeVisible();
      /* Sem transições, o estado do foco é o final já na 1ª medida (sem espera fixa). */
      await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
      /* A medida sem o foco: um indicador que já existe aqui não conta como foco. */
      await page.evaluate(() => globalThis.document.activeElement?.blur?.());
      const semFoco = await page.evaluate(medir, p.busca);
      /* O foco pelo teclado: o Tab chega na busca vindo do elemento anterior, e o :focus-visible vale. */
      await busca.focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      const r = await page.evaluate(medir, p.busca);
      expect(r.medidos, `só ${r.medidos} campos medidos em ${p.site}: a página carregou?`).toBeGreaterThanOrEqual(p.campos);
      expect.soft(r.fracos, r.fracos.join(" | ")).toEqual([]);
      expect(r.busca.achada, `a busca (${p.busca}) não foi achada`).toBe(true);
      expect(r.busca.focada && r.busca.focoVisivel, "a busca não ficou com o foco do teclado").toBe(true);
      const bons = r.busca.foco.filter((i) => i.largura >= 2 && i.c >= 3 && !semFoco.busca.foco.some((s) => igual(s, i)));
      const visto = r.busca.foco.map((i) => `${i.tipo} ${i.largura}px ${i.c}:1`).join(" | ") || "nenhum contorno nem anel";
      const antes = semFoco.busca.foco.map((i) => `${i.tipo} ${i.largura}px`).join(" | ") || "nenhum";
      expect(bons.length, `o foco da busca em ${p.site}: ${visto} (sem o foco: ${antes})`).toBeGreaterThan(0);
    });
  }
}

/* O texto da busca de /programs no learn-tech (learn-tech#179, WCAG 1.4.3): com o foco, o fundo do campo fica
   sky-500/5, e o texto digitado e o texto de exemplo precisam de 4,5:1 contra ele; o rótulo "Buscar" fica na tela.
   Medido em 24/11/2026: digitado 4,30:1 e exemplo 1,89:1 com foco. A cor do texto é composta sobre a pilha real
   (a tela, os fundos dos ancestrais e o fundo do próprio campo), porque o exemplo do Tailwind 4 tem 50% de alfa.
   Guarda de N: a busca existe, está focada e tem o texto digitado; sem ela, o teste falha em vez de passar calado.
   Contra a produção, este teste tem o test.fail; a busca que some fica vermelha no teste de guarda acima, sem test.fail.
   O rótulo precisa de tamanho de texto (um sr-only de 1x1 passava no toBeVisible) e de 4,5:1 (R19 do Esp QA do #78). */
const PENDENTE_TEXTO = "learn-tech#179";
test("learn-tech — texto digitado e de exemplo da busca com 4,5:1 com foco, e o rótulo visível", async ({ page }) => {
  test.fail(contraProducao("learn-tech"), `deploy pendente: ${PENDENTE_TEXTO}`);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(SITES["learn-tech"].replace(/\/$/, "") + "/programs");
  const busca = page.locator('input[aria-label^="Buscar"]').first();
  await expect(busca, "a busca de /programs não está na página").toBeVisible();
  const rotulo = page.locator("label").filter({ has: busca }).getByText("Buscar", { exact: true });
  await expect(rotulo, 'o rótulo "Buscar" não está na página').toBeVisible();
  const caixa = await rotulo.boundingBox();
  expect(caixa && caixa.width >= 10 && caixa.height >= 10, `o rótulo "Buscar" não está na tela: ${JSON.stringify(caixa)}`).toBe(true);
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
  const texto = (e) => {
    const cv = globalThis.document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    const pintar = (cs) => {
      cv.clearRect(0, 0, 1, 1);
      for (const c of cs) {
        cv.fillStyle = c;
        cv.fillRect(0, 0, 1, 1);
      }
      return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3);
    };
    const lum = (a) =>
      a
        .map((v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        })
        .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
    const ct = (a, b) => {
      const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
      return +((x + 0.05) / (y + 0.05)).toFixed(2);
    };
    const camadas = [];
    for (let q = e; q; q = q.parentElement) {
      const c = globalThis.getComputedStyle(q).backgroundColor;
      if (c !== "rgba(0, 0, 0, 0)") camadas.unshift(c);
    }
    camadas.unshift("#ffffff");
    const fundo = pintar(camadas);
    /* O rótulo é texto comum; o campo vazio mede o texto de exemplo. */
    const vazio = e.tagName === "INPUT" && e.value === "";
    const cor = globalThis.getComputedStyle(e, vazio ? "::placeholder" : undefined).color;
    return { focada: globalThis.document.activeElement === e, valor: e.value, c: ct(pintar([...camadas, cor]), fundo) };
  };
  const doRotulo = await rotulo.evaluate(texto);
  expect(doRotulo.c, `o rótulo "Buscar": ${doRotulo.c}:1`).toBeGreaterThanOrEqual(4.5);
  await busca.focus();
  const exemplo = await busca.evaluate(texto);
  await busca.fill("react");
  const digitado = await busca.evaluate(texto);
  expect(exemplo.focada && digitado.focada, "a busca não ficou com o foco").toBe(true);
  expect(digitado.valor, "o texto não foi digitado na busca").toBe("react");
  expect(exemplo.c, `o texto de exemplo com foco: ${exemplo.c}:1`).toBeGreaterThanOrEqual(4.5);
  expect(digitado.c, `o texto digitado com foco: ${digitado.c}:1`).toBeGreaterThanOrEqual(4.5);
});

/* Fim de campos-acessibilidade.spec.mjs */
