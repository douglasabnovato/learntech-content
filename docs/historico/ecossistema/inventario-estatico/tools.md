# Inventário de conteúdo estático do site tools (28/10/2026)

Somente leitura. Raiz: `mundo-learn-tech` (branch feature/tasks-28-10-2026). Comparado: `tools/data/tools.js`, `tools/data/host.js`, `tools/index.html`, `tools/detalhe.html`, `tools/main.js`, `tools/js/*.js`, `tools/assets/` contra `learntech-content/content/tools/ferramentas.json` e `hospedagens.json` (schema `src/schemas/career-tools.ts`, `ferramentaSchema`).
Não revisa o conteúdo que já está na API (a revisão editorial existe em `learntech-content/docs/ecossistema/revisao/tools.md`); aqui só se aponta o que acrescentar ou tirar do site.

## 1. Como o site funciona hoje

- **Catálogo (`index.html` + `main.js` + `js/renderer.js`)**: HTML/CSS/JS puro, sem build. Uma página com duas abas (Ferramentas, Hospedagens), chips de categoria gerados a partir do campo `category` dos itens (com contagem), busca sem acento (`js/utils.js`), paginação 12 em 12, estado na URL `?s=&c=&q=`, tema claro/escuro em `localStorage` (`tools:theme`).
- **Consumo da API (`main.js`)**: `main.js` importa SEMPRE `data/tools.js` e `data/host.js` (cópia local) e, em paralelo, chama `GET {API_URL}/v1/tools/ferramentas.json` e `/v1/tools/hospedagens.json` (`js/api.js`, `buscarRecurso`, com AbortController de 5 s). `esperarAte(carregarCatalogo(), 2500)` faz uma corrida contra 2,5 s:
  - API respondeu em até 2,5 s, as duas listas não vazias e todo item com `title` e `site_url` (`listaValida`) -> usa a API; `resolverMidia` troca `/media/...` por URL completa (thumb e `detalhe.imagens`).
  - API falhou, formato inesperado, `API_URL` vazio/placeholder ou passou de 2,5 s -> `createApp` recebe a cópia local. A resposta que chegar depois (até o limite de 5 s do fetch) é **descartada**: não há re-renderização nem cache. Não há aviso visual, só `console.warn` no caso de falha (no caso de tempo esgotado, nem isso).
  - Consequência da cópia local: o visitante vê 45 ferramentas / 10 hospedagens (API tem 60 / 11), a descrição antiga do GitHub, e nenhum card abre página de detalhe (a cópia local não tem `slug`/`detalhe`; Figma e GitHub voltam a abrir o site oficial).
- **Detalhe (`detalhe.html` + `js/detalhe.js`)**: lê `?id=` ou `#id=`, busca as duas listas só na API (sem limite de 2,5 s, só os 5 s do fetch) e monta tudo com `textContent`. Sem API não há fallback local: mostra "Detalhes indisponíveis". Card abre detalhe só quando o item tem `slug` e `detalhe`.
- **Identificação**: `carregarIdentificacao("tools")` injeta `{API}/sdk/identificacao.js` nas duas páginas.
- **Thumb**: aceita `./assets/...` (servido pelo próprio site), `/media/...` (API) ou URL absoluta (hoje 17 itens usam `google.com/s2/favicons`).

## 2. Tabela de itens

Classes: CONTEÚDO-API (já está na API; a versão do site é cópia local manual) | CONTEÚDO-MIGRAR (só existe no site e é bom) | CONTEÚDO-COMPLETAR (vai/está na API mas incompleto) | CONTEÚDO-REESCREVER (tema vale, texto atual não; reescrever com fontes públicas) | REMOVER | COPY (texto de interface, fica no código).

| # | Item | Arquivo | O que é | Usado? | Já na API? | Classe | Destino na API | Telas | Observação |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 45 ferramentas (title, description, category, pricing, thumb, site_url, thumbFit) | `data/tools.js` | Cópia local do catálogo | Sim, só como fallback (API lenta/fora) | Sim, os 45 com mesmos valores e mesma ordem | CONTEÚDO-API | `content/tools/ferramentas.json` (já) | Catálogo, aba Ferramentas | Única divergência de campo: descrição do GitHub (local é a antiga). Faltam no local `slug`/`detalhe` de Figma e GitHub |
| 2 | 15 ferramentas só na API: Git, VS Code, Vite, Vitest, Tailwind CSS, VisuAlg, Prisma, Logisim Evolution, StarUML, Power BI, Salesforce Marketing Cloud, Microsoft Excel, Google Planilhas, GLPI, CryptoJS | `ferramentas.json` | Itens novos | Só quando a API vence os 2,5 s | Sim (só lá) | CONTEÚDO-API | (já) | Catálogo; detalhe para 5 deles | Ausentes da cópia local. 11 usam favicon externo, 4 usam `/media/tools/*.webp` (não funcionam em cópia local sem a API) |
| 3 | 10 hospedagens | `data/host.js` | Cópia local | Sim, fallback | Sim, iguais | CONTEÚDO-API | `content/tools/hospedagens.json` (já) | Catálogo, aba Hospedagens | Sem divergência de campo |
| 4 | Cloudflare Workers | `hospedagens.json` | Hospedagem nova | Só via API | Sim (só lá) | CONTEÚDO-API | (já) | Aba Hospedagens | Falta no `host.js` |
| 5 | `slug` + `detalhe` de 7 ferramentas (Figma, GitHub, SMC, Excel, Planilhas, GLPI, CryptoJS) | `ferramentas.json` | Página de detalhe | Sim, `detalhe.html` | Sim (só lá) | CONTEÚDO-API | (já) | Detalhe; card do catálogo | Nenhuma hospedagem tem detalhe, embora o schema aceite |
| 6 | Imagens Gratuitas | `data/tools.js` / API | Link para post de blog de terceiro (Rocketseat), não ferramenta | Sim | Sim | REMOVER (ou CONTEÚDO-REESCREVER como guia) | Se o tema valer: guia "bancos de imagem livres" com fontes (licenças Unsplash, Pexels, CC) em recurso de guias, não em ferramentas | Catálogo | Já apontado em revisao/tools.md (#7). Decisão do dono |
| 7 | Pusher (em Hospedagens) | `data/host.js` / API | Serviço de WebSocket, não hospedagem; cria categoria "Tempo Real" com 1 item | Sim | Sim | CONTEÚDO-API (mover de lista na API) | `ferramentas.json`, categoria Back-end, ou remover | Aba Hospedagens | Decisão do dono (revisao #8) |
| 8 | Mockingbird, Fronteditor, Heroku | `data/*.js` / API | Itens possivelmente parados ou desaconselháveis | Sim | Sim | CONTEÚDO-API (decidir remoção na API) | — | Catálogo | Não revisar agora; registrado em revisao/tools.md |
| 9 | Nomes de categoria (12 de ferramentas, 3 de hospedagens) | campo `category` dos itens | Texto livre repetido em cada item; chips gerados a partir dele | Sim | Sim (como string em cada item) | CONTEÚDO-COMPLETAR | Novo `content/tools/categorias.json` (`{ secao, nome, slug, descricao, ordem }`), validado no build contra os `category` dos itens | Chips do catálogo; futura página/intro de categoria | Não existe descrição de categoria em lugar nenhum (nem HTML, nem JS, nem Readme). Mal classificados já listados em revisao #9 |
| 10 | Valores de `pricing` (Gratuito, Freemium, Pago) | itens; CSS `[data-price]` | Vocabulário controlado, hoje texto livre no schema | Sim (selo e cor por `data-price`) | Sim (texto livre) | CONTEÚDO-COMPLETAR | `z.enum` em `ferramentaSchema` + definição curta de cada modelo (em `categorias.json` ou `glossario`) | Selo do card e do detalhe | Um valor fora do trio quebra a cor do selo sem erro |
| 11 | Miniaturas locais (42 em `thumb_tools`, 9 em `thumb_host`) | `assets/thumb_*` | Capturas de tela ~1650 px, 9,9 MB | Sim (local e API apontam `./assets/...`) | Referenciadas pela API, mas o arquivo vive no site | CONTEÚDO-MIGRAR | `media/tools/thumbs/*.webp` (~640 px) e trocar `thumb` para `/media/...` | Catálogo e detalhe | Hoje a API depende de arquivo do site consumidor; outro consumidor da API não acha a imagem. 6 acima de 300 KB |
| 12 | Miniaturas via `google.com/s2/favicons` (17 itens) | itens | Favicon externo | Sim | Sim | CONTEÚDO-COMPLETAR | `media/tools/*.webp` próprias | Catálogo | VisuAlg e Logisim mostram favicon do host (SourceForge, GitHub) |
| 13 | `assets/logos/logo-tools-1.png` (1,5 MB), `assets/thumbs/tool-1.jpg` (433 KB) | `assets/` | Órfãos | Não (só citados em docs/Readme) | Não | REMOVER | — | — | Readme já lista na fase "Peso" |
| 14 | `assets/logos/logo-tools.png` | `assets/logos` | Marca do site | Sim (cabeçalho/rodapé) | Não | COPY (identidade visual, fica no site) | — | Todas | 214 KB para 30x30 px; otimizar no site |
| 15 | `public/*` (favicons, og-image, manifest) | `public/` | Ícones e cartão social | Sim | Não | COPY | — | Metadados | Fica no site |
| 16 | `.github/*.jpg` (11 capturas, 1,7 MB) | `.github/` | Imagens do Readme | Só no Readme | Não | COPY (documentação do repo) | — | — | Fora do site publicado |
| 17 | Rótulo, título e subtítulo das abas ("Ferramentas que valeram o tempo", "Onde colocar o projeto no ar" e subtítulos) | `index.html` 128-134 e `js/renderer.js` 13-31 (duplicado) | Copy de interface | Sim | Não | COPY | — | Catálogo | Fica no código; o texto da aba Ferramentas está duplicado em HTML e JS (risco de divergir) |
| 18 | Meta description e og:description | `index.html`, `detalhe.html` | Copy/SEO | Sim | Não | COPY | — | Metadados | detalhe.js troca a description pelo `resumo` do item |
| 19 | Textos de botões e estados ("Carregar mais", "Fim da lista.", "Nada encontrado", "Limpar filtros", "Exibindo X de Y", placeholder de busca, "Carregando detalhes...", "Detalhes indisponíveis", "Ferramenta não encontrada", "Acessar site oficial", "Links oficiais", "Fontes", "Atualizado em") | `index.html`, `js/renderer.js`, `detalhe.html`, `js/detalhe.js` | Copy | Sim | Não | COPY | — | Catálogo e detalhe | "Voltar para as ferramentas" aparece também no detalhe de hospedagem |
| 20 | Texto "sobre" do rodapé ("Tools é o catálogo de ferramentas do ecossistema learnTECH...") | `index.html`, `detalhe.html` (duplicado) | Copy | Sim | Não | COPY | — | Todas | Duplicado nas duas páginas |
| 21 | Rodapé "Ecossistema" (learn-tech, Repositório, Sugerir ferramenta) e "Contato" (GitHub, LinkedIn, Instagram) | `index.html`, `detalhe.html` | Links fixos | Sim | Não | COPY (por ora) | Opcional futuro: `content/ecossistema/sites.json` compartilhado pelos 4 sites | Todas | Só lista o learn-tech; bootcamps e career não aparecem. Os outros sites devem ter listas próprias também fixas |
| 22 | "© ano learnTECH — Douglas A. B. Novato", "HTML5 · CSS3 · JavaScript ES6" | rodapé | Copy | Sim | Não | COPY | — | Todas | — |
| 23 | Seção "Sobre" do Readme (propósito, para quem, o que não é) | `tools/Readme.md` 17-31 | Texto do repositório | Não é exibido no site | Não | COPY (documentação do repo) | — | — | Não é conteúdo de tela |
| 24 | Tabelas "O catálogo" e contagens do Readme ("45 ferramentas · 10 hospedagens · 12 categorias") | `tools/Readme.md` 5, 39, 133, 211, 265-292 | Contagem manual | Não | Divergem da API (60/11) | REMOVER (substituir por link para a API ou gerar) | — | — | Também conferido por `docs/claudeia/verificar.ps1` contra os `data/*.js`, então só se mantém em sincronia com a cópia local |
| 25 | Guias / textos editoriais longos | — | Não existem no site | — | — | — | — | — | Nenhum texto de guia escondido em HTML/JS. Candidatos futuros vêm de revisao/tools.md (lacunas) e do mapa 11 |

## 3. Propostas

1. **Cópia local passa a ser gerada a partir da API** (ex.: script no learntech-content que escreve `tools/data/tools.js` e `host.js` a partir dos JSON, ou o site passa a ler um `data/*.json` copiado no build). Elimina a divergência 45/60. Incluir `slug`/`detalhe` nessa cópia é opcional: sem API a página de detalhe não funciona de qualquer jeito.
2. **Não descartar a resposta tardia**: ao chegar depois dos 2,5 s, re-renderizar uma vez (mantendo seção/filtro/busca do estado) ou guardar em `sessionStorage`/cache para a próxima visita. Assim o catálogo antigo só aparece com a API realmente fora. Opcional: registrar o descarte no console.
3. **Miniaturas para `media/tools/`**: converter as 51 capturas para webp ~640 px, publicar em `/media/tools/thumbs/` e trocar `thumb` na API. A cópia local gerada pode manter `./assets/` como fallback ou apontar para a mesma URL da API (o que recria a dependência; decidir).
4. **Novo recurso `/v1/tools/categorias.json`** com nome, slug, seção, descrição curta e ordem; build valida que todo `category` existe nele. Chips continuam gerados no site, mas com ordem e `title`/descrição vindos da API. Descrições devem ser escritas do zero (não há texto atual a migrar).
5. **`pricing` como enum** no schema (Gratuito | Freemium | Pago) e uma definição curta de cada um (pode morar no mesmo recurso de categorias ou num glossário).
6. **"Imagens Gratuitas"**: remover do catálogo; se o tema valer, virar guia próprio com fontes públicas (páginas de licença das bibliotecas de imagem), em um futuro recurso de guias (`/v1/tools/guias/{slug}.json`) e não como ferramenta.
7. **Copy fica no código**, mas consolidar duplicações: título/subtítulo da aba Ferramentas (HTML x renderer.js) e rodapé (index x detalhe).
8. **Apagar órfãos** `logo-tools-1.png` e `tool-1.jpg`; otimizar `logo-tools.png`.
9. **Readme**: trocar contagens fixas por link para `/v1/tools/*.json` (ou gerar), e ajustar `verificar.ps1` se a cópia local virar gerada.
10. Atualizar `02-contratos.md` 2.4/3: diz 56 ferramentas e "11 só na API"; hoje são 60 e 15.

## 4. Riscos

- **Cópia local defasada é o que aparece em rede lenta** (celular, primeira visita sem cache): 15 ferramentas e 1 hospedagem somem, detalhe some dos cards, e nada avisa o visitante.
- **Resposta tardia descartada**: o fetch continua por até 5 s e gasta banda sem efeito; a decisão de 2,5 s é por carga, sem retry.
- **Validação mínima no site** (`listaValida` só exige `title` e `site_url`): um item da API sem `category` ou `pricing` aparece com chip/selo vazio; se UMA lista falhar, as duas caem para o local.
- **Thumb `./assets/` na API acopla a API ao site tools**: qualquer outro consumidor (ou mudança de pasta no tools) quebra 51 miniaturas; ao mover para `/media/`, a cópia local precisa de decisão (manter assets duplicados ou depender da API).
- **Favicons do Google** (17 itens) são serviço externo não documentado; pode mudar ou bloquear.
- **`/media/` em fallback**: se a cópia local for gerada da API sem tratar `/media/`, as 4 miniaturas webp (Excel, Planilhas, GLPI, CryptoJS) ficam quebradas, porque `resolverMidia` só roda no caminho da API.
- **Categorias como texto livre**: renomear uma categoria na API muda os chips e invalida links compartilhados `?c=...` (o site ignora categoria inexistente e volta para "Todas").
- **Mover Pusher ou remover itens** muda contagens e links com `?q=`; baixo impacto, mas `verificar.ps1` e Readme acusam divergência se a cópia local não for regenerada.
- **Página de detalhe sem fallback**: com a API fora, `detalhe.html` mostra "Detalhes indisponíveis"; links compartilhados de detalhe dependem 100 % da API.
