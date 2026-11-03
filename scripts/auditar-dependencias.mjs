/* auditar-dependencias.mjs — roda `npm audit` nos cinco repositórios e grava um resumo como evidência.
 * Uso (na raiz do learntech-content, depois de npm install nos projetos): npm run auditar
 * Saída: docs/engenharia/relatorios/auditoria-AAAA-MM-DD.md (vulnerabilidades por gravidade e pacotes afetados).
 * Meta do MVP: zero vulnerabilidades altas ou críticas em dependências de produção. */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPOS = ["learntech-content", "learn-tech", "bootcamps", "career", "tools"];
const linhas = [];
let pior = 0;

for (const repo of REPOS) {
  const dir = path.resolve(RAIZ, "..", repo);
  if (!fs.existsSync(path.join(dir, "package-lock.json"))) { linhas.push(`| ${repo} | sem package-lock.json (rode npm install) | | | | | |`); continue; }
  for (const escopo of ["produção", "todas"]) {
    const args = ["audit", "--json", ...(escopo === "produção" ? ["--omit=dev"] : [])];
    const r = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", args, { cwd: dir, encoding: "utf8", shell: process.platform === "win32" });
    let v = {}, pacotes = [];
    try {
      const j = JSON.parse(r.stdout || "{}");
      v = j.metadata?.vulnerabilities ?? {};
      pacotes = Object.entries(j.vulnerabilities ?? {}).filter(([, x]) => ["high", "critical"].includes(x.severity)).map(([n, x]) => `${n} (${x.severity})`);
    } catch { linhas.push(`| ${repo} | ${escopo} | erro ao ler a saída do npm audit | | | | |`); continue; }
    if (escopo === "produção") pior = Math.max(pior, (v.high ?? 0) + (v.critical ?? 0));
    linhas.push(`| ${repo} | ${escopo} | ${v.critical ?? 0} | ${v.high ?? 0} | ${v.moderate ?? 0} | ${v.low ?? 0} | ${pacotes.slice(0, 6).join(", ") || "-"} |`);
  }
}

const hoje = new Date().toISOString().slice(0, 10);
const destino = path.join(RAIZ, "docs", "engenharia", "relatorios", `auditoria-${hoje}.md`);
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, `# Auditoria de dependências, ${hoje}\n\nMeta: zero vulnerabilidades altas ou críticas em produção. Situação: ${pior === 0 ? "meta atingida" : `${pior} alta(s) ou crítica(s) em produção`}.\n\n| Repositório | Escopo | Crítica | Alta | Moderada | Baixa | Altas e críticas |\n|---|---|---|---|---|---|---|\n${linhas.join("\n")}\n\nCorreção: \`npm audit fix\` (sem --force) no repositório; o que exigir troca de versão maior vira tarefa no backlog.\n`);
console.log(`Resumo: ${path.relative(RAIZ, destino)}`);
process.exit(pior === 0 ? 0 : 1);

/* Fim de auditar-dependencias.mjs */
