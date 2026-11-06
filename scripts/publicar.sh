#!/usr/bin/env bash
# publicar.sh — leva uma branch de feature já commitada para a developer e a main de UM repositório,
# seguindo docs/processo/fluxo-git.md (feature → developer → main, sempre --ff-only), parando no primeiro erro.
#
# Uso (Git Bash, na raiz do repositório, com os commits por tema já feitos):
#   ../learntech-content/scripts/publicar.sh [--deploy]
#
# O que faz, em ordem:
#   1. confere que você está numa branch feature/... e que a árvore está limpa (o script NÃO faz commit:
#      os commits são por tema e com os arquivos adicionados pelo nome, nunca git add -A);
#   2. roda as verificações do projeto, se existirem (npm run verificar | test + build, e lint);
#   3. pede confirmação e faz push da branch;
#   4. espera a CI do commit da ponta terminar verde (gh run watch); sem o gh, pede a confirmação manual;
#   5. developer: pull --ff-only e merge --ff-only da branch; push;
#   6. main: pull --ff-only e merge --ff-only da branch; push (com nova tentativa se o ruleset ainda
#      estiver vendo a CI "in progress");
#   7. com --deploy (só na API e só se os segredos não estiverem no GitHub), roda npm run deploy.
# Nunca usa --no-ff, nunca faz commit direto na main e nunca usa force push.
set -euo pipefail

deploy="${1:-}"
case "$deploy" in ""|--deploy) ;; *) echo "Uso: publicar.sh [--deploy]  (faça os commits antes; o script não commita)"; exit 1;; esac

branch=$(git branch --show-current)
case "$branch" in feature/*) ;; *) echo "Você está em '$branch'. Rode a partir de uma branch feature/..."; exit 1;; esac
repo=$(basename "$(git rev-parse --show-toplevel)")

# Branch de integração de cada repositório (tabela de docs/processo/fluxo-git.md).
case "$repo" in
  learn-tech) integracao="developer-mvp-2026" ;;
  career) integracao="developer-mvp-2026-2" ;;
  *) integracao="developer" ;;
esac

if [ -n "$(git status --porcelain)" ]; then
  echo "Há alterações não commitadas em $repo:"; git status --short
  echo "Faça os commits por tema (git add <arquivos pelo nome>) ou guarde o trabalho de outra frente antes de publicar."
  exit 1
fi

git fetch origin
echo "== $repo · $branch → $integracao → main"
git log --oneline "origin/main..$branch" || true

roda() { if [ -f package.json ] && node -e "process.exit(require('./package.json').scripts?.['$1']?0:1)" 2>/dev/null; then echo "-- npm run $1"; npm run "$1"; fi; }
if [ -f package.json ]; then
  if node -e "process.exit(require('./package.json').scripts?.verificar?0:1)" 2>/dev/null; then roda verificar; else roda test; roda build; fi
  roda lint
fi

read -r -p "Tudo certo? Enviar '$branch' e, com a CI verde, levar para $integracao e main de $repo? [s/N] " ok
[ "$ok" = "s" ] || { echo "Cancelado."; exit 1; }

git push -u origin "$branch"
sha=$(git rev-parse HEAD)

# Espera a CI do commit da ponta. O ruleset da main só aceita commit que passou no check "verificar".
if command -v gh >/dev/null 2>&1; then
  echo "-- esperando a CI de ${sha:0:7}"
  id=""
  for _ in $(seq 1 30); do
    id=$(gh run list --commit "$sha" --workflow CI --event push --json databaseId --jq '.[0].databaseId' 2>/dev/null || true)
    [ -n "$id" ] && break
    sleep 5
  done
  [ -n "$id" ] || { echo "A CI de ${sha:0:7} não apareceu no GitHub Actions. Confira e rode de novo."; exit 1; }
  gh run watch "$id" --exit-status || { echo "CI vermelha em ${sha:0:7}: corrija na branch e rode de novo. Nada foi integrado."; exit 1; }
else
  read -r -p "Sem o gh instalado. A CI de ${sha:0:7} está verde em Actions? [s/N] " verde
  [ "$verde" = "s" ] || { echo "Espere a CI verde e rode de novo."; exit 1; }
fi

# Integra com --ff-only: se a developer ou a main tiverem commits que a branch não tem, o merge recusa
# e é preciso atualizar a branch (rebase ou merge da main nela) e passar de novo pela CI.
integrar() {
  local alvo="$1"
  git checkout "$alvo"
  git pull --ff-only origin "$alvo"
  git merge --ff-only "$branch"
  for tentativa in 1 2 3; do
    if git push origin "$alvo"; then return 0; fi
    echo "Push de $alvo recusado (tentativa $tentativa). Se for 'Required status check ... is in progress', espera 20 s."
    sleep 20
  done
  echo "Push de $alvo recusado três vezes. Confira o ruleset e a CI."; return 1
}

if git ls-remote --exit-code --heads origin "$integracao" >/dev/null 2>&1; then
  integrar "$integracao"
else
  echo "-- $integracao não existe no remoto; pulando a integração"
fi
integrar main
git checkout "$branch"

if [ "$deploy" = "--deploy" ]; then
  echo "-- Se os segredos da Cloudflare estiverem no GitHub, o deploy.yml já publica depois da CI da main; senão, deploy manual:"
  npm run deploy
fi
echo "== Publicado: $repo ($branch → $integracao → main)"

# Fim de publicar.sh
