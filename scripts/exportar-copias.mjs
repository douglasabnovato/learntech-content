/* exportar-copias.mjs — gera a cópia de reserva (fallback) de cada site a partir de content/.
 *
 * A API é a única fonte de conteúdo. Cada site guarda uma cópia local para quando a API não responde;
 * essa cópia NÃO deve ser editada à mão: rode este script depois de mudar content/ e faça o commit
 * dos arquivos gerados em cada site.
 *
 * Uso (na raiz do learntech-content, com os sites como pastas irmãs em mundo-learn-tech/):
 *   npm run copias           # gera
 *   npm run copias:conferir  # só confere se as cópias estão em dia (sai com erro se não)
 *
 * Regras:
 * - Caminhos /media/... viram URL absoluta da API (API_PUBLICA), porque o site não serve /media.
 * - O campo `detalhe` fica fora da cópia: sem API, o card abre o site oficial (a página de detalhe exige a API).
 * - Eventos e catálogo de programas saem de montarRecursos, o mesmo do build: relacionados chegam com
 *   título e URL prontos, e o catálogo traz os mesmos campos de /v1/learn-tech/programas.json (inclusive status).
 * - Roda com tsx (devDependency do build), porque importa scripts/lib/conteudo.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { carregarConteudo, montarRecursos } from "./lib/conteudo.ts";

const API_PUBLICA = "https://learntech-content.douglasabnovato.workers.dev";
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITES = path.resolve(RAIZ, "..");
const CONTENT = path.join(RAIZ, "content");
const conferir = process.argv.includes("--conferir");

const ler = (rel) => JSON.parse(fs.readFileSync(path.join(CONTENT, rel), "utf8"));

/* Troca /media/... pela URL absoluta da API, em qualquer profundidade. */
function absolutizar(valor) {
  if (typeof valor === "string") return valor.startsWith("/media/") ? API_PUBLICA + valor : valor;
  if (Array.isArray(valor)) return valor.map(absolutizar);
  if (valor && typeof valor === "object") return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, absolutizar(v)]));
  return valor;
}

/* Remove a página de detalhe (e o slug que só serve a ela) da cópia local. */
const semDetalhe = (lista) => lista.map(({ detalhe, slug, ...resto }) => resto);

const CABECALHO = (fonte) =>
  `/* GERADO por learntech-content/scripts/exportar-copias.mjs a partir de ${fonte}.\n` +
  `   Não edite à mão: mude o conteúdo na API e rode o script de novo. */\n\n`;

const json = (v) => JSON.stringify(v, null, 2);

/* Cada saída: site, arquivo relativo ao site e conteúdo gerado. */
function saidas() {
  const r = [];
  const tools = (nome, fonte, lista) => r.push({ site: "tools", arquivo: `data/${nome}.js`, texto: CABECALHO(fonte) + `export const ${nome === "tools" ? "toolsList" : "hostsList"} = ${json(absolutizar(semDetalhe(lista)))};\n` });
  tools("tools", "content/tools/ferramentas.json", ler("tools/ferramentas.json"));
  tools("host", "content/tools/hospedagens.json", ler("tools/hospedagens.json"));

  const career = (arquivo, nome, fonte, valor) => r.push({ site: "career", arquivo, texto: CABECALHO(fonte) + `export const ${nome} = ${json(valor)};\n` });
  career("js/good-companies.js", "companies", "content/career/empresas.json", absolutizar(semDetalhe(ler("career/empresas.json"))));
  career("js/jobs.js", "jobs", "content/career/vagas.json", absolutizar(semDetalhe(ler("career/vagas.json"))));
  career("js/perfis-dev.js", "profiles", "content/career/perfis.json", absolutizar(semDetalhe(ler("career/perfis.json"))));
  career("js/destaques.js", "destaques", "content/career/destaques.json", ler("career/destaques.json"));
  if (fs.existsSync(path.join(CONTENT, "career/modelos-curriculo.json"))) {
    career("js/curriculos.js", "curriculos", "content/career/modelos-curriculo.json", absolutizar(ler("career/modelos-curriculo.json")));
  }

  const { conteudo, erros } = carregarConteudo(CONTENT);
  if (erros.length) throw new Error(`content/ inválido, rode npm run validar:\n${erros.join("\n")}`);
  const recursos = montarRecursos(conteudo);
  const recurso = (caminho) => recursos.find((x) => x.caminho === caminho).dados;

  const eventos = [...recurso("bootcamps/eventos.json")].sort((a, b) => Number(a.id) - Number(b.id));
  r.push({
    site: "bootcamps",
    arquivo: "src/entities/event/api/events.data.ts",
    texto: CABECALHO("content/bootcamps/eventos/*.json") + `import type { BootcampEvent } from "../model/types";\n\nexport const events: BootcampEvent[] = ${json(absolutizar(eventos))};\n`,
  });

  const blog = ler("learn-tech/paginas/blog.json").itens;
  r.push({ site: "learn-tech", arquivo: "src/constants/blogData.js", texto: CABECALHO("content/learn-tech/paginas/blog.json") + `const blogData = ${json(absolutizar(blog))};\n\nexport default blogData;\n` });
  /* Catálogo de programas do learn-tech (só os campos de card, como /v1/learn-tech/programas.json):
     completa a reserva manual programsData.js com os programas novos, para listas e cards funcionarem sem API. */
  const catalogo = [...recurso("learn-tech/programas.json")].sort((a, b) => a.id - b.id);
  r.push({ site: "learn-tech", arquivo: "src/constants/programasCatalogo.js", texto: CABECALHO("content/learn-tech/programas/*.json") + `const programasCatalogo = ${json(absolutizar(catalogo))};\n\nexport default programasCatalogo;\n` });

  /* Apresentação do learn-tech (/conheca): reserva local da página quando a API não responde (issue #21). */
  r.push({ site: "learn-tech", arquivo: "src/constants/conhecaData.js", texto: CABECALHO("content/learn-tech/paginas/conheca.json") + `const conhecaData = ${json(ler("learn-tech/paginas/conheca.json"))};\n\nexport default conhecaData;\n` });

  /* Categorias do learn-tech: ícones vão por nome ("FaCode"); o site hidrata com src/constants/icones.js. */
  const categorias = ler("learn-tech/paginas/categorias.json").itens;
  r.push({ site: "learn-tech", arquivo: "src/constants/categoriesData.js", texto: CABECALHO("content/learn-tech/paginas/categorias.json") + `const categoriesData = ${json(absolutizar(categorias))};\n\nexport default categoriesData;\n` });

  /* Trilhas por objetivo (learn-tech#132): reserva local da página /trilhas. */
  r.push({ site: "learn-tech", arquivo: "src/constants/trilhasData.js", texto: CABECALHO("content/learn-tech/paginas/trilhas.json") + `const trilhasData = ${json(ler("learn-tech/paginas/trilhas.json"))};

export default trilhasData;
` });

  if (fs.existsSync(path.join(CONTENT, "learn-tech/areas.json"))) {
    r.push({ site: "learn-tech", arquivo: "src/constants/areasData.js", texto: CABECALHO("content/learn-tech/areas.json") + `const areasData = ${json(absolutizar(ler("learn-tech/areas.json")))};\n\nexport default areasData;\n` });
  }
  return r;
}

let divergentes = 0;
for (const s of saidas()) {
  const destino = path.join(SITES, s.site, s.arquivo);
  if (!fs.existsSync(path.join(SITES, s.site))) { console.warn(`- ${s.site}: pasta não encontrada, pulei`); continue; }
  const texto = s.texto.replace(/\r?\n/g, "\r\n");
  const atual = fs.existsSync(destino) ? fs.readFileSync(destino, "utf8") : "";
  if (atual.replace(/\r\n/g, "\n") === texto.replace(/\r\n/g, "\n")) { console.log(`= ${s.site}/${s.arquivo} (em dia)`); continue; }
  if (conferir) { console.log(`x ${s.site}/${s.arquivo} desatualizado`); divergentes++; continue; }
  fs.writeFileSync(destino, texto);
  console.log(`+ ${s.site}/${s.arquivo}`);
}
if (conferir && divergentes) { console.error(`${divergentes} cópia(s) desatualizada(s): rode npm run copias`); process.exit(1); }

/* Fim de exportar-copias.mjs */
