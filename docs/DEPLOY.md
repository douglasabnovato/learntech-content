# Deploy (tudo gratuito)

Pré-requisitos: Node 20 ou superior, conta gratuita na [Cloudflare](https://dash.cloudflare.com/sign-up) e o repositório no GitHub.

## 1. Primeira publicação (pelo seu computador)

```bash
cd learntech-content
npm install
npx wrangler login                         # abre o navegador para autorizar
npx wrangler d1 create learntech-acessos   # imprime um database_id
```

Copie o `database_id` impresso para `wrangler.jsonc`, no lugar de `COLE_AQUI_O_ID_GERADO_PELO_WRANGLER_D1_CREATE`. Esse id não é segredo e pode ir para o Git.

```bash
npm run db:migrar:remoto                   # cria a tabela acessos no D1
npx wrangler secret put ADMIN_TOKEN        # cole um token longo (24+ caracteres)
npm run deploy                             # build + wrangler deploy
```

O Wrangler mostra a URL, no formato `https://learntech-content.<seu-subdominio>.workers.dev`. Na primeira vez ele pede para escolher o subdomínio `workers.dev`.

Para gerar um token forte:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## 2. Conferir

```bash
curl https://learntech-content.<sub>.workers.dev/v1/saude
curl https://learntech-content.<sub>.workers.dev/v1/index.json
```

## 3. Ligar os sites

Em cada site, troque `https://learntech-content.SEU-SUBDOMINIO.workers.dev` pela URL real:

| Site | Onde |
|---|---|
| learn-tech | variável `VITE_API_URL` na Vercel (Settings → Environment Variables) e `data-api`/`src` do script em `index.html` |
| bootcamps | variável `VITE_API_URL` na Vercel e o script em `index.html` |
| career | `js/config.js` e o script em `index.html` |
| tools | `js/config.js` e o script em `index.html` |

Se um domínio de site mudar, atualize `ALLOWED_ORIGINS` em `wrangler.jsonc` e faça o deploy de novo.

## 4. Deploy automático (opcional)

1. Cloudflare → My Profile → API Tokens → **Create Token** → modelo "Edit Cloudflare Workers". Inclua a permissão D1 Edit.
2. GitHub → Settings → Secrets and variables → Actions:
   - secrets `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`;
   - variable `DEPLOY_AUTOMATICO` = `sim`.
3. A partir daí, cada push na `main` testa e publica (`.github/workflows/deploy.yml`).

## 5. Anti-robô (opcional)

1. Cloudflare → Turnstile → Add site, com os 4 domínios, em modo Managed.
2. `npx wrangler secret put TURNSTILE_SECRET` com a secret key.
3. Nos sites, acrescente `data-turnstile-sitekey="<site key>"` na tag do script.

## 6. Consultar os acessos

```bash
TOKEN=...  API=https://learntech-content.<sub>.workers.dev
curl -H "Authorization: Bearer $TOKEN" "$API/v1/acessos/resumo"
curl -H "Authorization: Bearer $TOKEN" "$API/v1/acessos?projeto=tools&desde=2026-10-01"
curl -H "Authorization: Bearer $TOKEN" "$API/v1/acessos?formato=csv&limite=1000" -o acessos.csv
curl -X DELETE -H "Authorization: Bearer $TOKEN" "$API/v1/acessos?email=pessoa@exemplo.com"
```

Também dá para ver a tabela no painel: Cloudflare → Storage & Databases → D1 → learntech-acessos → Console.
