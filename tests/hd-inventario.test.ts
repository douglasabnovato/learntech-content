/* hd-inventario.test.ts — inventário do hd (#42): arquivo movido continua registrado, --ignorar não abre a pasta
   e --saida não escreve nada no hd. */
import { describe, it, expect, vi, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
// @ts-expect-error módulo .mjs sem tipos
import { listar, classificar, pastasIgnoradas, arquivosLocais } from "../scripts/lib/hd-inventario.mjs";

const RAIZ = path.resolve(__dirname, "..");
const sha = (texto: string) => crypto.createHash("sha256").update(texto).digest("hex");
const temporaria = () => fs.mkdtempSync(path.join(os.tmpdir(), "hd-inv-"));
const gravar = (arq: string, texto: string) => {
  fs.mkdirSync(path.dirname(arq), { recursive: true });
  fs.writeFileSync(arq, texto);
};
type Arquivo = { abs: string; rel: string; sha256?: string };
const comHash = (lista: Arquivo[]) => lista.map((a) => ({ ...a, sha256: sha(fs.readFileSync(a.abs, "utf8")) }));

afterEach(() => vi.restoreAllMocks());

describe("inventário do hd", () => {
  it("arquivo movido de pasta continua já registrado (a identificação é pelo hash)", () => {
    const hd = temporaria();
    gravar(path.join(hd, "5-expertise", "ufjf", "dcc013", "pilha.c"), "int main(){}");
    const acervo = {
      itens: [{ id: "HD-0001", estado: "triado", arquivos: [{ sha256: sha("int main(){}"), ext: "c", bytes: 12 }] }],
    };
    const antes = classificar(comHash(listar(hd)), acervo);
    expect(antes.registrados.get("HD-0001")).toBe(1);

    fs.mkdirSync(path.join(hd, "000-catalogado"), { recursive: true });
    fs.renameSync(path.join(hd, "5-expertise", "ufjf", "dcc013", "pilha.c"), path.join(hd, "000-catalogado", "pilha.c"));
    const depois = classificar(comHash(listar(hd)), acervo);
    expect(depois.registrados.get("HD-0001")).toBe(1);
    expect(depois.novos.size).toBe(0);
    expect(depois.removidos).toEqual([]);
  });

  it("--ignorar: a pasta não é aberta, nem em subpasta indicada pelo caminho", () => {
    const hd = temporaria();
    gravar(path.join(hd, "4-experiences", "x.txt"), "nao abrir");
    gravar(path.join(hd, "6-tech", "evento", "a.txt"), "a");
    gravar(path.join(hd, "6-tech", "fechada", "b.txt"), "b");
    const lidas: string[] = [];
    const original = fs.readdirSync;
    vi.spyOn(fs, "readdirSync").mockImplementation(((p: fs.PathLike, o: unknown) => {
      lidas.push(String(p));
      return (original as (p: fs.PathLike, o: unknown) => unknown)(p, o);
    }) as typeof fs.readdirSync);

    const lista = listar(hd, { ignorar: pastasIgnoradas("4-experiences, 6-tech/fechada") });
    expect(lista.map((a: Arquivo) => a.rel)).toEqual(["6-tech/evento/a.txt"]);
    expect(lidas.length).toBeGreaterThan(0);
    expect(lidas.some((p) => p.includes("4-experiences") || p.includes("fechada"))).toBe(false);
  });

  it("--saida: mapa e cache vão para a pasta indicada; sem ela, ficam no hd", () => {
    const hd = temporaria();
    expect(arquivosLocais(hd, undefined).cache).toBe(path.join(hd, ".hash-cache.json"));
    const saida = temporaria();
    expect(arquivosLocais(hd, saida)).toEqual({
      pasta: saida,
      mapa: path.join(saida, ".acervo-local.json"),
      cache: path.join(saida, ".hash-cache.json"),
    });
  });

  it("o script com --saida não escreve nada no hd e recusa uma saída dentro do hd", () => {
    const hd = temporaria();
    gravar(path.join(hd, "1-pasta", "a.txt"), "conteudo novo do teste");
    gravar(path.join(hd, "4-experiences", "b.txt"), "nao abrir");
    const antes = fs.readdirSync(hd, { recursive: true }).map(String).sort();
    const saida = path.join(temporaria(), "local");
    const script = path.join(RAIZ, "scripts", "hd-inventariar.mjs");

    const r = spawnSync(process.execPath, [script, "--hd", hd, "--saida", saida, "--ignorar", "4-experiences"], {
      cwd: RAIZ,
      encoding: "utf8",
    });
    expect(r.status, r.stderr).toBe(0);
    expect(r.stdout).toContain("hd: 1 arquivo(s)");
    expect(fs.readdirSync(hd, { recursive: true }).map(String).sort()).toEqual(antes);
    expect(fs.existsSync(path.join(saida, ".hash-cache.json"))).toBe(true);
    expect(fs.existsSync(path.join(saida, ".acervo-local.json"))).toBe(true);

    const recusa = spawnSync(process.execPath, [script, "--hd", hd, "--saida", path.join(hd, "cache")], {
      cwd: RAIZ,
      encoding: "utf8",
    });
    expect(recusa.status).toBe(1);
    expect(fs.existsSync(path.join(hd, "cache"))).toBe(false);
  });
});

/* Fim de hd-inventario.test.ts */
