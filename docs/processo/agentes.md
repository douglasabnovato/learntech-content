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

Itens antigos têm destinos em texto livre (ex.: `empresas/Pitang`). Eles continuam válidos e são migrados quando forem tocados.

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
| 1. Triador | `hd:extrair`, agente triador e avaliação com gabarito (itens já triados do acervo) | Acerto de pelo menos 80% em direitos e destinos |
| 2. Produtores | Primeiro o do bootcamps, depois os outros três e o revisor | Um item de cada site aprovado no A2 |
| 3. Verificador | Script de exibição e CI agendada (issue #10) | Relatório "N de N visíveis" gerado sozinho |
| 4. Piloto | `6-tech_community/gdg_jf` de ponta a ponta | Itens `exibido`, métricas medidas, retrospectiva |
| 5. Escala | Lotes por tipo, com mídia no R2 (issue #8) | Remessa com fotos sem estourar o Worker |

## Métricas por lote
- Tempo do hd até `exibido` (pelas `etapas`).
- Percentual aprovado no A2 sem edição.
- Acerto do triador contra o gabarito.
- Defeitos achados pelo verificador depois do deploy.
- Minutos do autor por lote.
