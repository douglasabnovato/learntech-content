/* acervo.test.ts — estados do fluxo de agentes e regras de cada estado no registro do hd. */
import { describe, it, expect } from "vitest";
import path from "node:path";
import { itemAcervoSchema } from "../src/schemas/acervo";
import { carregarConteudo, errosDestinos } from "../scripts/lib/conteudo";

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

describe("acervo: uso de cada arquivo", () => {
  const destino = "bootcamps/eventos/gdg-jf";
  const comArquivo = (f: object, extra: object = {}) =>
    valido({ estado: "publicado", destinos: [destino], ...extra, arquivos: [{ ...base.arquivos[0], ...f }] });

  it("aceita arquivo sem uso (pendente) e os usos com seus campos", () => {
    expect(comArquivo({})).toBe(true);
    expect(comArquivo({ uso: "exibido", destino })).toBe(true);
    expect(comArquivo({ uso: "fonte", destino })).toBe(true);
    expect(comArquivo({ uso: "similar", similarA: "b".repeat(64) })).toBe(true);
    expect(comArquivo({ uso: "tecnico" })).toBe(true);
    expect(comArquivo({ uso: "referencia" })).toBe(true);
    expect(comArquivo({ uso: "referencia", motivo: "regras editoriais, seção 7" })).toBe(true);
    expect(comArquivo({ uso: "descartado", motivo: "foto desfocada" })).toBe(true);
  });

  it("recusa exibido ou fonte sem destino, ou com destino fora do item", () => {
    expect(comArquivo({ uso: "exibido" })).toBe(false);
    expect(comArquivo({ uso: "fonte" })).toBe(false);
    expect(comArquivo({ uso: "exibido", destino: "bootcamps/eventos/outro" })).toBe(false);
  });

  it("recusa similar sem hash, descartado sem motivo e o uso antigo bloqueado", () => {
    expect(comArquivo({ uso: "similar" })).toBe(false);
    expect(comArquivo({ uso: "bloqueado", motivo: "regra" })).toBe(false);
    expect(comArquivo({ uso: "descartado", motivo: " " })).toBe(false);
  });
});

describe("acervo: destinos no formato projeto/recurso/id (#18)", () => {
  const { conteudo } = carregarConteudo(path.resolve(__dirname, "..", "content"));
  const comDestinos = (destinos: string[]) => ({ ...conteudo, acervo: { ...conteudo.acervo, itens: [{ ...base, id: "HD-9002", destinos } as never] } });

  it("o acervo publicado não tem destino curto nem inexistente", () => {
    expect(errosDestinos(conteudo)).toEqual([]);
  });

  it("recusa destino curto, recurso desconhecido e id que não existe", () => {
    expect(errosDestinos(comDestinos(["programas/404"]))[0]).toMatch(/fora do formato/);
    expect(errosDestinos(comDestinos(["learn-tech/podcasts/1"]))[0]).toMatch(/fora do formato/);
    expect(errosDestinos(comDestinos(["career/empresas/nao-existe"]))[0]).toMatch(/não existe/);
    expect(errosDestinos(comDestinos(["learn-tech/programas/404", "bootcamps/eventos/gdg-jf"]))).toEqual([]);
  });
});

describe("galeria do programa e do artigo (ADR 12)", () => {
  const { conteudo } = carregarConteudo(path.resolve(__dirname, "..", "content"));

  it("aceita foto com alt e recusa foto sem alt", async () => {
    const { fotoGaleriaSchema } = await import("../src/schemas/learn-tech");
    expect(fotoGaleriaSchema.safeParse({ url: "/media/learn-tech/programas/1005-galeria-1.webp", alt: "Favoritos" }).success).toBe(true);
    expect(fotoGaleriaSchema.safeParse({ url: "/media/x.webp", alt: "" }).success).toBe(false);
  });

  it("o programa 1005 e o artigo do Hack Dev têm galeria", () => {
    const p = conteudo.programas.find((x) => x.id === 1005) as { galeria?: unknown[] } | undefined;
    const b = (conteudo.paginas.blog as { itens: { id: string; galeria?: unknown[] }[] }).itens.find((x) => x.id === "hack-dev-rotina-e-trilha-para-a-primeira-vaga");
    expect(p?.galeria?.length).toBe(2);
    expect(b?.galeria?.length).toBe(1);
  });
});
