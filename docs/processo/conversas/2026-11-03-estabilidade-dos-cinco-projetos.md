# Conversa de 03/11/2026: estabilidade e publicação dos cinco projetos

**Frente:** engenharia. **Objetivo:** os cinco projetos estáveis e públicos. **Plano:** `docs/engenharia/plano-estabilidade-2026-11-03.md`.

## O que foi feito
- **Fase A (autor):** publicou a branch `feature/tasks-01-11-2026-c` nos cinco repositórios, com o deploy da API (versão `950f63cb`, cabeçalhos novos conferidos por curl). Placar de 64 para 76.
- **Correções no caminho:**
  - 5 erros de lint na API, resolvidos na config e em 2 scripts (`c873491`);
  - 2 testes do bootcamps que comparavam referência (`toBe`) em vez de conteúdo, trocados por `toStrictEqual`.
- **Fase C (autor):** ruleset `main protegida` nos cinco, com o check `verificar` obrigatório.
- **Conferência da CI (autor):** verde nos cinco. Surgiram:
  - o aviso do Node 20 nas ações `@v4`;
  - 70 erros de lint "informativos" no learn-tech;
  - o `verificar.ps1` da career falhando no Linux, por causa das barras `\`.
- **Branch `feature/tasks-03-11-2026` (Claude):**
  - ações em `@v5` nos cinco;
  - lint do learn-tech zerado e obrigatório;
  - script da career corrigido, sem `continue-on-error`;
  - lint na CI da API;
  - documentação atualizada.

## Lições
1. **Confirmar o que entrou no commit:** "o lint passou na pasta" não prova que a correção entrou no commit. Antes de dizer que algo está publicado, conferir o `git status` limpo.
2. **Teste não executado:** teste escrito sem rodar fica como "escrito, não executado" até o autor ver verde.
3. **Ruleset e merge:** o ruleset com status check exige merge `--ff-only`. O `--no-ff` cria um commit que nunca passou na CI. O guia de 01/11 dizia o contrário e foi corrigido.
4. **Passos "informativos":** um passo informativo na CI (`continue-on-error`) esconde falha. Cada um precisa de data para virar obrigatório.

## Pendências abertas
Ver `PROXIMOS-PASSOS.md`, itens 2 a 4 (publicar a branch do dia, medir e ligar o monitor, conferir os sites) e 14 e 15 (leia-me duplicado da career, deploy automático da API).
