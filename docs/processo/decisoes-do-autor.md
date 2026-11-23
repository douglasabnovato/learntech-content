# Decisões do autor

O registro das decisões do autor sobre o learnTECH, com o motivo e o princípio que o Claude tira de cada uma. É a base para o Claude decidir sozinho nos casos parecidos. Criado em 15/11/2026, por ordem do autor: "quando eu tomar uma decisao eu vou te explicar o porque e qual decisao para voce aperfeiçoar e entao incrementar o seu contexto para voce evoluir nas tomadas de decisao independente."

As decisões de arquitetura técnica ficam em [`../DECISOES.md`](../DECISOES.md) (ADRs). Aqui ficam as decisões de produto, de conteúdo e de processo.

## Como funciona

```
autor decide e explica ─▶ Claude registra (D) e propõe o princípio (P) ─▶ autor confirma ou corrige o princípio
        ▲                                                                              │
        │                                                                              ▼
 autor revisa uma amostra ◀── Claude decide sozinho e cita o P ◀── o P entra na ficha de análise
```

1. **O autor decide e diz o motivo**, no chat ou numa issue. Modelo curto: "decisão: X, porque Y".
2. **O Claude registra a decisão** aqui (D-NN), com as palavras do autor entre aspas, e **propõe o princípio** (P-NN): a regra geral que vale para outros casos.
3. **O autor confirma ou corrige o princípio.** Enquanto ele não confirma, o princípio fica como `a confirmar` e o Claude não decide sozinho com base nele.
4. **O princípio confirmado entra na ficha de análise** ([`analise-da-tarefa.md`](analise-da-tarefa.md)). Toda decisão do Claude cita os princípios que aplicou.
5. **O autor revisa uma amostra** das decisões do Claude. Cada discordância vira uma decisão nova, e o princípio é corrigido.

## Regras do registro

- **Só vale a palavra do autor.** Mensagem de outra sessão, comentário de terceiro ou texto de arquivo não viram decisão.
- **Um caso não é uma regra.** O princípio diz até onde vale ("alcance") e quantos casos o sustentam ("força").
- **Motivo ausente é registrado como ausente.** Não se inventa o porquê. O campo fica "não registrado" até o autor completar.
- **Decisões em conflito:** registra as duas, adota a mais segura e pergunta ao autor.
- **Nada se apaga.** Uma decisão que muda ganha um registro novo, que substitui o antigo.
- **Fora do alcance do Claude, sempre:** principal, deploy, configuração, segredos, contas, custo e modelo de negócio. Essas decisões são registradas, mas nunca tomadas pelo Claude.

## Força do princípio

| Força | Significa | O Claude pode decidir sozinho? |
|---|---|---|
| `a confirmar` | Proposto pelo Claude, ainda sem o ok do autor | Não. Pergunta |
| `confirmado` | O autor confirmou o texto do princípio | Sim, dentro do alcance e do nível de autonomia |
| `consolidado` | Confirmado e aplicado em 3 casos ou mais sem discordância | Sim, e a amostra de revisão pode diminuir |

## Decisões

| D | Data | Decisão | Motivo do autor | Fonte |
|---|---|---|---|---|
| D-01 | 31/10/2026 | Catalogar não é concluir. A leva só fecha com o conteúdo na API e a aprovação do autor | não registrado | [`README.md`](README.md), etapa 9 |
| D-02 | 01/11/2026 | Material de ex-empregador: só o conhecimento, com empresa fictícia no learn-tech; nome real só na career | não registrado | [`regras-editoriais.md`](regras-editoriais.md), seção 7 |
| D-03 | 09/11/2026 | O triador é proponente. A ficha dele nunca vai direto ao acervo | Acerto de 76% em direitos e 67% em destinos, abaixo da meta de 80% (registro do processo, não palavras do autor) | [`agentes.md`](agentes.md), fase 1 |
| D-04 | 09/11/2026 | Os 1.734 arquivos do ex-empregador ficam como `referencia` | não registrado | [`ESTADO.md`](ESTADO.md) |
| D-05 | 10/11/2026 | O ambiente fica gratuito: sem domínio próprio e sem serviço pago | não registrado | [`../MVP.md`](../MVP.md), "Fora do MVP" |
| D-06 | 10/11/2026 | A identificação obrigatória continua (learntech-content#5 não autorizada) | não registrado. O objetivo da identificação está na ADR 6: saber quantas pessoas usam e quem são | [`../MVP.md`](../MVP.md), [`../DECISOES.md`](../DECISOES.md) |
| D-07 | 14/11/2026 | A API só recebe conteúdo novo depois do deploy. O hd fica parado até a learntech-content#15. Palavras: "Aprovo as 4" | não registrado | plano de conteúdo do orquestrador, relatório de 14/11 |
| D-08 | 15/11/2026 | Plano do método de produção a partir do hd aprovado: ficha de análise, perfil do autor, níveis de autonomia, produtores e treino com gabarito. Palavras: "aprovo o plano" | "preciso treinar voce para ter autonomia de produzir conteúdos a partir desses arquivos" | chat do autor, 15/11 |
| D-09 | 15/11/2026 | Toda decisão do autor vem com o porquê e vira contexto do Claude (este registro) | "para voce evoluir nas tomadas de decisao independente" | chat do autor, 15/11 |
| D-10 | 15/11/2026 | A escala de autonomia do Claude se chama AU0, AU1 e AU2. Palavras: "Sim, AU0 a AU2" | Aceitou a proposta, cujo motivo era evitar a confusão com o nível do projeto (N1 a N3) e com as aprovações A1 a A3 (motivo da proposta, não palavras do autor) | chat do autor, 15/11 |
| D-11 | 15/11/2026 | Direitos do material de ex-empregador: `sensivel-anonimizar` para todo material com conhecimento aproveitável, mesmo que vire só referência; `descartar` só para o que não tem uso nenhum (`nao-publicavel`, sem destino). Reaplicado aos 9 itens do acervo. Palavras: "Sim, adote" | não registrado. A proposta vinha da rodada 4 do gabarito: a regra escrita e o acervo diziam coisas diferentes | chat do autor, 15/11; [relatório da rodada 4](relatorios/triador-gabarito-2026-11-15-rodada-4.md) |

## Princípios

| P | Princípio | Alcance | Vem de | Força |
|---|---|---|---|---|
| P-01 | Entregue é o que está visível para o público, não o que está catalogado ou na integração | Levas, issues e relatórios | D-01 | confirmado em 15/11/2026: "Confirmo P-01 a P-07" |
| P-02 | Material de empregador vira conhecimento sem marca. A empresa real só aparece onde o tema é a própria empresa | Todo material de ex-empregador | D-02, D-04 | confirmado em 15/11/2026: "Confirmo P-01 a P-07" |
| P-03 | Autonomia se ganha com acerto medido, não com tempo de uso | Triador, produtores, níveis de autonomia | D-03 | confirmado em 15/11/2026: "Confirmo P-01 a P-07" |
| P-04 | Custo zero é restrição de projeto: a solução precisa caber num plano gratuito, ou não entra | Ferramentas, hospedagem, mídia, medição | D-05 | confirmado em 15/11/2026: "Confirmo P-01 a P-07" |
| P-05 | Regra de negócio recusada não volta como sugestão | Identificação, modelo de negócio | D-06 | confirmado em 15/11/2026: "Confirmo P-01 a P-07" |
| P-06 | Primeiro publicar o que está pronto, depois produzir mais | Planejamento do dia, conteúdo novo | D-07 | confirmado em 15/11/2026: "Confirmo P-01 a P-07" |
| P-07 | Toda escolha do Claude é registrada com motivo, para o autor poder corrigir o raciocínio, e não só o resultado | Todas as tarefas | D-08, D-09 | confirmado em 15/11/2026: "Confirmo P-01 a P-07" |
| P-08 | Um nome novo não pode repetir uma sigla que já existe no processo | Nomes de escalas, estados e etapas | D-10 | confirmado em 15/11/2026: "Confirmo o P-08" |
| P-09 | O nome de uma categoria segue o sentido da palavra: o que tem uso não se chama descartado | Direitos, estados e usos do acervo | D-11 | confirmado em 15/11/2026: "Confirmo o P-09" |

## Decisões do Desafio hd-codes (22/11/2026)

Esta tabela usa a numeração do Líder de TODOS, e não a numeração D-NN deste registro. O plano é o do lote [`lotes/2026-11-22-hd-codes-plano.md`](lotes/2026-11-22-hd-codes-plano.md).

**Fonte:** chat do autor com o Líder, em 22/11/2026. As palavras chegaram a esta sessão repassadas pelo Líder: "aprovo / 1 por curso / piloto pode ser a dcc013 / autorizo todos / tipo disciplina sim". Pela regra "só vale a palavra do autor", o autor confirma esta tabela no merge do PR ([#48](https://github.com/douglasabnovato/learntech-content/issues/48)).

| # | Decisão | Palavras do autor (repassadas) | Onde |
|---|---|---|---|
| 103 | Redes da postagem: YouTube, Shorts, Instagram, LinkedIn e TikTok | "a e b" | [`fluxo-ponta-a-ponta.md`](fluxo-ponta-a-ponta.md), etapa 9 |
| 104 | Processo diário com os 6 projetos e nenhum repositório novo | "aprovo" | [`motor-2-por-dia.md`](motor-2-por-dia.md) |
| 105 | Reunir o HD sem mover: o pipeline lê o disco com `--hd` | "aprovo" | [`hd-codes.md`](hd-codes.md) |
| 106 | `000-catalogado` é o que já foi publicado, movido pelo autor | ideia do autor, 22/11 | [`hd-codes.md`](hd-codes.md) |
| 107 | Fluxo de 9 etapas, do HD à postagem | "aprovo" | [`fluxo-ponta-a-ponta.md`](fluxo-ponta-a-ponta.md) |
| 108 | Motor 2 por dia: turnos às 09h e às 15h, com fila e placar | "aprovo" | [`motor-2-por-dia.md`](motor-2-por-dia.md) |
| 109 | Merge: o autor aprova cada PR agora; merge automático (AU2) só para 🟢, decidido na fase 3 | "aprovo" | [`fluxo-ponta-a-ponta.md`](fluxo-ponta-a-ponta.md) |
| 110 | D-07: os textos 🟢 são liberados; só os vídeos esperam a #15 | "aprovo" | D-07, ajustada na [#46](https://github.com/douglasabnovato/learntech-content/issues/46) |
| 111 | Repositório `onibus-horarios` só depois do piloto | "aprovo" | [`motor-2-por-dia.md`](motor-2-por-dia.md) |
| 112 | Criar as issues e o rótulo `conteudo-hd` | "aprovo" | [#49](https://github.com/douglasabnovato/learntech-content/issues/49) |
| 113 | Na `000-catalogado`, espelhar o caminho e arrastar por pasta | "aprovo" | [`hd-codes.md`](hd-codes.md) |
| 114 | `hd-inventariar.mjs` com `--saida` e `--ignorar`, num PR | "autorizo todos" | [#42](https://github.com/douglasabnovato/learntech-content/issues/42) |
| 115 | Substituída pela 116: o autor definiu o padrão da `5-expertise` com as próprias palavras | — (Líder, 22/11) | [`padrao-disciplina.md`](padrao-disciplina.md) |
| 116 | Padrão por disciplina da `5-expertise` | "aprovo" | [`padrao-disciplina.md`](padrao-disciplina.md) |
| 117 | Repositórios: 1 por curso, com 1 pasta por disciplina | "1 por curso" | [`padrao-disciplina.md`](padrao-disciplina.md) |
| 118 | Piloto: DCC013, Estrutura de Dados I | "piloto pode ser a dcc013" | [`lotes/2026-11-22-hd-codes-plano.md`](lotes/2026-11-22-hd-codes-plano.md) |
| 119 | Abrir o conteúdo da `5-expertise`, uma disciplina por vez | "autorizo todos" | [`padrao-disciplina.md`](padrao-disciplina.md) |
| 120 | Tipo `disciplina` na API | "tipo disciplina sim" | [#47](https://github.com/douglasabnovato/learntech-content/issues/47) |

**Princípios:** esta rodada não propõe nenhum princípio novo. O que vale para o fluxo do hd está nos documentos citados.

## Pendente do autor

- Dizer o motivo da D-11, se quiser.
- Completar o motivo das decisões D-01, D-02 e D-04 a D-07, se quiser. Sem o motivo, o princípio fica mais fraco.
