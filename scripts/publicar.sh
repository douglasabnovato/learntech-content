#!/usr/bin/env bash
# publicar.sh — publica uma branch de feature na main de UM repositório, parando no primeiro erro.
#
# Uso (Git Bash, na raiz do repositório):
#   ../learntech-content/scripts/publicar.sh "<mensagem do commit>" [--deploy]
#
# O que faz, em ordem:
#   1. confere que você está numa branch feature/... e mostra o que vai entrar (git status e diff --stat);
#   2. roda as verificações do projeto, se existirem (npm run verificar | test | lint | build);
#   3. pede confirmação, faz git add -A, commit e push da branch;
#   4. atualiza a main, faz o merge --no-ff da branch e envia a main;
#   5. com --deploy (só na API), roda npm run deploy.
# Se a regra de CI obrigatória estiver ativa no GitHub, prefira abrir PR e fazer o merge por lá.
set -euo pipefail

msg="${1:-}"
deploy="${2:-}"
[ -n "$msg" ] || { echo "Uso: publicar.sh \"mensagem do commit\" [--deploy]"; exit 1; }

branch=$(git branch --show-current)
case "$branch" in feature/*) ;; *) echo "Você está em '$branch'. Rode a partir de uma branch feature/..."; exit 1;; esac
repo=$(basename "$(git rev-parse --show-toplevel)")

echo "== $repo · $branch"
git status --short
git diff --stat HEAD | tail -1 || true

roda() { if [ -f package.json ] && node -e "process.exit(require('./package.json').scripts?.['$1']?0:1)" 2>/dev/null; then echo "-- npm run $1"; npm run "$1"; fi; }
if [ -f package.json ]; then
  if node -e "process.exit(require('./package.json').scripts?.verificar?0:1)" 2>/dev/null; then roda verificar; else roda test; roda build; fi
  roda lint
fi

read -r -p "Tudo certo? Publicar '$branch' na main de $repo? [s/N] " ok
[ "$ok" = "s" ] || { echo "Cancelado."; exit 1; }

git add -A
git commit -m "$msg"
git push -u origin "$branch"
git checkout main
git pull origin main
git merge --no-ff "$branch" -m "merge: $branch"
git push origin main

if [ "$deploy" = "--deploy" ]; then npm run deploy; fi
echo "== Publicado: $repo ($branch → main)"
