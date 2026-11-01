# Próximos passos do autor

Lista única das tarefas que dependem do autor (Douglas), em ordem de prioridade. O Claude atualiza este arquivo ao fim de cada entrega e repete a lista no chat. Uma tarefa concluída sai da lista e vai para "Concluídas", com a data.

Formato: número, tarefa, projeto, **identificada em** (data em que surgiu) e como fazer.

## Em aberto

1. **Subir o placar e o backlog de engenharia** (learntech-content). Identificada em 2026-11-01.
   `git checkout -b feature/tasks-01-11-2026-b`, `git add -A`, `git commit -m "processo: placar de 0 a 100 e backlog de engenharia"`, `git push -u origin feature/tasks-01-11-2026-b`, merge na `main` e `git push origin main`. Não precisa de deploy (só documentação e scripts).
2. **Subir no YouTube as duas compilações de vídeo e mandar os links ao Claude** (bootcamps). Identificada em 2026-10-31.
   Arquivos em `C:\douglasabnovato-github\videos-para-youtube\`: `hackathon-inovacao-social-jf-2023.mp4` e `fator-s-challenge-2023.mp4`. Com os links, o Claude troca o `videoUrl` dos dois eventos.
3. **Transcrever o áudio de 12 minutos do treinamento de alta performance** (learn-tech e bootcamps). Identificada em 2026-10-30.
   Use o "Transcrever" do Word na web (Microsoft 365) ou a digitação por voz do Google Docs e salve o texto como .txt em `hd/3-soft_skills/geronimo-theml - performance/`.
4. **Trocar as senhas que aparecem em arquivos do hd** (segurança). Identificada em 2026-10-30.
   HD-0035 e HD-0055 (ambiente do ex-empregador) e DOC-058 (plataforma de curso). Nada disso foi copiado para a API.
5. **Informar o site oficial da Taak** (tools). Identificada em 2026-10-31.
   A ficha está como "Página em revisão" e o link aponta para uma reportagem.
6. **Fechar a leva 1, cujos arquivos já saíram do hd** (todos). Identificada em 2026-10-31.
   Para fechar os itens abertos, traga de volta os arquivos ou passe as informações:
   - mapa mental de marca pessoal (DOC-021);
   - provas do IF Sudeste (DOC-054 a 056);
   - deck do CodeXperience 2024/25 (EV-003);
   - ideia e pitch do Startup Way (EV-007);
   - certificado do Minas Summit 2024 (EV-002);
   - se foi bolsista na universidade (DOC-024) e no Santander/Ada (EV-005);
   - autoria do e-book de produtividade (DOC-016);
   - palestra de vendas (DOC-031).
7. **Aprovar o fechamento do lote 2026-10-30** (processo). Identificada em 2026-10-31.
   Depois das tarefas 2 e 3, o Claude apresenta o relatório de fechamento. Com a aprovação, entra a linha "Aprovado pelo autor em: AAAA-MM-DD" em `docs/processo/lotes/2026-10-30-leva-3.md`, e só então os arquivos podem sair do hd.
8. **Apagar a pasta de apoio do Claude, quando quiser** (limpeza). Identificada em 2026-10-31.
   `C:\douglasabnovato-github\.claude-tmp\` guarda textos extraídos (sem senhas, e-mails ou telefones) e miniaturas. O ambiente do Claude não tem permissão para apagar.

## Concluídas
- 2026-11-01: merge e push das alterações de 31/10 e 01/11 em learntech-content, learn-tech, bootcamps e career, com o deploy da API.
- 2026-11-01: confirmar a API no ar com a versão nova (o autor rodou o deploy e a checagem por curl).
- 2026-10-31: merge e push das levas 2 a 4 nos cinco projetos (`main` atualizada no GitHub).
- 2026-10-31: confirmar a participação na organização do Hackathon (sim; a página foi enriquecida).
- 2026-10-31: definir o critério da página da ABC (contar a experiência sem expor a empresa).
