# Backlog de engenharia do MVP

Itens mapeados em 30/10/2026 para levar a API e os quatro sites ao nível de MVP de qualidade: arquitetura, testes, CI/CD, performance, acessibilidade, responsividade, UX, armazenamento, segurança, SEO, observabilidade e processo. `[x]` = feito e verificável no repositório; `[ ]` = a fazer. O `npm run progresso` lê este arquivo.

Regra: um item só é marcado com evidência (arquivo, script, relatório). O diagnóstico com notas de 0 a 10 refina esta lista.

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
- [ ] Diagnóstico de engenharia com notas de 0 a 10 por critério e por projeto, com evidências
- [ ] Documento de arquitetura do ecossistema: diagramas de contexto e de containers, contratos API ↔ sites
- [ ] Registro de decisões de arquitetura (ADRs) para as escolhas já feitas (API única, cópias de reserva, D1, Workers)
- [ ] Pasta `docs/` em cada site: setup do zero, arquitetura e decisões (learn-tech, bootcamps, career, tools)

## Qualidade de código e testes
- [ ] Lint e formatação padronizados nos cinco projetos (incluir career e tools)
- [ ] Testes unitários no bootcamps
- [ ] Testes nos sites estáticos career e tools
- [ ] Testes de ponta a ponta dos fluxos principais (abrir card, página de detalhe, filtros) com Playwright
- [ ] CI na career e checagem de build e teste obrigatória antes do merge nos cinco repositórios

## Experiência, performance e acessibilidade
- [ ] Metas de performance (Core Web Vitals, tamanho de bundle) medidas com Lighthouse nos quatro sites
- [ ] Acessibilidade WCAG 2.2 AA verificada (contraste, teclado, textos alternativos, rótulos)
- [ ] Responsividade testada nos breakpoints principais, com registro
- [ ] Design system mínimo documentado (cores, tipografia, componentes) e consistente entre os sites
- [ ] SEO e compartilhamento: metadados, sitemap e Open Graph

## Dados, segurança e operação
- [ ] Cópia de reserva das categorias do learn-tech gerada pelo `exportar-copias`
- [ ] Versionamento e política de cache da API documentados
- [ ] Cabeçalhos de segurança e auditoria de dependências (npm audit) nos projetos com Node
- [ ] Observabilidade: logs e erros da API e monitoramento de disponibilidade dos sites
