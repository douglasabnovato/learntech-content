/* verificar-links.test.ts — extração e classificação do verificador de links (issue #7). Sem rede. */
import { describe, it, expect } from "vitest";
// @ts-expect-error módulo .mjs sem tipos
import { extrairLinks, classificar, coletarLinks, montarRelatorio, ehExemplo } from "../scripts/verificar-links.mjs";

describe("ehExemplo", () => {
  it.each([
    "http://api",
    "https://rastreio.construirmais.exemplo/pedido?codigo={{1}}",
    "https://loja.construirmais.com.br/rastreio?pedido=%%Codigo%%",
    "https://seu-usuario.github.io",
    "https://exemplo-servico-de-formulario.com/f/SEU_ID",
    "https://www.example.com/x",
  ])("ignora o modelo %s", (url) => {
    expect(ehExemplo(url)).toBe(true);
  });

  it("não ignora link de referência", () => {
    expect(ehExemplo("https://developer.mozilla.org/pt-BR/docs/Web/HTML")).toBe(false);
  });
});

describe("extrairLinks", () => {
  it("acha URLs em qualquer campo, inclusive dentro de texto, com o caminho JSON", () => {
    const dados = {
      fontes: ["https://a.dev/x"],
      corpo: "Veja https://b.dev/guia, e depois (https://c.dev/y).",
      n: 3,
    };
    expect(extrairLinks(dados)).toEqual([
      { url: "https://a.dev/x", caminho: "$.fontes[0]" },
      { url: "https://b.dev/guia", caminho: "$.corpo" },
      { url: "https://c.dev/y", caminho: "$.corpo" },
    ]);
  });
});

describe("classificar", () => {
  it("2xx e 3xx são ok", () => {
    expect(classificar("https://a.dev", { status: 200 })).toBe("ok");
    expect(classificar("https://a.dev", { status: 301 })).toBe("ok");
  });

  it("404, 410 e domínio inexistente são erro", () => {
    expect(classificar("https://a.dev", { status: 404 })).toBe("erro");
    expect(classificar("https://a.dev", { status: 410 })).toBe("erro");
    expect(classificar("https://a.dev", { falha: "ENOTFOUND" })).toBe("erro");
  });

  it("403, 429, 5xx e tempo esgotado são aviso", () => {
    for (const r of [{ status: 403 }, { status: 429 }, { status: 503 }, { falha: "TEMPO_ESGOTADO" }]) {
      expect(classificar("https://a.dev", r)).toBe("aviso");
    }
  });

  it("domínio que bloqueia robôs nunca vira erro, nem com 404", () => {
    expect(classificar("https://www.w3schools.com/html/", { status: 404 })).toBe("aviso");
    expect(classificar("https://br.linkedin.com/in/x", { falha: "ENOTFOUND" })).toBe("aviso");
  });
});

describe("coletarLinks no conteúdo real", () => {
  const mapa = coletarLinks();

  it("encontra centenas de URLs e ignora example.com", () => {
    expect(mapa.size).toBeGreaterThan(500);
    expect([...mapa.keys()].some((u: string) => u.includes("example.com"))).toBe(false);
  });

  it("registra o arquivo de origem de cada URL", () => {
    const [usos] = [...mapa.values()];
    expect(usos[0].arquivo).toMatch(/^content\/(learn-tech|bootcamps|career|tools)\/.+\.json$/);
  });
});

describe("montarRelatorio", () => {
  it("resume e separa erros de avisos", () => {
    const usos = [{ arquivo: "content/tools/x.json", caminho: "$.url" }];
    const md = montarRelatorio(
      [
        { url: "https://ok.dev", usos, status: 200, situacao: "ok" },
        { url: "https://quebrou.dev", usos, status: 404, situacao: "erro" },
        { url: "https://lento.dev", usos, falha: "TEMPO_ESGOTADO", situacao: "aviso" },
      ],
      "2026-11-18",
    );
    expect(md).toContain("**3 URLs únicas**: 1 ok, 1 avisos e 1 erros.");
    expect(md).toContain("| 404 | https://quebrou.dev | `content/tools/x.json` |");
    expect(md).toContain("| TEMPO_ESGOTADO | https://lento.dev |");
  });
});
