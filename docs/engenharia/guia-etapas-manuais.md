# Guia das etapas manuais das fases 3 a 5 (qualidade, UX e operação)

O Claude escreveu o código, as configurações e os testes. Estas etapas pedem a sua máquina (instalar dependências, rodar o navegador) ou a sua conta no GitHub. Faça em ordem. Cada etapa diz o que conferir e o que mandar de volta.

Antes de tudo, as alterações estão na branch `feature/tasks-01-11-2026-c` dos cinco repositórios.

## 1. Instalar as dependências novas (atualiza o package-lock.json)
A CI usa `npm ci`, que falha se o `package-lock.json` não acompanhar o `package.json`. Por isso este passo vem antes do commit.
```bash
cd /c/douglasabnovato-github/mundo-learn-tech/learntech-content && npm install
cd ../learn-tech && npm install
cd ../bootcamps && npm install
cd ../career && npm install
cd ../tools && npm install
```
- **API:** entraram ESLint, typescript-eslint, Prettier, Playwright, axe-core, Lighthouse e chrome-launcher.
- **bootcamps:** Vitest e Prettier.
- **learn-tech:** Prettier.
- **career e tools:** ESLint e Prettier. O `package.json` deles é só para as ferramentas de desenvolvimento; o site continua sem build.

Na career e no tools surge uma pasta `node_modules/`. Ela já está fora do Git se houver `.gitignore`; se `git status` listar a pasta, crie o arquivo:
```bash
echo node_modules/ > .gitignore
```

## 2. Rodar testes, lint e formato
```bash
cd /c/douglasabnovato-github/mundo-learn-tech/learntech-content && npm run verificar && npm run lint
cd ../learn-tech && npm test && npm run lint && npm run build
cd ../bootcamps && npm test && npm run lint && npm run build
cd ../career && npm test && npm run lint
cd ../tools && npm test && npm run lint
```
- **Resultado esperado:** testes verdes nos cinco projetos. Na career e no tools, os testes já passaram no ambiente do Claude: 12 e 7.
- **Se o lint apontar erros em código antigo:** não corrija à mão. Me mande a saída, que eu corrijo.
- **`npm run format:check`:** é opcional por enquanto. O código antigo não foi formatado para não gerar diffs enormes; a formatação geral fica para uma rodada própria.

## 3. Testes de ponta a ponta, acessibilidade e capturas (Playwright)
Na API, uma vez só, baixe o navegador:
```bash
cd /c/douglasabnovato-github/mundo-learn-tech/learntech-content
npx playwright install chromium
```
Depois, sempre que quiser medir:
```bash
npm run e2e          # fluxos, acessibilidade e capturas, contra os sites em produção
npm run ux:resumo    # gera docs/engenharia/relatorios/e2e-AAAA-MM-DD.md
```
- Os testes rodam contra produção. Os fluxos do programa 1104, do artigo dos bastidores e da área "Marketing Tech e CRM" só passam depois do deploy desta branch.
- Para testar local, defina as variáveis antes, por exemplo: `E2E_LEARN_TECH=http://localhost:5173 npm run e2e`.
- Os relatórios completos ficam em `e2e/relatorios/`, fora do Git. O HTML do Playwright fica em `e2e/relatorios/html/index.html`.
- **O que mandar de volta:** o arquivo `docs/engenharia/relatorios/e2e-AAAA-MM-DD.md`, que já fica na pasta e eu leio. Com ele eu corrijo as falhas e marco no backlog acessibilidade e responsividade com evidência.

## 4. Lighthouse (performance, acessibilidade, boas práticas e SEO)
```bash
npm run ux:lighthouse   # gera docs/engenharia/relatorios/lighthouse-AAAA-MM-DD.md
```
- **Metas do MVP:** performance ≥ 80, acessibilidade ≥ 90, boas práticas ≥ 90, SEO ≥ 90, LCP ≤ 2,5 s, CLS ≤ 0,1.
- O resumo fica na pasta e eu leio. As páginas que não baterem as metas viram tarefas de correção.

## 5. Commit, merge e deploy
Siga o fluxo de sempre nos cinco repositórios, na branch `feature/tasks-01-11-2026-c`:
1. `git add -A` e `git commit`;
2. `git push -u origin feature/tasks-01-11-2026-c`;
3. merge na `main` e `git push origin main`;
4. na API, `npm run deploy`.

O que muda em cada repositório:
- **API:** artigos e acervo da leva 1, `relacionados` nos eventos, lint e formato, e2e, scripts de UX, sitemaps, monitoramento de disponibilidade e documentos de engenharia.
- **learn-tech:** cópia gerada das categorias, teste das categorias, Open Graph, sitemap, robots, cabeçalhos de segurança e `docs/README.md`.
- **bootcamps:** testes, CI com teste, Open Graph, sitemap, robots, cabeçalhos de segurança e `docs/README.md`.
- **career:** CI nova, testes, `package.json` de ferramentas, ESLint, sitemap e `docs/README.md`.
- **tools:** testes na CI, `package.json` de ferramentas, ESLint, Open Graph corrigido, sitemap e `docs/README.md`.

## 6. CI obrigatória antes do merge (configuração no GitHub)
Em cada repositório (learntech-content, learn-tech, bootcamps, career, tools), no GitHub:
1. **Settings** → **Branches** (ou **Rules** → **Rulesets**) → **Add branch ruleset** (ou "Add rule") para `main`.
2. Marque **Require status checks to pass** e escolha o check da CI (`ci` / o job `verificar` ou `build`). Ele só aparece na lista depois da primeira execução da CI na branch nova.
3. Se quiser manter o merge local pelo Git Bash, não marque "Require a pull request". O bloqueio continua valendo para push direto de código que não passou na CI, desde que a regra esteja ativa e você não esteja em "bypass".

## 7. Monitoramento de disponibilidade
Depois do merge, na API, abra **Actions** → **disponibilidade** → **Run workflow** para testar. Depois ele roda sozinho a cada 6 horas. Se a API ou algum site cair, o GitHub avisa por e-mail.

## 8. Primeiro verde da CI da career
O `verificar.ps1` da career foi escrito no Windows e nunca rodou no Linux do GitHub. Por isso o passo está com `continue-on-error`. Na primeira execução, abra o log:
- se esse passo passou, me avise, que eu tiro o `continue-on-error`;
- se falhou por causa de caminho com `\`, me mande o log, que eu corrijo o script.

## 9. Sitemaps no Google Search Console (opcional, recomendado)
Cadastre os sites no Search Console e envie os sitemaps:
- `https://learn-tech-pied.vercel.app/sitemap.xml`
- `https://bootcamps-dun.vercel.app/sitemap.xml`
- `https://douglasabnovato.github.io/career/sitemap.xml`
- `https://douglasabnovato.github.io/tools/sitemap.xml`

Os sitemaps são regenerados com `npm run sitemaps` na API, sempre junto com `npm run copias`.
