/* progresso.mjs — placar de 0 a 100 do que foi mapeado e do que está feito no ecossistema.
 *
 * 0 = nada do que mapeamos foi feito; 100 = tudo feito. O placar é calculado a partir de dados do repositório,
 * nunca estimado à mão. Componentes e pesos:
 *   - Conteúdo do acervo (45): itens fechados / todos os itens (fechado = publicado ou referência, com destino e sem pendências).
 *   - Engenharia do MVP (30): itens [x] / todos em docs/engenharia/backlog.md.
 *   - Pendências do autor (15): concluídas / (concluídas + em aberto) em PROXIMOS-PASSOS.md.
 *   - Publicação (10): repositórios com a main local igual à remota e sem alterações pendentes.
 *
 * Uso: node scripts/progresso.mjs     (rode na raiz do learntech-content; os sites ficam na pasta vizinha)
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PESOS = { conteudo: 45, engenharia: 30, autor: 15, publicacao: 10 };
const REPOS = ["learntech-content", "learn-tech", "bootcamps", "career", "tools"];

const acervo = JSON.parse(fs.readFileSync(path.join(RAIZ, "content", "acervo.json"), "utf8")).itens;
const fechado = (i) => ["publicado", "referencia"].includes(i.estado) && i.destinos.length > 0 && !i.pendencias?.length;
const porLote = {};
for (const i of acervo) { porLote[i.lote] ??= [0, 0]; porLote[i.lote][1]++; if (fechado(i)) porLote[i.lote][0]++; }
const conteudo = acervo.filter(fechado).length / acervo.length;

const backlog = fs.readFileSync(path.join(RAIZ, "docs", "engenharia", "backlog.md"), "utf8");
const feitos = (backlog.match(/^- \[x\]/gim) ?? []).length;
const total = (backlog.match(/^- \[[ x]\]/gim) ?? []).length;
const engenharia = total ? feitos / total : 0;

const passos = fs.readFileSync(path.join(RAIZ, "PROXIMOS-PASSOS.md"), "utf8");
const [aberto = "", concluido = ""] = passos.split(/^## Concluídas/m);
const abertas = (aberto.match(/^\d+\. /gm) ?? []).length;
const concluidas = (concluido.match(/^- /gm) ?? []).length;
const autor = abertas + concluidas ? concluidas / (abertas + concluidas) : 1;

const git = (repo, cmd) => { try { return execSync(`git -C "${path.resolve(RAIZ, "..", repo)}" ${cmd}`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return null; } };
const estados = REPOS.map((r) => {
  const limpo = git(r, "status --porcelain") === "";
  const main = git(r, "rev-parse main"), remota = git(r, "rev-parse origin/main");
  return { r, limpo, sincronizado: main !== null && main === remota, branch: git(r, "branch --show-current"), ultimo: git(r, 'log -1 --format="%h %s (%cr)" main') };
});
const publicacao = estados.filter((e) => e.limpo && e.sincronizado).length / REPOS.length;

const pct = (x) => `${Math.round(x * 100)}%`;
const placar = Math.round(conteudo * PESOS.conteudo + engenharia * PESOS.engenharia + autor * PESOS.autor + publicacao * PESOS.publicacao);
console.log(`PLACAR: ${placar}/100\n`);
console.log(`Conteúdo do acervo   ${pct(conteudo).padStart(4)}  (peso ${PESOS.conteudo})  ${acervo.filter(fechado).length}/${acervo.length} itens fechados`);
for (const [l, [f, t]] of Object.entries(porLote)) console.log(`   lote ${l}: ${f}/${t}`);
console.log(`Engenharia do MVP    ${pct(engenharia).padStart(4)}  (peso ${PESOS.engenharia})  ${feitos}/${total} itens do backlog`);
console.log(`Pendências do autor  ${pct(autor).padStart(4)}  (peso ${PESOS.autor})  ${concluidas} concluídas, ${abertas} em aberto`);
console.log(`Publicação           ${pct(publicacao).padStart(4)}  (peso ${PESOS.publicacao})`);
for (const e of estados) console.log(`   ${e.r.padEnd(18)} ${e.sincronizado ? "main = GitHub" : "main ≠ GitHub"} | ${e.limpo ? "limpo" : "com alterações"} | ${e.branch} | ${e.ultimo}`);

/* Fim de progresso.mjs */
