/* campos-acessibilidade.spec.mjs — a borda dos campos e o foco da busca nos quatro sites, a 360 px, nos 2 temas.
   Entra no projeto "acessibilidade" (o testMatch pega o fim do nome).
   - Borda (WCAG 1.4.11): o limite visual de cada campo (a borda, ou o fundo do campo) tem 3:1 contra o fundo de trás.
     O estudo de 24/11/2026 achou 6 de 8 campos abaixo (1,23 a 1,48:1); as correções são o learn-tech#178, o
     learntech-content#71 (o modal, já medido no acessibilidade.spec.mjs), o career#49 e o tools#72.
   - Foco (WCAG 2.4.7): a busca, focada pelo teclado, mostra um indicador de 2 px ou mais (contorno ou anel de
     box-shadow), com 3:1 contra o fundo de trás. Só a troca da cor da borda não basta: era 1,17:1 no career e
     1,06:1 no tools (R19 do Esp UX/UI do career#49 e do tools#72, nota 3).
   Guarda de N: cada página tem um mínimo de campos; com a marcação mudada e 0 campos, as listas viriam vazias e
   passariam. Contra a produção, passa depois do deploy dos 3 sites (o do autor). */
import { test, expect } from "./visitante.mjs";
import { SITES } from "./sites.mjs";

const PAGINAS = [
  { site: "learn-tech", caminho: "/programs", campos: 2, busca: 'input[type="search"], input[placeholder*="Buscar"]' },
  { site: "bootcamps", caminho: "/", campos: 1, busca: 'input[type="search"], input[placeholder*="Buscar"]' },
  { site: "career", caminho: "/", campos: 2, busca: "#search-input" },
  { site: "tools", caminho: "/", campos: 1, busca: "#busca" },
];

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
  /* O fundo de trás: o branco e todos os fundos dos ancestrais, de fora para dentro. */
  const pilha = (e) => {
    const camadas = [];
    for (let q = e.parentElement; q; q = q.parentElement) {
      const c = globalThis.getComputedStyle(q).backgroundColor;
      if (c !== "rgba(0, 0, 0, 0)") camadas.unshift(c);
    }
    return ["#ffffff", ...camadas];
  };
  const nome = (e) => (e.getAttribute("aria-label") || e.placeholder || e.name || e.id || e.tagName).trim().slice(0, 30);

  const campos = [...doc.querySelectorAll("input:not([type=hidden]):not([type=checkbox]):not([type=radio]), select, textarea")].filter(
    (e) => {
      const c = e.getBoundingClientRect();
      return c.width > 1 && c.height > 1 && globalThis.getComputedStyle(e).visibility !== "hidden";
    },
  );
  const fracos = campos
    .map((e) => {
      const st = globalThis.getComputedStyle(e);
      const atras = pilha(e);
      const fora = pintar(atras);
      const borda = parseFloat(st.borderBottomWidth) > 0 ? ct(pintar([...atras, st.borderBottomColor]), fora) : 0;
      const fundo = ct(pintar([...atras, st.backgroundColor]), fora);
      return { nome: nome(e), c: Math.max(borda, fundo) };
    })
    .filter((a) => a.c < 3)
    .map((a) => `borda de "${a.nome}" ${a.c.toFixed(2)}:1`);

  /* O foco: o contorno, ou o anel mais largo do box-shadow (o ring do Tailwind). */
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
  const atras = e ? pilha(e) : ["#ffffff"];
  const fora = pintar(atras);
  const foco = indicadores.map((i) => ({ ...i, c: +ct(pintar([...atras, i.cor]), fora).toFixed(2) }));
  return {
    medidos: campos.length,
    fracos,
    busca: { achada: !!e, focada: doc.activeElement === e, focoVisivel: !!e?.matches(":focus-visible"), foco },
  };
};

for (const esquema of ["light", "dark"]) {
  for (const p of PAGINAS) {
    test(`${p.site} — borda dos campos e foco da busca a 360 px (${esquema})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: esquema });
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(SITES[p.site].replace(/\/$/, "") + p.caminho);
      await page.waitForLoadState("networkidle");
      /* O foco pelo teclado: o Tab chega na busca vindo do elemento anterior, e o :focus-visible vale. */
      const busca = page.locator(p.busca).first();
      await expect(busca, `a busca (${p.busca}) não está na página`).toBeVisible();
      await busca.focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      await page.waitForTimeout(400);
      const r = await page.evaluate(medir, p.busca);
      expect(r.medidos, `só ${r.medidos} campos medidos em ${p.site}: a página carregou?`).toBeGreaterThanOrEqual(p.campos);
      expect.soft(r.fracos, r.fracos.join(" | ")).toEqual([]);
      expect(r.busca.achada, `a busca (${p.busca}) não foi achada`).toBe(true);
      expect(r.busca.focada && r.busca.focoVisivel, "a busca não ficou com o foco do teclado").toBe(true);
      const bons = r.busca.foco.filter((i) => i.largura >= 2 && i.c >= 3);
      const visto = r.busca.foco.map((i) => `${i.tipo} ${i.largura}px ${i.c}:1`).join(" | ") || "nenhum contorno nem anel";
      expect(bons.length, `o foco da busca em ${p.site}: ${visto}`).toBeGreaterThan(0);
    });
  }
}

/* Fim de campos-acessibilidade.spec.mjs */
