# CLAUDE.md: learntech-content

API de conteúdo do ecossistema learnTECH (Cloudflare Workers + D1 + Static Assets) e fonte única dos quatro sites: learn-tech, bootcamps, career e tools. Tudo em português do Brasil.

## Antes de qualquer tarefa
1. `docs/processo/ESTADO.md`: onde o trabalho parou e as frentes abertas.
2. `docs/ESTADO-DO-PROJETO.md`: o que foi feito e as issues em ordem.
3. `docs/COMO-EVOLUIR.md`: o passo a passo para remessas do hd e mudanças na API.

## Conteúdo do hd (fluxo de agentes)
- **Fluxo, estados e papéis:** `docs/processo/agentes.md`. Cada agente tem um papel só: triador, produtor de um projeto, revisor ou verificador.
- **Contratos por site:** `docs/contratos/` (o que gerar, o padrão, onde gravar, como verificar).
- **Processo de 10 etapas e regras:** `docs/processo/README.md`, `regras-editoriais.md`, `modelos.md`, `pesquisa.md`, `checklists.md`.
- **Aprovações do autor:** nada é produzido sem o A1, nada é publicado sem o A2 e nada sai do hd sem o A3 (`npm run leva:status`).

## Regras que não mudam
- **Privacidade:** o `acervo.json` guarda só hash, tipo, tamanho e decisão; nunca nome nem conteúdo de arquivo. Nenhum dado pessoal de terceiro, nenhum nome de cliente, nenhum link interno de ex-empregador, grupo de WhatsApp ou pasta do Drive em conteúdo publicado.
- **Segredos:** o Claude não lê, não pede e não cadastra segredos (tokens da Cloudflare, variáveis do GitHub).
- **Schemas:** `src/schemas/` é a fonte da verdade dos campos. Mudança de estrutura segue: schema → `scripts/lib/conteudo.ts` → teste → OpenAPI → ADR em `docs/DECISOES.md` → `npm run copias` → sites.
- **Cópias nos sites:** são geradas por `npm run copias` e `npm run sitemaps`. Nunca edite à mão no repositório do site.
- **Regra editorial nova:** só o autor cria. O Claude propõe.

## Git
- Branch do dia `feature/tasks-DD-MM-AAAA`, criada da `main` (sufixo `-b`, `-c` no mesmo dia). Depois: push, CI verde e `developer` por `--ff-only` (`docs/processo/fluxo-git.md`).
- **O Claude para na `developer`.** A `main` é produção: quem leva a `developer` para a `main` é o autor (09/11/2026).
- A `main` é protegida: check `verificar` obrigatório e sem force push. Nunca commit direto na `main` e nunca `--no-ff`.
- Não usar `git add -A` quando houver trabalho de outra frente na árvore.
- Comentários e issues no GitHub terminam com `<sub>por douglas ciborgue</sub>`.

## Comandos
| Comando | Para quê |
|---|---|
| `npm run verificar` | typecheck, testes e build (o mesmo da CI) |
| `npm run validar` | só schemas e integridade do conteúdo |
| `npm run lint` | ESLint |
| `npm run hd:inventariar` | inventário do hd por hash (`-- --registrar` cria os itens) |
| `npm run hd:imagens` / `npm run hd:uso` | uso de cada arquivo do hd (`-- --aplicar` marca o automático, `-- --relatorio` grava o relatório); 100% = zero pendentes |
| `npm run leva:status` / `npm run cobertura` / `npm run progresso` | fechamento de leva, cobertura entre projetos e placar |
| `npm run copias` / `npm run sitemaps` | atualizar as cópias e os sitemaps nos quatro sites |
| `npm run e2e` | fluxos e acessibilidade contra a produção (Playwright e axe) |
| `npm run deploy` | publicação manual, só na máquina do autor |
