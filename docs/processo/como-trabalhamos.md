# Como trabalhamos: autor e Claude

Referência da colaboração entre o autor (Douglas) e o Claude para desenvolver, manter, analisar e arquitetar o ecossistema learnTECH. Nasceu da revisão de 01/11/2026 e é ajustada sempre que uma forma de trabalhar falha ou melhora. As regras de conteúdo estão em `README.md` e `regras-editoriais.md`; este documento trata da colaboração.

## Papéis
| Quem | Faz | Não faz |
|---|---|---|
| **Autor** | Define objetivo, prioridade e critério de pronto. Revisa, aprova e publica (merge e deploy). Decide o que é sensível. Faz a revisão semanal. | Executar comandos sem saber o que mudou. |
| **Claude** | Planeja, produz conteúdo e código, testa o que consegue, documenta, mede (placar, cobertura, leva) e lista o que depende do autor. Cria as branches locais. | Fazer merge na `main` ou deploy. Ler segredos. Declarar "concluído" sem evidência. |

## O que estamos acertando (manter)
1. **Divisão clara:** o Claude prepara, o autor publica.
2. **Correção vira regra:** todo erro encontrado vira regra escrita ou checagem automática (regras editoriais, `leva:status`, `cobertura`, varredura de anonimização).
3. **Progresso medido:** `npm run progresso` (placar de 0 a 100), `PROXIMOS-PASSOS.md` e relatório ao fim de cada fluxo.
4. **Contexto rico:** trajetória do autor, objetivo do ecossistema e padrão de qualidade estão documentados.
5. **Limites de segurança desde o início:** segredos, dados de terceiros e projetos de outras empresas ficam fora.
6. **Autonomia com rastro:** o Claude não para por dúvida; registra, escolhe o caminho mais conservador e segue.

## O que estamos ajustando (metas)
| # | Problema observado | Ajuste | Como medir |
|---|---|---|---|
| 1 | Entregas enormes (mais de 160 arquivos num commit, mensagens genéricas, dias sem commit) | Commits por tema, com mensagem descritiva. O Claude entrega a lista de commits sugeridos | Nenhum commit com mais de cerca de 40 arquivos fora de conteúdo gerado |
| 2 | Publicar sem revisar ("eu não conferi") | Pull request com pré-visualização: a CI roda, o Vercel gera o link e o autor olha antes do merge | Todo merge tem PR com CI verde |
| 3 | Merge local direto na `main` | CI obrigatória na `main` (regra no GitHub) e merge `--ff-only` depois da CI verde na branch | Regra ativa nos 5 repositórios (feito em 03/11/2026) |
| 4 | Sessões gigantes misturando conteúdo, engenharia, processo e Git, com o contexto resumido no meio | Uma conversa por frente, com registro de passagem (`conversas/`) | Cada conversa termina com o registro preenchido |
| 5 | Testes escritos pelo Claude, mas só executados na máquina do autor (`node_modules` de Windows) | Dar ao Claude acesso ao GitHub: a CI do PR vira a verificação, sem depender do notebook | O Claude lê o resultado da CI e corrige antes de pedir revisão |
| 6 | Acreditar no "terminei" sem prova (o hd foi apagado antes da hora) | Toda conclusão vem com evidência: saída do script, teste verde, link da CI | Relatórios sempre com a saída de `progresso`, `leva:status` e `cobertura` |
| 7 | Pedidos com várias frentes e critério implícito | Pedido com objetivo, critério de pronto e prioridade (modelo abaixo) | Menos idas e vindas por ambiguidade |
| 8 | Risco legal no material do ex-empregador | Reler as cláusulas de confidencialidade do contrato antes de ampliar esse conteúdo; na dúvida, generalizar | Decisão do autor registrada |
| 9 | Comandos de Git colados a cada publicação | Script `scripts/publicar.sh` | Publicação com um comando, que para no primeiro erro |
| 10 | O autor vira só executor | Revisão semanal de 20 minutos: placar, backlog e amostra do conteúdo publicado | Registro da revisão em `conversas/` |

## Trabalho contínuo até terminar os cinco projetos (09/11/2026)
Pedido do autor: o Claude trabalha sempre para terminar os cinco projetos, apresenta o andamento e transforma toda tarefa nova em issue.

**Ciclo de cada sessão** (começa quando o autor abre a conversa ou diz "continue"):
1. Ler `ESTADO.md`, as issues abertas dos cinco repositórios e a saída de `npm run progresso` e `npm run hd:uso`.
2. Pegar a próxima issue que não depende do autor, na ordem de prioridade abaixo, e entregá-la: branch do dia, testes, push, CI verde e `developer` por `--ff-only`, com a evidência comentada na issue. **O Claude não leva nada para a `main`** (produção): o autor revisa a `developer` e faz o `--ff-only` para a `main` (decisão do autor em 09/11/2026). A issue fecha quando o trabalho chega à `main`.
3. Ao achar uma tarefa nova, abrir a issue no repositório certo: contexto, critérios de entrega, origem, labels (`proximos-passos` mais o tema; `decisao-do-autor` quando depende do autor) e a assinatura.
4. Terminar com o relatório de andamento (modelo abaixo) e o `ESTADO.md` atualizado.

**Ordem de prioridade:**
1. Uso do hd até zero pendentes e fluxo de agentes (learntech-content, label `acervo`): sem isso, a próxima remessa do hd não entra.
2. Qualidade de MVP de cada site (`proximos-passos` com acessibilidade, SEO, performance, testes).
3. Produto (busca, filtros, páginas novas).
4. Issues antigas sem label (ideias e conteúdos do autor): só quando ele trouxer o material.

**Relatório de andamento:**
```
Feito: <issue, o que mudou, evidência: teste, CI, saída do script>
Em andamento: <issue e o que falta>
Para você: <decisões e ações do autor, cada uma com a issue>
Issues novas: <links>
Próximo: <a próxima issue que o Claude vai pegar>
Placar: <npm run progresso> · hd: <pendentes do npm run hd:uso>
```

## Fluxo de entrega (alvo)
1. **Início:** branch do dia nos repositórios tocados, sempre a partir da `main` atualizada (regra completa em `README.md`, Recepção).
2. **Trabalho:** o Claude produz em entregas pequenas, roda validação, testes possíveis, `cobertura`, `leva:status` e `copias`.
3. **Pull request:** com acesso ao GitHub, o Claude envia a branch e abre o PR com o modelo (resumo, evidências, checklist). Sem acesso, entrega os commits sugeridos e o comando `publicar.sh`.
4. **CI e pré-visualização:** a CI roda e o Vercel publica a prévia. O Claude lê o resultado e corrige o que falhar.
5. **Revisão do autor:** de 5 a 10 minutos, com o diff resumido, a prévia e a checklist do PR.
6. **Merge e deploy:** pelo autor. Na API, `npm run deploy` ou o deploy automático com os segredos.
7. **Fechamento:** relatório com repositórios, pendências e placar; `PROXIMOS-PASSOS.md` e o registro da conversa atualizados.

## Modelo de pedido (para o autor)
```
Objetivo: <o que quero conseguir>
Pronto quando: <critério verificável — ex.: artigo publicado, validação 0 erros, revisão independente feita>
Prioridade: <alta | média | baixa> — <o que fazer primeiro se não der tempo>
Restrições: <o que não pode — ex.: não citar a empresa X>
```

## Conversas múltiplas e passagem de contexto
- **Uma conversa por frente:** conteúdo do hd (por remessa), engenharia (por fase), revisão semanal, dúvidas avulsas.
- **Memória compartilhada é o repositório.** Toda conversa começa lendo `docs/processo/ESTADO.md` (estado atual e para onde ir), depois `PROXIMOS-PASSOS.md` e o último registro em `docs/processo/conversas/`.
- **Toda conversa termina com um registro** em `conversas/AAAA-MM-DD-<tema>.md` (modelo em `conversas/README.md`) e com o `ESTADO.md` atualizado.
- **Projeto no claude.ai (opcional):** pode guardar uma cópia do `ESTADO.md` para abrir conversas no navegador com o contexto já carregado. A fonte de verdade continua sendo o repositório, que é versionado.

## Evidência mínima de cada entrega
| Tipo | Evidência |
|---|---|
| Conteúdo | Validação com 0 erros, `cobertura` sem destino inexistente, revisão independente por amostra quando houver texto novo com fontes |
| Código | Teste verde (local ou CI), lint, build |
| UX | Relatório do e2e e do Lighthouse em `docs/engenharia/relatorios/` |
| Processo | Documento atualizado e `progresso` rodado |

## Revisão semanal (autor, 20 minutos)
1. `npm run progresso`: o placar subiu? O que travou?
2. `PROXIMOS-PASSOS.md`: alguma tarefa sua passou de 7 dias?
3. Abrir 3 páginas publicadas na semana e conferir texto, fontes e visual.
4. Escolher a prioridade da semana seguinte e registrar em `conversas/`.
