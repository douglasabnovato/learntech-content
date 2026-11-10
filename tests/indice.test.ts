/* indice.test.ts: contagem de itens do /v1/index.json (issue #21). */
import { describe, it, expect } from "vitest";
import { contarItens } from "../scripts/lib/conteudo";

describe("contarItens", () => {
  it("conta lista direta", () => expect(contarItens([1, 2, 3])).toBe(3));
  it("conta objeto com itens, como o blog", () => expect(contarItens({ itens: [1, 2] })).toBe(2));
  it("deixa sem contagem página sem lista", () => {
    expect(contarItens({ heroContent: {} })).toBeUndefined();
    expect(contarItens(null)).toBeUndefined();
  });
});

/* Fim de indice.test.ts */
