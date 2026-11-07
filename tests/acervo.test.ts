/* acervo.test.ts — estados do fluxo de agentes e regras de cada estado no registro do hd. */
import { describe, it, expect } from "vitest";
import { itemAcervoSchema } from "../src/schemas/acervo";

const base = {
  id: "HD-9001", lote: "2026-11-06", origem: "hd/entrada/teste", descricao: "Item de teste",
  direitos: "proprio", estado: "novo", destinos: [],
  arquivos: [{ sha256: "a".repeat(64), ext: "pdf", bytes: 10 }],
};
const valido = (extra: object) => itemAcervoSchema.safeParse({ ...base, ...extra }).success;

describe("acervo: estados do fluxo", () => {
  it("aceita os estados novos na ordem do fluxo", () => {
    expect(valido({ estado: "extraido" })).toBe(true);
    expect(valido({ estado: "triado" })).toBe(true);
    expect(valido({ estado: "produzido", destinos: ["bootcamps/eventos/gdg-jf"] })).toBe(true);
    expect(valido({ estado: "exibido", destinos: ["bootcamps/eventos/gdg-jf"] })).toBe(true);
  });

  it("recusa item triado sem direitos definidos", () => {
    expect(valido({ estado: "triado", direitos: "a-triar" })).toBe(false);
    expect(valido({ estado: "extraido", direitos: "a-triar" })).toBe(true);
  });

  it("recusa item produzido ou exibido sem destino", () => {
    expect(valido({ estado: "produzido" })).toBe(false);
    expect(valido({ estado: "exibido" })).toBe(false);
  });

  it("aceita a ficha do triador e recusa confiança fora de 0 a 1", () => {
    const triagem = { confianca: 0.8, justificativa: "Fotos e programação do evento", sinais: ["rosto"], em: "2026-11-06" };
    expect(valido({ estado: "triado", triagem })).toBe(true);
    expect(valido({ estado: "triado", triagem: { ...triagem, confianca: 1.5 } })).toBe(false);
  });

  it("exige que a última etapa seja o estado atual", () => {
    const etapas = [
      { estado: "novo", em: "2026-11-06", por: "autor" },
      { estado: "triado", em: "2026-11-06", por: "triador" },
    ];
    expect(valido({ estado: "triado", etapas })).toBe(true);
    expect(valido({ estado: "planejado", etapas })).toBe(false);
    expect(valido({ estado: "triado", etapas: [{ estado: "triado", em: "2026-11-06", por: "estagiario" }] })).toBe(false);
  });
});
