# Plano para os cinco projetos ficarem estáveis e públicos (03/11/2026)

## Definição de "estável e público"
Um projeto está estável e público quando:
1. a `main` local é igual à do GitHub e não há branch de trabalho sem commit;
2. a CI da `main` está verde;
3. o site (ou a API) responde 200 no endereço público, com a versão nova;
4. a `main` está protegida por CI obrigatória;
5. o monitoramento de disponibilidade está ligado (a cada 6 horas);
6. há um relatório de e2e e de Lighthouse sem falha crítica.

## Estado em 03/11/2026, 7h
- Os cinco repositórios estão na branch `feature/tasks-01-11-2026-c`, sem commit. A `main` local é igual à do GitHub nos cinco.
- `node_modules` existe na API, no learn-tech e no bootcamps; falta na career e no tools.
- career e tools ganharam `.gitignore` com `node_modules/` (03/11).
- Lotes: 2026-10-27 com 51 de 67 fechados; 2026-10-30 com 52 de 55.
- Backlog de engenharia: 23 de 31. Os 8 abertos dependem de rodar na máquina do autor ou de configurar o GitHub.
- `hd/7-abc-projetos/` tem 3.159 arquivos fora do inventário (material do ex-empregador). É uma remessa nova, com a seção 7 das regras editoriais. Não bloqueia a estabilidade.

## Plano (autor, no Git Bash)
- **Fase A, terminar a branch de 01/11:** guia-etapas-manuais.md, etapas 1, 2 e 5, com os commits de `commits-sugeridos-2026-11-01-c.md`.
- **Fase B, conferir no ar:** `curl` na API, abrir os 4 sites e a aba Actions.
- **Fase C, proteger:** etapas 6 e 7 do guia.
- **Fase D, medir:** etapas 3 e 4 do guia; os relatórios ficam em `docs/engenharia/relatorios/`.
- **Fase E, abrir a branch do dia:** `feature/tasks-03-11-2026` a partir da `main`, para as correções que os relatórios apontarem.
