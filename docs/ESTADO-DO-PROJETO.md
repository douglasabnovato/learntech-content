# Estado do projeto: learntech-content (API)

**Atualizado em 10/11/2026.** A régua dos 12 critérios está em [`MVP.md`](MVP.md). Este arquivo responde a três perguntas: onde o projeto está, o que já fizemos e o que queremos fazer. Para trazer arquivos novos ou mudar a estrutura, siga [`COMO-EVOLUIR.md`](COMO-EVOLUIR.md).

## Onde está

| Item | Situação |
|---|---|
| Produção | `https://learntech-content.douglasabnovato.workers.dev` (Cloudflare Workers + D1 + Static Assets). `GET /v1/saude` responde `ok` |
| Repositório | `main` protegida (ruleset "main protegida": check `verificar` obrigatório, sem force push). Fluxo: `feature/tasks-DD-MM-AAAA` → `developer` → `main`, só fast-forward |
| CI | `ci.yml` com typecheck, lint, 126 testes e build. `deploy.yml` só roda com a variável `DEPLOY_AUTOMATICO = sim` |
| Deploy | Manual com `npm run deploy`, na máquina do autor, até os segredos da Cloudflare estarem no GitHub (#9) |
| Conteúdo servido | 49 programas, 46 artigos, 27 eventos, 43 empresas, 24 vagas, 14 perfis, 97 ferramentas, 12 hospedagens (índice da API em 10/11) |
| Placar (`npm run progresso`) | 79/100 em 10/11, logo depois de as cinco integrações irem para a `main` |
| e2e contra a produção | 10/11: 52 de 55. Os 10 fluxos passam; o axe acusa contraste e nome acessível (corrigidos nas integrações, com axe local zerado); 3 capturas falham pela rolagem horizontal da home do learn-tech (learn-tech#139, corrigida na integração) |

## O que fizemos

| Período | Entregas |
|---|---|
| 27 a 29/10 | A API passa a ser a fonte única dos quatro sites. Primeira rodada de conteúdo a partir do `hd/` |
| 30 e 31/10 | Levas 2 a 4 de conteúdo, Capivara Tech, regra de fechamento de leva |
| 01/11 | Cobertura entre projetos, placar de 0 a 100, backlog de engenharia, cabeçalhos de segurança, `no-store` nas rotas dinâmicas, log de erro estruturado |
| 03/11 | Leva 1 publicada nos cinco repositórios, `main` protegida, actions em v5, lint obrigatório, lote de conteúdo a partir das issues dos quatro sites, `status` opcional no card de programa (ADR 9) |
| 05/11, MVP | Limite de taxa nas escritas e `DELETE` com e-mail no corpo (ADR 10); testes do Worker e do D1 com as migrações; zod e hono sem vulnerabilidade; cópias geradas a partir de `montarRecursos`; sitemap com hospedagens; deploy só depois da CI verde; lote 4 de conteúdo (10 itens) e card de IA |
| 05/11, estabilidade | e2e contra a produção sem flutuação (visitante já identificado, iframes de terceiros fora do axe); deploy automático sem ficar vermelho a cada push; `COMO-EVOLUIR.md` nos cinco repositórios |
| 06/11, fluxo de agentes | Fase 0: estados `extraido`, `triado`, `produzido` e `exibido` no acervo, com `triagem` e `etapas`; `docs/processo/agentes.md`; contratos dos quatro sites em `docs/contratos/`; `CLAUDE.md` nos cinco repositórios; 107 testes |
| 06/11 | Este documento em cada repositório, README com o estado e issues novas para as lacunas (#10 e #11) |
| 09/11 | Fase 1 do fluxo de agentes (`hd:extrair`, triador, A1 e gabarito); uso dos 502 documentos e das fotos do hd; destinos em formato único `projeto/recurso/id` (#18); galeria no programa e no artigo (ADR 12) |
| 10/11 | Página `/conheca` (textos na API e contagem do blog no índice, #21); cinco integrações na `main` e deploy (versão `40e6d2df`); thumbs da career em WebP (career#31); e2e e Lighthouse contra a produção; `MVP.md` |

Detalhes: `docs/engenharia/diagnostico-mvp-2026-11-03.md`, `docs/engenharia/mvp-2026-11-03.md` e `docs/processo/conversas/2026-11-03-mvp-cinco-projetos.md`.

## O que queremos fazer

Todas as issues têm o label `proximos-passos` e pelo menos três critérios de entrega. A ordem é a sugerida.

| Ordem | Issue | O quê | Tipo |
|---|---|---|---|
| 1 | [#9](https://github.com/douglasabnovato/learntech-content/issues/9) | Deploy automático com os segredos da Cloudflare | infra, decisão do autor |
| 2 | [#10](https://github.com/douglasabnovato/learntech-content/issues/10) | e2e e acessibilidade agendados na CI | qualidade |
| 3 | [#6](https://github.com/douglasabnovato/learntech-content/issues/6) | Testes e lint do SDK `identificacao.js` | testes |
| 4 | [#7](https://github.com/douglasabnovato/learntech-content/issues/7) | Verificador de links agendado | qualidade |
| 5 | [#11](https://github.com/douglasabnovato/learntech-content/issues/11) | Lighthouse 13 e auditoria sem vulnerabilidade alta | engenharia |
| 6 | [#8](https://github.com/douglasabnovato/learntech-content/issues/8) | Mídia no R2 (só se couber no plano gratuito) e orçamento de tamanho no build | performance |
| - | [#5](https://github.com/douglasabnovato/learntech-content/issues/5) | Identificação opcional: **não autorizada** pelo autor em 10/11. A identificação obrigatória continua | decisão do autor |
| 8 | [#4](https://github.com/douglasabnovato/learntech-content/issues/4) | Votação de temas nos cards de programa (ADR 9) | produto, decisão do autor |

### Próximas remessas de conteúdo
Os arquivos novos do `hd/` entram pelo fluxo de agentes de `docs/processo/agentes.md` (fase 0 concluída em 06/11; próximas: triador, produtores, verificador e piloto com `gdg_jf`), sobre o processo de 10 etapas de `docs/processo/README.md`. Resumo em `COMO-EVOLUIR.md`. Pendências de conteúdo e do autor: `PROXIMOS-PASSOS.md`.

## Decisões que dependem do autor
- Cadastrar `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` e criar `DEPLOY_AUTOMATICO = sim` (#9). O Claude não lê nem cadastra segredos.
- Modal de identificação obrigatório ou opcional (#5).
- Votação de temas nos programas (#4).

## Os quatro sites

| Site | Estado do projeto |
|---|---|
| learn-tech | [`docs/ESTADO-DO-PROJETO.md`](https://github.com/douglasabnovato/learn-tech/blob/main/docs/ESTADO-DO-PROJETO.md) |
| bootcamps | [`docs/ESTADO-DO-PROJETO.md`](https://github.com/douglasabnovato/bootcamps/blob/main/docs/ESTADO-DO-PROJETO.md) |
| career | [`docs/ESTADO-DO-PROJETO.md`](https://github.com/douglasabnovato/career/blob/main/docs/ESTADO-DO-PROJETO.md) |
| tools | [`docs/ESTADO-DO-PROJETO.md`](https://github.com/douglasabnovato/tools/blob/main/docs/ESTADO-DO-PROJETO.md) |

## Como manter este arquivo
Ao fim de cada rodada: acrescente uma linha em "O que fizemos", atualize "Onde está" com os números de `npm run progresso` e `npm test`, e troque as issues fechadas por novas em "O que queremos fazer". O ponto de entrada das conversas continua sendo `docs/processo/ESTADO.md`.
