# 2026-11-03 a 05 — processo: MVP dos cinco projetos

## Pedido
- Analisar tema, conteúdo e README de cada repositório e pesquisar conteúdo novo, com olhar de produto e de engenharia.
- Documentar o processo e o plano de ação de cada repositório e executar na branch do dia, seguindo feature → developer → main.
- Deixar os projetos como um bom MVP, com pelo menos 5 issues de próximos passos por projeto (3 ou mais critérios de entrega cada).
- Em 05/11: garantir que tudo esteja no GitHub e em produção.

## Feito
- **Branch do dia 03/11 fechada:**
  - commits da frente de estabilidade (CI v5, lint do learn-tech, docs);
  - correção da checagem de acessibilidade da career, que exigia um modal removido em 29/10;
  - fast-forward nas branches de integração e na `main` dos cinco repositórios;
  - PRs #3 (API), #54 (tools), #27 (career) e #126 (learn-tech) fechados como merged.
- **Diagnóstico por repositório:** produto, engenharia, conteúdo, plano de ação, issues e processo. Cópia versionada em cada repositório:
  - API: `docs/engenharia/diagnostico-mvp-2026-11-03.md`;
  - sites: `docs/claudeia/diagnostico-mvp-2026-11-03.md`.
- **Execução, um agente por repositório** (relatório em `docs/.../06-mvp-2026-11-03.md` ou `docs/engenharia/mvp-2026-11-03.md`):
  - **API:**
    - 63 → 102 testes;
    - limite de taxa nas escritas e DELETE com o e-mail no corpo (ADR 10);
    - zod e hono sem vulnerabilidades;
    - deploy só depois da CI;
    - `publicar.sh` com `--ff-only`;
    - placar honesto;
    - sitemap com as hospedagens.
  - **learn-tech:**
    - chunk inicial de 496 → 284 kB;
    - reserva honesta, com "Conteúdo indisponível agora";
    - textos em português, um `<h1>` por página e ARIA;
    - abas acessíveis;
    - SEO por rota (título, descrição, canonical, `noindex` no 404);
    - 24 → 30 testes.
  - **bootcamps:**
    - filtro por status e categoria na URL;
    - Voltar seguro;
    - relacionados sem API;
    - logo de 205 → 3,9 KB;
    - galeria com `<dialog>`;
    - acessibilidade;
    - `react-router` sem vulnerabilidades;
    - 7 → 25 testes.
  - **career:**
    - Prettier e lint na CI;
    - `urlSegura` nos links;
    - canonical e `og:url` no detalhe;
    - `404.html`;
    - README real;
    - 12 → 15 testes.
  - **tools:**
    - resposta tardia da API reaproveitada;
    - SEO do detalhe;
    - teclado nas abas;
    - "Tentar novamente";
    - README real;
    - `verificar.ps1` contando as cópias;
    - 7 → 9 testes.
- **Gerador de cópias:**
  - usa `montarRecursos`, como o build: os relacionados saem com título e URL, e o catálogo leva o `status`;
  - roda com `tsx`;
  - os relacionados de career e tools usam `?tipo=&id=` e `?id=`, iguais ao sitemap e ao canonical.
- **Conteúdo, lote 4 (10 itens):**
  - tools: Render, Supabase, Google Search Console, GitHub Actions e Playwright;
  - career: Zé Delivery, Nubank, Remotar, Loiane Groner e um modelo de currículo sênior de back-end;
  - card de IA e título "Banco de Dados" nas categorias do learn-tech;
  - revisão independente: 3 itens ok e 2 corrigidos (Zé Delivery e Remotar).
- **Processo:** `fluxo-git.md` e `mvp-por-repositorio.md`.
- **Issues de próximos passos** (label `proximos-passos`, cada uma com 3 ou 4 critérios):
  - API: #4 a #9;
  - learn-tech: #127 a #132;
  - bootcamps: #70 a #74;
  - career: #28 a #32;
  - tools: criadas em 05/11.

## Decisões (do Claude, para revisão do autor)
- **Commit da frente de estabilidade:** a branch do dia 03/11 só podia ser fechada com ela, e todos os testes passavam.
- **Nome das branches de integração:** foram mantidos como estão (`developer`, `developer-mvp-2026`, `developer-mvp-2026-2`). Uniformizar é proposta.
- **Fora desta rodada, porque dependem do autor ou de um risco maior:**
  - modal obrigatório;
  - lockfile do learn-tech;
  - Testing Library;
  - Prettier em massa no bootcamps;
  - CSP;
  - remoção de assets órfãos.
  Cada um virou issue.
- **Deploy da API:** com `npm run deploy` na máquina do autor (wrangler autenticado), porque o autor pediu produção e os segredos do GitHub não existem.

## Aprendizados e ajustes de processo
- Uma rodada que fica dias sem commit some do GitHub, e o autor não consegue revisar. **Regra nova:** ao fim de cada etapa de execução, commit e push da branch, mesmo antes do merge.
- O ruleset recusa o push da `main` logo após a CI; repetir depois de 10 a 30 s (`fluxo-git.md`).
- Um agente por repositório com fronteiras de arquivo explícitas funcionou sem conflito. Arquivo compartilhado (o gerador de cópias) fica com o Claude principal.
- Script de criação de issues em lote precisa ser idempotente: ele parou no tools e precisou ser retomado.

## Pendências
- **Autor:**
  - revisar as escolhas deste registro;
  - decidir as issues com label `decisao-do-autor`;
  - cadastrar os segredos da Cloudflare (API #9).
- **Claude, na próxima conversa:**
  - executar as issues `proximos-passos` por prioridade;
  - lote de conteúdo com as respostas das issues R.
