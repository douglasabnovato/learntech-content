/* hd-inventario.mjs — partes puras do inventário do hd (scripts/hd-inventariar.mjs), testadas em tests/hd-inventario.test.ts.
 * A identificação é sempre pelo SHA-256 do conteúdo: o caminho não entra na comparação, então um arquivo
 * movido de pasta (por exemplo, para a 000-catalogado) continua reconhecido como "já registrado". */
import fs from "node:fs";
import path from "node:path";

/* Arquivos de controle e lixo do sistema que nunca entram no inventário. */
export const ARQUIVOS_IGNORADOS = new Set([
  ".acervo-local.json",
  ".hash-cache.json",
  ".imagens-publicadas.json",
  ".dhash-cache.json",
  "desktop.ini",
  "Thumbs.db",
  ".DS_Store",
]);

/* Normaliza um caminho relativo: barras normais, NFC, sem barra no começo nem no fim. */
export const normalizar = (rel) =>
  rel
    .split(/[\\/]+/)
    .filter(Boolean)
    .join("/")
    .normalize("NFC");

/* Lê a lista do --ignorar ("4-experiences,outra/sub") como um conjunto de caminhos relativos normalizados. */
export function pastasIgnoradas(valor) {
  return new Set(
    String(valor ?? "")
      .split(",")
      .map((s) => normalizar(s.trim()))
      .filter(Boolean),
  );
}

/* Lista os arquivos de `pasta`, com caminho relativo em barras normais e NFC.
 * Uma pasta em `ignorar` (caminho relativo à raiz, ou só o nome quando está na raiz) não é nem aberta:
 * o readdirSync dela nunca roda. `.extraido` é a saída do hd:extrair e também fica de fora. */
export function listar(pasta, { ignorar = new Set(), base = pasta } = {}) {
  return fs.readdirSync(pasta, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(pasta, e.name);
    const rel = normalizar(path.relative(base, p));
    if (e.isDirectory()) return e.name === ".extraido" || ignorar.has(rel) ? [] : listar(p, { ignorar, base });
    if (ARQUIVOS_IGNORADOS.has(e.name)) return [];
    return [{ abs: p, rel }];
  });
}

/* Grupo de um arquivo: a pasta de até dois níveis (ex.: "6-tech_community/gdg_jf"). */
export const grupo = (rel) => rel.split("/").slice(0, -1).slice(0, 2).join("/") || "(raiz)";

/* Separa os arquivos (com sha256) em já registrados no acervo, novos por grupo e cópias idênticas,
 * e acha os itens do acervo cujos arquivos já saíram todos do hd. */
export function classificar(arquivos, acervo) {
  const porHash = new Map();
  for (const it of acervo.itens) for (const f of it.arquivos ?? []) porHash.set(f.sha256, it);

  const registrados = new Map(); /* id do item → quantidade de arquivos no hd */
  const novos = new Map(); /* grupo → arquivos novos */
  const vistos = new Set(); /* hash novo já contado (cópias idênticas entram uma vez só) */
  let copias = 0;
  for (const a of arquivos) {
    const it = porHash.get(a.sha256);
    if (it) {
      registrados.set(it.id, (registrados.get(it.id) ?? 0) + 1);
      continue;
    }
    if (vistos.has(a.sha256)) {
      copias++;
      continue;
    }
    vistos.add(a.sha256);
    const g = grupo(a.rel);
    if (!novos.has(g)) novos.set(g, []);
    novos.get(g).push(a);
  }
  const noHd = new Set(arquivos.map((a) => a.sha256));
  const removidos = acervo.itens.filter((it) => it.arquivos?.length && it.arquivos.every((f) => !noHd.has(f.sha256)));
  return { porHash, registrados, novos, copias, removidos };
}

/* Onde ficam os arquivos locais do inventário (mapa ID → caminhos e cache de hash).
 * Sem --saida, ficam na raiz do hd (comportamento antigo). Com --saida, ficam na pasta indicada, e nada é escrito no hd. */
export function arquivosLocais(hd, saida) {
  const pasta = saida ? path.resolve(saida) : hd;
  return { pasta, mapa: path.join(pasta, ".acervo-local.json"), cache: path.join(pasta, ".hash-cache.json") };
}

/* Fim de hd-inventario.mjs */
