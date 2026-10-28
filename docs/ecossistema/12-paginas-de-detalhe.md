# Páginas de detalhe no career, no tools e no bootcamps (28/10/2026)

## 1. O que mudou

Antes, o clique no card do career e do tools levava direto ao site oficial. Agora, **um item que tem `detalhe` na API abre uma página própria**. Ela mostra:
- texto, imagens e vídeo do YouTube;
- o botão para o site oficial;
- as redes e as fontes.

**Um item sem `detalhe` continua indo ao site oficial.** Nada quebra; as páginas crescem conforme houver conteúdo de qualidade.

| Projeto | O que foi feito | Arquivos |
|---|---|---|
| API | Campos opcionais `slug` e `detalhe` (resumo, parágrafos, imagens, vídeo do YouTube, links, fontes, data) nas listas do career e do tools; o build acusa slug repetido e detalhe sem slug; 3 testes novos | `src/schemas/career-tools.ts`, `scripts/lib/conteudo.ts`, `tests/conteudo.test.ts` |
| tools | Página `detalhe.html?id=<slug>`, card que abre o detalhe quando ele existe, CSS próprio e resolução de `/media/` nas imagens | `detalhe.html`, `js/detalhe.js`, `css/detalhe.css`, `js/renderer.js`, `js/api.js`, `Readme.md` |
| career | Página `detalhe.html?tipo=empresas\|vagas\|perfis&id=<slug>`, card que abre o detalhe (a janela da BRQ continua igual), "Voltar" para a seção de origem | `detalhe.html`, `js/detalhe.js`, `css/detalhe.css`, `js/app.js`, `js/api.js`, `js/catalog.js`, `Readme.md` |
| bootcamps | A página de evento já tinha tudo. Só corrigi o botão "site oficial", que não aparece mais quando o link está vazio (antes recarregava a página: Startup Way e SMC 2012) | `src/pages/detail/Detail.tsx` |
| conteúdo | 12 itens com detalhe | `content/tools/ferramentas.json`, `content/career/empresas.json`, `content/career/vagas.json`, `media/tools/detalhe/`, `media/career/detalhe/` |

**Itens com página de detalhe:**
- **tools:** Microsoft Excel, Google Planilhas, GLPI, CryptoJS, Salesforce Marketing Cloud, GitHub (com vídeo), Figma (com vídeo);
- **career, empresas:** Pitang (com vídeo), Le Wagon, Digital House, Netuno;
- **career, vagas:** Santander Open Academy.

## 2. Verificação feita

Rodei o career e o tools num Chromium automático, ligados a uma cópia da API, em 1366 px e em 390 px. A cópia servia os mesmos arquivos de `content/` e `media/`.

| Verificação | Resultado |
|---|---|
| Card do Figma no tools | Abre `detalhe.html?id=figma` |
| Card sem detalhe (Balsamiq) | Continua indo a `https://balsamiq.cloud/` |
| Detalhe de Figma, GitHub e CryptoJS | Título, imagens e vídeo (quando existe) corretos; a galeria carrega ao rolar |
| Detalhe inexistente | "Ferramenta não encontrada" / "Página não encontrada" |
| Cards de Pitang, Le Wagon, Digital House, Netuno e Santander no career | Abrem `detalhe.html?tipo=...&id=...` |
| Detalhe da Pitang | Texto, imagem, vídeo, 7 links oficiais, fontes e data (print revisado) |
| Erros no console | Nenhum das páginas; só os do iframe do YouTube, que não carrega no ambiente de teste, sem internet |

**Faltou rodar:**
- `npm run verificar` da API: build oficial com Zod e testes;
- o bootcamps no `npm run dev`;
- os sites com a API real.

## 3. Decisões que o Douglas pode mudar

| # | Decisão | Onde mudar |
|---|---|---|
| 1 | **Os detalhes vêm só da API.** Os dados locais dos sites não têm `detalhe`; sem API, os cards abrem o site oficial | — |
| 2 | **No tools, o card só vira "detalhe" se a API responder em até 2,5 s** (regra que já existia); a página de detalhe espera até 5 s | `tools/main.js`, `tools/js/api.js` |
| 3 | O cabeçalho do detalhe **não tem busca**; no career o menu vira links que voltam ao index na seção escolhida | `detalhe.html` dos dois sites |
| 4 | Galeria em proporção 16:10 com recorte; logos estreitos podem ser cortados | `css/detalhe.css` |
| 5 | Vídeos incorporados pelo domínio `youtube-nocookie` | `js/detalhe.js` |
| 6 | Título do vídeo fixo: "Vídeo sobre <título>" | `career/js/detalhe.js` |
| 7 | Em textos secundários, contraste reforçado em relação aos cards (para passar de 4,5:1) | `css/detalhe.css` |
| 8 | Capas dos detalhes geradas com `scripts/gerar-capa.py` e legenda "Ilustração própria do LearnTECH." | `content/*` |
| 9 | **Digital House:** a Digital House Brasil hoje é a Rocketseat. O `site_url` virou a página oficial do comunicado (`landing.digitalhouse.com/rocketseat-digitalhouse`), e o texto explica a mudança | `content/career/empresas.json` |
| 10 | Salesforce Marketing Cloud: o texto cita o nome novo "Agentforce Marketing"; o título continua o antigo | `content/tools/ferramentas.json` |
| 11 | Datas que envelhecem: Pitang Transforma 2025 e o ranking GPTW 2026 | `content/career/empresas.json` |
| 12 | Um revisor rodou por engano um `git diff --stat` (só leitura) no career; está registrado em `career/docs/claudeia/03-registro.md` | — |

## 4. Pontos de atenção

1. **Documentos internos em repositório.** `01-inventario-documentos.md` lista nomes de arquivos do `hd`, que incluem nomes de empresas e de um cliente. Se o repositório do learntech-content for **público**, mova `docs/ecossistema/` para fora dele ou anonimize esses nomes antes do push.
2. **A BRQ não está na API.** A janela de detalhe dela é local. Migrá-la para o novo `detalhe` unificaria o career; ainda é só proposta.
3. **Profissionais (perfis).** Nenhum tem detalhe ainda. O `hd` quase não tem material para isso (`11-mapa-editorial.md`, seção 4).

## 5. Comandos

```powershell
# API
cd C:\douglasabnovato-github\mundo-learn-tech\learntech-content
npm run verificar

# Ver tudo na máquina: 08-piloto-codexperience.md, seção 4, e o passo a passo dos cinco projetos.
# career e tools: lembre de voltar o js/config.js ao valor original antes do commit.
```

Commits, um por projeto, na branch `feature/conteudo-2026-10-28` (ou `feature/detalhe-2026-10-28`):
- **learntech-content:** `content`, `media`, `scripts`, `src`, `tests`, `docs/ecossistema`;
- **tools:** `detalhe.html`, `js`, `css`, `Readme.md`, `docs`;
- **career:** `detalhe.html`, `js`, `css`, `Readme.md`, `docs`;
- **bootcamps:** `src/pages/detail/Detail.tsx`.
