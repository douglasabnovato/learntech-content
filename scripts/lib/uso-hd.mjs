/* uso-hd.mjs — cálculo do uso de cada arquivo do hd (ADR 11), separado da leitura do disco para ser testado.
 *
 * classificar(arquivos, acervo, imagens, { aplicar })
 *   arquivos: [{ rel, sha, ext, bytes }] na ordem do hd (sha ausente = arquivo sem inventário);
 *   acervo:   o content/acervo.json lido (é alterado quando aplicar = true);
 *   imagens:  { rel: { dist, publicada } } de hd/.imagens-publicadas.json.
 * Regras:
 *   - cópia idêntica (hash já visto) segue o uso do original e não conta duas vezes;
 *   - arquivo sem `uso` é pendente;
 *   - aplicar só grava em arquivo pendente: técnico pela extensão, exibido quando a imagem é igual (dHash até 5)
 *     a uma foto da galeria de um evento que é destino do item. Nunca sobrescreve decisão tomada.
 */
export const TECNICO = new Set(["ico", "tmp", "lnk", "iqy", "h2d", "map", "url", "ini", "db", "dsstore", "ds_store"]);
export const IMAGEM = new Set(["jpg", "jpeg", "png", "webp"]);
export const USADOS = new Set(["exibido", "fonte", "similar"]);
export const ORDEM = ["exibido", "fonte", "similar", "tecnico", "bloqueado", "descartado", "pendente"];
export const DIST_EXIBIDA = 5;
export const DIST_PROVAVEL = 10;
/* Ícones e capturas do próprio site batem com qualquer imagem simples: não contam como publicação. */
export const FALSO_POSITIVO = /favicon|android-chrome|apple-touch|og-image|[.]github[/]/;

/* Imagem publicada na galeria de um evento: devolve o destino "bootcamps/eventos/<slug>". */
export const destinoDaImagem = (pub) => {
  const m = pub?.match(/media\/bootcamps\/eventos\/([^/]+)\//);
  return m ? `bootcamps/eventos/${m[1]}` : null;
};

const pendente = (f) => !f.uso || f.uso === "pendente";

export function classificar(arquivos, acervo, imagens = {}, { aplicar = false } = {}) {
  const porHash = new Map();
  for (const it of acervo.itens) for (const f of it.arquivos ?? []) porHash.set(f.sha256, { it, f });
  const linhas = [];
  const vistos = new Set();
  let semHash = 0;
  let gravados = 0;
  for (const a of arquivos) {
    if (!a.sha) { semHash++; continue; }
    const reg = porHash.get(a.sha);
    const copia = vistos.has(a.sha);
    vistos.add(a.sha);
    if (!reg) { linhas.push({ ...a, fora: true, copia }); continue; }
    const achada = IMAGEM.has(a.ext) ? imagens[a.rel] : null;
    const img = achada && !FALSO_POSITIVO.test(achada.publicada ?? "") ? achada : null;
    if (aplicar && !copia && pendente(reg.f)) {
      const dest = img && img.dist <= DIST_EXIBIDA ? destinoDaImagem(img.publicada) : null;
      if (TECNICO.has(a.ext)) { reg.f.uso = "tecnico"; gravados++; }
      else if (dest && reg.it.destinos.includes(dest)) { reg.f.uso = "exibido"; reg.f.destino = dest; gravados++; }
    }
    const provavel = !!img && img.dist <= DIST_PROVAVEL && pendente(reg.f);
    linhas.push({ ...a, it: reg.it, uso: reg.f.uso ?? "pendente", copia, provavel });
  }
  return { linhas, gravados, semHash };
}

/* Fim de uso-hd.mjs */
