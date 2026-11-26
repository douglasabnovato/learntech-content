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

/* O cabeçalho fixo do learn-tech com o texto grande (learn-tech#168), a 360 × 800. A 100%, ele tem 80 px e fica no
   lugar. A 200%, ele tem cerca de 161 px (20% da tela) e, durante a leitura (depois de rolar para baixo), cobre no
   máximo 12% da tela: ele se recolhe. O texto a 200% é aplicado como a escala do navegador, no font-size do html.
   Guarda: confere que a escala foi aplicada e que a página rolou, senão o teste passaria sem medir nada. */
test.describe("learn-tech — cabeçalho a 360 px com o texto a 100% e a 200%", () => {
  test.use({ viewport: { width: 360, height: 800 } });
  const base = SITES["learn-tech"].replace(/\/$/, "");

  for (const escala of [100, 200]) {
    test(`texto a ${escala}%`, async ({ page }) => {
      await page.addInitScript((e) => {
        const folha = new globalThis.CSSStyleSheet();
        folha.replaceSync(`html { font-size: ${e}%; }`);
        globalThis.document.adoptedStyleSheets = [...globalThis.document.adoptedStyleSheets, folha];
      }, escala);
      await page.goto(base + "/");
      await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();
      const medir = () =>
        page.evaluate(() => {
          const n = globalThis.document.getElementById("navbar");
          const r = n.getBoundingClientRect();
          const alto = globalThis.innerHeight;
          return {
            fonte: globalThis.getComputedStyle(globalThis.document.documentElement).fontSize,
            altura: r.height,
            visivel: Math.max(0, Math.min(r.bottom, alto) - Math.max(r.top, 0)),
            alto,
            y: globalThis.scrollY,
          };
        });
      const topo = await medir();
      expect(topo.fonte, "a escala do texto não foi aplicada").toBe(`${(16 * escala) / 100}px`);
      await expect(page.locator("h1").first()).toBeVisible();
      await page.mouse.move(180, 400);
      for (let i = 0; i < 6; i++) {
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(150);
      }
      await expect.poll(async () => (await medir()).y, { message: "a página não rolou" }).toBeGreaterThan(600);
      if (escala === 100) {
        /* 80,47 px: a altura vem em rem. Tolerância de 1 px. */
        expect(Math.abs(topo.altura - 80), `altura do cabeçalho a 100%: ${topo.altura}`).toBeLessThan(1);
        await expect
          .poll(async () => (await medir()).visivel, { message: "a 100%, o cabeçalho fica no lugar" })
          .toBeGreaterThanOrEqual(topo.altura - 1);
      } else {
        expect(topo.altura, "a 200%, o cabeçalho é maior que a 100%").toBeGreaterThan(80);
        await expect
          .poll(async () => (await medir()).visivel / topo.alto, {
            message: "a 200%, o cabeçalho cobre mais de 12% da tela durante a leitura",
          })
          .toBeLessThanOrEqual(0.12);
        /* "Durante a leitura", e não num instante (R19 do Esp QA do #88): 1 s depois, sem rolar, ele continua recolhido.
           Um cabeçalho que se recolhe e volta sozinho fica vermelho aqui. */
        await page.waitForTimeout(1000);
        const depois = await medir();
        expect(depois.visivel / topo.alto, "a 200%, o cabeçalho voltou sem o leitor subir").toBeLessThanOrEqual(0.12);
      }
    });
  }
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

/* O SDK testado (R19 do Esp QA do #81). Com E2E_SDK=public/sdk/identificacao.js, cada contexto do modal serve o SDK
   local por rota, na página de produção do learn-tech: assim a prova roda antes do deploy da API. */
const SDK_LOCAL = process.env.E2E_SDK ? path.resolve(process.env.E2E_SDK) : null;
const SDK_PRODUCAO = "https://learntech-content.douglasabnovato.workers.dev/sdk/identificacao.js";
async function novoContexto(browser, opcoes) {
  const contexto = await browser.newContext(opcoes);
  if (SDK_LOCAL) await contexto.route(/[/]sdk[/]identificacao[.]js/, (r) => r.fulfill({ path: SDK_LOCAL, contentType: "text/javascript" }));
  return contexto;
}
/* A falha esperada, amarrada à correção: sem o E2E_SDK, o teste tem test.fail só enquanto o SDK publicado não tem a
   marca do código novo (um trecho único dele, nunca um pedaço de palavra). Quando o deploy da API sair, a marca aparece
   e o teste volta a valer sozinho. Uma falha de outro motivo aparece no teste de guarda abaixo, que não tem test.fail. */
const MARCA_71 = "min-height:44px"; /* os alvos, a borda, o erro e a rolagem (#71) */
const MARCA_81 = "inset 0 0 0 1px var(--erro)"; /* o erro junto do campo e o 2º sinal (#81) */
async function sdkPendente(request, marca) {
  if (SDK_LOCAL) return false;
  return !(await (await request.get(SDK_PRODUCAO)).text()).includes(marca);
}

baseTest("learn-tech — modal de identificação: abre na 1ª visita com os 2 campos e o Continuar (guarda)", async ({ browser }) => {
  const contexto = await novoContexto(browser, { viewport: { width: 360, height: 800 } });
  const page = await contexto.newPage();
  await page.goto(SITES["learn-tech"].replace(/\/$/, "") + "/");
  const dialogo = page.getByRole("dialog");
  await expect(dialogo, "o modal não abriu na 1ª visita").toBeVisible();
  await expect(dialogo.getByLabel("Nome completo")).toBeVisible();
  await expect(dialogo.getByLabel("E-mail")).toBeVisible();
  await expect(dialogo.getByRole("button", { name: "Continuar" })).toBeVisible();
  await contexto.close();
});

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
  baseTest(`learn-tech — modal de identificação: axe, 44 px e contraste a 360 px (${esquema})`, async ({ browser, request }) => {
    baseTest.fail(await sdkPendente(request, MARCA_71), "deploy pendente da API: o SDK publicado não tem o #71");
    const contexto = await novoContexto(browser, { viewport: { width: 360, height: 800 }, colorScheme: esquema });
    const page = await contexto.newPage();
    await page.goto(SITES["learn-tech"].replace(/\/$/, "") + "/");
    const dialogo = page.getByRole("dialog");
    await expect(dialogo).toBeVisible();
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const graves = r.violations.filter((v) => ["critical", "serious"].includes(v.impact)).map((v) => `${v.id} x${v.nodes.length}`);
    expect(graves, graves.join(" | ")).toEqual([]);
    /* Guarda (R19 do Esp QA do #71, a lição do #68): o "0 violações" só vale se o axe entrou no shadow DOM do modal.
       Em 24/11 eram 37 nós em 18 regras; o mínimo de 20 dá folga e pega o caso calado (versão ou configuração do axe). */
    const naSombra = [...r.passes, ...r.violations, ...r.incomplete]
      .flatMap((v) => v.nodes)
      .filter((n) => Array.isArray(n.target[0]) && n.target[0][0] === "#learntech-identificacao").length;
    expect(naSombra, "o axe não entrou no shadow DOM do modal").toBeGreaterThanOrEqual(20);
    /* Guarda dos alvos e das bordas: com a marcação mudada e 0 elementos achados, as listas viriam vazias e passariam. */
    await expect(dialogo.locator("input")).toHaveCount(2);
    expect(await dialogo.locator("button").count(), "botões no modal").toBeGreaterThanOrEqual(1);
    const pequenos = await dialogo.evaluate((form) =>
      [...form.querySelectorAll("input, button")]
        .map((e) => ({ nome: e.getAttribute("aria-label") || e.name || e.textContent.trim(), c: e.getBoundingClientRect() }))
        .filter((a) => a.c.height < 44 || a.c.width < 44)
        .map((a) => `${a.nome} ${a.c.width.toFixed(1)}x${a.c.height.toFixed(1)}`),
    );
    /* soft: na produção, a falha dos 44 px não esconde a do contraste, que vem a seguir. */
    expect.soft(pequenos, pequenos.join(" | ")).toEqual([]);
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
  baseTest(
    `learn-tech — modal de identificação: topo e fim alcançáveis a ${viewport.width}x${viewport.height}`,
    async ({ browser, request }) => {
      baseTest.fail(await sdkPendente(request, MARCA_71), "deploy pendente da API: o SDK publicado não tem o #71");
      const contexto = await novoContexto(browser, { viewport });
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
    },
  );
}

/* O erro no nome, a 360 px (issue #80): a mensagem fica logo embaixo do nome, e não junto do e-mail (G1; antes, 89 px
   do nome e 8 px do e-mail), e o campo inválido tem um 2º sinal além do matiz (o anel por dentro, de 1 px, na cor do
   erro). Guarda de N: o nome ficou aria-invalid e a mensagem tem texto; sem isso, as distâncias não valem nada.
   Roda no claro, no escuro e no alto contraste (forced-colors, onde o navegador apaga o box-shadow: ali o 2º sinal é a
   borda de 2 px, R19 do Esp UX/UI do #81). O 2º sinal precisa da cor do erro (a da mensagem) e de não existir no
   e-mail válido; uma sombra transparente ou em todos os campos não conta (R19 do Esp QA do #81). */
for (const modo of ["light", "dark", "forced-colors"]) {
  baseTest(
    `learn-tech — modal de identificação: o erro no nome fica junto do nome, com 2 sinais, a 360 px (${modo})`,
    async ({ browser, request }) => {
      baseTest.fail(await sdkPendente(request, MARCA_81), "deploy pendente da API: o SDK publicado não tem o #81");
      const alto = modo === "forced-colors";
      const contexto = await novoContexto(browser, {
        viewport: { width: 360, height: 800 },
        colorScheme: alto ? "light" : modo,
        forcedColors: alto ? "active" : "none",
      });
      const page = await contexto.newPage();
      await page.goto(SITES["learn-tech"].replace(/\/$/, "") + "/");
      const dialogo = page.getByRole("dialog");
      await expect(dialogo).toBeVisible();
      await dialogo.getByLabel("Nome completo").fill("Visitante");
      await dialogo.getByLabel("E-mail").fill("e2e@example.com");
      await dialogo.getByRole("button", { name: "Continuar" }).click();
      const r = await dialogo.evaluate((form) => {
        const raiz = form.getRootNode();
        const ids = ["lt-nome", "lt-email", "lt-erro"].filter((id) => !raiz.getElementById(id));
        if (ids.length) return { faltam: ids };
        const nome = raiz.getElementById("lt-nome");
        const email = raiz.getElementById("lt-email");
        const msg = raiz.getElementById("lt-erro");
        const m = msg.getBoundingClientRect();
        const n = nome.getBoundingClientRect();
        const e = email.getBoundingClientRect();
        const st = globalThis.getComputedStyle(nome);
        const ok = globalThis.getComputedStyle(email);
        const corErro = globalThis.getComputedStyle(msg).color;
        return {
          faltam: [],
          invalido: nome.getAttribute("aria-invalid"),
          texto: msg.textContent,
          doNome: Math.round(m.top - n.bottom),
          doEmail: Math.round(Math.min(Math.abs(e.top - m.bottom), Math.abs(m.top - e.bottom))),
          anel: st.boxShadow !== ok.boxShadow && st.boxShadow.includes("inset") && st.boxShadow.includes(corErro),
          bordaGrossa: parseFloat(st.borderBottomWidth) >= 2 && parseFloat(ok.borderBottomWidth) < 2,
          visto: `sombra "${st.boxShadow}", borda ${st.borderBottomWidth}, erro ${corErro}, e-mail ${ok.borderBottomWidth}`,
        };
      });
      expect(r.faltam, "o modal não tem os ids do SDK novo (lt-nome, lt-email e lt-erro)").toEqual([]);
      expect(r.invalido, "o nome não ficou aria-invalid").toBe("true");
      expect(r.texto, "a mensagem de erro está vazia").toBe("Informe nome e sobrenome.");
      expect(r.doNome, `a mensagem fica a ${r.doNome} px embaixo do nome`).toBeGreaterThanOrEqual(0);
      expect(r.doNome, `a mensagem fica a ${r.doNome} px do nome e a ${r.doEmail} px do e-mail`).toBeLessThanOrEqual(16);
      expect(r.doNome, "a mensagem fica mais perto do e-mail que do nome").toBeLessThan(r.doEmail);
      expect(alto ? r.bordaGrossa : r.anel, `o campo inválido sem o 2º sinal (${modo}): ${r.visto}`).toBe(true);
      await contexto.close();
    },
  );
}
