# Lote 2026-11-22: plano do Desafio hd-codes

**Estado:** plano aprovado pelo autor em 22/11/2026. As palavras dele, repassadas pelo Líder de TODOS: "aprovo / 1 por curso / piloto pode ser a dcc013 / autorizo todos / tipo disciplina sim". Ainda não há conteúdo produzido. Issue-mãe: [#49](https://github.com/douglasabnovato/learntech-content/issues/49).

## O que é
A hd-codes inteira (204 itens) vira material em 2 entregas por dia, um item por vez, nos 4 sites, nos repositórios dos cursos e no Studio D. A `5-expertise` é a prioridade, com o padrão por disciplina.

Documentos:
- [`../fluxo-ponta-a-ponta.md`](../fluxo-ponta-a-ponta.md)
- [`../hd-codes.md`](../hd-codes.md)
- [`../motor-2-por-dia.md`](../motor-2-por-dia.md)
- [`../padrao-disciplina.md`](../padrao-disciplina.md)

## Fases
| Fase | Quando | Entrega |
|---|---|---|
| F0 | 1º dia depois do ok | inventário da hd-codes, só leitura (#41, depois da #42), e a fila com os primeiros 40 itens (#43) |
| F1 | semana 1 | o motor 2 por dia com a L1 e a L2 (#44) e o placar (#45) |
| F2 | semana 2 | roteiro automático para cada página e a ficha das redes (studio-d) |
| F3 | semana 3 | decisão sobre o merge automático (AU2) e o repositório `onibus-horarios`, se aprovado |

## Pré-requisitos neste repositório
| Issue | O quê | Estado |
|---|---|---|
| [#42](https://github.com/douglasabnovato/learntech-content/issues/42) | `hd:inventariar` com `--saida` e `--ignorar` | PR aberto |
| [#48](https://github.com/douglasabnovato/learntech-content/issues/48) | esta documentação | PR aberto |
| [#47](https://github.com/douglasabnovato/learntech-content/issues/47) | tipo `disciplina` no schema, com o exemplo da DCC013 | a fazer |
| [#46](https://github.com/douglasabnovato/learntech-content/issues/46) | D-07 ajustada: textos 🟢 liberados, vídeos esperam a #15 | a fazer |

## Piloto
A DCC013, Estrutura de Dados I (HC-107), entrega:
- a página do tipo `disciplina` no learn-tech;
- a pasta no repositório do curso, com o visual de pilha, fila e lista;
- o roteiro no Studio D.

## O que depende do autor
- os merges e o deploy da API;
- o login do wrangler no Acer ([#35](https://github.com/douglasabnovato/learntech-content/issues/35));
- o Python e o OCR (decisão 76);
- o A1 de cada item 🟡 e de cada disciplina;
- a gravação e a postagem;
- o arraste para a `000-catalogado`.

## Fechamento
Na hd-codes não existe A3 ([`../README.md`](../README.md), etapa 9): o item fecha quando está no ar e o autor o arrastou para a `000-catalogado`.
