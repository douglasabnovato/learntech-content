# Deploy (tudo gratuito)

Pré-requisitos: Node 20 ou superior, conta gratuita na [Cloudflare](https://dash.cloudflare.com/sign-up) e o repositório no GitHub.

## 1. Primeira publicação (pelo seu computador)

```bash
cd learntech-content
npm install
npx wrangler login                         # abre o navegador para autorizar
npx wrangler d1 create learntech-acessos   # imprime um database_id
```

Copie o `database_id` impresso para `wrangler.jsonc`, no campo `d1_databases[0].database_id`. Esse id não é segredo e pode ir para o Git. (Neste repositório o campo já está preenchido; só refaça este passo se for criar um banco novo.)

```bash
npm run db:migrar:remoto                   # cria as tabelas acessos e mensagens no D1
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

O `DELETE /v1/acessos?email=` apaga **também as mensagens** do "Fala aê" desse e-mail e responde `{ "apagados": <acessos>, "mensagens": <mensagens> }`. Use-o para pedidos de exclusão (LGPD).

## 7. Mensagens do "Fala aê"

O formulário "Fala aê" do learn-tech grava em `POST /v1/mensagens`, na tabela `mensagens` do mesmo banco D1 (migração `migrations/0002_mensagens.sql`).

**Antes do primeiro deploy com esta rota**, crie a tabela no D1 remoto; sem ela, o envio responde 500:

```bash
npm run db:migrar:remoto                   # aplica 0002_mensagens.sql (as já aplicadas são puladas)
npm run deploy
```

Consultar e apagar:

```bash
TOKEN=...  API=https://learntech-content.<sub>.workers.dev
curl -H "Authorization: Bearer $TOKEN" "$API/v1/mensagens"                                  # 200 mais recentes
curl -H "Authorization: Bearer $TOKEN" "$API/v1/mensagens?motivo=privacidade&desde=2026-10-01"
curl -H "Authorization: Bearer $TOKEN" "$API/v1/mensagens?email=pessoa@exemplo.com"
curl -H "Authorization: Bearer $TOKEN" "$API/v1/mensagens?formato=csv&limite=1000" -o mensagens.csv
curl -X DELETE -H "Authorization: Bearer $TOKEN" "$API/v1/mensagens?email=pessoa@exemplo.com"   # só as mensagens
```

Filtros: `projeto`, `motivo` (`duvida-programa`, `sugestao-conteudo`, `problema-tecnico`, `privacidade`, `outro`), `email`, `desde` (AAAA-MM-DD), `limite` (até 1000) e `formato=csv`.

Não há aviso automático de mensagem nova: consulte a rota (ou o Console do D1) periodicamente. As respostas são enviadas pelo seu e-mail, para o endereço informado.

**Turnstile:** com `TURNSTILE_SECRET` configurado, `POST /v1/mensagens` também exige token válido. O formulário do learn-tech ainda **não envia** token, então, se ativar o Turnstile, integre o widget no `FalaAe.jsx` antes (ou o envio passará a responder 403).
