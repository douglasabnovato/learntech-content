/* estabilidade.spec.mjs — estabilidade visual (CLS) das páginas representativas no celular.
   Mede o CLS (layout-shift sem interação do visitante, maior janela), com rede lenta, e exige até 0,1 (meta "bom" do Web Vitals).
   Criado para a career#36 (o banner e o detalhe empurravam a página quando os dados chegavam). */
/* global window */
import { devices } from "@playwright/test";
import { test, expect } from "./visitante.mjs";
import { PAGINAS, url } from "./sites.mjs";

const LIMITE_CLS = 0.1;

/* Páginas que ainda passam do limite na produção, cada uma com a sua issue.
   O teste fica marcado como falha esperada; quando a correção chegar, ele avisa, e a linha sai daqui.
   Vazio de 20/11/2026 (learn-tech#142, bootcamps#79 e tools#64 passaram na produção) até 26/11/2026. */
const CONHECIDAS = {
  "learn-tech programa-url-antiga": "learn-tech#187 (a correção é o learn-tech#188, que ainda não está no ar)",
};

/* Páginas só deste teste. A URL com a categoria antiga redireciona para a canônica (learn-tech#187): o redirecionamento
   não pode deixar a página vazia, senão o rodapé sobe ao topo da tela e o CLS vai a 1,0. */
const SO_ESTABILIDADE = [{ site: "learn-tech", nome: "programa-url-antiga", caminho: "/program/web/1104" }];

test.use({ ...devices["Moto G4"] });
test.setTimeout(75_000);

for (const p of [...PAGINAS, ...SO_ESTABILIDADE]) {
  test(`${p.site} — ${p.nome} — CLS até ${LIMITE_CLS}`, async ({ page, context }) => {
    const issue = CONHECIDAS[`${p.site} ${p.nome}`];
    test.fail(Boolean(issue), `CLS acima do limite na produção: ${issue}`);
    await page.addInitScript(() => {
      /* CLS como no Web Vitals: a maior janela de deslocamentos (intervalo < 1 s entre eles, janela de até 5 s). */
      window.__cls = 0;
      let janela = 0,
        inicio = 0,
        ultimo = 0;
      new PerformanceObserver((lista) => {
        for (const e of lista.getEntries()) {
          if (e.hadRecentInput) continue;
          if (janela && e.startTime - ultimo < 1000 && e.startTime - inicio < 5000) janela += e.value;
          else {
            janela = e.value;
            inicio = e.startTime;
          }
          ultimo = e.startTime;
          window.__cls = Math.max(window.__cls, janela);
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: 200_000,
      uploadThroughput: 94_000,
    });
    await page.goto(url(p), { waitUntil: "load", timeout: 40_000 });
    await page.waitForTimeout(5_000);
    const cls = await page.evaluate(() => window.__cls);
    test.info().annotations.push({ type: "CLS", description: cls.toFixed(3) });
    expect(cls, `CLS de ${p.site} ${p.nome}`).toBeLessThanOrEqual(LIMITE_CLS);
  });
}

/* Fim de estabilidade.spec.mjs */
