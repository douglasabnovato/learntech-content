# Processo: levar um repositório a MVP finalizado

Criado em 03/11/2026, quando o autor pediu que os cinco projetos chegassem a um MVP com documentação, plano de ação, código, publicação e issues de próximos passos. É um processo repetível: rode-o por repositório e aperfeiçoe esta página a cada rodada.

## Definição de MVP finalizado (por repositório)
- [ ] O site ou a API está no ar, com a `main` igual à branch publicada (`npm run progresso`, Publicação).
- [ ] CI obrigatória verde, com lint e testes.
- [ ] README que diz a verdade: o que é, como rodar, de onde vêm os dados, números atuais.
- [ ] Jornadas principais funcionando, com e sem a API (reserva honesta).
- [ ] Acessibilidade básica: um `<h1>` por página, nomes acessíveis, foco visível e navegação por teclado.
- [ ] SEO básico: título, descrição e canonical por página; sitemap.
- [ ] Pelo menos 5 issues de próximos passos, cada uma com 3 ou mais critérios de entrega verificáveis.

## Etapas
| # | Etapa | Quem | Saída |
|---|---|---|---|
| 1 | **Recepção:** estado do Git, branches de integração e PRs abertos | Claude | Branch do dia criada a partir da `main` (`fluxo-git.md`) |
| 2 | **Diagnóstico de produto e engenharia:** proposta de valor, jornadas, lacunas, arquitetura, testes, a11y, SEO, segurança, conteúdo | Agente por repositório, só leitura | `docs/.../diagnostico-mvp-AAAA-MM-DD.md` no próprio repositório |
| 3 | **Plano de ação:** até 8 tarefas executáveis no dia, cada uma com critério de pronto e risco | Mesmo agente | Seção 4 do diagnóstico |
| 4 | **Execução:** um agente por repositório, sem commit, conferindo lint, testes e build depois de cada tarefa | Agentes | `docs/.../06-mvp-AAAA-MM-DD.md` com evidências |
| 5 | **Conteúdo novo:** lote pela API (pesquisa → validação → revisão por amostra → cópias) | Claude e agentes de pesquisa | `docs/processo/lotes/` |
| 6 | **Integração:** `npm run copias` e `sitemaps`; testes de todos os sites | Claude | Cópias em dia |
| 7 | **Publicação:** commits por tema → feature → developer → main | Claude, com autorização do autor | `fluxo-git.md` |
| 8 | **Issues de próximos passos:** pelo menos 5 por repositório, com 3 ou mais critérios de entrega | Claude | Issues com label `proximos-passos` |
| 9 | **Relatório:** o que mudou, escolhas feitas, pendências do autor e melhorias do processo | Claude | `conversas/AAAA-MM-DD-*.md` |

## Regras de paralelismo
- **Um agente por repositório.** Dois agentes nunca editam o mesmo repositório ao mesmo tempo, exceto em arquivos explicitamente separados no brief (por exemplo, "não edite `scripts/exportar-copias.mjs`").
- **Os agentes não fazem commit.** O Claude principal revisa as evidências e commita por tema.
- **Cópias geradas** (`data/*.js`, `js/*.js` da career, `events.data.ts`, `constants/*Data.js` do learn-tech) só mudam por `npm run copias`.

## Rodadas
| Data | Repositórios | Observações |
|---|---|---|
| 2026-11-03 | os cinco | Primeira rodada. Ver `conversas/2026-11-03-mvp-cinco-projetos.md` |
