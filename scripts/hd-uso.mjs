/* hd-uso.mjs — raio-x do uso de cada arquivo do hd: o que já foi para a tela, o que foi fonte e o que falta decidir.
 *
 * Regra (relatório docs/processo/relatorios/uso-do-hd-2026-11-06.md): 100% usado = nenhum arquivo "pendente".
 * O uso fica em cada arquivo do content/acervo.json (campo `uso`, ver src/schemas/acervo.ts). Arquivo sem `uso` é pendente.
 * Cópias idênticas no hd têm o mesmo hash e seguem o uso do original.
 *
 * Uso (na raiz do learntech-content):
 *   node scripts/hd-uso.mjs                # resumo no terminal
 *   node scripts/hd-uso.mjs --aplicar      # grava no acervo o que dá para decidir sozinho (só em arquivo pendente):
 *                                          #   tecnico: extensões sem conteúdo (ico, tmp, lnk, iqy, h2d...);
 *                                          #   exibido: imagem igual (dHash até 5) a uma foto publicada na galeria de um evento que é destino do item.
 *   node scripts/hd-uso.mjs --relatorio    # grava docs/processo/relatorios/uso-do-hd-AAAA-MM-DD.md (sem nomes de arquivo)
 *   node scripts/hd-uso.mjs --hd <pasta>
 *
 * Depende de `npm run hd:inventariar` (hash) e, para imagens, de `npm run hd:imagens` (<hd>/.imagens-publicadas.json).
 * Sem dependências: só Node 20+.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(RAIZ, "content");
const ARQ_ACERVO = path.join(CONTENT, "acervo.json");
const argv = process.argv.slice(2);
const aplicar = argv.includes("--aplicar");
const relatorio = argv.includes("--relatorio");
const iHd = argv.indexOf("--hd");
const HD = path.resolve(iHd >= 0 ? argv[iHd + 1] : path.join(RAIZ, "..", "hd"));
const IGNORAR = new Set([".acervo-local.json", ".hash-cache.json", ".imagens-publicadas.json", "desktop.ini", "Thumbs.db", ".DS_Store"]);
const TECNICO = new Set(["ico", "tmp", "lnk", "iqy", "h2d", "map", "url", "ini", "db", "dsstore", "ds_store"]);
const IMAGEM = new Set(["jpg", "jpeg", "png", "webp"]);
const USADOS = new Set(["exibido", "fonte", "similar"]);
const ORDEM = ["exibido", "fonte", "similar", "tecnico", "bloqueado", "descartado", "pendente"];
const DIST_EXIBIDA = 5;
const DIST_PROVAVEL = 10;
/* Ícones e capturas do próprio site batem com qualquer imagem simples: não contam como publicação. */
const FALSO_POSITIVO = /favicon|android-chrome|apple-touch|og-image|[.]github[/]/;

if (!fs.existsSync(HD)) { console.error(`hd não encontrado em ${HD}`); process.exit(1); }
const ler = (p, padrao) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : padrao);
const acervo = ler(ARQ_ACERVO, { itens: [] });
const cache = ler(path.join(HD, ".hash-cache.json"), {});
const imagens = Object.fromEntries(Object.entries(ler(path.join(HD, ".imagens-publicadas.json"), { hd: {} }).hd).map(([k, v]) => [k.normalize("NFC"), v]));
const temImagens = fs.existsSync(path.join(HD, ".imagens-publicadas.json"));

function listar(pasta, base = pasta) {
  return fs.readdirSync(pasta, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(pasta, e.name);
    if (e.isDirectory()) return listar(p, base);
    if (IGNORAR.has(e.name)) return [];
    return [{ abs: p, rel: path.relative(base, p).split(path.sep).join("/").normalize("NFC") }];
  });
}

/* Hash → { item, arquivo } do acervo. */
const porHash = new Map();
for (const it of acervo.itens) for (const f of it.arquivos ?? []) porHash.set(f.sha256, { it, f });

/* Destino "projeto/recurso/id" existe no content/? */
const listaDe = (arq) => { const j = ler(path.join(CONTENT, arq), []); return Array.isArray(j) ? j : Object.values(j).find(Array.isArray) ?? []; };
const chaves = (arq) => new Set(listaDe(arq).flatMap((i) => [i.slug, i.id].filter((v) => v !== undefined).map(String)));
const pasta = (p) => new Set(fs.existsSync(path.join(CONTENT, p)) ? fs.readdirSync(path.join(CONTENT, p)).map((f) => f.replace(/\.json$/, "")) : []);
const RECURSOS = {
  "learn-tech/programas": pasta("learn-tech/programas"), "learn-tech/blog": chaves("learn-tech/paginas/blog.json"),
  "learn-tech/areas": chaves("learn-tech/areas.json"), "bootcamps/eventos": pasta("bootcamps/eventos"),
  "career/empresas": chaves("career/empresas.json"), "career/vagas": chaves("career/vagas.json"),
  "career/perfis": chaves("career/perfis.json"), "career/modelos-curriculo": chaves("career/modelos-curriculo.json"),
  "tools/ferramentas": chaves("tools/ferramentas.json"), "tools/hospedagens": chaves("tools/hospedagens.json"),
};
const existeDestino = (d) => { const p = d.split("/"); const rec = RECURSOS[`${p[0]}/${p[1]}`]; return rec ? rec.has(p.slice(2).join("/")) : null; };

/* Imagem do hd igual a uma foto da galeria de um evento: devolve o destino "bootcamps/eventos/<slug>". */
const destinoDaImagem = (pub) => { const m = pub?.match(/media\/bootcamps\/eventos\/([^/]+)\//); return m ? `bootcamps/eventos/${m[1]}` : null; };

const arquivos = listar(HD);
const linhas = [];
const vistos = new Set();
let semHash = 0;
let gravados = 0;
for (const a of arquivos) {
  const st = fs.statSync(a.abs);
  const sha = cache[`${a.rel}|${st.size}|${Math.round(st.mtimeMs)}`];
  if (!sha) { semHash++; continue; }
  const reg = porHash.get(sha);
  const ext = path.extname(a.rel).slice(1).toLowerCase().replace(/[^a-z0-9]/g, "") || "sem-extensao";
  const copia = vistos.has(sha);
  vistos.add(sha);
  if (!reg) { linhas.push({ a, ext, bytes: st.size, fora: true, copia }); continue; }
  const achada = IMAGEM.has(ext) ? imagens[a.rel] : null;
  const img = achada && !FALSO_POSITIVO.test(achada.publicada ?? "") ? achada : null;
  if (aplicar && !copia && (!reg.f.uso || reg.f.uso === "pendente")) {
    const dest = img && img.dist <= DIST_EXIBIDA ? destinoDaImagem(img.publicada) : null;
    if (TECNICO.has(ext)) { reg.f.uso = "tecnico"; gravados++; }
    else if (dest && reg.it.destinos.includes(dest)) { reg.f.uso = "exibido"; reg.f.destino = dest; gravados++; }
  }
  const provavel = img && img.dist <= DIST_PROVAVEL && (!reg.f.uso || reg.f.uso === "pendente");
  linhas.push({ a, ext, bytes: st.size, it: reg.it, uso: reg.f.uso ?? "pendente", copia, provavel });
}

if (aplicar && gravados) {
  acervo.atualizadoEm = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(ARQ_ACERVO, (JSON.stringify(acervo, null, 2) + "\n").replace(/\n/g, "\r\n"));
}

/* Contagens: arquivos únicos (sem as cópias), e as cópias à parte. */
const unicos = linhas.filter((l) => !l.copia && !l.fora);
const conta = (lista) => Object.fromEntries(ORDEM.map((u) => [u, lista.filter((l) => l.uso === u).length]));
const total = conta(unicos);
const copias = linhas.filter((l) => l.copia).length;
const fora = linhas.filter((l) => l.fora && !l.copia).length;
const usados = unicos.filter((l) => USADOS.has(l.uso)).length;
const pct = (n) => (unicos.length ? ((100 * n) / unicos.length).toFixed(1).replace(".", ",") : "0");

/* Por item. */
const porItem = new Map();
for (const l of unicos) {
  const p = porItem.get(l.it.id) ?? { it: l.it, n: 0, usos: {}, provaveis: 0 };
  p.n++; p.usos[l.uso] = (p.usos[l.uso] ?? 0) + 1; if (l.provavel) p.provaveis++;
  porItem.set(l.it.id, p);
}
const itens = [...porItem.values()].sort((a, b) => (b.usos.pendente ?? 0) - (a.usos.pendente ?? 0) || a.it.id.localeCompare(b.it.id));
const destinosQuebrados = [...new Set(itens.flatMap((p) => p.it.destinos))].filter((d) => existeDestino(d) === false);

const resumoUsos = ORDEM.map((u) => `${u} ${total[u]}`).join(" | ");
console.log(`hd: ${arquivos.length} arquivos (${unicos.length} únicos, ${copias} cópias idênticas${semHash ? `, ${semHash} sem hash` : ""}${fora ? `, ${fora} fora do acervo` : ""})`);
console.log(`  ${resumoUsos}`);
console.log(`  usados ${usados} (${pct(usados)}%) · pendentes ${total.pendente} (${pct(total.pendente)}%)${total.pendente ? "  <- precisa zerar" : ""}`);
if (aplicar) console.log(`  --aplicar: ${gravados} arquivo(s) marcados no acervo`);
if (!temImagens) console.log("  sem comparação de imagens: rode npm run hd:imagens");
if (semHash || fora) console.log("  há arquivos sem inventário: rode npm run hd:inventariar -- --registrar");
console.log("\nPor item (pendentes primeiro):");
for (const p of itens) {
  const usos = ORDEM.filter((u) => p.usos[u]).map((u) => `${u} ${p.usos[u]}`).join(" · ");
  console.log(`  ${p.it.id} [${p.it.estado}] ${String(p.n).padStart(4)}  ${usos}${p.provaveis ? ` · imagem provável a conferir ${p.provaveis}` : ""}`);
}
console.log(destinosQuebrados.length ? `\nDestinos que não existem no content/: ${destinosQuebrados.join(", ")}` : "\nTodos os destinos existem no content/.");

if (relatorio) {
  const hoje = new Date().toISOString().slice(0, 10);
  const n = (v) => v.toLocaleString("pt-BR");
  const md = [
    `# Uso do hd (${hoje.split("-").reverse().join("/")})`, "",
    "Gerado por `npm run hd:uso -- --relatorio`. Regra: 100% usado = nenhum arquivo pendente. Usos em `src/schemas/acervo.ts`.", "",
    "## Resumo", "",
    "| Medida | Arquivos |", "|---|---|",
    `| No hd | ${n(arquivos.length)} |`, `| Únicos (por hash) | ${n(unicos.length)} |`, `| Cópias idênticas (seguem o original) | ${n(copias)} |`,
    ...(fora ? [`| Fora do acervo | ${n(fora)} |`] : []),
    ...ORDEM.map((u) => `| ${u} | ${n(total[u])} |`),
    `| **Usados** (exibido, fonte, similar) | **${n(usados)} (${pct(usados)}%)** |`,
    `| **Pendentes** | **${n(total.pendente)} (${pct(total.pendente)}%)** |`, "",
    "## Por item", "",
    "| Item | Estado | Origem | Arquivos | Usos | Imagem provável |", "|---|---|---|---|---|---|",
    ...itens.map((p) => `| ${p.it.id} | ${p.it.estado} | \`${p.it.origem}\` | ${p.n} | ${ORDEM.filter((u) => p.usos[u]).map((u) => `${u} ${p.usos[u]}`).join(", ")} | ${p.provaveis || "–"} |`), "",
    "## Destinos", "",
    destinosQuebrados.length ? `Não existem no \`content/\`: ${destinosQuebrados.map((d) => `\`${d}\``).join(", ")}.` : "Todos os destinos dos itens existem no `content/`.", "",
  ].join("\n");
  const saida = path.join(RAIZ, "docs", "processo", "relatorios", `uso-do-hd-${hoje}.md`);
  fs.mkdirSync(path.dirname(saida), { recursive: true });
  fs.writeFileSync(saida, md);
  console.log(`\nRelatório: ${path.relative(RAIZ, saida)}`);
}

/* Fim de hd-uso.mjs */
