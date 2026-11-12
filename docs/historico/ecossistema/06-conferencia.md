# 06 · Conferência de estado: feito x falta

Conferência de 27/10/2026, feita só com leitura de arquivos e comandos git de leitura (`branch`, `log`, `status`, `diff --stat`, `rev-parse`). Nenhum build, teste ou instalação foi executado; nada foi alterado nos projetos. Caminhos relativos a `mundo-learn-tech/`. Os achados das revisões do dia estão em `<projeto>/docs/claudeia/01-relatorio.md` e `03-registro.md`, citados abaixo como "relatório" e "registro".

---

## 1. Quadro-resumo

| Projeto | Branch atual | Sem commit | Testes | CI | Deploy | Estado |
|---|---|---|---|---|---|---|
| learn-tech | `feature/claudeia-2026-10-27` (igual a `origin`, 1 commit à frente de `origin/main`) | 0 | Vitest: `src/constants/dados.test.js` (15 casos) | `.github/workflows/ci.yml` (versionado) | Vercel (`vercel.json`) | Revisão commitada e no remoto; falta PR/merge e decisões de produto |
| bootcamps | `feature/claudeia-2026-10-27` (só local, igual à `main`) | 6 | Nenhum | `.github/workflows/ci.yml` (não versionado) | Vercel (`vercel.json`) | Mudanças do lote 1 no disco, sem commit |
| career | `feature/claudeia-2026-10-27` (só local, igual à `main`) | 7 | Nenhum (só `docs/claudeia/verificar.ps1`) | Nenhum | GitHub Pages (`.nojekyll`) | Mudanças do lote 1 sem commit; API desligada |
| tools | `feature/claudeia-2026-10-27` (só local, igual à `main`) | 4 | Nenhum (só `verificar.ps1` + `node --check`) | `.github/workflows/ci.yml` (não versionado) | GitHub Pages (`.nojekyll`) | Mudanças do lote 1 sem commit; API desligada |
| learntech-content | `feature/claudeia-2026-10-27` (só local, igual à `main`) | 4 | Vitest: `tests/acessos.test.ts` (18), `tests/conteudo.test.ts` (12) | `ci.yml` (ativo); `deploy.yml` **vazio (0 bytes)** | Cloudflare, manual (`npm run deploy`); URL de produção não registrada | Mudanças do lote 1 sem commit; deploy automático inexistente |

### Git em detalhe

| Projeto | Branches locais | Branches remotas | `git log --oneline -8` | Arquivos sem commit |
|---|---|---|---|---|
| learn-tech | `developer-mvp-2026`, `feature/claudeia-2026-10-27`, `feature/contents`, `main` | `developer-mvp-2026`, `feature/claudeia-2026-10-27`, `feature/contents`, `main` | `8c08bfb ajustes na estrutura` · `9c68010 atualizacoes visuais de status` · `a07cf2a detalhes para o deploy` · `52b5743 deploy - reducao de tamanho` · `d146024 versao estavel para receber conteúdo` · `e618e89 projeto com api` · `a72ccba Merge PR #117` · `bc035f3 Merge PR #116` | nenhum |
| bootcamps | `developer`, `feature/claudeia-2026-10-27`, `main` | `developer-mvp`, `feature/add-4-projetos`, `main` | `fb79a0c Merge PR #66` · `441be18 Merge PR #65` · `25391b1 projeto nova versao` · `6644801 Merge PR #64` · `437f677 Merge PR #63` · `6156787 projeto add` · `4b5e9f5 detalhes do projeto` · `c76b0cb Merge PR #57` | `M public/eventos-vivos/bq-agenda-tech/index.html`, `M public/eventos-vivos/byteclass.dev/main.js`, `M readme.md`, `M src/entities/event/api/eventApi.ts`, `?? .github/`, `?? docs/` |
| career | `backup-feature-dev-content`, `developer-mvp`, `developer-mvp-2026-2`, `feature/claudeia-2026-10-27`, `feature/contents-2026-2`, `feature/dev-content`, `main` | `developer-mvp`, `developer-mvp-2026-2`, `feature/contents-2026-2`, `feature/dev-content`, `main` | `474dd9b curriculo` · `c5c4683 Merge PR #23` · `166af71 Merge PR #22` · `6d0918a Merge branch 'developer-mvp' into feature/dev-content` · `54eabbe novidades` · `d163d55 Merge PR #21` · `3d14b5f Merge PR #20` · `c050766 adicionar curriculo` | `M Readme.md`, `M index.html`, `M js/app.js`, `M js/catalog.js`, `M js/company-modal.js`, `M js/curriculos-render.js`, `?? docs/` |
| tools | `developer`, `feature/claudeia-2026-10-27`, `main` | `developer-mvp`, `feature/dev-content`, `main` | `0109522 nova versao` · `9d6003d Merge PR #50` · `5114758 Merge PR #49` · `4147821 projeto tools` · `dc92ba1 ajustes` · `fda164d Merge PR #47` · `f8201d0 Merge PR #48` · `39feecb qa-3 do projeto` | `M js/renderer.js`, `M main.js`, `?? .github/workflows/`, `?? docs/` |
| learntech-content | `developer`, `feature/claudeia-2026-10-27`, `main` | `main` | `f73ffa3 chore: database_id do D1, .npmrc e CI` · `5f26384 api` · `57e03c6 inicio do projeto` | `M docs/DEPLOY.md`, `M public/sdk/identificacao.js`, `?? docs/claudeia/`, `?? docs/ecossistema/` |

**Alerta de fim de linha.** Nos quatro repositórios com mudanças pendentes, o `git diff --stat` acusa o arquivo inteiro como alterado (career: 1.940 inserções e 1.931 remoções; bootcamps: 827/799; tools: 400/389; learntech-content: 274/269). Com `--ignore-cr-at-eol` a mudança real cai para career 52/43, bootcamps 34/6, tools 13/2, learntech-content 7/2. O repositório guarda LF (conferido em `git show HEAD:js/catalog.js` do career) e a cópia de trabalho está em CRLF; `core.autocrlf` não está definido em nenhum dos repositórios. Os registros afirmam "CRLF preservado", o que é verdade para o disco, mas um commit direto reescreveria todas as linhas desses arquivos.

**Branches de integração divergentes.** O CI do learn-tech escuta `developer-mvp-2026` (`ci.yml:8`), mas as branches locais do bootcamps e do tools se chamam `developer`, enquanto o remoto tem `developer-mvp`; o CI do bootcamps escuta `developer-mvp` (`ci.yml:7`). O CI do learntech-content escuta só push na `main` e PRs (`ci.yml:3-5`), então não roda no push da branch de revisão.

### CI por projeto

| Projeto | Arquivo | O que faz |
|---|---|---|
| learn-tech | `.github/workflows/ci.yml` | Node 22 → `npm install` (lockfile ignorado no Git, `.gitignore:10`) → `npm test` → `npm run build` → `npm run lint` com `continue-on-error` (`:29-39`) |
| bootcamps | `.github/workflows/ci.yml` (não versionado) | Node 22 → `npm ci` → `npm run lint` → `npm run build` (`tsc -b && vite build`) (`:29-36`) |
| career | — | Não existe; o registro explica que não há `package.json` nem script para rodar |
| tools | `.github/workflows/ci.yml` (não versionado) | `pwsh ./docs/claudeia/verificar.ps1` + `node --input-type=module --check` em `main.js`, `js/*.js`, `data/*.js` (`:20-30`) |
| learntech-content | `.github/workflows/ci.yml` | `npm ci` → `typecheck` → `test` → `build` (`:13-16`) |
| learntech-content | `.github/workflows/deploy.yml` | **Vazio (0 bytes)**; `docs/DEPLOY.md:50-56` descreve um deploy automático que não existe |

---

## 2. Projetos

### 2.1 learn-tech

Stack: React 19, Vite 6, Tailwind 4, React Router 7, Vitest 4, JavaScript sem TypeScript (`package.json`). 16 rotas (`src/App.jsx:121-151`).

**Feito**

| Disciplina | Item | Evidência |
|---|---|---|
| Engenharia | Camada de dados com API, timeout de 5 s, cache e fallback local | `src/services/conteudo.js:6-100` |
| Engenharia | `Tabs` em modo controlado; `Quiz` aceita só formato válido do `localStorage`; visualizer não abre navegador em CI | registro, "Alterações" |
| Engenharia | CI criado e commitado | `.github/workflows/ci.yml`; commit `8c08bfb` |
| UX | `lang="pt-BR"` e meta description | `index.html:2` |
| UX | `aria-label` na busca e no filtro de programas; `role="status"` nos carregamentos | `pages/programs/Programs.jsx:50,60`; `Detail.jsx:27` |
| Testes | Contrato dos dados locais (ids, módulos, `lessonsCount`, ícones, quiz, sem `rating`/`students`) | `src/constants/dados.test.js` (15 `it`) |

**Falta**

| Disciplina | Item | Evidência |
|---|---|---|
| Engenharia | Lockfile fora do Git (builds não reprodutíveis) | `.gitignore:10` |
| Engenharia | Catálogo duplicado: 33 programas locais x 34 na API (901 só na API) | `programsData.js` (2.702 linhas); `content/learn-tech/programas/` |
| Engenharia | Lint não verificado; código e assets órfãos; dois mapas de ícones | relatório 2.5 e 3 (E4, E9) |
| UX | 30 de 33 programas levam a "Carregando conteúdo..." infinito | `pages/enroll/Description.jsx:14`; relatório P1 |
| UX | "Fala aê" simula envio (canal LGPD citado na política); progresso de módulo não persiste; link `/blogs` quebrado | relatório P2, P3, P4 |
| UX | Sem skip-link (nenhum encontrado em `src/`); botões do menu móvel sem `aria-label`; vários `h1` | relatório 2.4 |
| Design | Sem tokens: `src/index.css` só importa a fonte e o Tailwind, sem `@theme`; cores utilitárias diretas (sky/indigo); classe inexistente `in-500` na aba ativa; nenhum arquivo Figma referenciado | `src/index.css`; relatório 2.4 |
| Testes | Nada de componente, e2e ou da camada `conteudo.js`; o teste valida só os dados locais, não os da API | `dados.test.js` importa `constants/` |
| Conteúdo | `status` só existe no local; com a API ativa os cards perdem o "Em breve" | `02-contratos.md`, D1 |

**Riscos**: com a API ligada, os 30 programas sem conteúdo ficam clicáveis (D1); divergência local x API sem verificação; a branch ainda não foi mesclada (`origin/main` = `9c68010`).

### 2.2 bootcamps

Stack: React 19, TypeScript 5.9 strict, Vite 7, Tailwind 4, Framer Motion 12, React Router 7, react-helmet-async, Speed Insights (`package.json`). Rotas `/`, `/event/:slug`, `*` (`AppRouter.tsx:16-18`).

**Feito**

| Disciplina | Item | Evidência |
|---|---|---|
| Engenharia | Tipos espelhando o schema da API; acesso a dados isolado com fallback | `entities/event/model/types.ts`; `entities/event/api/eventApi.ts` |
| Engenharia | Validação de formato da resposta da API (lote 1, sem commit) | `eventApi.ts:60,75` |
| Engenharia | `try/catch` no smooth scroll do ByteClass; README atualizado; CI criado (sem commit) | registro, "Executado" |
| UX | `lang="pt-BR"`; foco visível global; um `h1` por página; skeleton e spinner com `sr-only` | `index.html:2`; `src/app/styles/main.css:10-13`; relatório 2.4 |
| Design | Tokens de marca no `@theme` (`--color-brand-primary`, `--color-brand-secondary`, `--font-sans`) | `src/app/styles/main.css:3-8` |

**Falta**

| Disciplina | Item | Evidência |
|---|---|---|
| Engenharia | `useEventBySlug` sem cancelamento; `error` nunca lido; lint com react-hooks 7 não verificado | relatório 2.5 |
| Engenharia | Tipos duplicados à mão entre `types.ts` e `src/schemas/bootcamps.ts` | os dois arquivos |
| UX | Formulários dos sites embutidos (BQ, ByteClass) não enviam nada; fotos do BQ quebradas | relatório 2.2 |
| UX | Contraste baixo (`text-zinc-600` sobre `zinc-950`); capas apagadas no celular; rodapé em inglês; "Voltar" com `navigate(-1)` | relatório 2.2 e 2.4 |
| UX | CTA com `href=""` no evento `smc-2012` (só na API) | `02-contratos.md`, D11 |
| Design | Tokens cobrem só 2 cores e a fonte; resto em classes `zinc-*`; nenhum Figma referenciado | `main.css:3-8` |
| Testes | Nenhum teste automatizado; CI só faz lint e build | relatório 2.5; `ci.yml` |
| Conteúdo | Fallback com 17 eventos x 21 na API; galerias vazias no local x 6 eventos com galeria na API; `editions[].image` não é exibido | `02-contratos.md`, seção 3 e D10 |

**Riscos**: 11 MB de PNG em `public/eventos-vivos/byteclass.dev`; script de identificação sem SRI/CSP; commit pendente com arquivos inteiros reescritos por causa do fim de linha.

### 2.3 career

Stack: HTML + CSS + JavaScript ES Modules, sem build e sem `package.json`; Google Fonts e Boxicons via unpkg (`index.html:33-39`). Página única com seções Empresas, Plataformas Jobs, Dev Profiles e Currículos (`js/app.js:55-89`).

**Feito**

| Disciplina | Item | Evidência |
|---|---|---|
| Engenharia | Escape em `innerHTML` do modal e dos currículos; validação do catálogo remoto; `destaques` tolerante | registro L1-02, L1-03, L1-04 (sem commit) |
| Engenharia | README limpo; `og:image` absoluto | registro L1-01, L1-06 |
| UX | `lang="pt-BR"`; skip-link; `aria-pressed` no menu; `aria-live` na lista; `alt` dos cards; `aria-labelledby` no modal | `index.html:2,63,99-116,172`; `js/app.js:217`; registro L1-05 |
| Design | Variáveis CSS: 39 em `css/layout.css`, 11 em `css/company-modal.css`; tema claro e escuro sem flash | contagem de `--*:`; `index.html:49-59` |

**Falta**

| Disciplina | Item | Evidência |
|---|---|---|
| Engenharia | API e identificação desligadas pelo marcador `SEU-SUBDOMINIO` | `js/config.js:3`; `js/api.js:5` |
| Engenharia | Modal fixo em `id === "brq"` e lendo só dados locais; BRQ não existe na API | `js/app.js:197`; `js/company-modal.js:2,146`; `02-contratos.md`, D4 |
| Engenharia | `@import` duplicado e serial de `company-modal.css` | relatório 2.3 |
| UX | Modal sem focus trap e sem devolver o foco; banner sem pausa; rótulos misturando inglês e português; H1 inicial "Carregando..." | relatório 2.4 |
| Design | Nenhum Figma referenciado; tokens só em CSS local, sem ligação com os outros sites | — |
| Testes | Nenhum teste e nenhum CI (só `verificar.ps1` manual) | sem `.github/` |
| Conteúdo | 16 empresas locais x 21 na API; `duration` usado como rótulo | `02-contratos.md`, seção 3 e D9 |

**Riscos**: ao ligar a API, a lista de empresas muda e a BRQ some; 8,5 MB de imagens referenciadas e 12,6 MB não usadas (relatório 2.3).

### 2.4 tools

Stack: HTML + CSS + JavaScript ES Modules, sem build e sem `package.json`. Duas abas, Ferramentas e Hospedagens (`index.html:68-83`).

**Feito**

| Disciplina | Item | Evidência |
|---|---|---|
| Engenharia | `textContent` nos chips; `href` só com `http(s)`; validação da resposta da API | `js/renderer.js:138`; `main.js:11-13` (sem commit) |
| Engenharia | CI estático criado (sem commit) | `.github/workflows/ci.yml` |
| UX | `lang="pt-BR"`; skip-link; `role="tablist"`; `aria-live` no contador; `alt` "Miniatura de ..."; `prefers-reduced-motion` | `index.html:2,59,68,134`; `js/renderer.js:141`; relatório 5 |
| Design | Tokens CSS em `css/layout.css` (32 variáveis: `--bg`, `--surface`, `--accent`, `--text-muted`...); tema claro e escuro | `css/layout.css` |

**Falta**

| Disciplina | Item | Evidência |
|---|---|---|
| Engenharia | API desligada pelo marcador; resposta lenta (mais de 2,5 s) é descartada | `js/config.js:3`; `main.js:8,31` |
| Engenharia | README sem a API e sem `js/api.js`/`js/config.js` | relatório 2 |
| UX | Abas sem navegação por setas; busca sem outline; título da aba muda ao carregar | relatório 5 e 3 |
| Design | "Figma" aparece só como item do catálogo (`data/tools.js`), não como arquivo de design | grep |
| Testes | Sem teste de comportamento; o CI só confere arquivos e sintaxe | `ci.yml:20-30` |
| Conteúdo | 45 ferramentas e 10 hospedagens locais x 56 e 11 na API | `02-contratos.md`, seção 3 |

**Riscos**: miniaturas de cerca de 1.650 px para cards de 320 px (cerca de 10 MB); `og:image` relativo.

### 2.5 learntech-content

Stack: TypeScript 5.9 strict, Hono 4, Zod 4, Cloudflare Workers + Static Assets + D1, Vitest 4, Wrangler 4 (`package.json`; `wrangler.jsonc`).

**Feito**

| Disciplina | Item | Evidência |
|---|---|---|
| Engenharia | Conteúdo como código validado por Zod e por regras de integridade; leitura 100% estática | `scripts/build.ts`; `scripts/lib/conteudo.ts:127-198`; `wrangler.jsonc` |
| Engenharia | Porta e adaptadores para acessos (D1 e memória); CORS de escrita, limite de 8 KB, token em tempo constante | `src/acessos/`; `src/app.ts:27-36,77` |
| Engenharia | Escape do `href` da política no SDK; `DEPLOY.md` corrigido sobre `database_id` | registro, itens 1 e 2 (sem commit) |
| UX | SDK com Shadow DOM, `role="dialog"`, `aria-modal`, foco preso e tema escuro | relatório 2.4 |
| Testes | 30 testes Vitest com erros plantados | `tests/acessos.test.ts` (18), `tests/conteudo.test.ts` (12) |
| Conteúdo | 34 programas, 11 páginas, 21 eventos, 21 empresas, 16 vagas, 12 perfis, 56 ferramentas, 11 hospedagens, 41 mídias, 20 itens de cobertura | `02-contratos.md`, seção 3 |

**Falta**

| Disciplina | Item | Evidência |
|---|---|---|
| Engenharia | `deploy.yml` vazio; URL de produção desconhecida | `.github/workflows/deploy.yml` (0 bytes); relatório 2.1 |
| Engenharia | Sem limite de taxa no `POST /v1/acessos`; `localhost` em `ALLOWED_ORIGINS`; sem lint | `src/app.ts:77-102`; `wrangler.jsonc` `vars` |
| Engenharia | Schemas frouxos para campos ricos de programa e para páginas | `02-contratos.md`, D2 e D3 |
| UX | No SDK: botão desabilitado sem texto de progresso, foco não volta, falha de rede silenciosa | relatório 2.4 |
| Design | Não se aplica (sem telas próprias além do SDK) | — |
| Testes | SDK sem teste; sem verificação de links externos (208 URLs) | relatório 2.5 |
| Conteúdo | 30 de 34 programas sem módulos/quiz; itens talvez desatualizados (Polywork, Data Studio, Mockingbird); e-mail de privacidade e LICENSE indefinidos | relatório 2.2 e 2.1 |

**Itens planejados e ainda não feitos em `content/cobertura.json`** (`atualizadoEm` 2026-09-27; 9 publicados, 6 planejados, 4 referência, 1 fora do escopo)

| Pasta do acervo | Destino | Observação registrada |
|---|---|---|
| `disciplinas-bacharel-ciencia-da-computacao-ufjf (DCC013, DCC119, DCC120, DCC121)` — estruturas de dados e algoritmos em C/C++ | learn-tech, programas (sem id) | "Trilha 4 — Algoritmos e estruturas de dados, a portar para JavaScript/Python" |
| `2-hard_skills/3-code_challenge e 4-project_challenge` — desafios de código e de projeto | learn-tech, programas (sem id) | "Exercícios das trilhas 6 e 11" |
| `conteudos-writer/startup-way-challenge` — Startup Way Challenge 2023 | bootcamps, eventos (sem id) | "Aguardando confirmação da participação e uma imagem de capa" |
| `personal-project/3-soft_skills` — carreira, produtividade e autoconhecimento | learn-tech, páginas `mentorias`, `carreira` | "Trilha Soft skills do dev (6 cursos)" |
| `conteudos-projetos/conteudo-gestao-de-projetos` — formação em gestão de projetos | learn-tech, programas 601, 602, 603 | os três existem só como card, sem módulos |
| `abc-da-construcao` — CRM, e-commerce e comunicação como case fictício | learn-tech, programas (sem id); tools, Salesforce Marketing Cloud e Power BI | "Aguarda nome fictício e validação de confidencialidade" |

Pendências anotadas dentro de itens já publicados: Ferrex aguarda confirmação do papel e do evento (6-tech_community); Niky, Levty e Ascendion aguardam dados públicos confirmados, e "etapas do processo seletivo viram trilha em learn-tech (planejado)" (1-selection_process).

**Riscos**: escrita pública sem limite de taxa pode gastar a cota do D1 e poluir a métrica; deploy manual sem registro da URL; a fonte única ainda convive com quatro cópias locais.

---

## 3. Itens que dependem do usuário

| Tipo | Item | Onde |
|---|---|---|
| Commit | Decidir o fim de linha (`.gitattributes` ou `core.autocrlf`) antes de commitar, para não reescrever arquivos inteiros | bootcamps, career, tools, learntech-content (seção 1) |
| Commit | Commitar e publicar as mudanças do lote 1 e `docs/` | bootcamps (6), career (7), tools (4), learntech-content (4) |
| Commit / PR | Abrir PR de `feature/claudeia-2026-10-27` para a `main` | learn-tech (já no remoto) |
| Decisão | Versionar `package-lock.json` do learn-tech | `learn-tech/.gitignore:10` |
| Segredo | `ADMIN_TOKEN` (24+ caracteres) via `wrangler secret put`; `TURNSTILE_SECRET` se usar anti-robô | `wrangler.jsonc` (comentário final); `docs/DEPLOY.md:19,58-62` |
| Segredo | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` e variável `DEPLOY_AUTOMATICO=sim` no GitHub, e conteúdo real do `deploy.yml` | `docs/DEPLOY.md:50-56` |
| Painel | `npx wrangler login`, escolha do subdomínio `workers.dev`, `npm run db:migrar:remoto`, `npm run deploy`, e registro da URL obtida | `docs/DEPLOY.md:7-23` |
| Painel | `VITE_API_URL` na Vercel (learn-tech e bootcamps) | `docs/DEPLOY.md:41-44`; `.env.example` dos dois |
| Configuração | Trocar o marcador em `js/config.js` do career e do tools pela URL real (liga catálogo e identificação) | `career/js/config.js:3`; `tools/js/config.js:3` |
| Painel | Turnstile com os 4 domínios e `data-turnstile-sitekey` | `docs/DEPLOY.md:58-62` |
| Execução local | Rodar `docs/claudeia/verificar.ps1` em cada projeto e anotar o resultado | registros dos 5 projetos |
| Conteúdo / jurídico | E-mail de contato de privacidade; LICENSE; texto "Não coletamos IP" com Turnstile ligado | `learntech-content/docs/claudeia/01-relatorio.md` P1, P2, P6 |
| Produto | Decisões listadas nos relatórios: "Em breve"/status dos programas, formulários (Fala aê, BQ, ByteClass), modal além da BRQ, progresso de módulo, contraste e capas, terceiro estado de evento | relatórios, seção "Decisão de produto" |

---

## 4. Seguro sem decisão x precisa de validação

| Seguro executar (não muda o que o visitante vê nem publica nada) | Motivo |
|---|---|
| Rodar `verificar.ps1`, `npm test`, `npm run typecheck`, `npm run build` e `npm run lint` localmente | Só leitura e geração de `dist/` local |
| Conferir a aba Actions dos repositórios depois do push | Só leitura |
| Corrigir `docs/DEPLOY.md` seção 3 (scripts não ficam no `index.html`) e o comentário "47 MB" de `conteudo.js:83` | Documentação e comentário |
| Teste de paridade local x API (ids de programas, eventos, empresas, ferramentas) | Só acusa diferença; não altera dados |
| Declarar como **opcionais** no `programaSchema` os campos que as telas já leem (`about`, `whatYouBuild`, `enrollDetails`...) | Aditivo; os dados atuais já passam pelo `looseObject`. Confirmar rodando o build |
| Teste automatizado do SDK de identificação | Não altera o script |

| Precisa de validação do dono | Motivo |
|---|---|
| Ligar a API no career e no tools (`js/config.js`) | Troca o catálogo exibido (career perde a BRQ e ganha 6 empresas; tools ganha 12 itens) e ativa o pedido de nome e e-mail |
| Publicar `status` nos programas da API e incluí-lo em `CAMPOS_RESUMO` | Muda o card e a navegação do learn-tech quando a API está ativa |
| Migrar os 94 `./assets/...` para `/media/` | Move imagens entre repositórios e muda a origem das imagens |
| Padronizar nomes de campos (seção 5 de `02-contratos.md`) | Exige mudança coordenada em API e sites |
| Escrever o `deploy.yml` | Publica em produção e depende de segredos |
| Limite de taxa, remoção de `localhost` em `ALLOWED_ORIGINS`, Turnstile | Afeta a escrita em produção e o desenvolvimento local |
| Remover fallbacks locais (ADR 5) | Só depois de a API estar estável e com URL registrada |
| Normalizar fim de linha | Afeta todos os arquivos dos repositórios |
| Links cruzados entre os quatro sites | Mudança visual e de navegação |
| Qualquer item de "Decisão de produto" dos relatórios | Regra de negócio, aparência ou conteúdo |
