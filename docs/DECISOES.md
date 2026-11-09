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

- **Decisão:** recursos de leitura são arquivos `.json` pré-gerados. A única escrita pública é `POST /v1/acessos` (depois veio também `POST /v1/mensagens`, do "Fala aê"). Uma mudança incompatível de formato cria `/v2` sem derrubar `/v1`.
- **Consequência:** cache simples e barato. Não há filtros no servidor; os sites filtram no navegador, como já faziam.

## ADR 4 — Mídia

- **Decisão:** as miniaturas que já existem em tools e career continuam nos próprios sites (`./assets/...`, resolvido por quem consome). As fotos novas de eventos e as capas de instituições do bootcamps vão para `/media` em WebP, sem EXIF, até 1600 px. O vídeo de 47 MB do programa 1 fica no learn-tech.
- **Consequência:** `dist/` fica abaixo de 4 MB. Se o acervo de fotos crescer, a migração natural é para o R2, que tem 10 GB gratuitos.
- **Atualização (03/11/2026):** a previsão de 4 MB foi superada. Hoje `dist/` tem 291 arquivos e 15 MB, dos quais 11 MB são mídia (`du -sh dist`). Ainda cabe com folga no limite dos Static Assets (20 mil arquivos, 25 MiB por arquivo), e a decisão continua valendo. As galerias pendentes de 21 eventos vão aumentar esse número; a proposta é revisar a decisão e migrar a mídia para o R2 quando `dist/` passar de 50 MB.

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

## ADR 9 — Status do card de programa e votação de temas (proposta, 03/11/2026)

- **Contexto:** a issue learn-tech #120 pede card colorido para programa lançado, card preto e branco para programa em construção e uma votação para escolher o tema dos cards ainda sem programa.
- **Decisão (status):** o programa ganha o campo opcional `status` (`lancado` ou `novidade`), publicado no resumo de `/v1/learn-tech/programas.json`. O site já respeita esse campo (`statusDoPrograma` em `learn-tech/src/services/conteudo.js`); sem o campo, decide pelos módulos.
- **Proposta (votação), ainda não implementada:** uma tabela `votos` no D1 (`tema`, `email`, `criadoEm`), `POST /v1/votos` aceito só a partir dos quatro domínios, um voto por e-mail e tema, Turnstile ligado e `GET /v1/votos/resumo` público só com contagens. A identificação reaproveita o `/sdk/identificacao.js` (ADR 6), e a política de privacidade ganha a finalidade "votação". Falta o autor aprovar e decidir a lista de temas.

## ADR 10 — Limite de taxa nas escritas e e-mail fora da URL (03/11/2026)

- **Contexto:** a deduplicação é por e-mail (ADR 7), então um robô que troca de e-mail a cada envio consegue encher as tabelas `acessos` e `mensagens` e gastar a cota gratuita de escritas do D1. Os `DELETE` de administração recebiam o e-mail em `?email=`, e com o Workers Logs ligado a URL com dado pessoal pode ir para os logs.
- **Decisão (limite):** `POST /v1/acessos` e `POST /v1/mensagens` passam pelo binding `ratelimits` do Workers (`LIMITADOR_ESCRITA` em `wrangler.jsonc`), gratuito e sem tabela nova: 30 requisições por 60 s por IP (`CF-Connecting-IP`) e rota. Acima disso a resposta é `429` com `Retry-After: 60`. A origem é conferida antes, então origem recusada não consome o limite. Se o binding faltar (testes, ambiente sem ele) ou falhar, a requisição passa: o Turnstile e a deduplicação continuam valendo, e o limite nunca derruba um registro legítimo.
- **Decisão (DELETE):** o e-mail vai no corpo JSON (`{ "email": "..." }`). O `?email=` continua aceito por compatibilidade temporária, com o cabeçalho `Deprecation: true` e marcado como `deprecated` no OpenAPI. Pode sair quando nenhum script do autor usar mais a forma antiga. O `GET /v1/mensagens?email=` continua igual, porque GET não tem corpo; é rota de administração e o filtro é opcional.
- **Consequência:** o contador é por localização da Cloudflare e aproximado (documentação do binding), então é um filtro leve, não uma cota exata. Uma escola inteira atrás do mesmo NAT pode chegar a 30 envios por minuto; se acontecer, aumente `limit` no `wrangler.jsonc`. O limite só vale a partir do próximo deploy.

## ADR 11 — Uso de cada arquivo do hd (09/11/2026)

- **Contexto:** o acervo decidia por item (uma pasta de até dois níveis). Um item `publicado` com centenas de arquivos escondia imagens e vídeos que nunca foram para a tela, e não dava para afirmar que 100% do hd foi usado (`docs/processo/relatorios/uso-do-hd-2026-11-06.md`).
- **Decisão:** cada arquivo de `arquivos[]` ganha `uso` (`exibido`, `fonte`, `similar`, `referencia`, `tecnico`, `descartado`, `pendente`) e, conforme o uso, `destino` (um dos destinos do item), `similarA` (hash de um arquivo exibido) ou `motivo`. Sem o campo, o arquivo é pendente. "100% usado" passa a ser "nenhum arquivo pendente", e `leva:status` só fecha o lote assim. `hd:uso` mede e marca o que é automático; o resto é decisão do triador, do produtor e do autor.
- **Consequência:** o lote de 30/10 volta a aparecer aberto até os 2.608 arquivos pendentes terem uso. O acervo continua sem nome e sem conteúdo de arquivo; o `motivo` não pode citar pessoa ou cliente. O acervo não é publicado na API, então não há mudança no OpenAPI nem nas cópias dos sites.
- **Revisão (09/11/2026, autor):** o uso `bloqueado` virou `referencia`. O hd serve para virar texto e referência na API; alguns arquivos são exibidos. Arquivo de referência é base de conhecimento do texto e não vai para a tela (ex.: material do ex-empregador, seção 7 das regras editoriais). Nada é enviado para fora do hd: o acervo guarda só o hash e a decisão. `referencia` conta como usado.
