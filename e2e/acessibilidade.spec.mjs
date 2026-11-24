/* acessibilidade.spec.mjs — verificação automática WCAG 2.2 A/AA (axe-core) nas páginas representativas.
   Grava e2e/relatorios/acessibilidade.json. Falha só com violação "critical"; as demais entram no relatório para correção. */
import fs from "node:fs";
import path from "node:path";
import { test, expect } from "./visitante.mjs";
import { test as baseTest } from "@playwright/test";
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
    const violacoes = r.violations.map((v) => ({
      id: v.id,
      impacto: v.impact,
      descricao: v.help,
      ocorrencias: v.nodes.length,
      ajuda: v.helpUrl,
    }));
    resultados.push({ site: p.site, pagina: p.nome, url: url(p), violacoes });
    expect(
      violacoes.filter((v) => v.impacto === "critical"),
      JSON.stringify(violacoes, null, 2),
    ).toEqual([]);
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

/* Alvos de toque de 44 px nos sites irmãos, a 360 px (bootcamps#85, career#44 e tools#70; padrão E8 do Esp UX/UI).
   Mede todo alvo interativo visível. Ficam de fora o link de pular para o conteúdo, que só aparece no foco
   (1 x 1 px fora dele), e só o link de fato inline numa frase (o parágrafo ou item tem texto além do link), que a
   WCAG 2.5.8 isenta. Um link sozinho num parágrafo, como o "Conheça o learnTECH" do career, não é isento.
   Guarda (R19 do Esp QA do #68): pelo menos 10 alvos medidos por site, senão o teste falha (com o JS bloqueado ou a
   página vazia, ele passaria calado). Contra a produção, passa depois que a main de cada site receber o PR dele
   (bootcamps#85, career#44 e o PR do "Conheça", tools#70) e o deploy chegar. */
const SITES_44 = [
  { site: "bootcamps", caminho: "/" },
  { site: "career", caminho: "/" },
  { site: "tools", caminho: "/" },
];

for (const s of SITES_44) {
  test(`${s.site} — alvos de 44 px a 360 px`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(SITES[s.site].replace(/\/$/, "") + s.caminho);
    await page.waitForLoadState("networkidle");
    const { medidos, pequenos } = await page.evaluate(() => {
      const seletor = "a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=tab]";
      const lista = [];
      let total = 0;
      /* Inline numa frase: o link é inline e o bloco em volta (p ou li) tem texto além do texto do link. */
      const inlineNumaFrase = (e, cs) => {
        if (e.tagName !== "A" || cs.display !== "inline" || e.closest("nav")) return false;
        const bloco = e.closest("p, li");
        if (!bloco) return false;
        return bloco.textContent.replace(e.textContent, "").trim().length > 0;
      };
      for (const e of globalThis.document.querySelectorAll(seletor)) {
        const c = e.getBoundingClientRect();
        const cs = globalThis.getComputedStyle(e);
        if (c.width <= 1 || c.height <= 1 || cs.visibility === "hidden" || cs.display === "none") continue;
        if (inlineNumaFrase(e, cs)) continue;
        total += 1;
        if (c.width < 44 || c.height < 44) {
          const nome = (e.getAttribute("aria-label") || e.textContent || e.getAttribute("placeholder") || "").trim().slice(0, 30);
          lista.push(`${e.tagName.toLowerCase()} "${nome}" ${c.width.toFixed(1)}x${c.height.toFixed(1)}`);
        }
      }
      return { medidos: total, pequenos: lista };
    });
    expect(medidos, `só ${medidos} alvos medidos em ${s.site}: a página carregou?`).toBeGreaterThanOrEqual(10);
    expect(pequenos, pequenos.join(" | ")).toEqual([]);
  });
}

/* O modal de identificação do SDK (/sdk/identificacao.js, shadow DOM aberto), na 1ª visita a 360 px (C8 do MVP do
   learntech-content). O e2e dos outros testes entra já identificado; aqui o contexto é novo e sem identificação.
   Roda nos 2 esquemas de cor (o erro no escuro tinha ~3,7:1, R19 do Esp UX/UI do #71). O axe percorre o shadow DOM
   aberto: 0 violações critical ou serious. Campos e botões com 44 px; o link da política fica dentro de uma frase,
   isento pela WCAG 2.5.8. A borda dos campos, o único limite visual deles, com 3:1 contra a caixa (WCAG 1.4.11; era
   1,48:1), e o texto de erro com 4,5:1 (WCAG 1.4.3). Contra a produção, passa depois do deploy da API. */
const contrastes = (form) => {
  const cv = globalThis.document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const rgb = (c) => {
    cv.fillStyle = "#fff";
    cv.fillRect(0, 0, 1, 1);
    cv.fillStyle = c;
    cv.fillRect(0, 0, 1, 1);
    return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3);
  };
  const lum = ([r, g, b]) =>
    [r, g, b]
      .map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      })
      .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ct = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
  const cor = (e, prop) => rgb(globalThis.getComputedStyle(e)[prop]);
  const fundo = cor(form.closest(".caixa") ?? form, "backgroundColor");
  const bordas = [...form.querySelectorAll("input")].map((e) => ({
    nome: `borda de ${e.name}`,
    c: ct(cor(e, "borderBottomColor"), fundo),
    minimo: 3,
  }));
  const erro = form.querySelector("[role=alert]");
  return [...bordas, { nome: `erro "${erro.textContent}"`, c: ct(cor(erro, "color"), fundo), minimo: 4.5 }]
    .filter((a) => a.c < a.minimo)
    .map((a) => `${a.nome} ${a.c.toFixed(2)}:1`);
};

for (const esquema of ["light", "dark"]) {
  baseTest(`learn-tech — modal de identificação: axe, 44 px e contraste a 360 px (${esquema})`, async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 360, height: 800 }, colorScheme: esquema });
    const page = await contexto.newPage();
    await page.goto(SITES["learn-tech"].replace(/\/$/, "") + "/");
    const dialogo = page.getByRole("dialog");
    await expect(dialogo).toBeVisible();
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const graves = r.violations.filter((v) => ["critical", "serious"].includes(v.impact)).map((v) => `${v.id} x${v.nodes.length}`);
    expect(graves, graves.join(" | ")).toEqual([]);
    const pequenos = await dialogo.evaluate((form) =>
      [...form.querySelectorAll("input, button")]
        .map((e) => ({ nome: e.getAttribute("aria-label") || e.name || e.textContent.trim(), c: e.getBoundingClientRect() }))
        .filter((a) => a.c.height < 44 || a.c.width < 44)
        .map((a) => `${a.nome} ${a.c.width.toFixed(0)}x${a.c.height.toFixed(0)}`),
    );
    expect(pequenos, pequenos.join(" | ")).toEqual([]);
    /* "Continuar" com o formulário vazio mostra o erro, que entra na medida do contraste. */
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(dialogo.getByRole("alert")).not.toBeEmpty();
    const fracos = await dialogo.evaluate(contrastes);
    expect(fracos, fracos.join(" | ")).toEqual([]);
    await contexto.close();
  });
}

/* Com o celular deitado (800 x 360) ou com zoom de 200% (1280 x 800 vira 640 x 400), a caixa (~483 px) passa da
   altura da tela. O fundo rola, e o topo e o fim da caixa são alcançáveis (WCAG 1.4.10; R19 do Esp UX/UI do #71).
   Antes, o fundo não rolava e a caixa ficava cortada nas 2 pontas. */
for (const viewport of [
  { width: 800, height: 360 },
  { width: 640, height: 400 },
]) {
  baseTest(`learn-tech — modal de identificação: topo e fim alcançáveis a ${viewport.width}x${viewport.height}`, async ({ browser }) => {
    const contexto = await browser.newContext({ viewport });
    const page = await contexto.newPage();
    await page.goto(SITES["learn-tech"].replace(/\/$/, "") + "/");
    const dialogo = page.getByRole("dialog");
    await expect(dialogo).toBeVisible();
    const r = await dialogo.evaluate((form) => {
      const fundo = form.parentElement;
      const altura = globalThis.innerHeight;
      fundo.scrollTop = 0;
      const topo = form.getBoundingClientRect().top;
      fundo.scrollTop = 1e6;
      const fim = form.getBoundingClientRect().bottom;
      return { topo, fim, altura };
    });
    expect(r.topo, "o topo da caixa, com o fundo no início").toBeGreaterThanOrEqual(0);
    expect(r.fim, "o fim da caixa, com o fundo rolado até o fim").toBeLessThanOrEqual(r.altura);
    await contexto.close();
  });
}
