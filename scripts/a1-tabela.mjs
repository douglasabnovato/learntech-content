/* a1-tabela.mjs — tabela do A1 a partir das propostas do triador (fase 1, issue #16).
 *
 * Uso (na raiz do learntech-content):
 *   node scripts/a1-tabela.mjs                # imprime a tabela em Markdown
 *   node scripts/a1-tabela.mjs --saida <arq>  # grava em arquivo (ex.: docs/processo/lotes/AAAA-MM-DD-a1.md)
 *   node scripts/a1-tabela.mjs --hd <pasta>   (ou --propostas <pasta> para outra pasta de propostas)
 * Lê <hd>/.extraido/propostas/*.json. Ficha com confiança abaixo de 0,7 vai para "Perguntas ao autor".
 * Sem nome de arquivo: só item, direitos, destinos e contagem por uso.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ORDEM } from "./lib/uso-hd.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const opc = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const HD = path.resolve(opc("--hd") ?? path.join(RAIZ, "..", "hd"));
const iP = argv.indexOf("--propostas");
const PASTA = iP >= 0 ? path.resolve(argv[iP + 1]) : path.join(HD, ".extraido", "propostas");
if (!fs.existsSync(PASTA)) { console.error(`sem propostas em ${PASTA}`); process.exit(1); }

const propostas = fs.readdirSync(PASTA).filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(PASTA, f), "utf8"))).sort((a, b) => a.id.localeCompare(b.id));
const contar = (p) => {
  const c = Object.fromEntries(ORDEM.map((u) => [u, 0]));
  for (const f of p.arquivos ?? []) c[f.uso ?? "pendente"] = (c[f.uso ?? "pendente"] ?? 0) + 1;
  return ORDEM.filter((u) => c[u]).map((u) => `${u} ${c[u]}`).join(", ") || "–";
};
const linha = (p) => `| ${p.id} | ${p.direitos} | ${p.estado} | ${(p.destinos ?? []).map((d) => `\`${d}\``).join("<br>") || "–"} | ${contar(p)} | ${p.triagem?.confianca ?? "–"} |`;
const cab = "| Item | Direitos | Estado | Destinos | Uso proposto | Confiança |\n|---|---|---|---|---|---|";
const certas = propostas.filter((p) => (p.triagem?.confianca ?? 0) >= 0.7);
const duvidas = propostas.filter((p) => (p.triagem?.confianca ?? 0) < 0.7);
const total = Object.fromEntries(ORDEM.map((u) => [u, propostas.reduce((s, p) => s + (p.arquivos ?? []).filter((f) => (f.uso ?? "pendente") === u).length, 0)]));

const md = [
  "# Tabela do A1",
  "",
  `${propostas.length} itens propostos pelo triador. Uso proposto, somando os arquivos: ${ORDEM.filter((u) => total[u]).map((u) => `${u} ${total[u]}`).join(", ") || "nenhum"}.`,
  "",
  "## Para aprovar",
  "",
  certas.length ? cab + "\n" + certas.map(linha).join("\n") : "Nenhum item.",
  "",
  "## Perguntas ao autor (confiança abaixo de 0,7)",
  "",
  duvidas.length ? cab + "\n" + duvidas.map(linha).join("\n") + "\n\n" + duvidas.map((p) => `- **${p.id}:** ${p.triagem?.justificativa ?? "sem justificativa"}`).join("\n") : "Nenhuma.",
  "",
].join("\n");

const saida = opc("--saida");
if (saida) { fs.writeFileSync(path.resolve(RAIZ, saida), md); console.log(`Tabela: ${saida}`); } else console.log(md);

/* Fim de a1-tabela.mjs */
