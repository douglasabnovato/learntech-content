# Diagnóstico para o MVP: learntech-content (03/11/2026)

Repositório: `C:\douglasabnovato-github\mundo-learn-tech\learntech-content`, branch `feature/tasks-03-11-2026` (5 commits à frente da `main`, `f9edca4`, ainda sem merge).

## 0. Evidência coletada (comandos rodados agora)

| Comando | Resultado |
|---|---|
| `npm run validar` | ✔ 49 programas, 27 eventos, 87 ferramentas, 41 empresas, 0 erros |
| `npm test` | 3 arquivos, **63 testes verdes** (23,9 s) |
| `npm run typecheck` / `npm run lint` | 0 erros |
| `npm run format:check` | **31 arquivos fora do Prettier** (o passo não roda na CI) |
| `npm run progresso` | **79/100** (conteúdo 84%, engenharia 28/33, autor 9 de 25, publicação 100%) |
| `npm run cobertura` | 122 itens: 9 sem destino, 75 em 1 projeto, 35 em 2, 3 em 3, **0 nos 4** |
| `npm run auditar` | **zod com 1 vulnerabilidade alta em produção**; 16 altas em dev (lighthouse/puppeteer) |
| `gh issue list ... --state open` | **Nenhuma issue** no repositório da API (nem aberta nem fechada). As 94 issues de conteúdo estão nos repositórios dos sites (`docs/processo/lotes/2026-11-03-issues.md`) |
| `du -sh dist` | 15 MB, 291 arquivos |

Efeito colateral: `npm run auditar` gravou `docs/engenharia/relatorios/auditoria-2026-11-03.md` (não rastreado). Isso deixa a API "com alterações" no próximo `progresso`. Faça o commit ou apague o arquivo.

---

## 1. Produto

**Proposta de valor.** É a fonte única, aberta e gratuita do conteúdo do ecossistema learnTECH: programas com quiz, artigos, eventos, empresas, vagas, perfis e ferramentas. O conteúdo é curado a partir da trajetória do autor, com fontes conferidas por regra (2 domínios por ficha, `scripts/lib/conteudo.ts:306-314`). Para os 4 sites, a API resolve três coisas: um só lugar para editar, um contrato validado (Zod) e relacionados entre projetos com URL pronta (`conteudo.ts:161-175`).

**Público.**
- Primário: quem está entrando ou fazendo transição para tecnologia, que lê nos 4 sites.
- Secundário: o próprio autor como editor (conteúdo como código, ADR 1) e quem quiser reutilizar o catálogo (OpenAPI pública em `/v1/openapi.json`).

**O que está pronto.**
- 49 programas, todos com módulos e quiz; 45 artigos; 27 eventos; 41 empresas, 23 vagas e 13 perfis, todos com página de detalhe; 87 ferramentas e 11 hospedagens; 6 áreas; 4 modelos de currículo.
- Leitura estática na borda, com escrita apenas em acessos e mensagens (D1), cron de retenção e exclusão por titular (LGPD).
- CI com typecheck, lint, testes e build; ruleset `main protegida`; monitor de disponibilidade a cada 6 h.
- Documentação de processo muito acima da média: `ESTADO.md`, `como-trabalhamos.md`, ADRs e lotes.

**Lacunas que impedem chamar de MVP finalizado.**
1. **Publicado ≠ main.** A branch do dia tem 5 commits fora da `main`, mas o placar mostra "Publicação 100%". O critério em `scripts/progresso.mjs:44` só olha `main == origin/main` e árvore limpa, e ignora a branch de trabalho não integrada.
2. **Nada foi medido em produção.** E2E, axe, capturas e Lighthouse estão escritos e nunca rodaram (`docs/engenharia/backlog.md:29,36-38`). O monitor nunca teve o primeiro *Run* (`PROXIMOS-PASSOS.md:13`).
3. **Faltam o canal de privacidade e o anti-robô.**
   - O e-mail de contato para pedidos LGPD não está definido (`docs/PRIVACIDADE.md:35-37`).
   - O Turnstile depende de segredo e de `data-turnstile-sitekey`, e nenhum site passa o sitekey (`learn-tech/src/services/identificacao.js:6-13`). Ou o anti-robô está desligado, ou, se `TURNSTILE_SECRET` estiver cadastrado, **todo POST falha com 403** (`src/app.ts:105-108`) e nenhum acesso é registrado. Confira com `GET /v1/acessos/resumo`.
4. **A identificação é obrigatória por padrão** (`public/sdk/identificacao.js:15`, `data-obrigatorio` padrão `true`). Pedir nome e e-mail antes de ler conteúdo gratuito é a maior barreira de adoção do produto e não tem métrica de abandono.
5. **Documentação desatualizada em números e endpoints** (detalhe na seção 2). Num MVP "documentado", isso conta.
6. **Conteúdo com marcas de rascunho:**
   - 9 fichas "Página em revisão" (perfis 4/13, empresas 2, vagas 2, ferramentas 1);
   - 23 de 27 eventos sem vídeo e 21 sem galeria;
   - `status` do card (ADR 9) usado em 0 de 49 programas.

**Métricas de sucesso possíveis** (já mensuráveis pela API ou por script):

| Métrica | Fonte | Meta sugerida para o MVP |
|---|---|---|
| Pessoas únicas por semana e por projeto | `GET /v1/acessos/resumo` | linha de base nas 4 primeiras semanas |
| Retorno (e-mail com acesso em 2 semanas distintas) | D1 `acessos` | ≥ 20% |
| Mensagens "Fala aê" por mês e tempo de resposta | D1 `mensagens` | resposta ≤ 7 dias |
| Fichas com 2 domínios de fonte / sem "em revisão" | `validar` + contagem | 100% / ≤ 3 |
| Itens do acervo em ≥ 2 projetos | `npm run cobertura` | de 38 para ≥ 50 |
| Links externos quebrados | script novo (seção 4, tarefa 7) | 0 nas fichas publicadas |
| Disponibilidade | `disponibilidade.yml` | 0 falhas em 30 dias |

---

## 2. Engenharia

**Arquitetura (boa e simples).**
- Um Worker em que os Static Assets servem `dist/v1` e o Hono cuida só de `/v1/saude`, `/v1/acessos*` e `/v1/mensagens` (`src/worker.ts:18-28`, `wrangler.jsonc:15`).
- Persistência por portas, com adaptadores D1 e em memória (`src/acessos/`, `src/mensagens/`).
- O build valida schema e integridade e gera OpenAPI a partir do Zod (`scripts/build.ts`, `scripts/lib/openapi.ts`).

**Testes.**
- 63 testes:
  - conteúdo real mais erros plantados (`tests/conteudo.test.ts`);
  - rotas, CORS, Turnstile, CSV, LGPD e retenção (`tests/acessos.test.ts`, `tests/mensagens.test.ts`).
- Lacunas:
  - Adaptadores D1 (`src/acessos/repositorio-d1.ts`, `src/mensagens/repositorio-d1.ts`): o SQL real não tem nenhum teste; só o adaptador em memória é testado.
  - `src/worker.ts`: falta o roteamento (`DINAMICOS`, linha 18) e a coerência com `run_worker_first` (`wrangler.jsonc:15`). Se as duas listas divergirem, uma rota cai em 404 sem nenhum teste acusar.
  - `public/sdk/identificacao.js`: 200 linhas sem teste e sem lint (está em `ignores`, `eslint.config.js:7`).
  - O teste de OpenAPI só confere 3 caminhos (`tests/conteudo.test.ts:208-212`).

**CI/CD.**
- `ci.yml` roda typecheck, lint, test e build, mas não roda `format:check` nem auditoria.
- `deploy.yml`:
  - dispara em todo push na `main` sem depender da CI (não há `workflow_run` nem `needs`);
  - roda `npm run verificar`, que não inclui lint (`package.json`, script `verificar`);
  - sem os segredos, termina **verde sem publicar** (`deploy.yml:17-19`), ou seja, falso positivo.
- `scripts/publicar.sh:37-43` faz `git add -A`, um commit único, `merge --no-ff` e push direto na `main`. Isso contradiz o próprio processo: commits por tema (`como-trabalhamos.md:22`) e `--ff-only` depois da CI verde (`ESTADO.md:28`). Com o ruleset exigindo o check `verificar`, o push do merge commit tende a ser recusado.

**Segurança.**
- Pontos fortes: CORS só para escrita, limite de corpo, Zod, token comparado em tempo constante (`app.ts:34-42`), CSV contra injeção de fórmula (`app.ts:45-49`) e cabeçalhos de segurança (`app.ts:77-83`).
- Riscos:
  - **Sem limite de taxa por IP.** A deduplicação é por e-mail (`app.ts:112-115`), então um robô com e-mails diferentes pode esgotar as 100 mil escritas/dia do D1 e encher a tabela `mensagens`. O binding `ratelimits` do Workers (janela de 10 s ou 60 s, por localização) serve como filtro leve, combinado com o Turnstile.
  - **E-mail na query string** em `DELETE /v1/acessos?email=` e `DELETE /v1/mensagens?email=` (`app.ts:144,213`) e em `GET /v1/mensagens?email=` (`app.ts:198`). Com o Workers Logs ligado (`wrangler.jsonc:31`), a URL com dado pessoal pode ir para os logs. Prefira corpo JSON no DELETE.
  - **zod com vulnerabilidade alta** em produção (relatório do `auditar`).
  - `_headers` estático sem `Strict-Transport-Security` (`public/_headers`). É menor, porque o workers.dev já força HTTPS.

**Observabilidade.**
- O log de erro é JSON (`app.ts:222-232`).
- `/v1/saude` devolve `versao` do `package.json`, que é sempre `1.0.0` (`worker.ts:16`, `package.json:3`). Com isso, a "versão nova no ar" não é verificável. A conferência de deploy depende do ID da versão do wrangler, visto à mão.
- Sem métrica de POST rejeitado (403, 400 e 413) nem alerta de cron falho.

**Dívidas técnicas.**
- **Docs desatualizadas:**
  - `docs/ARQUITETURA.md:74` diz 30 testes (são 63);
  - `ARQUITETURA.md:75` diz que a CI é "typecheck, testes e build" (agora inclui lint);
  - `ARQUITETURA.md:66` fala só de acessos e saúde (faltam mensagens);
  - `ARQUITETURA.md:67` diz "~120 arquivos, 3,8 MB" e `DECISOES.md:25` diz "abaixo de 4 MB" (são 291 arquivos e 15 MB).
  - A tabela de endpoints do `README.md:28-31` não traz `/v1/learn-tech/areas.json` nem `/v1/career/modelos-curriculo.json`.
- **OpenAPI impreciso:** `/v1/learn-tech/programas.json` aparece como lista de `Programa` completo (`openapi.ts:35`), mas é o resumo (`conteudo.ts:358-364`). As páginas não têm schema (`openapi.ts:38`).
- `looseObject` em programas e módulos (`src/schemas/learn-tech.ts`) aceita campos arbitrários, o que abre espaço para *drift* de contrato.
- **Categorias desalinhadas:**
  - `paginas/categorias.json` usa o slug `database`, e os programas usam `data-base`;
  - `comunicacao`, `gestao` e `tecnologia` não têm nenhum programa;
  - `ia` tem programa, mas não tem card;
  - não há regra de integridade categorias ↔ `categoryFilter` (só área ↔ programa, `conteudo.ts:250-253`).
- O Prettier nunca foi aplicado (31 arquivos).
- Mais de 10 branches antigas no remoto (`feature/tasks-28-10…31-10`, `developer`, `feature/claudeia-2026-10-27`).

**Riscos (probabilidade × impacto).**

| Risco | P | I | Mitigação |
|---|---|---|---|
| Spam nas rotas de escrita esgota o D1 ou enche `mensagens` | M | A | Turnstile + `ratelimits` + teste |
| Turnstile configurado só de um lado (todo POST com 403) | M | A | Conferir o resumo e documentar o par segredo/sitekey |
| Deploy "verde" sem publicar, ou publicar sem a CI passar | M | M | `needs`/`workflow_run` e falhar sem segredos |
| `publicar.sh` divergente do ruleset | A | M | Reescrever para o fluxo de PR |
| Dados pessoais em URL nos logs | M | M | DELETE com corpo |
| Mídia crescendo (15 MB hoje) | B | M | Limite no build e gatilho para o R2 (ADR 4) |
| Fontes externas apodrecendo (1.450 URLs únicas) | A | M | Verificador de links agendado |

---

## 3. Conteúdo

**Lacunas por recurso.**

| Recurso | Situação | Lacuna |
|---|---|---|
| `learn-tech/programas` | 49 programas; `ia` = 1 (801) e `fundamentos` = 1 (901); `status` em 0 | Trilhas fracas justamente em IA e fundamentos, que são porta de entrada. Os cards não diferenciam programa lançado de novidade |
| `learn-tech/paginas/categorias` | 14 cards | 3 sem programa, `ia` sem card e slug `database` ≠ `data-base` |
| `learn-tech/blog` | 45 artigos | 4 temas aguardando rascunho do autor (career #7) e nenhum artigo que use a própria API ou o processo como caso |
| `learn-tech/areas` | 6 áreas | Sem área de dados/IA própria (dados está em `back`) |
| `bootcamps/eventos` | 27 eventos | 23 sem vídeo, 21 sem galeria; 18 issues R aguardando relato |
| `career/perfis` | 13 perfis | 4 em revisão (31%) |
| `career/modelos-curriculo` | 4 modelos | Faltam back-end, QA/testes e suporte/infra |
| `career/empresas` e `vagas` | 41 e 23 | 2 e 2 em revisão |
| `tools/ferramentas` | 87 | Taak em revisão e sem site oficial (`PROXIMOS-PASSOS.md:23`); faltam ferramentas de teste (Playwright), mesmo com o ecossistema usando Playwright |
| Matriz de cobertura | 0 itens nos 4 projetos | Não há um "fio condutor" que atravesse os 4 sites |

**5 ideias de conteúdo novo de alto valor.**
1. `learn-tech/programas/902`: **Git e GitHub na prática: branch, commit por tema, PR e CI verde.** Fortalece `fundamentos`, usa o próprio fluxo do ecossistema como estudo de caso (`como-trabalhamos.md`) e relaciona `tools/ferramentas/vitest`.
2. `learn-tech/programas/802`: **IA no par de programação: do prompt ao teste verde.** Segunda trilha de `ia`, com quiz sobre revisar código gerado, evidência antes de "concluído" e segredos fora do prompt. Liga as issues de DevIA (tools #15, fichas `github-copilot`, `cursor`, `claude-code`).
3. `learn-tech/blog/como-consumir-uma-api-publica-de-conteudo`: **artigo prático com a própria API** (`/v1/openapi.json`, fetch com fallback local, cache de 5 min). Relaciona `hospedagens/cloudflare-workers` e `ferramentas/vitest`. É o primeiro conteúdo que vende a API como produto.
4. `career/modelos-curriculo/desenvolvedor-back-end-junior`: **modelo fictício de back-end júnior**. Hoje há estágio web, transição para dados, front-end júnior e CRM pleno; falta a vaga mais comum de back-end.
5. `learn-tech/blog/do-hackathon-ao-portfolio`: **do evento à vaga.** Primeiro item da cobertura nos **4 projetos**, com relacionados a `eventos:hackathon-inovacao-social-jf`, `vagas:*` (career), `ferramentas:*` (tools) e `programas:902`.

---

## 4. Plano de ação executável hoje (sem segredos e sem deploy)

Em ordem de prioridade. Cada tarefa cabe num commit por tema, na branch do dia.

### T1. Placar honesto de publicação
- **Objetivo:** "Publicação" só conta 100% quando não houver branch de trabalho com commits fora da `main`.
- **Arquivos:** `scripts/progresso.mjs:39-44`. Acrescentar `git rev-list --count main..HEAD` (e `origin/main..main`).
- **Pronto quando:** com a branch atual, `npm run progresso` mostra a API como "5 commit(s) fora da main" e Publicação < 100%. Depois do merge, volta a 100%.
- **Risco:** baixo, porque o script é só leitura.

### T2. Atualizar os dependentes vulneráveis e registrar
- **Objetivo:** zerar a alta do zod em produção.
- **Arquivos:** `package.json` e `package-lock.json` (`npm audit fix`, sem `--force`, ou `npm i zod@latest` na mesma major 4); `docs/engenharia/backlog.md:48`.
- **Pronto quando:** `npm run auditar` mostra 0 altas em produção na API; `npm run verificar` e `npm run lint` estão verdes; o relatório está versionado em `docs/engenharia/relatorios/`.
- **Risco:** médio. Mudanças no zod podem alterar mensagens ou o `toJSONSchema`, mas os 63 testes e o `validar` cobrem.

### T3. Testes do roteamento do Worker e coerência com o wrangler
- **Objetivo:** pegar divergência entre `DINAMICOS` (`src/worker.ts:18`) e `run_worker_first` (`wrangler.jsonc:15`).
- **Arquivos:** novo `tests/worker.test.ts`. Ler o `wrangler.jsonc` sem comentários e chamar `worker.fetch` com `ASSETS` e `DB` falsos. Se preciso, exportar `DINAMICOS`.
- **Pronto quando:** 5 a 8 testes novos verdes; `/v1/saude` e `/v1/acessos/resumo` vão ao Hono; `/v1/index.json` vai ao `ASSETS`; um teste falha se alguém acrescentar uma rota numa lista e não na outra.
- **Risco:** baixo.

### T4. Testar o SQL real dos adaptadores D1
- **Objetivo:** cobrir `repositorio-d1.ts` (acessos e mensagens), hoje sem teste.
- **Arquivos:** `tests/repositorio-d1.test.ts`. Usar o `node:sqlite` do Node 22+/24 com um *shim* mínimo de `D1Database` (`prepare/bind/all/run/first`), aplicando `migrations/*.sql`. A alternativa é `@cloudflare/vitest-pool-workers`, mas é mais pesada.
- **Pronto quando:** inserir, `existeDesde`, listar com filtros, resumir, apagar por e-mail e apagar antes de uma data passam contra SQLite real, inclusive o `CHECK` de projeto inválido.
- **Risco:** médio. O shim pode divergir do D1 em detalhes (o tipo de `meta.changes`). Documente o limite no próprio teste.

### T5. Limite de taxa e DELETE sem e-mail na URL
- **Objetivo:** fechar os dois riscos de segurança da seção 2.
- **Arquivos:**
  - `src/app.ts`: uma dependência opcional `limitar?: (chave) => Promise<boolean>`, aplicada nos dois POST, com chave `CF-Connecting-IP` + rota, respondendo 429;
  - `src/worker.ts`: ligar o binding `RATE_LIMITER` quando existir;
  - `wrangler.jsonc`: bloco `ratelimits` (entra no próximo deploy do autor);
  - DELETE aceitando `{ "email": ... }` no corpo, com a query mantida como legado e marcada *deprecated* no OpenAPI;
  - testes em `tests/acessos.test.ts` e `tests/mensagens.test.ts`; `docs/DECISOES.md` com um ADR 10.
- **Pronto quando:** testes novos de 429 e de DELETE por corpo estão verdes; sem o binding, o comportamento atual se mantém (teste); o OpenAPI lista 429.
- **Risco:** médio. Um limite agressivo pode bloquear uma escola num mesmo NAT; comece com 30 por 60 s por IP.

### T6. CI e deploy sem falso verde
- **Objetivo:** a CI cobre formato e o deploy só sai depois da CI.
- **Arquivos:**
  - `.prettierrc.json` e o código: rodar `npm run format` (criar o script `prettier --write`) num **commit isolado** só de formatação;
  - `.github/workflows/ci.yml`: passo `npm run format:check`;
  - `package.json`: `verificar` passa a incluir lint;
  - `.github/workflows/deploy.yml`: `on: workflow_run` da CI com `conclusion == success` e, sem segredos, `::warning::` com `exit 1` em `workflow_dispatch`;
  - `scripts/publicar.sh`: abrir PR (`gh pr create`) em vez de `merge --no-ff` + push na `main`.
- **Pronto quando:** `npm run format:check` passa local; `npm run verificar` roda o lint; o diff do `deploy.yml` mostra a dependência da CI; `publicar.sh` não contém mais `git push origin main`.
- **Risco:** médio. O commit de formatação é grande (31 arquivos), então deve ir separado dos commits de lógica para não poluir o *blame*.

### T7. Regras de integridade novas e verificador de links
- **Objetivo:** pegar desalinhamento de categorias e fontes mortas antes de publicar.
- **Arquivos:**
  - `scripts/lib/conteudo.ts`, dentro de `verificarIntegridade`:
    - aviso (não erro) para card de `paginas/categorias.json` sem programa;
    - erro para `categoryFilter` sem card de categoria (corrigir `database` → `data-base` e criar o card `ia` em `content/learn-tech/paginas/categorias.json`);
  - `scripts/verificar-links.mjs`: HEAD/GET com timeout e concorrência 8 nas URLs de `fontes`, `site_url` e `officialLink`, com relatório em `docs/engenharia/relatorios/links-AAAA-MM-DD.md`; script `npm run links` no `package.json`;
  - teste com erro plantado em `tests/conteudo.test.ts`.
- **Pronto quando:** `npm run validar` dá 0 erros com a correção aplicada; o teste plantado acusa o `categoryFilter` órfão; `npm run links` gera o relatório com contagem de 2xx, 3xx, 4xx e erros.
- **Risco:** baixo na regra. No verificador, alguns sites bloqueiam robôs (403), então classifique como "a conferir" e não como quebrado.

### T8. Docs e contrato em dia
- **Objetivo:** "documentado" vira verdade.
- **Arquivos:**
  - `README.md:20-39`: incluir `areas.json` e `modelos-curriculo.json`;
  - `docs/ARQUITETURA.md:66-67,74-75`: 63 testes, lint na CI, mensagens no Worker, 291 arquivos e 15 MB;
  - `docs/DECISOES.md:25`: ADR novo com o gatilho do R2, por exemplo dist > 50 MB;
  - `scripts/lib/openapi.ts:35`: schema `ProgramaResumo` derivado de `CAMPOS_RESUMO`, mais `modulesCount` e `hasQuiz`;
  - `scripts/build.ts`: `index.json` e `/v1/saude` com o SHA do commit (`git rev-parse --short HEAD` no build, gravado num `src/versao.gen.ts` ou em `dist/v1/versao.json`);
  - `tests/conteudo.test.ts`: todo `recurso.caminho` de `montarRecursos` tem um caminho correspondente no OpenAPI.
- **Pronto quando:** o novo teste de contrato fica verde e falha ao remover um caminho; `README` e `ARQUITETURA` batem com `npm test` e `du -sh dist`; `/v1/saude` (no `wrangler dev`) mostra o SHA.
- **Risco:** baixo.

---

## 5. Issues propostas para depois do MVP

Este repositório hoje não tem nenhuma issue. Proponho abrir estas na API, para o backlog sair do Markdown e ganhar rastreio.

### Issue 1. Votação de temas dos cards (ADR 9)
- **Contexto:** a issue learn-tech #120 pede votação dos temas dos programas futuros. O ADR 9 (`docs/DECISOES.md:53-57`) desenha a tabela `votos` e as rotas, mas falta a aprovação do autor e a lista de temas.
- **Critérios:**
  - migração `0003_votos.sql` com unicidade (email, tema);
  - `POST /v1/votos` com origem, Zod, Turnstile e limite de taxa, com testes de duplicidade e origem;
  - `GET /v1/votos/resumo` público só com contagens, documentado no OpenAPI;
  - finalidade "votação" na `paginas/privacidade.json`.
- **Labels:** `enhancement`, `api`, `privacidade`, `learn-tech`.

### Issue 2. Identificação opcional e medição de abandono
- **Contexto:** o SDK exige nome e e-mail por padrão (`public/sdk/identificacao.js:15`), o que pode afastar leitores de conteúdo gratuito. Não há dado sobre quantos fecham o formulário.
- **Critérios:**
  - decisão registrada em ADR (obrigatório ou opcional por site);
  - contador anônimo de "formulário exibido / enviado / dispensado", sem dado pessoal;
  - painel no `GET /v1/acessos/resumo` com a taxa de conversão;
  - `PRIVACIDADE.md` atualizada.
- **Labels:** `produto`, `sdk`, `privacidade`, `metricas`.

### Issue 3. Testes e lint do SDK `identificacao.js`
- **Contexto:** são 200 linhas rodando nos 4 sites, fora do ESLint (`eslint.config.js:7`) e sem teste. Uma regressão derruba a identificação no ecossistema inteiro.
- **Critérios:**
  - testes com `happy-dom` ou `jsdom` para armazenamento bloqueado, `data-projeto` inválido, 1 POST por sessão e limpeza no 400;
  - SDK incluído no lint;
  - teste e2e simples num HTML local servido pelo `wrangler dev`.
- **Labels:** `testes`, `sdk`, `qualidade`.

### Issue 4. Verificador de links agendado na CI
- **Contexto:** são cerca de 1.450 URLs externas no `content/`, e a regra de 2 domínios só vale se as fontes continuarem vivas. A tarefa T7 cria o script; falta rodar sozinho.
- **Critérios:**
  - workflow semanal `links.yml` com o relatório como artefato;
  - abertura automática de issue com a lista de links quebrados (via `gh`), sem duplicar issue aberta;
  - lista de exceções versionada para domínios que bloqueiam robôs.
- **Labels:** `conteudo`, `ci`, `manutencao`.

### Issue 5. Mídia no R2 e orçamento de tamanho no build
- **Contexto:** `dist/` passou de menos de 4 MB (ADR 4) para 15 MB, com 11 MB de mídia, e as galerias pendentes (21 eventos) vão multiplicar isso.
- **Critérios:**
  - o build falha acima de um orçamento configurável e avisa a 80%;
  - ADR com o gatilho e o desenho do R2 (URL pública, cache e nomes imutáveis);
  - script de migração das galerias para o R2 com a validação `mídia ausente` adaptada.
- **Labels:** `infra`, `performance`, `adr`.

### Issue 6. Contrato tipado publicado para os sites
- **Contexto:** os sites espelham os tipos à mão (`types.ts` do bootcamps, testes de contrato da career e do tools, segundo `cache-e-versionamento.md:6`), e `looseObject` aceita campos não previstos.
- **Critérios:**
  - o build gera `dist/v1/tipos.d.ts` ou JSON Schema por recurso a partir do Zod;
  - um teste falha quando um campo do resumo de programas é removido (regra "nunca remover em /v1");
  - o bootcamps consome os tipos gerados em vez do `types.ts` manual;
  - changelog do contrato em `docs/engenharia/`.
- **Labels:** `api`, `contrato`, `dx`.

---

## 6. Melhorias do processo de trabalho (autor + Claude)

1. **Abrir issues no repositório da API e ligar os commits a elas.** O backlog vive em Markdown (`backlog.md`, `PROXIMOS-PASSOS.md`) e o repositório tem 0 issues. Issue com critério de pronto dá rastreio (`fixes #n`), permite o placar ler o GitHub e tira o autor do papel de lembrar.
2. **Trocar `publicar.sh` pelo fluxo de PR já descrito.** Hoje o script contradiz o `como-trabalhamos.md` (commit único com `git add -A`, `--no-ff` e push na `main`). Ferramenta que contradiz o processo vence o processo.
3. **"Publicado" quer dizer na `main` e no ar, com o SHA conferível.** As tarefas T1 e T8 tornam isso automático: o placar acusa branch pendente e `/v1/saude` mostra o commit. Isso acaba com o "acreditar no terminei" (`como-trabalhamos.md:27`).
4. **Limitar o WIP a uma branch de trabalho por repositório e apagar as velhas.** Há mais de 10 branches `feature/tasks-*` no remoto. Branch mergeada deve ser apagada no merge (opção do GitHub), e o `ESTADO.md` deve citar só a ativa.
5. **Separar pendências do autor de pendências de conteúdo do autor.** `PROXIMOS-PASSOS.md` tem 16 itens abertos, vários com 5 dias ou mais (itens 5 a 9 desde 30 e 31/10), e o placar pesa 15%. Sugiro limite de 7 itens ativos, com o resto em "aguardando insumo" fora do placar. Também vale dar ao Claude uma tarefa por item que ele possa preparar, como modelo de resposta ou rascunho para aprovar.
6. **Commit de formatação e de dependências sempre isolado.** Evita repetir as entregas de 160 arquivos (`como-trabalhamos.md:22`) e mantém o diff de lógica revisável em 5 a 10 minutos.
7. **Medição antes de nova frente de conteúdo.** Rodar e2e, Lighthouse e o primeiro *Run* do monitor (`PROXIMOS-PASSOS.md:13`) é o que falta para o critério "estável e público" e custa menos de 30 minutos ao autor. Proponho que nenhum lote novo de conteúdo comece antes disso.
8. **Documentação com número gerado, não digitado.** Contagens em docs (testes, tamanho, arquivos) ficam velhas em dias, como mostra `ARQUITETURA.md`. Gere um bloco `<!-- gerado -->` no build ou cite o comando em vez do número.

Fontes da comparação com boas práticas: [Cloudflare Workers — Rate Limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/); [Classmethod — experimentos de rate limit na Cloudflare](https://dev.classmethod.jp/en/articles/cloudflare-rate-limit-experiments/).
