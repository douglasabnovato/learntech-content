/* verificar-links.mjs — confere os links externos do conteúdo (issue #7).
 *
 * Varre content/{learn-tech,bootcamps,career,tools}/**.json, junta todas as URLs (em qualquer campo:
 * links, fontes, sources, capas, textos) e testa cada uma uma vez só, com HEAD e, se o servidor
 * recusar o HEAD, com GET.
 *
 *   erro  → 404, 410 ou domínio inexistente: o link quebrou e precisa de troca.
 *   aviso → 401, 403, 429, 5xx, tempo esgotado ou domínio que bloqueia robôs: precisa de conferência humana,
 *           mas não reprova (muitos sites recusam robôs e funcionam no navegador).
 *   ok    → 2xx ou 3xx.
 *
 * Uso:
 *   npm run links                         resumo no terminal
 *   npm run links -- --relatorio          grava docs/engenharia/relatorios/links-AAAA-MM-DD.md
 *   npm run links -- --saida arquivo.md   grava o relatório nesse caminho (usado pelo workflow semanal)
 *   npm run links -- --estrito            sai com código 1 se houver erro
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { hojeLocal } from "./lib/data-local.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROJETOS = ["learn-tech", "bootcamps", "career", "tools"];

/* Domínios de exemplo ou que não são links de conteúdo. */
const IGNORADOS = /^(localhost|127\.0\.0\.1|(.+\.)?example\.(com|org|net))$/;

/* Empresas fictícias dos exercícios (CRM e e-mail transacional nos programas 1101, 1105 e 1107). */
const FICTICIOS = ["construirmais.com.br"];

/** URL de exercício ou modelo, não de referência: host sem ponto, TLD de exemplo, marcador de template ou placeholder. */
export function ehExemplo(url) {
  const host = hostDe(url);
  if (!host || IGNORADOS.test(host) || !host.includes(".")) return true;
  if (/\.(exemplo|example|test|invalid|local)$/.test(host) || host.includes("exemplo")) return true;
  if (FICTICIOS.some((d) => casaDominio(host, d))) return true;
  return /\{\{|%%|SEU_|seu-usuario|<|\$\{/.test(url);
}

/* Domínios que bloqueiam robôs ou exigem login: qualquer falha vira aviso, nunca erro. */
export const BLOQUEIAM_ROBOS = [
  "w3schools.com",
  "linkedin.com",
  "instagram.com",
  "facebook.com",
  "x.com",
  "twitter.com",
  "medium.com",
  "udemy.com",
  "glassdoor.com.br",
  "glassdoor.com",
  "indeed.com",
  "sympla.com.br",
  "reclameaqui.com.br",
  "tiktok.com",
];

const TEMPO_LIMITE_MS = 15000;
const CONCORRENCIA = 8;
const AGENTE = "Mozilla/5.0 (compatible; learntech-links/1.0; verificador de links do conteúdo)";

/** Percorre um valor JSON e devolve [{ url, caminho }] de toda URL http(s) achada, inclusive dentro de textos. */
export function extrairLinks(valor, caminho = "$") {
  if (typeof valor === "string") {
    return [...valor.matchAll(/https?:\/\/[^\s"'<>()\]]+/g)].map((m) => ({ url: m[0].replace(/[.,;:!?]+$/, ""), caminho }));
  }
  if (Array.isArray(valor)) return valor.flatMap((item, i) => extrairLinks(item, `${caminho}[${i}]`));
  if (valor && typeof valor === "object") return Object.entries(valor).flatMap(([k, v]) => extrairLinks(v, `${caminho}.${k}`));
  return [];
}

const hostDe = (url) => {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
};

const casaDominio = (host, dominio) => host === dominio || host.endsWith(`.${dominio}`);

/** Classifica o resultado de uma URL em ok, aviso ou erro. `status` é o HTTP ou null; `falha` é o código do erro de rede. */
export function classificar(url, { status = null, falha = null } = {}) {
  const host = hostDe(url) ?? "";
  const bloqueia = BLOQUEIAM_ROBOS.some((d) => casaDominio(host, d));
  if (status !== null && status >= 200 && status < 400) return "ok";
  if (falha === "ENOTFOUND" && !bloqueia) return "erro";
  if ((status === 404 || status === 410) && !bloqueia) return "erro";
  return "aviso";
}

/** Lê os JSON de content/ e devolve Map<url, [{ arquivo, caminho }]>. */
export function coletarLinks(raiz = RAIZ) {
  const mapa = new Map();
  for (const projeto of PROJETOS) {
    const pasta = path.join(raiz, "content", projeto);
    if (!fs.existsSync(pasta)) continue;
    for (const nome of fs.readdirSync(pasta, { recursive: true })) {
      if (!String(nome).endsWith(".json")) continue;
      const arquivo = path.posix.join("content", projeto, String(nome).replaceAll("\\", "/"));
      const dados = JSON.parse(fs.readFileSync(path.join(raiz, arquivo), "utf8"));
      for (const { url, caminho } of extrairLinks(dados)) {
        if (ehExemplo(url)) continue;
        if (!mapa.has(url)) mapa.set(url, []);
        mapa.get(url).push({ arquivo, caminho });
      }
    }
  }
  return mapa;
}

async function requisitar(url, metodo) {
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);
  try {
    const resposta = await fetch(url, { method: metodo, redirect: "follow", signal: controle.signal, headers: { "user-agent": AGENTE } });
    await resposta.body?.cancel();
    return { status: resposta.status };
  } catch (e) {
    const codigo = e?.cause?.code ?? (e?.name === "AbortError" ? "TEMPO_ESGOTADO" : (e?.code ?? "FALHA_DE_REDE"));
    return { falha: codigo };
  } finally {
    clearTimeout(relogio);
  }
}

export async function testar(url) {
  let resultado = await requisitar(url, "HEAD");
  /* Muitos servidores recusam ou tratam mal o HEAD: confirma com GET antes de reclamar. */
  if (resultado.falha || resultado.status >= 400) resultado = await requisitar(url, "GET");
  return { ...resultado, situacao: classificar(url, resultado) };
}

async function emParalelo(itens, limite, fn) {
  const saida = new Array(itens.length);
  let proximo = 0;
  const trabalhadores = Array.from({ length: Math.min(limite, itens.length) }, async () => {
    while (proximo < itens.length) {
      const i = proximo++;
      saida[i] = await fn(itens[i], i);
    }
  });
  await Promise.all(trabalhadores);
  return saida;
}

export function montarRelatorio(resultados, data = hojeLocal()) {
  const por = (s) => resultados.filter((r) => r.situacao === s);
  const [erros, avisos, oks] = [por("erro"), por("aviso"), por("ok")];
  const descrever = (r) => r.status ?? r.falha;
  const linhas = (lista) =>
    lista
      .sort((a, b) => a.usos[0].arquivo.localeCompare(b.usos[0].arquivo))
      .map((r) => `| ${descrever(r)} | ${r.url} | ${[...new Set(r.usos.map((u) => `\`${u.arquivo}\``))].join(", ")} |`);
  const tabela = (lista) => (lista.length ? ["| Status | URL | Arquivo |", "|---|---|---|", ...linhas(lista)].join("\n") : "Nenhum.");
  return [
    `# Links do conteúdo: ${data}`,
    "",
    "Gerado por `npm run links` (`scripts/verificar-links.mjs`, issue #7).",
    "",
    `**${resultados.length} URLs únicas**: ${oks.length} ok, ${avisos.length} avisos e ${erros.length} erros.`,
    "",
    "## Erros (404, 410 ou domínio inexistente): trocar o link",
    "",
    tabela(erros),
    "",
    "## Avisos (bloqueio de robô, 403, 429, 5xx ou tempo esgotado): conferir no navegador",
    "",
    tabela(avisos),
    "",
  ].join("\n");
}

async function principal(args) {
  const mapa = coletarLinks();
  const urls = [...mapa.keys()];
  console.log(`verificando ${urls.length} URLs únicas de content/ ...`);
  const resultados = await emParalelo(urls, CONCORRENCIA, async (url) => ({ url, usos: mapa.get(url), ...(await testar(url)) }));
  const relatorio = montarRelatorio(resultados);

  const iSaida = args.indexOf("--saida");
  const destino =
    iSaida >= 0
      ? args[iSaida + 1]
      : args.includes("--relatorio")
        ? path.join(RAIZ, "docs/engenharia/relatorios", `links-${hojeLocal()}.md`)
        : null;
  if (destino) {
    fs.writeFileSync(destino, relatorio);
    console.log(`relatório: ${path.relative(process.cwd(), destino)}`);
  }

  const conta = (s) => resultados.filter((r) => r.situacao === s).length;
  const erros = conta("erro");
  for (const r of resultados.filter((x) => x.situacao === "erro"))
    console.log(`✖ ${r.status ?? r.falha}  ${r.url}  (${r.usos[0].arquivo})`);
  console.log(`${erros ? "✖" : "✔"} ${conta("ok")} ok, ${conta("aviso")} avisos, ${erros} erros`);
  if (args.includes("--estrito") && erros) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await principal(process.argv.slice(2));
}
