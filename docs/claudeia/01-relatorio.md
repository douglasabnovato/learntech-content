# 01 · Relatório de revisão — learntech-content

Revisão independente feita em 27/10/2026 na branch `feature/claudeia-2026-10-27`, só por leitura de arquivos (sem rodar npm, build, testes nem git). Tudo que foi deduzido do código ou do README e não está escrito como regra aparece como **inferido · confirmar**.

## 1. Visão geral

| Item | Situação |
|---|---|
| O que é | API de conteúdo do ecossistema LearnTECH: JSON versionado em `content/`, validado por Zod, publicado como arquivos estáticos em `/v1`, mais um único endpoint de escrita (`POST /v1/acessos`) para o registro de identificação (README.md) |
| Consumidores | learn-tech (Vercel), bootcamps (Vercel), career e tools (GitHub Pages) — README.md, tabela inicial |
| Stack | TypeScript 5.9 (strict), Hono 4.13, Zod 4.6, Cloudflare Workers + Static Assets + D1, Vitest 4.1, tsx, Wrangler 4 (versões do `package-lock.json`) |
| Hospedagem | Cloudflare, plano gratuito (`wrangler.jsonc`); cron diário 03:00 UTC para retenção |
| URL publicada | Não encontrada no repositório. A doc usa o marcador `learntech-content.<sub>.workers.dev` (docs/DEPLOY.md) — **confirmar** |
| Dependências | 2 de produção (`hono`, `zod`), 6 de desenvolvimento (package.json) |
| Ambiente | Variáveis em `wrangler.jsonc`: `ALLOWED_ORIGINS`, `RETENCAO_DIAS`, `JANELA_DEDUPE_MIN`. Segredos: `ADMIN_TOKEN`, `TURNSTILE_SECRET` (opcional) |
| Fim de linha | CRLF em todos os arquivos de texto não vazios (medido: 108 de 108; `.npmrc` e `deploy.yml` têm 0 bytes) |

### Tamanho medido (sem node_modules, .git, dist)

| Tipo | Arquivos | Linhas | Observação |
|---|---:|---:|---|
| `.json` (conteúdo) | 73 | 6.478 | `content/**` |
| `.json` (projeto) | 3 | — | package.json, package-lock.json, tsconfig.json |
| `.ts` | 19 | 1.288 | src 13 (619 linhas), scripts 3 (378), tests 2 (281), vitest.config |
| `.js` (SDK) | 1 | 195 → 200 após este lote | `public/sdk/identificacao.js` |
| `.md` | 6 | 327 | README + 5 em `docs/` (antes desta revisão) |
| `.webp` | 40 | — | 2,8 MB; maior arquivo 170 KB |
| `.pdf` | 1 | — | 658 KB (certificado) |
| outros (`.yml`, `.sql`, `.jsonc`, `_headers` etc.) | 7 | — | `deploy.yml` tem **0 bytes** |
| **Total** | **151** | | |

### Acervo medido

| Recurso | Itens | Observação |
|---|---:|---|
| Programas (learn-tech) | 34 | 4 com `moduleContents` e quiz completos; 30 só com dados de card/ementa |
| Páginas (learn-tech) | 11 | todas as exigidas por `PAGINAS` |
| Eventos (bootcamps) | 21 | |
| Empresas / vagas / perfis (career) | 21 / 16 / 12 | |
| Ferramentas / hospedagens (tools) | 56 / 11 | |
| Cobertura do acervo | 20 itens | 9 publicado, 6 planejado, 4 referência, 1 fora do escopo; `atualizadoEm` 2026-09-27 |
| Referências `/media/...` | 41 | 41 arquivos existem, 0 órfãos |
| Referências `./assets/...` | 94 | 94 existem nas pastas irmãs `career/` e `tools/` |
| URLs externas | 208 | **não verificadas**: sem rede no ambiente da revisão |

## 2. Avaliação

| Área | Nota | Resumo |
|---|---:|---|
| Objetivo | 8 | Claro, documentado e com ADRs; falta URL publicada e estado real do deploy |
| Eficiência de produto digital | 7 | Fluxo de leitura e identificação bem desenhados; acervo com profundidade desigual e itens possivelmente desatualizados |
| Performance de software | 9 | Leitura 100% estática na borda, catálogo resumido, mídia em WebP pequena |
| UX design | 7 | SDK acessível e isolado; pequenos atritos de feedback e foco |
| Engenharia | 8 | TS estrito, 30 testes, CI, portas e adaptadores; workflow de deploy vazio e escrita sem limite de taxa |

### 2.1 Objetivo — 8/10

Objetivo (**inferido · confirmar**): ser a fonte única de conteúdo dos quatro sites LearnTECH, gratuita e sem banco para conteúdo, e medir quantas pessoas usam e quem são, sem login (README.md; docs/DECISOES.md ADR 1, 6).

| Pontos fortes | Evidência |
|---|---|
| Escopo explícito e limitado (leitura estática + 1 escrita) | README.md, tabela de endpoints |
| Decisões registradas com contexto e consequência | docs/DECISOES.md, ADR 1–8 |
| Regras do learn-tech portadas para o build | scripts/lib/conteudo.ts:107-161; ADR 8 |

| Falhas | Evidência |
|---|---|
| URL de produção não aparece no repositório; não dá para saber se a API está no ar | docs/DEPLOY.md usa marcador `<sub>` |
| E-mail de contato para pedidos de privacidade ainda não definido | docs/PRIVACIDADE.md, seção "Pendência" |
| Sem arquivo de licença para o conteúdo e o código | não existe LICENSE na raiz |

### 2.2 Eficiência de produto digital — 7/10

Fluxo principal (**inferido · confirmar**): o site consumidor faz `GET /v1/...json`; se falhar em 5 s, usa os dados do próprio bundle (ADR 5; `learn-tech/src/services/conteudo.js:7`). Em paralelo, o SDK pede nome e e-mail uma vez por navegador e registra um acesso por sessão.

**Regra de negócio (inferido · confirmar):** o formulário de identificação é obrigatório por padrão (`data-obrigatorio` diferente de `"false"` — public/sdk/identificacao.js:15) e existe para medir volume e perfil de uso (texto do próprio formulário, linha 124; ADR 6). Não é atrito a remover; as propostas abaixo só o aperfeiçoam.

| Pontos fortes | Evidência |
|---|---|
| Deduplicação de 30 min por e-mail+projeto evita inflar a métrica | src/app.ts:96-99 |
| Sessão local evita POST a cada página | identificacao.js `SESSAO`, `iniciar()` |
| Integridade entre arquivos: destaques, mídia, cobertura, quiz | scripts/lib/conteudo.ts:127-197 |
| Nenhum link interno quebrado: 41/41 mídias e 94/94 `./assets` existem | medido nesta revisão |

| Falhas | Evidência |
|---|---|
| Só 4 de 34 programas têm conteúdo de módulos e quiz; os outros 30 são vitrine | medido em `content/learn-tech/programas` |
| Itens possivelmente desatualizados (**confirmar**): Polywork (career/vagas), "Data Studio" apontando para `datastudio.google.com` (hoje Looker Studio), Mockingbird | content/career/vagas.json, content/tools/ferramentas.json |
| 208 URLs externas sem verificação automática de link quebrado | não há script nem teste para isso |
| Texto de privacidade diz "Não coletamos IP"; com Turnstile ligado, o IP é repassado à Cloudflare na verificação (não é gravado) | content/learn-tech/paginas/privacidade.json; src/app.ts:90; src/turnstile.ts:9 |
| Painel de resumo só por `curl` com token; não há visão simples para o dono acompanhar a métrica que justifica o formulário | docs/DEPLOY.md seção 6 |

### 2.3 Performance de software — 9/10

| Pontos fortes | Evidência |
|---|---|
| Leitura servida por Static Assets, sem invocar o Worker | wrangler.jsonc `run_worker_first` só para acessos e saúde; src/worker.ts:17 |
| Cache de borda `max-age=300, stale-while-revalidate=86400` | public/_headers |
| Catálogo resumido sem módulos e quiz | scripts/lib/conteudo.ts:201-207; teste em tests/conteudo.test.ts:262 |
| Mídia em WebP, maior arquivo 170 KB; total `media/` 3,5 MB | medido |
| Turnstile carregado sob demanda, só se houver site key | identificacao.js `tokenTurnstile()` |

| Falhas | Evidência |
|---|---|
| Maior programa tem 53 KB (`1.json`); aceitável, sem compressão de imagem prévia de capas externas (Pixabay em 1280 px) | medido; URLs `cdn.pixabay.com/..._1280.jpg` |
| `resumo` faz `COUNT(DISTINCT)` na tabela inteira a cada chamada; irrelevante hoje, cresce com o volume | src/acessos/repositorio-d1.ts:46-47 |

### 2.4 UX design — 7/10

A interface visível deste repositório é só o formulário do SDK; as telas de conteúdo estão nos sites consumidores.

| Pontos fortes | Evidência |
|---|---|
| Shadow DOM isola o CSS do site | identificacao.js `attachShadow` |
| `role="dialog"`, `aria-modal`, `aria-labelledby/-describedby`, `role="alert"` no erro, armadilha de foco | identificacao.js:117-160 |
| Tema escuro por `prefers-color-scheme` | ESTILO, linhas 92 e 102 |
| Finalidade e retenção explicadas no próprio formulário, com link para a política | linhas 124 e 130 |

| Falhas | Evidência |
|---|---|
| Botão "Continuar" fica desabilitado sem texto de progresso; com rede lenta + Turnstile, parece travado | identificacao.js `enviar.disabled = true` |
| Ao fechar o diálogo, o foco não volta para onde estava | função `fechar()` |
| Falha de rede é silenciosa: grava a identificação e fecha, sem avisar | `registrar().catch(...)` devolve null |
| Validação de nome só exige 2 palavras; nomes compostos de uma palavra (raros) são barrados | identificacao.js `n.split(" ")`; src/acessos/schema.ts:7 |

### 2.5 Engenharia — 8/10

| Subárea | Situação | Evidência |
|---|---|---|
| Arquitetura | Boa: porta `RepositorioAcessos` com adaptadores D1 e memória; app recebe dependências | src/acessos/repositorio.ts; src/app.ts:17-22 |
| Tipagem | Estrita (`strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`) | tsconfig.json |
| Testes | 30 testes Vitest (18 de rotas, 12 de conteúdo), com erros plantados | tests/*.ts |
| CI | Typecheck + testes + build em push na `main` e em PR | .github/workflows/ci.yml |
| Deploy automático | **Arquivo vazio (0 bytes)**, mas a doc descreve o fluxo | .github/workflows/deploy.yml; docs/DEPLOY.md seção 4 |
| Lint | Não existe | package.json sem lint |
| Robustez | JSON e storage protegidos no SDK; JSON inválido vira erro com nome de arquivo no build | identificacao.js:27-40; scripts/lib/conteudo.ts:30-37 |
| Segurança | Boa base (CORS de escrita, Zod, 8 KB, token em tempo constante, CSV sem fórmula). Falta limite de taxa; Turnstile é opcional | src/app.ts; ADR 7 |
| Documentação | Boa (arquitetura, ADR, conteúdo, deploy, privacidade). Havia instrução desatualizada do `database_id` (corrigida) | docs/ |

Riscos técnicos observados:

| Risco | Evidência |
|---|---|
| Sem limite de taxa no `POST /v1/acessos`; sem Turnstile, um script com e-mails aleatórios pode gastar a cota de escrita do D1 e poluir a métrica. `Origin` é forjável fora do navegador | src/app.ts:77-102 |
| `ALLOWED_ORIGINS` de produção inclui `http://localhost:*` e `http://127.0.0.1:*` | wrangler.jsonc `vars` |
| Deduplicação faz "consulta e depois insere" sem transação; duas abas simultâneas podem gerar 2 linhas | src/app.ts:97-100 |
| Exportação administrativa limitada a 1.000 linhas, sem paginação | src/app.ts:114 |
| SDK (código que roda nos 4 sites) não tem nenhum teste automatizado | não há teste para `public/sdk` |
| Link da política entrava em `innerHTML` sem escape (corrigido neste lote) | identificacao.js, antes linha 125 |

## 3. Relação com o learn-tech

| Tema | Situação | Evidência |
|---|---|---|
| Fonte de conteúdo | A API é a fonte primária; o learn-tech busca em `VITE_API_URL` e cai para os dados locais | learn-tech/src/services/conteudo.js:1-33 |
| Duplicação | O catálogo existe duas vezes: `learn-tech/src/constants/programsData.js` (2.702 linhas, 33 programas) e `content/learn-tech/programas` (34 programas). O 901 só existe na API | medido por id |
| Sincronização | Não há verificação automática de que os dois catálogos batem; uma edição só de um lado faz o site mostrar versões diferentes conforme a API responda ou não | nenhum script de comparação nos dois repositórios |
| Regras compartilhadas | As regras do `dados.test.js` do learn-tech foram copiadas para `verificarIntegridade` | ADR 8 |
| Identificação | O learn-tech injeta `/sdk/identificacao.js` desta API; a política padrão aponta para `/privacy` do learn-tech, rota que existe | learn-tech/src/services/identificacao.js; learn-tech/src/App.jsx:129 |

O ADR 5 já prevê remover os dados locais "depois que a API estiver estável"; até lá, a divergência é o maior risco de coerência do ecossistema.

## 4. Falhas em ordem de gravidade

### Engenharia

| # | Falha | Gravidade | Evidência |
|---|---|---|---|
| E1 | `deploy.yml` vazio: o deploy automático documentado não existe e o GitHub provavelmente acusa workflow inválido em cada push (**confirmar na aba Actions**) | Alta | .github/workflows/deploy.yml (0 bytes) |
| E2 | Escrita pública sem limite de taxa; Turnstile opcional | Alta | src/app.ts:77-102 |
| E3 | Catálogo duplicado com o learn-tech sem checagem de sincronia | Média | seção 3 |
| E4 | SDK sem teste automatizado | Média | public/sdk |
| E5 | `localhost` liberado em produção | Baixa | wrangler.jsonc |
| E6 | Dedupe sem atomicidade; exportação limitada a 1.000 linhas | Baixa | src/app.ts:97-100, 114 |
| E7 | Sem lint e sem verificação de links externos | Baixa | package.json |
| E8 | `innerHTML` com atributo não escapado no SDK | Baixa | **corrigido** neste lote |
| E9 | Instrução desatualizada do `database_id` em DEPLOY.md | Baixa | **corrigido** neste lote |

### Decisão de produto (não executar sem aprovação)

| # | Tema | Proposta |
|---|---|---|
| P1 | Texto "Não coletamos IP" com Turnstile ligado | Ajustar o texto da política ou manter Turnstile desligado; decisão jurídica/de produto |
| P2 | E-mail de contato de privacidade | Definir e publicar (pendência já registrada pelo dono) |
| P3 | Formulário obrigatório (regra de negócio de medição) | **Manter.** Aperfeiçoar: texto de progresso no botão, aviso discreto em falha de rede, devolver o foco, painel de resumo para o dono acompanhar a métrica |
| P4 | 30 programas sem módulos/quiz | Priorizar quais ganham conteúdo, ou sinalizar "em produção" nos cards |
| P5 | Itens possivelmente desatualizados (Polywork, Data Studio, Mockingbird) | Revisar a curadoria e decidir manter, renomear ou retirar |
| P6 | Licença do conteúdo e do código | Escolher e adicionar LICENSE |
