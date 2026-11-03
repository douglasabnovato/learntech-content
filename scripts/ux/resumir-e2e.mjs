/* resumir-e2e.mjs — transforma os relatórios do Playwright (fluxos, acessibilidade e capturas) num resumo em Markdown
   que fica no repositório como evidência: docs/engenharia/relatorios/e2e-AAAA-MM-DD.md. Uso: npm run ux:resumo */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REL = path.join(RAIZ, "e2e", "relatorios");
const ler = (f) => (fs.existsSync(path.join(REL, f)) ? JSON.parse(fs.readFileSync(path.join(REL, f), "utf8")) : null);

const linhas = [];
const resultado = ler("resultado.json");
if (resultado) {
  const testes = [];
  const andar = (suite, prefixo = "") => {
    for (const s of suite.suites ?? []) andar(s, prefixo + (s.title ? s.title + " › " : ""));
    for (const spec of suite.specs ?? []) for (const t of spec.tests) testes.push({ nome: prefixo + spec.title, projeto: t.projectName, status: t.results.at(-1)?.status ?? "?" });
  };
  andar(resultado);
  const por = (proj) => testes.filter((t) => t.projeto === proj);
  for (const proj of ["fluxos", "acessibilidade", "capturas"]) {
    const ts = por(proj);
    if (!ts.length) continue;
    linhas.push(`## ${proj}: ${ts.filter((t) => t.status === "passed").length}/${ts.length} passaram`, "");
    for (const t of ts.filter((t) => t.status !== "passed")) linhas.push(`- falhou: ${t.nome} (${t.status})`);
    linhas.push("");
  }
}
const a11y = ler("acessibilidade.json");
if (a11y) {
  linhas.push("## Violações de acessibilidade por página", "", "| Site | Página | Crítico | Sério | Moderado | Leve | Regras |", "|---|---|---|---|---|---|---|");
  for (const r of a11y) {
    const n = (i) => r.violacoes.filter((v) => v.impacto === i).length;
    linhas.push(`| ${r.site} | ${r.pagina} | ${n("critical")} | ${n("serious")} | ${n("moderate")} | ${n("minor")} | ${r.violacoes.map((v) => v.id).join(", ") || "-"} |`);
  }
  linhas.push("");
}
const hoje = new Date().toISOString().slice(0, 10);
const destino = path.join(RAIZ, "docs", "engenharia", "relatorios", `e2e-${hoje}.md`);
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, `# Testes de ponta a ponta, acessibilidade e responsividade, ${hoje}\n\n${linhas.join("\n") || "Sem relatórios em e2e/relatorios/. Rode npm run e2e antes."}\nCapturas em e2e/relatorios/capturas/ (não versionadas).\n`);
console.log(`Resumo: ${path.relative(RAIZ, destino)}`);

/* Fim de resumir-e2e.mjs */
