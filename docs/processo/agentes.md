# Fluxo de agentes: do hd até a tela

Proposto e aprovado em 06/11/2026 (fase 0). O fluxo continua sendo o de 10 etapas de `README.md`, mas o trabalho de cada etapa passa a ter um responsável fixo: um agente do Claude Code com papel único ou o autor. Os agentes trocam arquivos com formato definido. As aprovações A1, A2 e A3 continuam do autor.

```
hd/entrada ─▶ TRIADOR ─▶ fichas no acervo ─▶ ◆A1 autor aprova a tabela
                                                │
      ┌──────────────┬──────────────┬───────────┴──┐
      ▼              ▼              ▼              ▼
 PRODUTOR        PRODUTOR       PRODUTOR       PRODUTOR
 learn-tech      bootcamps      career         tools
      └──────────────┴──── content/ ────────────────┘
                             │ validar + REVISOR
                             ▼
                   ◆A2 autor aprova o PR ─▶ deploy e cópias
                             │
                             ▼
                        VERIFICADOR ─▶ ◆A3 "N de N visíveis"
```

## Estados do item no `acervo.json`

| Estado | Quem coloca | Significa |
|---|---|---|
| `novo` | `npm run hd:inventariar -- --registrar` | Arquivo registrado por hash, ainda sem leitura |
| `extraido` | script de extração (fase 1) | Texto, imagens e metadados extraídos para `hd/.extraido/`, fora do git |
| `triado` | triador | Ficha preenchida: direitos, descrição sem nomes, destinos sugeridos e `triagem` com confiança |
| `planejado` | autor, no A1 | Destinos aprovados. A produção pode começar |
| `produzido` | produtor do projeto | Conteúdo escrito em `content/`, `npm run validar` verde, aguardando A2 |
| `publicado` | autor, no A2, depois do deploy | Conteúdo na API |
| `exibido` | verificador | Página conferida nos sites: API, cópia, detalhe, imagem, relacionados e sitemap |
| `publicado-em-parte` | produtor ou autor | Parte publicada, com `pendencias` |
| `referencia` | triador ou autor | O arquivo não sai do hd, mas o conhecimento foi usado nos destinos |
| `nao-publicavel` | triador ou autor | Sem uso público (ex-empregador, dado de terceiro) |

Regras que o build confere (`src/schemas/acervo.ts`):
- de `triado` em diante, `direitos` não pode ser `a-triar`;
- `produzido`, `publicado`, `publicado-em-parte` e `exibido` precisam de destino;
- `triagem.confianca` vai de 0 a 1;
- quando há `etapas`, a última é o estado atual, e `por` é o autor ou um dos agentes.

`npm run leva:status` e `npm run progresso` contam `publicado`, `exibido` e `referencia` como fechados.

## Uso de cada arquivo (09/11/2026)
O estado é do item (a pasta). O uso é de cada arquivo dentro dele, no campo `uso` de `arquivos[]`. **100% usado = nenhum arquivo `pendente`.** Origem: `relatorios/uso-do-hd-2026-11-06.md`.

| Uso | Significa | Campo obrigatório | Quem marca |
|---|---|---|---|
| `exibido` | Aparece na tela | `destino` (um dos destinos do item) | produtor; `hd:uso --aplicar` marca as fotos iguais às da galeria do evento; o verificador confirma |
| `fonte` | Virou texto publicado, mas não aparece em si | `destino` | produtor |
| `similar` | Quase igual a um arquivo exibido (rajada, outro ângulo) | `similarA` (hash do exibido) | produtor, com `imagens-parecidas.py` |
| `tecnico` | Sem conteúdo (ico, tmp, lnk, iqy...) | — | `hd:uso --aplicar` |
| `referencia` | Base de conhecimento do texto, sem exibição (ex.: material do ex-empregador, regras editoriais seção 7) | `motivo` opcional | triador propõe; autor confirma no A1 |
| `descartado` | Poderia ser usado, mas não vale | `motivo` (ex.: "foto desfocada") | autor, no A1 |
| `pendente` | Sem decisão (arquivo sem o campo também conta) | — | — |

- Cópias idênticas no hd têm o mesmo hash e seguem o uso do original.
- css, js e xml não são marcados como técnicos sozinhos: podem ser código do autor e ficam para o triador.
- `npm run hd:imagens` compara as imagens do hd com as publicadas (dHash) e grava `hd/.imagens-publicadas.json`, fora do git (com cache do dHash em `hd/.dhash-cache.json`: só a primeira execução é lenta). `npm run hd:uso` mostra o raio-x por uso e por item; `-- --aplicar` grava as marcações automáticas; `-- --relatorio` grava `relatorios/uso-do-hd-AAAA-MM-DD.md`, sem nomes de arquivo. `-- --vivo` confere cada destino também na API publicada e na cópia do site.
- `npm run leva:status` só fecha o lote com zero arquivos pendentes.

## Formato do destino
Para itens novos, o destino é sempre `projeto/recurso/id`:

| Projeto | Recursos | id |
|---|---|---|
| learn-tech | `programas`, `blog`, `areas` | número do programa, ou id do artigo ou da área |
| bootcamps | `eventos` | slug do evento |
| career | `empresas`, `vagas`, `perfis`, `modelos-curriculo` | slug |
| tools | `ferramentas`, `hospedagens` | slug |

Todo destino segue `projeto/recurso/id`, com o id real do conteúdo (ex.: `career/empresas/pitang`). O `npm run validar` falha com destino curto ou inexistente (issue #18, 09/11/2026).

## Os papéis

| Papel | Lê | Escreve | Nunca faz |
|---|---|---|---|
| Triador (propõe o `uso` de cada arquivo) | `hd/.extraido/`, `regras-editoriais.md`, `trajetoria-do-autor.md`, `docs/contratos/README.md` | ficha no `acervo.json` (estado `triado`) | escrever em `content/`; copiar nome de pessoa ou cliente |
| Produtor de cada projeto | o contrato do projeto em `docs/contratos/`, os itens `planejado` com destino no projeto | arquivos do recurso em `content/<projeto>/`, mídia em `media/<projeto>/`, estado `produzido` | mexer em outro projeto; mudar schema; publicar |
| Revisor | o conteúdo produzido e o contrato | parecer com nota por critério no relatório do lote | reescrever o conteúdo |
| Verificador | a API publicada e os quatro sites | relatório do lote, estado `exibido`, issue quando falha | mudar conteúdo |
| Autor | tabela do A1, PR do A2, relatório do A3 | aprovações, direitos de casos difíceis, regras novas | — |

Cada produtor carrega só o contrato do seu projeto. Assim o tom de um site não vaza para o outro, e os quatro podem rodar em paralelo, porque cada um mexe em arquivos diferentes.

## Fases

| Fase | Entrega | Pronto quando |
|---|---|---|
| 0. Contratos (06/11/2026) | Estados novos no schema, `docs/contratos/`, `CLAUDE.md` nos cinco repositórios | `validar` e testes verdes |
| 1. Triador | `hd:extrair`, agente triador e avaliação com gabarito (itens já triados do acervo) | Entregue em 09/11/2026: o triador é **proponente** e o A1 corrige (decisão do autor). O gabarito continua como métrica por lote |

### Fase 1 na prática (09/11/2026)
1. `npm run hd:extrair`: texto e metadados de cada arquivo em `hd/.extraido/`, fora do git. O EXIF sai sem GPS. Com `-- --marcar`, itens `novo` passam a `extraido`.
2. O agente `triador` (`.claude/agents/triador.md`) lê a extração e as regras, e grava uma proposta por item em `hd/.extraido/propostas/<id>.json`.
3. `npm run a1`: tabela do A1 com as propostas. Confiança abaixo de 0,7 vira pergunta ao autor.
4. `npm run triador:gabarito`: mede o acerto contra os itens já decididos. O triador roda sem ler o `acervo.json`. Regras em `scripts/lib/gabarito.mjs`; relatório com `-- --relatorio`.

**Decisão do autor (09/11/2026): o triador é proponente.** Em três rodadas (42 itens), o acerto foi de 76% em direitos e 67% em destinos, abaixo da meta inicial de 80% (`relatorios/triador-gabarito-2026-11-09-rodada-3.md`). A ficha do triador nunca vai direto para o acervo: o autor a confirma ou corrige no A1, e as fichas com confiança abaixo de 0,7 viram pergunta. O acerto contra o gabarito segue como métrica por lote, para acompanhar a evolução, e não bloqueia a fase.
| 2. Produtores | Primeiro o do bootcamps, depois os outros três e o revisor | Um item de cada site aprovado no A2 |
| 3. Verificador | Script de exibição e CI agendada (issue #10) | Relatório "N de N visíveis" gerado sozinho |
| 4. Piloto | `6-tech_community/gdg_jf` de ponta a ponta | Itens `exibido`, métricas medidas, retrospectiva |
| 5. Escala | Lotes por tipo, com mídia no R2 (issue #8) | Remessa com fotos sem estourar o Worker |

## Níveis de autonomia (16/11/2026)

Entrega 3 do método de produção a partir do hd, aprovado pelo autor em 15/11/2026 ("aprovo o plano"). O nível diz o que o Claude decide sozinho no A1. O A2 (PR e deploy) e o A3 (fechamento da leva) continuam sempre do autor, em qualquer nível. A base é o princípio P-03 de [`decisoes-do-autor.md`](decisoes-do-autor.md): autonomia se ganha com acerto medido.

**Nível em vigor: N0.** Subir de nível exige o ok explícito do autor, registrado como decisão. O Claude propõe a subida quando a meta for atingida, mas não sobe sozinho.

| Nível | O Claude decide sozinho | Continua com o autor | Para subir ao próximo |
|---|---|---|---|
| **N0** (em vigor) | Nada. Propõe a ficha com a [análise](analise-da-tarefa.md) | Todas as fichas no A1 | Gabarito de pelo menos 85% em direitos e destinos numa rodada com 20 itens ou mais, e princípios P-01 a P-07 confirmados |
| **N1** | Itens com direitos `proprio`, confiança de pelo menos 0,85, sem sinal de pessoa, cliente ou credencial, e com um princípio confirmado que cubra o caso | Todo o resto. Mais uma amostra de 1 em cada 5 itens decididos pelo Claude, revisada depois | 90% de concordância na amostra em dois lotes seguidos |
| **N2** | Também itens `terceiro-citavel`, que entram como referência citada | Material de ex-empregador, dados de pessoas, `sensivel-anonimizar` e confiança abaixo de 0,85. Amostra de 1 em cada 10 | Não há N3. O que é sensível fica sempre com o autor |

### Regras dos níveis
- **Sempre com o autor, em qualquer nível:**
  - material de ex-empregador;
  - fotos e dados de pessoas;
  - credenciais;
  - casos sem princípio confirmado;
  - qualquer tema de principal, deploy, configuração, segredos, contas, custo ou modelo de negócio.
- **Descida automática:** se a amostra de um lote ficar abaixo de 80% de concordância, o nível cai um degrau no lote seguinte. O Claude avisa o autor e registra o motivo.
- **Toda decisão do Claude vai para o plano do lote**, com a ficha completa. O autor pode reverter qualquer uma no A2, antes do deploy.
- **A medição usa o que já existe:** `npm run triador:gabarito` antes de subir, e a amostra revisada pelo autor depois. Cada discordância vira uma decisão nova em [`decisoes-do-autor.md`](decisoes-do-autor.md).

## Métricas por lote
- Tempo do hd até `exibido` (pelas `etapas`).
- Percentual aprovado no A2 sem edição.
- Acerto do triador contra o gabarito.
- Defeitos achados pelo verificador depois do deploy.
- Minutos do autor por lote.
- Nível de autonomia em vigor e concordância da amostra revisada pelo autor.
