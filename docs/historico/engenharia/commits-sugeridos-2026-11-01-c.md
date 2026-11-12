# Commits sugeridos: branch `feature/tasks-01-11-2026-c`

Em vez de um commit gigante, um commit por tema. Faça em ordem, depois do `npm install` (guia, etapa 1), que atualiza o `package-lock.json` e entra no commit de ferramentas. Em cada repositório: `git add <caminhos>` e `git commit -m "<mensagem>"`. No fim, `git status` deve mostrar a árvore limpa.

## learntech-content
1. **conteúdo: leva 1 (artigos e estante), capas próprias sem repetição e fontes novas**
   `git add content/learn-tech/paginas/blog.json content/learn-tech/programas content/acervo.json media/learn-tech`
2. **eventos: relacionados em todos os eventos (Veja também no ecossistema)**
   `git add content/bootcamps/eventos`
3. **api: cabeçalhos de segurança, no-store nas rotas dinâmicas e log de erro estruturado**
   `git add src/app.ts tests/acessos.test.ts public/_headers`
4. **qualidade: lint, prettier, e2e com Playwright, acessibilidade, capturas, Lighthouse e auditoria**
   `git add eslint.config.js .prettierrc.json .prettierignore package.json package-lock.json .gitignore e2e scripts/ux scripts/auditar-dependencias.mjs`
5. **cópias e seo: catálogo de programas e categorias geradas; sitemaps**
   `git add scripts/exportar-copias.mjs scripts/gerar-sitemaps.mjs`
6. **operação: monitoramento de disponibilidade e modelo de PR**
   `git add .github`
7. **docs: engenharia (arquitetura, diagnóstico, design system, cache, backlog, guia), processo e colaboração**
   `git add docs PROXIMOS-PASSOS.md scripts/publicar.sh`

## learn-tech
1. **dados: cópias geradas (blog, categorias, catálogo de programas) com testes**
   `git add src/constants src/services/conteudo.js src/pages/home/category/Category.jsx`
2. **seo e segurança: Open Graph, canonical, sitemap, robots e cabeçalhos no Vercel**
   `git add index.html public vercel.json`
3. **qualidade e docs: prettier, modelo de PR e documentação de engenharia**
   `git add .prettierrc.json .prettierignore package.json package-lock.json .github docs`

## bootcamps
1. **testes: eventApi e contrato da cópia, com Vitest na CI**
   `git add src/entities/event/api/*.test.ts package.json package-lock.json .github/workflows/ci.yml`
2. **dados: cópia dos eventos com relacionados**
   `git add src/entities/event/api/events.data.ts`
3. **seo e segurança: Open Graph, canonical, sitemap, robots e cabeçalhos no Vercel**
   `git add index.html public vercel.json`
4. **docs: prettier, modelo de PR e documentação de engenharia**
   `git add .prettierrc.json .prettierignore .github docs`

## career
1. **ci e testes: workflow novo e testes com node --test**
   `git add .github tests package.json package-lock.json eslint.config.js .prettierrc.json .prettierignore`
2. **seo e docs: sitemap e documentação de engenharia**
   `git add sitemap.xml docs`

## tools
1. **ci e testes: node --test na CI e testes**
   `git add .github tests package.json package-lock.json eslint.config.js .prettierrc.json .prettierignore`
2. **seo e docs: Open Graph corrigido, sitemap e documentação**
   `git add index.html sitemap.xml docs`

Depois dos commits: `git push -u origin feature/tasks-01-11-2026-c`, merge na `main` (pelo PR, se o GitHub estiver vinculado) e, na API, `npm run deploy`.
