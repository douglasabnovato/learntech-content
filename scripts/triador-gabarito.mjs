/* triador-gabarito.mjs — mede o acerto do triador contra os itens já triados do acervo (fase 1, issue #16).
 *
 * Uso (na raiz do learntech-content):
 *   node scripts/triador-gabarito.mjs              # lê <hd>/.extraido/propostas/*.json e compara com content/acervo.json
 *   node scripts/triador-gabarito.mjs --relatorio  # grava docs/processo/relatorios/triador-gabarito-AAAA-MM-DD.md
 *   node scripts/triador-gabarito.mjs --hd <pasta>   (ou --propostas <pasta> para outra pasta de propostas)
 * Meta da fase 1: pelo menos 80% de acerto em direitos e em destinos. O relatório não tem nome de arquivo.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compararItem, resumir, META } from "./lib/gabarito.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const iHd = argv.indexOf("--hd");
const HD = path.resolve(iHd >= 0 ? argv[iHd + 1] : path.join(RAIZ, "..", "hd"));
const iP = argv.indexOf("--propostas");
const PASTA = iP >= 0 ? path.resolve(argv[iP + 1]) : path.join(HD, ".extraido", "propostas");
if (!fs.existsSync(PASTA)) { console.error(`sem propostas em ${PASTA} (rode o agente triador no modo gabarito)`); process.exit(1); }

const acervo = JSON.parse(fs.readFileSync(path.join(RAIZ, "content", "acervo.json"), "utf8"));
const porId = new Map(acervo.itens.map((i) => [i.id, i]));
const linhas = fs.readdirSync(PASTA).filter((f) => f.endsWith(".json")).flatMap((f) => {
  const p = JSON.parse(fs.readFileSync(path.join(PASTA, f), "utf8"));
  const item = porId.get(p.id);
  return item ? [compararItem(p, item)] : [];
}).sort((a, b) => a.id.localeCompare(b.id));

const r = resumir(linhas);
const pct = (v) => (v === null ? "–" : `${Math.round(v * 100)}%`);
const sim = (b) => (b ? "sim" : "não");
const tabela = [
  "| Item | Direitos | Destinos (comuns/propostos/certos) | Uso igual | Confiança |",
  "|---|---|---|---|---|",
  ...linhas.map((l) => `| ${l.id} | ${sim(l.direitosOk)} | ${sim(l.destinosOk)} (${l.comuns}/${l.propostos}/${l.certos}) | ${l.uso.comparados ? `${l.uso.iguais}/${l.uso.comparados}` : "–"} | ${l.confianca ?? "–"} |`),
].join("\n");
const resumo = `${r.itens} itens · direitos ${pct(r.direitos)} · destinos ${pct(r.destinos)} · uso por arquivo ${pct(r.uso)} · meta ${pct(META)}: ${r.aprovado ? "atingida" : "não atingida"}`;
console.log(resumo + "\n\n" + tabela);

if (argv.includes("--relatorio")) {
  const hoje = new Date().toISOString().slice(0, 10);
  const [a, m, d] = hoje.split("-");
  const md = `# Triador contra o gabarito (${d}/${m}/${a})\n\nGerado por \`npm run triador:gabarito -- --relatorio\`. O triador leu só o material extraído e as regras, sem o \`acervo.json\`. A proposta de cada item foi comparada com a ficha que o acervo já tem.\n\n**${resumo}**\n\n${tabela}\n\nRegras de acerto: \`scripts/lib/gabarito.mjs\`.\n`;
  const arq = path.join(RAIZ, "docs", "processo", "relatorios", `triador-gabarito-${hoje}.md`);
  fs.writeFileSync(arq, md);
  console.log(`\nRelatório: ${path.relative(RAIZ, arq)}`);
}
if (!r.aprovado) process.exitCode = 1;

/* Fim de triador-gabarito.mjs */
