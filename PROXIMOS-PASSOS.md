# Próximos passos do autor

Lista única das tarefas que dependem do autor (Douglas), em ordem de prioridade. O Claude atualiza este arquivo ao fim de cada entrega e repete a lista no chat. Uma tarefa concluída sai da lista e vai para "Concluídas", com a data.

Formato: número, tarefa, projeto, **identificada em** (data em que surgiu) e como fazer.

## Em aberto

1. **Vincular a conta do GitHub ao Claude e confirmar a regra nova de pull request** (todos). Identificada em 2026-11-01.
   No claude.ai: Configurações → Conectores → GitHub, e autorize os 5 repositórios. Com isso, o Claude lê a CI e abre os PRs; o merge continua sendo seu. Confirme no chat se aceita a regra de o Claude enviar as branches de feature e abrir o PR (`docs/processo/como-trabalhamos.md`).
2. **Executar o guia das etapas manuais das fases 3 a 5** (os cinco repositórios). Identificada em 2026-11-01.
   Siga `docs/engenharia/guia-etapas-manuais.md`, em ordem: `npm install` nos cinco, testes e lint, `npx playwright install chromium`, `npm run e2e` com `npm run ux:resumo`, `npm run ux:lighthouse`, commit, merge e deploy da branch `feature/tasks-01-11-2026-c`, e a regra de CI obrigatória no GitHub. Os relatórios ficam em `docs/engenharia/relatorios/`, e o Claude lê dali.
3. **Subir no YouTube as duas compilações de vídeo e mandar os links ao Claude** (bootcamps). Identificada em 2026-10-31.
   Arquivos em `C:\douglasabnovato-github\videos-para-youtube\`: `hackathon-inovacao-social-jf-2023.mp4` e `fator-s-challenge-2023.mp4`. Com os links, o Claude troca o `videoUrl` dos dois eventos.
4. **Transcrever o áudio de 12 minutos do treinamento de alta performance** (learn-tech e bootcamps). Identificada em 2026-10-30.
   Use o "Transcrever" do Word na web (Microsoft 365) ou a digitação por voz do Google Docs e salve o texto como .txt em `hd/3-soft_skills/geronimo-theml - performance/`.
5. **Trocar as senhas que aparecem em arquivos do hd** (segurança). Identificada em 2026-10-30.
   HD-0035 e HD-0055 (ambiente do ex-empregador) e DOC-058 (plataforma de curso). Nada disso foi copiado para a API.
6. **Informar o site oficial da Taak** (tools). Identificada em 2026-10-31.
   A ficha está como "Página em revisão" e o link aponta para uma reportagem.
7. **Fechar a leva 1, cujos arquivos já saíram do hd** (todos). Identificada em 2026-10-31.
   Para fechar os itens abertos, traga de volta os arquivos ou passe as informações:
   - mapa mental de marca pessoal (DOC-021);
   - provas do IF Sudeste (DOC-054 a 056);
   - deck do CodeXperience 2024/25 (EV-003);
   - ideia e pitch do Startup Way (EV-007);
   - certificado do Minas Summit 2024 (EV-002);
   - se foi bolsista na universidade (DOC-024) e no Santander/Ada (EV-005);
   - autoria do e-book de produtividade (DOC-016);
   - palestra de vendas (DOC-031).
8. **Aprovar o fechamento do lote 2026-10-30** (processo). Identificada em 2026-10-31.
   Depois das tarefas 3 e 4, o Claude apresenta o relatório de fechamento. Com a aprovação, entra a linha "Aprovado pelo autor em: AAAA-MM-DD" em `docs/processo/lotes/2026-10-30-leva-3.md`, e só então os arquivos podem sair do hd.
9. **Apagar a pasta de apoio do Claude, quando quiser** (limpeza). Identificada em 2026-10-31.
   `C:\douglasabnovato-github\.claude-tmp\` guarda textos extraídos (sem senhas, e-mails ou telefones) e miniaturas. O ambiente do Claude não tem permissão para apagar.

10. **Confirmar fatos que só você sabe** (conteúdo). Identificada em 2026-11-01.
   - Título exato do livro do Paulo Vieira que está na estante (o texto diz "As 6 Chaves para Conquistar suas Metas", e nenhuma fonte aberta confirmou).
   - ByteClass: o site oficial fala em atendimento 100% online, enquanto o texto do bootcamps fala em presencial ou híbrido e em níveis M1 a M5. Qual versão vale?
   - CodeXperience: o evento foi gratuito? A página do Sympla de 2024 mostra pedidos pagos.
   - BQ Agenda Tech: o número do endereço é 113 ou 115?
11. **Reler as cláusulas de confidencialidade do contrato com o ex-empregador** e confirmar ou ajustar a seção 7 de `docs/processo/regras-editoriais.md` (jurídico). Identificada em 2026-11-01.

## Concluídas
- 2026-11-01: subir o placar e o backlog de engenharia (merge `3813e13`).
- 2026-11-01: merge e push das alterações de 31/10 e 01/11 em learntech-content, learn-tech, bootcamps e career, com o deploy da API.
- 2026-11-01: confirmar a API no ar com a versão nova (o autor rodou o deploy e a checagem por curl).
- 2026-10-31: merge e push das levas 2 a 4 nos cinco projetos (`main` atualizada no GitHub).
- 2026-10-31: confirmar a participação na organização do Hackathon (sim; a página foi enriquecida).
- 2026-10-31: definir o critério da página da ABC (contar a experiência sem expor a empresa).
