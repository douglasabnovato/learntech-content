# Backlog de engenharia do MVP

Itens mapeados em 30/10/2026 para levar a API e os quatro sites ao nível de MVP de qualidade: arquitetura, testes, CI/CD, performance, acessibilidade, responsividade, UX, armazenamento, segurança, SEO, observabilidade e processo. `[x]` = feito e verificável no repositório; `[ ]` = a fazer. O `npm run progresso` lê este arquivo.

Regra: um item só é marcado com evidência (arquivo, script, relatório). O diagnóstico com notas de 0 a 10 refina esta lista.

Regra (03/11/2026): teste ou script que o Claude escreve sem conseguir rodar fica descrito como "escrito, não executado" até o autor rodar e ver verde. Lição dos 2 testes do bootcamps que falharam na primeira execução por comparar referência (`toBe`) em vez de conteúdo (`toStrictEqual`).

## Base já existente
- [x] API: schemas Zod e regras de integridade no build (learntech-content)
- [x] API: testes automatizados com Vitest (learntech-content)
- [x] API: CI em todo push e pull request (learntech-content)
- [x] API: deploy na Cloudflare protegido por segredos (learntech-content)
- [x] Sites: cópias de reserva geradas a partir da API (learn-tech, bootcamps, career, tools)
- [x] Processo de conteúdo documentado, com checagens `leva:status` e `cobertura` (learntech-content)
- [x] CI nos sites learn-tech, bootcamps e tools
- [x] Testes de dados no learn-tech (`dados.test.js`)

## Diagnóstico e arquitetura
- [x] Diagnóstico de engenharia com notas de 0 a 10 por critério e por projeto, com evidências (`diagnostico-2026-11-01.md`)
- [x] Documento de arquitetura do ecossistema: diagramas de contexto e de containers, contratos API ↔ sites (`arquitetura-ecossistema.md`)
- [x] Registro de decisões de arquitetura (ADRs) para as escolhas já feitas (API única, cópias de reserva, D1, Workers) (`docs/DECISOES.md`, ADRs 1 a 8)
- [x] Pasta `docs/` em cada site: setup do zero, arquitetura e decisões (learn-tech, bootcamps, career, tools) (`<site>/docs/README.md`)

## Qualidade de código e testes
- [x] Lint padronizado nos cinco projetos, com 0 erros (03/11: API, bootcamps, career e tools rodados pelo autor; learn-tech zerado de 70 para 0 na branch `feature/tasks-03-11-2026`). Lint obrigatório na CI da API e do learn-tech. A formatação geral com Prettier fica para uma rodada própria
- [x] Testes unitários no bootcamps (`eventApi.test.ts`, `events.data.test.ts`: 7 de 7 verdes em 03/11, na máquina do autor e na CI)
- [x] Testes nos sites estáticos career e tools (`tests/*.test.js`: 12 e 7 testes passando com `node --test` em 01/11)
- [ ] Testes de ponta a ponta dos fluxos principais (abrir card, página de detalhe, filtros) com Playwright. Escritos em `e2e/`; falta rodar (guia, etapa 3)
- [x] CI na career (`.github/workflows/ci.yml`) e testes na CI do tools e do bootcamps
- [x] Checagem da CI obrigatória antes do merge nos cinco repositórios (ruleset `main protegida` ativo em 03/11: check `verificar`, sem force push e sem apagar a `main`)
- [x] Ações da CI atualizadas para `checkout@v5` e `setup-node@v5` (Node 24) nos cinco repositórios (03/11)
- [x] Verificação estática da career rodando no Linux da CI, sem `continue-on-error` (barras do `verificar.ps1` corrigidas em 03/11)

## Experiência, performance e acessibilidade
- [ ] Metas de performance (Core Web Vitals, tamanho de bundle) medidas com Lighthouse nos quatro sites. Script `npm run ux:lighthouse` pronto; falta rodar (guia, etapa 4)
- [ ] Acessibilidade WCAG 2.2 AA verificada (contraste, teclado, textos alternativos, rótulos). Teste axe em `e2e/acessibilidade.spec.mjs`; falta rodar
- [ ] Responsividade testada nos breakpoints principais, com registro. Capturas em `e2e/capturas.spec.mjs`; falta rodar
- [x] Design system mínimo documentado (cores, tipografia, componentes) e consistente entre os sites (`design-system.md`)
- [x] SEO e compartilhamento: metadados, sitemap e Open Graph (Open Graph e canonical nos 4 `index.html`; `npm run sitemaps`; robots nos sites do Vercel)

## Dados, segurança e operação
- [x] Cópia de reserva do catálogo de programas do learn-tech gerada pelo `exportar-copias` (`programasCatalogo.js`, com teste); o detalhe dos programas novos continua exigindo a API
- [x] Cópia de reserva das categorias do learn-tech gerada pelo `exportar-copias` (com teste `categorias.test.js`)
- [x] Versionamento e política de cache da API documentados (`cache-e-versionamento.md`; cache em `public/_headers` e `no-store` nas rotas dinâmicas)
- [x] Cabeçalhos de segurança nos sites do Vercel (`vercel.json` do learn-tech e do bootcamps)
- [x] Cabeçalhos de segurança na API (`public/_headers` e middleware em `src/app.ts`, com teste)
- [ ] Auditoria de dependências (`npm audit`) com relatório nos projetos com Node
- [x] Monitoramento de disponibilidade da API e dos sites (`.github/workflows/disponibilidade.yml`, a cada 6 horas)
- [x] Observabilidade: logs e erros da API (Workers Logs ligado em `wrangler.jsonc`, `onError` com log JSON estruturado, `/v1/saude`)
