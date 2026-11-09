/* uso-hd.test.ts — cálculo do uso de cada arquivo do hd (ADR 11): cópias, pendentes e marcação automática. */
import { describe, it, expect } from "vitest";
// @ts-expect-error módulo .mjs sem tipos
import { classificar } from "../scripts/lib/uso-hd.mjs";

const h = (c: string) => c.repeat(64);
const novoAcervo = () => ({
  itens: [
    {
      id: "HD-9001", destinos: ["bootcamps/eventos/gdg-jf"],
      arquivos: [
        { sha256: h("a"), ext: "jpg", bytes: 1 },
        { sha256: h("b"), ext: "ico", bytes: 1 },
        { sha256: h("c"), ext: "pdf", bytes: 1, uso: "referencia" },
        { sha256: h("d"), ext: "jpg", bytes: 1 },
      ],
    },
  ],
});
const arquivos = [
  { rel: "ev/1.jpg", sha: h("a"), ext: "jpg", bytes: 1 },
  { rel: "ev/copia-de-1.jpg", sha: h("a"), ext: "jpg", bytes: 1 },
  { rel: "ev/favicon.ico", sha: h("b"), ext: "ico", bytes: 1 },
  { rel: "ev/doc.pdf", sha: h("c"), ext: "pdf", bytes: 1 },
  { rel: "ev/2.jpg", sha: h("d"), ext: "jpg", bytes: 1 },
  { rel: "ev/sem-hash.txt", sha: undefined, ext: "txt", bytes: 1 },
];
const imagens = {
  "ev/1.jpg": { dist: 2, publicada: "learntech-content/media/bootcamps/eventos/gdg-jf/1.webp" },
  "ev/2.jpg": { dist: 3, publicada: "bootcamps/public/favicon.png" },
};

describe("uso do hd", () => {
  it("sem --aplicar: arquivo sem uso é pendente e cópia idêntica não conta de novo", () => {
    const { linhas, gravados, semHash } = classificar(arquivos, novoAcervo(), imagens);
    const unicos = linhas.filter((l: { copia: boolean }) => !l.copia);
    expect(semHash).toBe(1);
    expect(gravados).toBe(0);
    expect(unicos.map((l: { uso: string }) => l.uso)).toEqual(["pendente", "pendente", "referencia", "pendente"]);
    expect(linhas.filter((l: { copia: boolean }) => l.copia)).toHaveLength(1);
  });

  it("--aplicar marca técnico e a foto igual à da galeria, e não toca decisão já tomada", () => {
    const acervo = novoAcervo();
    const { gravados } = classificar(arquivos, acervo, imagens, { aplicar: true });
    const [foto, icone, doc, outra] = acervo.itens[0]!.arquivos as Array<{ uso?: string; destino?: string; motivo?: string }>;
    expect(gravados).toBe(2);
    expect(foto).toMatchObject({ uso: "exibido", destino: "bootcamps/eventos/gdg-jf" });
    expect(icone?.uso).toBe("tecnico");
    expect(doc).toMatchObject({ uso: "referencia" });
    /* parecida só com um ícone do site: falso positivo, continua pendente */
    expect(outra?.uso).toBeUndefined();
  });

  it("não marca exibido quando o evento da galeria não é destino do item", () => {
    const acervo = novoAcervo();
    acervo.itens[0]!.destinos = ["learn-tech/programas/101"];
    classificar(arquivos, acervo, imagens, { aplicar: true });
    expect((acervo.itens[0]!.arquivos[0] as { uso?: string }).uso).toBeUndefined();
  });
});
