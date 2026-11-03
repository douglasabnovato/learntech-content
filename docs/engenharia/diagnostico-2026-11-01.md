# Diagnóstico de engenharia, 01/11/2026

Notas de 0 a 10 por critério e por projeto, com a evidência de cada uma. Regra: sem medição, a nota de performance, acessibilidade e responsividade fica em no máximo 5, porque o comportamento ainda não foi provado. Refazer o diagnóstico depois de rodar `npm run e2e` e `npm run ux:lighthouse`.

| Critério | API | learn-tech | bootcamps | career | tools |
|---|---|---|---|---|---|
| 1. Arquitetura e documentação | 8 | 5 | 5 | 6 | 5 |
| 2. Qualidade de código (tipos, lint, formato) | 8 | 5 | 7 | 3 | 3 |
| 3. Testes automatizados | 8 | 5 | 3 | 6 | 6 |
| 4. CI/CD | 9 | 7 | 7 | 5 | 7 |
| 5. Performance | 7 | 4 | 5 | 4 | 4 |
| 6. Dados e armazenamento | 9 | 6 | 7 | 7 | 7 |
| 7. Segurança | 7 | 4 | 4 | 4 | 4 |
| 8. Acessibilidade | – | 4 | 5 | 4 | 4 |
| 9. Responsividade, UX e design | – | 5 | 6 | 5 | 6 |
| 10. SEO e compartilhamento | – | 6 | 6 | 6 | 6 |
| 11. Observabilidade | 7 | 2 | 3 | 2 | 2 |
| 12. Processo e registro de execução | 9 | 6 | 6 | 6 | 6 |
| **Média** | **8,0** | **4,9** | **5,3** | **4,8** | **5,0** |

## Evidências
- **API:**
  - arquitetura: `docs/ARQUITETURA.md`, `docs/DECISOES.md` (8 ADRs), `docs/DEPLOY.md` e `docs/engenharia/arquitetura-ecossistema.md`;
  - código: TypeScript estrito (`tsconfig.json` com `strict` e `noUncheckedIndexedAccess`), Zod em todo conteúdo e ESLint configurado (`eslint.config.js`, a instalar);
  - testes e CI: 60 testes Vitest (conteúdo, acessos e mensagens); CI com typecheck, teste e build; deploy com migrações D1 protegido por segredos;
  - segurança (ADR 7): CORS só para escrita, corpo limitado, Turnstile e token administrativo em tempo constante. Faltam auditoria de dependências e cabeçalhos;
  - observabilidade: Workers Logs ligado (`observability.enabled`), `onError` registrando erros, `/v1/saude` com teste e retenção por cron. **Correção de 01/11, à noite:** a primeira versão deste diagnóstico dizia que não havia log de erro; havia. A nota foi revista de 4 para 7.
- **learn-tech:**
  - código e testes: ESLint, Vitest com testes de dados e de serviço, e teste novo das categorias (`categorias.test.js`);
  - CI: teste, build e lint;
  - documentação: `docs/README.md` (novo);
  - SEO: Open Graph, canonical e sitemap adicionados em 01/11;
  - falta: TypeScript e testes de componente; reserva de programas defasada.
- **bootcamps:**
  - código: TypeScript, ESLint e `react-helmet-async`;
  - testes: Vitest e testes de `eventApi` e da cópia (novos, a instalar);
  - CI: lint e build, com teste acrescentado;
  - medição: Speed Insights do Vercel;
  - foco visível no tema (`ring-brand-primary`); seções com `aria-labelledby`.
- **career:**
  - testes: 12 testes com `node --test` passando em 01/11 (utilitários, cliente da API com fetch simulado e contrato das cópias); verificação estática em `verificar.ps1`;
  - CI: workflow novo (verificação, sintaxe e testes);
  - SEO: Open Graph completo e sitemap com páginas de detalhe por `?tipo=&id=`;
  - falta: lint instalado.
- **tools:**
  - testes: 7 testes com `node --test` passando em 01/11;
  - CI: verificação estática e sintaxe, com testes acrescentados;
  - temas claro e escuro com tokens CSS;
  - SEO: Open Graph corrigido (imagem absoluta, `og:url`, canonical) e sitemap.

## Prioridades que saem do diagnóstico
1. **Observabilidade dos sites (média 2,3):** o monitoramento agendado já foi criado (`disponibilidade.yml`). Falta capturar erros de JavaScript no navegador; o Speed Insights do Vercel cobre só performance.
2. **Segurança dos sites (4):** cabeçalhos no Vercel (`vercel.json`) e `npm audit` nos projetos com Node.
3. **Medir antes de otimizar:** rodar `npm run e2e` e `npm run ux:lighthouse` para transformar as notas de 4 e 5 em números reais.
4. **Qualidade nos sites estáticos:** instalar o ESLint e o Prettier (career e tools) e ligar a CI obrigatória.
