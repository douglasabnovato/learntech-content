# Fluxo de Git: feature → developer → main

Regra única dos cinco repositórios, escrita em 03/11/2026 depois da primeira publicação feita de ponta a ponta pelo Claude. Ela complementa a "Regra de branches" de `README.md` (Recepção).

## Branches
| Repositório | Integração (developer) | Produção |
|---|---|---|
| learntech-content | `developer` | `main` (deploy da API: `npm run deploy` ou `deploy.yml` com segredos) |
| learn-tech | `developer-mvp-2026` | `main` (Vercel publica sozinha) |
| bootcamps | `developer` | `main` (Vercel publica sozinha) |
| career | `developer-mvp-2026-2` | `main` (GitHub Pages) |
| tools | `developer` | `main` (GitHub Pages) |

Os nomes de integração diferem por histórico. Uniformizar para `developer` é a issue "Padronizar a branch de integração" (proposta no relatório de 03/11/2026).

## Passo a passo
1. **Branch do dia:** `git checkout main && git pull --ff-only origin main && git checkout -b feature/tasks-DD-MM-AAAA`. Se já houve merge no mesmo dia, use o sufixo `-b`, `-c`.
2. **Commits por tema:** conteúdo, schema, CI, docs e cópias geradas, cada um no seu commit. Nunca use `git add -A` numa árvore que tenha trabalho de outra frente: adicione os arquivos pelo nome. Para levar só parte de um arquivo compartilhado, monte o blob e use `git update-index --cacheinfo`, ou deixe o arquivo para o commit da outra frente.
3. **Push e CI:** `git push -u origin feature/...`. O check `verificar` precisa ficar verde no commit da ponta da branch.
4. **developer:** `git checkout <developer> && git pull --ff-only && git merge --ff-only feature/... && git push origin <developer>`.
5. **main:** `git checkout main && git pull --ff-only && git merge --ff-only feature/... && git push origin main`. O ruleset `main protegida` só aceita um commit que já passou no `verificar`.
   - **Recusa transitória:** logo depois de a CI terminar, o GitHub pode recusar o push com "Required status check ... is in progress". Espere de 10 a 30 s e repita. Em 03/11/2026, isso aconteceu em 4 dos 5 repositórios e passou na segunda tentativa.
6. **PR:** quando existe PR aberto da mesma branch, ele fecha como "merged" sozinho depois do passo 5.
7. **Deploy da API:** sem os segredos no GitHub, o deploy é `npm run deploy` na máquina do autor, que tem o wrangler autenticado. Os sites publicam sozinhos a partir da `main`.

## O que nunca fazer
- `--no-ff` na `main`: o commit de merge nunca passou na CI, e o push é recusado.
- Force push em `main` ou `developer`.
- Commit direto na `main`.
