# Cache e versionamento da API

## Versionamento
- **Contrato público:** `/v1`. Campo novo entra como opcional; nunca se renomeia nem se remove campo em `/v1`. Mudança que quebre um site exige `/v2`, com os sites migrando antes de `/v1` sair (ADR 3 em `../DECISOES.md`).
- **Versão do Worker:** `version` do `package.json`, exposta em `GET /v1/saude` (`versao`).
- **Tipos espelhados:** o schema Zod (`src/schemas`) é a fonte. O tipo do bootcamps (`types.ts`) e os testes de contrato da career e do tools acompanham cada mudança.

## Política de cache
| Recurso | Quem serve | Cache-Control | Por quê |
|---|---|---|---|
| `/v1/*.json` (conteúdo) | Static Assets (`public/_headers`) | `public, max-age=300, stale-while-revalidate=86400` | Conteúdo muda por deploy: 5 minutos de cache fresco e até 1 dia servindo a versão anterior enquanto busca a nova. Um deploy aparece nos sites em no máximo cerca de 5 minutos. |
| `/media/*` (imagens, PDFs) | Static Assets | `public, max-age=604800` (7 dias) | Arquivos raramente mudam; quando mudam, trocam de nome. |
| `/sdk/*` (identificação) | Static Assets | `public, max-age=3600` | Script pequeno, atualizado raramente; 1 hora equilibra atualização e tráfego. |
| `/v1/saude`, `/v1/acessos*`, `/v1/mensagens*` | Worker (Hono) | `no-store` | Resposta dinâmica; acessos e mensagens têm dados pessoais e não podem ficar em cache intermediário. |
| Sites no Vercel, `/assets/*` (arquivos com hash do Vite) | Vercel (`vercel.json`) | `public, max-age=31536000, immutable` | O nome muda a cada build; pode ficar em cache para sempre. |
| Sites no GitHub Pages | GitHub Pages | padrão do Pages (cerca de 10 minutos) | Não é configurável no Pages. |

**Cache no cliente:** os sites guardam em memória a resposta de cada recurso durante a navegação (`useApi` no learn-tech; módulos `api.js` na career e no tools). Sem API, usam a cópia de reserva.

## Cabeçalhos de segurança
- **Estáticos (`public/_headers`):** `X-Content-Type-Options: nosniff` e `Referrer-Policy: strict-origin-when-cross-origin`; CORS aberto (`*`) só para leitura.
- **Dinâmicos (middleware em `src/app.ts`):** `nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY` e `Cache-Control: no-store`, quando a rota não define outro. CORS só para escrita, a partir das origens de `ALLOWED_ORIGINS`.
- **Sites no Vercel (`vercel.json`):** `nosniff`, `Referrer-Policy`, `X-Frame-Options` e `Permissions-Policy`.

## Observabilidade
- **Logs do Worker:** `observability.enabled = true` em `wrangler.jsonc` liga o Workers Logs no painel da Cloudflare. Erros não tratados saem como uma linha JSON (`nivel`, `mensagem`, `metodo`, `caminho`, `ray`, `pilha`), fácil de filtrar.
- **Saúde:** `GET /v1/saude` (status, versão, horário).
- **Disponibilidade:** o workflow `.github/workflows/disponibilidade.yml` confere a API e os quatro sites a cada 6 horas.
- **Retenção:** cron diário (`0 3 * * *`) apaga acessos e mensagens mais antigos que `RETENCAO_DIAS`.
