/* build.ts — valida content/ e gera dist/ (JSON versionado em /v1, mídia em /media e arquivos de public/). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { carregarConteudo, verificarIntegridade, montarRecursos } from "./lib/conteudo";
import { gerarOpenApi } from "./lib/openapi";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(RAIZ, "dist");

/* Grava um JSON compacto criando as pastas necessárias. */
function gravar(rel: string, dados: unknown): number {
  const destino = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  const texto = JSON.stringify(dados);
  fs.writeFileSync(destino, texto);
  return texto.length;
}

/* Executa validação e, se não houver erro, a geração completa. */
function main(): void {
  const somenteValidar = process.argv.includes("--somente-validar");
  const versao = JSON.parse(fs.readFileSync(path.join(RAIZ, "package.json"), "utf8")).version as string;

  const { conteudo, erros } = carregarConteudo(path.join(RAIZ, "content"));
  erros.push(...verificarIntegridade(conteudo, path.join(RAIZ, "media")));
  if (erros.length > 0) {
    console.error(`✖ ${erros.length} problema(s) no conteúdo:\n  - ${erros.join("\n  - ")}`);
    process.exit(1);
  }
  console.log(`✔ conteúdo válido: ${conteudo.programas.length} programas, ${conteudo.eventos.length} eventos, ${conteudo.ferramentas.length} ferramentas, ${conteudo.empresas.length} empresas`);
  if (somenteValidar) return;

  fs.rmSync(DIST, { recursive: true, force: true });
  const recursos = montarRecursos(conteudo);
  let bytes = 0;
  for (const r of recursos) bytes += gravar(`v1/${r.caminho}`, r.dados);

  gravar("v1/openapi.json", gerarOpenApi(versao));
  gravar("v1/index.json", {
    nome: "LearnTECH Content API",
    versao,
    geradoEm: new Date().toISOString(),
    documentacao: "/v1/openapi.json",
    recursos: recursos
      .filter((r) => !/\/(programas|eventos)\/[^/]+\.json$/.test(r.caminho))
      .map((r) => ({ caminho: `/v1/${r.caminho}`, descricao: r.descricao, itens: Array.isArray(r.dados) ? r.dados.length : undefined })),
  });

  fs.cpSync(path.join(RAIZ, "media"), path.join(DIST, "media"), { recursive: true });
  fs.cpSync(path.join(RAIZ, "public"), DIST, { recursive: true });
  console.log(`✔ dist/ gerado: ${recursos.length + 2} recursos JSON (${Math.round(bytes / 1024)} KB) + mídia + public/`);
}

main();

/* Fim de build.ts */
