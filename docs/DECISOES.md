# Registro de decisões de arquitetura (ADR)

Cada decisão tem contexto, escolha e consequência. Mudou de ideia? Acrescente um ADR novo que substitui o antigo; não apague o histórico.

## ADR 1 — Conteúdo como código

- **Contexto:** o conteúdo muda por edição humana, em lotes, e precisa de revisão e histórico.
- **Decisão:** JSON em `content/`, versionado no Git, validado por Zod e por regras de integridade no build e no CI.
- **Consequência:** não existe painel administrativo nem banco para conteúdo. Todo ajuste passa por commit e o erro é pego antes do deploy. O custo é zero.

## ADR 2 — Cloudflare Workers + Static Assets + D1

- **Contexto:** hospedagem precisa ser gratuita, sem hibernar e sem cartão de crédito. Na pesquisa, o Supabase gratuito pausa após 1 semana sem uso, o Neon gratuito tem 0,5 GB e o Vercel Hobby é só para uso não comercial.
- **Decisão:** um único Worker. Os Static Assets servem a leitura, o Hono cuida das rotas dinâmicas e o D1 guarda os acessos.
- **Consequência:** a leitura não consome CPU de Worker, e o banco não dorme. Há dependência de uma única conta Cloudflare.

## ADR 3 — REST versionado em `/v1`, leitura estática

- **Decisão:** recursos de leitura são arquivos `.json` pré-gerados. A única escrita pública é `POST /v1/acessos`. Uma mudança incompatível de formato cria `/v2` sem derrubar `/v1`.
- **Consequência:** cache simples e barato. Não há filtros no servidor; os sites filtram no navegador, como já faziam.

## ADR 4 — Mídia

- **Decisão:** as miniaturas que já existem em tools e career continuam nos próprios sites (`./assets/...`, resolvido por quem consome). As fotos novas de eventos e as capas de instituições do bootcamps vão para `/media` em WebP, sem EXIF, até 1600 px. O vídeo de 47 MB do programa 1 fica no learn-tech.
- **Consequência:** `dist/` fica abaixo de 4 MB. Se o acervo de fotos crescer, a migração natural é para o R2, que tem 10 GB gratuitos.

## ADR 5 — Frontends API-first com fallback local

- **Decisão:** cada site busca na API e, se ela falhar ou demorar, usa os dados locais que já estão no bundle.
- **Consequência:** o deploy da API e o de cada site são independentes. Os dados locais passam a ser só reserva e podem ser removidos depois que a API estiver estável.

## ADR 6 — Identificação sem login

- **Contexto:** o LearnTECH é gratuito. O objetivo é saber quantas pessoas usam e quem são, não controlar acesso.
- **Decisão:** um script único servido pela API, com formulário em Shadow DOM. Ele pede nome completo e e-mail uma vez por navegador e registra projeto, página e horário uma vez por sessão.
- **Consequência:** não há senha nem conta. O texto de finalidade e a política de privacidade explicam a coleta. A retenção é de 12 meses, com exclusão sob pedido.

## ADR 7 — Segurança

- CORS com lista de origens só para escrita; a leitura é pública.
- Validação Zod e corpo limitado a 8 KB.
- Deduplicação de 30 minutos por e-mail e projeto.
- Turnstile opcional, gratuito, ligado por segredo.
- Administração por `ADMIN_TOKEN` (segredo, com no mínimo 24 caracteres), comparado em tempo constante.
- CSV exportado com proteção contra injeção de fórmula.
- Nenhum dado pessoal ou segredo no repositório.

## ADR 8 — Qualidade

- TypeScript estrito, Vitest e CI no GitHub Actions.
- As regras do `dados.test.js` do learn-tech (ids, módulos, passos, ícones e quiz) foram portadas para a validação do build. Elas continuam valendo para todo programa novo.
