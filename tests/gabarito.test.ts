/* gabarito.test.ts — regras de acerto do triador contra o acervo (fase 1, issue #16). */
import { describe, it, expect } from "vitest";
// @ts-expect-error módulo .mjs sem tipos
import { compararItem, resumir } from "../scripts/lib/gabarito.mjs";

const item = {
  id: "HD-9001", direitos: "proprio", destinos: ["bootcamps/eventos/gdg-jf", "learn-tech/programas/1005"],
  arquivos: [{ sha256: "a", uso: "exibido" }, { sha256: "b", uso: "descartado" }],
};

describe("gabarito do triador", () => {
  it("acerta direitos iguais e destinos com metade ou mais dos propostos certos", () => {
    const r = compararItem({ direitos: "proprio", destinos: ["bootcamps/eventos/gdg-jf", "tools/ferramentas/figma"], arquivos: [{ sha256: "a", uso: "exibido" }, { sha256: "b", uso: "similar" }] }, item);
    expect(r).toMatchObject({ direitosOk: true, destinosOk: true, comuns: 1, uso: { iguais: 1, comparados: 2 } });
  });

  it("erra destinos quando a maioria dos propostos está fora do acervo", () => {
    const r = compararItem({ direitos: "terceiro-citavel", destinos: ["bootcamps/eventos/gdg-jf", "tools/ferramentas/figma", "career/empresas/x"] }, item);
    expect(r).toMatchObject({ direitosOk: false, destinosOk: false });
  });

  it("item sem destino no acervo só acerta se a proposta também não tiver destino", () => {
    expect(compararItem({ direitos: "descartar", destinos: [] }, { ...item, destinos: [] }).destinosOk).toBe(true);
    expect(compararItem({ direitos: "descartar", destinos: ["learn-tech/programas/1"] }, { ...item, destinos: [] }).destinosOk).toBe(false);
  });

  it("aprova a fase com 80% em direitos e em destinos", () => {
    const ok = { direitosOk: true, destinosOk: true, uso: { iguais: 0, comparados: 0 } };
    const erro = { direitosOk: false, destinosOk: true, uso: { iguais: 0, comparados: 0 } };
    expect(resumir([ok, ok, ok, ok, erro]).aprovado).toBe(true);
    expect(resumir([ok, ok, ok, erro, erro]).aprovado).toBe(false);
  });
});
