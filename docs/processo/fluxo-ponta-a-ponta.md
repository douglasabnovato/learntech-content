# Fluxo de ponta a ponta: do HD à postagem

Atualizado em 22/11/2026, no Desafio hd-codes ([#49](https://github.com/douglasabnovato/learntech-content/issues/49), decisão 107 do autor). Este documento junta num lugar só o que antes estava espalhado: as levas do hd ([`README.md`](README.md)), os agentes ([`agentes.md`](agentes.md)) e o roteiro de gravação (Studio D).

## As 9 etapas

```
1 HD (hd-codes) → 2 TRIAGEM → 3 API learntech-content → 4 SITES (learn-tech, bootcamps, career, tools)
                                                    ↘ 5 PROJETOS NOVOS (código e especificação)
4 → 6 ROTEIRO (Studio D) → 7 GRAVAÇÃO (autor) → 8 SHORTS → 9 POSTAGEM (autor, guiado)
```

| # | Etapa | Quem | Depende do autor? |
|---|---|---|---|
| 1 | Ler a hd-codes, só leitura, um item por vez ([`hd-codes.md`](hd-codes.md)) | sessão LearnTech | não |
| 2 | Triagem: cor 🟢🟡🔴, destino e ficha ([`analise-da-tarefa.md`](analise-da-tarefa.md)) | triador + gabarito (D-08) | só nos itens 🟡 |
| 3 | Conteúdo na API, validado com `npm run validar` | sessão LearnTech | não |
| 4 | Exibir nos 4 sites (`npm run copias`) | API → sites | **o merge** (decisão 109) |
| 5 | Projeto novo a partir de código ou especificação do HD | sessão GitHub | a criação do repositório é do autor |
| 6 | Roteiro com blocos-corte, a partir da página publicada | sessão GitHub (Studio D) | não |
| 7 | Gravar a aula | **autor** | sim |
| 8 | Cortar os shorts e montar a ficha de publicação | sessão GitHub | não |
| 9 | Postar nas redes (decisão 103: YouTube, Shorts, Instagram, LinkedIn e TikTok) | **autor**, guiado | sim |

As etapas 1 a 6 e a 8 rodam sem o autor. Fora o merge, ele entra só na gravação (7) e na postagem (9).

## As aprovações

| Aprovação | Na hd-codes | Onde |
|---|---|---|
| **A1** (plano do lote) | vale: item 🟡 e disciplina da `5-expertise` só entram com o ok do autor | [`README.md`](README.md), etapa 4 |
| **A2** (publicação) | vale: o merge do PR é do autor, e o deploy da API também | [`README.md`](README.md), etapa 8 |
| **A3** (baixa do hd) | **não existe**: o autor arrasta o item publicado para a `000-catalogado` | [`hd-codes.md`](hd-codes.md) |

## O merge (decisão 109)
- **Agora:** o autor aprova cada PR, inclusive pelo celular.
- **Fase 3, depois de 2 semanas sem nenhum PR recusado:** a decisão sobre o merge automático (nível AU2 da D-10), só para PR de texto 🟢 que passou no `validar`. Os itens 🟡 continuam com o autor.

## Quem faz o commit
O Claude faz commit e push na branch do dia e abre o PR com a CI verde. O merge e o deploy são do autor ([`README.md`](README.md), etapa 1; [`fluxo-git.md`](fluxo-git.md)).

## Ligações
- O ritmo de 2 entregas por dia: [`motor-2-por-dia.md`](motor-2-por-dia.md).
- O padrão da `5-expertise`: [`padrao-disciplina.md`](padrao-disciplina.md).
- O plano do lote: [`lotes/2026-11-22-hd-codes-plano.md`](lotes/2026-11-22-hd-codes-plano.md).
