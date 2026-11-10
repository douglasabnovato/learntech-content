# MVP: learntech-content (API)

**Nível:** N3 (produto). Proposta do Claude em 10/11/2026; o autor confirma.
**Resumo:** 5 de 12 aplicáveis atendidos
**Finalizado:** não. Falta do código: fluxo na CI, falhas com teste, desempenho no celular, axe e segurança confirmados na produção. Falta do autor: hipótese (#23) e medição de uso (#24), alertas do Dependabot e levar as integrações para a `main`.

Régua: `engenharia/arquitetura/padroes.md`. "Atende" só com comando, data e resultado.

## Problema e público
API de conteúdo do ecossistema learnTECH: um só lugar para os programas, eventos, empresas, vagas, perfis e ferramentas que alimentam os quatro sites (README).

## Critérios (10/11/2026)

| # | Critério | Situação | Evidência |
|---|---|---|---|
| 1 | Problema e público claros | Atende | API de conteúdo do ecossistema learnTECH: um só lugar para os programas, eventos, empresas, vagas, perfis e ferramentas que alimentam os quatro sites (README). |
| 2 | Hipótese a validar | Não atende | Nenhuma hipótese escrita. A aposta é do autor: [learntech-content#23](https://github.com/douglasabnovato/learntech-content/issues/23). |
| 3 | Fluxo principal completo | Parcial | `npm run e2e` contra a produção em 10/11/2026: os 10 testes de fluxo dos quatro sites passam com os dados da API. O e2e ainda não roda na CI ([#10](https://github.com/douglasabnovato/learntech-content/issues/10)). |
| 4 | Escopo enxuto | Atende | Seção "Fora do MVP" abaixo, com as decisões do autor. |
| 5 | Medição de uso | Não atende | Sem painel de visitas. A API registra só as identificações (D1). Ferramenta gratuita a escolher: [learntech-content#24](https://github.com/douglasabnovato/learntech-content/issues/24). |
| 6 | Falhas tratadas | Parcial | `tests/worker.test.ts` e `tests/repositorio-d1.test.ts` cobrem erro de validação e de banco; os sites têm cópia de reserva quando a API falha. Falta teste do SDK `identificacao.js` ([#6]({API}/6)). |
| 7 | Desempenho aceitável | Parcial | A régua mede LCP de site; a API não tem tela. `curl -w %{time_total}` em 10/11/2026, 3 vezes: `/v1/index.json` 0,19 / 0,15 / 0,14 s e `/v1/learn-tech/programas.json` 0,14 / 0,17 / 0,14 s. O LCP dos sites está nos MVP.md de cada um. |
| 8 | Acessibilidade básica | Parcial | A API não tem tela própria. O modal do SDK de identificação aparece nos quatro sites e não tem teste de axe próprio ([#6](https://github.com/douglasabnovato/learntech-content/issues/6)). |
| 9 | Segurança e conformidade | Parcial | `npm audit --omit=dev` em 10/11/2026: 0 vulnerabilidades. Alertas do Dependabot desligados (`gh api .../dependabot/alerts` responde 403 em 10/11/2026; ligar é do autor). Sem segredo no código. Limite de taxa nas escritas e `DELETE` com e-mail no corpo (ADR 10). |
| 10 | Entrega confiável | Atende | `gh api repos/douglasabnovato/learntech-content/rulesets` em 10/11/2026: ruleset "main protegida" ativo (check `verificar` obrigatório, sem force push, sem apagar a `main`). CI em todo push e PR. |
| 11 | Testes dos fluxos críticos | Atende | CI da `developer` em 10/11/2026 (run 42852462272): 9 arquivos, 126 testes passando, nenhum pulado. |
| 12 | Documentação honesta | Atende | Os 18 comandos `npm run` citados no README e no `COMO-EVOLUIR.md` existem no `package.json` (conferido em 10/11/2026). |

## Fora do MVP
- Domínio próprio e qualquer serviço pago: o ambiente fica gratuito (decisão do autor, 10/11/2026).
- Identificação opcional: a identificação obrigatória continua ([learntech-content#5](https://github.com/douglasabnovato/learntech-content/issues/5), não autorizada pelo autor em 10/11/2026).
- Votação de temas nos cards de programa ([learntech-content#4](https://github.com/douglasabnovato/learntech-content/issues/4), aguardando o autor).
- Mídia no R2 só se couber no plano gratuito ([#8](https://github.com/douglasabnovato/learntech-content/issues/8)).

## Histórico
- 10/11/2026: primeira tabela, depois do ciclo de acessibilidade e busca nos quatro sites.
