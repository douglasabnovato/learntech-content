# Aproveitamento do acervo: do hd à tela dos quatro projetos (09/11/2026)

Pergunta do autor: quanto dos arquivos do hd vira conteúdo na API e, uma vez na API, quanto aparece nos quatro projetos. O objetivo é chegar a um bom índice e a um processo bem desenhado antes de começar a próxima remessa do hd.

## Como foi medido
- **hd → API:** relatório `uso-do-hd-2026-11-06.md`, com um arquivo por linha e hash. Hoje o `hd:uso` passou de 3 minutos no ambiente do Claude e não terminou, então os números por arquivo são os de 06/11. O hd não recebeu arquivos novos desde então.
- **Acervo:** `content/acervo.json`, com 122 itens, estados e destinos, lido nesta data.
- **API:** `dist/v1`, o build publicado de 06/11, com 316 conteúdos em 10 recursos.
- **API → sites:** código dos quatro sites nas branches atuais, observando três coisas:
  - quais recursos cada site busca;
  - quais campos da API aparecem no código;
  - quais conteúdos apontam para outro projeto (`relacionados`).

## Os quatro índices

| # | Índice | Hoje | Leitura |
|---|---|---|---|
| A | **Arquivos do hd com decisão** (exibido, fonte, similar, cópia, técnico ou bloqueado) | **77%** (2.804 de 3.631) | Faltam 827 arquivos sem decisão |
| A' | **Arquivos úteis que viraram conteúdo** (exibido, provável ou fonte, sem cópias e técnicos) | **14%** (368 de 2.638) | Baixo porque 1.443 são de ex-empregador (só conhecimento, sem exibição) |
| B | **Itens do acervo com destino na API** | **93%** (113 de 122) | Os 9 sem destino são não publicáveis, planejados ou referência pura |
| C | **Alcance entre projetos** (projetos que cada item atinge) | **média 1,36**; 66% chegam a um projeto só | O learn-tech recebe 90% dos itens; o bootcamps só 12% |
| D1 | **Recursos da API consumidos pelos sites** | **100%** (10 de 10) | Todo recurso tem tela |
| D2 | **Campos da API exibidos** | **84% a 100%** | O buraco está nas 6 áreas do learn-tech: `competencias` e `diaADia` estão escritos e não aparecem |
| D3 | **Conteúdos com link para outro projeto** | **59%** (188 de 316) | O learn-tech tem 0 de 100; o career não recebe nenhum link dos outros sites |

### C: alcance por projeto (itens do acervo)
| Projeto | Itens que chegam | % dos 113 com destino |
|---|---|---|
| learn-tech | 102 | 90% |
| tools | 20 | 18% |
| career | 19 | 17% |
| bootcamps | 13 | 12% |

Distribuição: 75 itens chegam a 1 projeto, 35 a 2, 3 a 3 e nenhum aos 4.

### D3: quem aponta para quem (links `relacionados` na API)
| De \ Para | learn-tech | bootcamps | career | tools | Conteúdos com link para fora |
|---|---|---|---|---|---|
| learn-tech (100) | — | 0 | 0 | 0 | **0%** |
| bootcamps (27) | 63 | — | 0 | 0 | 100% |
| career (86) | 220 | 15 | — | 14 | 81% |
| tools (103) | 211 | 12 | 0 | — | 88% |
| **Links recebidos** | **494** | **27** | **0** | **14** | |

**Leitura:** o learn-tech é o destino de quase tudo, mas é um beco sem saída. Quem chega num programa ou num artigo não descobre o evento, a empresa nem a ferramenta ligados a ele. O career, por sua vez, não é encontrado a partir de nenhum outro site.

## Onde está a perda
1. **827 arquivos sem decisão no hd** (relatório de 06/11):
   - 481 imagens de ex-empregador (HD-0025 e HD-0024), que devem ficar como `bloqueado`;
   - cerca de 330 fotos excedentes de eventos (hackathon, ideathon, TDC e outros);
   - 74 vídeos que não têm caminho de publicação.
2. **Conteúdo preso num projeto só:** 66% dos itens.
3. **learn-tech sem `relacionados`:** nem o schema dos programas, artigos e áreas nem as telas preveem esse campo.
4. **Texto escrito e não exibido:** `competencias` e `diaADia` nas 6 áreas do learn-tech, cerca de 5 mil caracteres.
5. **Destinos em dois formatos:** 59 dos 214 destinos do acervo estão no formato curto (`blog/x`, `programas/404`, `empresas/Nome`), e 155 no completo (`learn-tech/blog/x`). Isso dificulta a medição automática e a checagem no build.

## Metas propostas para "bom índice" (a aprovar)
| Índice | Meta |
|---|---|
| A | **100%**: nenhum arquivo do hd sem decisão; todo bloqueio com a regra que o justifica |
| C | **média ≥ 2,0** projetos por item publicado; **≥ 60%** dos itens em 2 ou mais projetos; cada projeto recebendo ≥ 25% dos itens |
| D2 | **100%**: campo da API sem tela é exibido ou removido |
| D3 | **≥ 80%** dos conteúdos de **cada** site com link para outro projeto; nenhum site com 0 links recebidos |

## Processo proposto para as próximas remessas
1. **Triagem por arquivo:** cada arquivo recebe uso e destino (`exibido`, `fonte`, `similar`, `bloqueado`, `descartado`). A proposta é de 06/11, e o campo `uso` está sendo implementado na branch de 09/11.
2. **Destino no formato único `projeto/recurso/id`,** validado no build: o build falha se o destino não existir ou estiver no formato curto.
3. **Mapa de alcance antes de produzir:** para cada item, o triador responde às quatro perguntas abaixo. Quando a resposta for "não cabe", a justificativa fica no item.
   - Que programa ou artigo ensina isso? (learn-tech)
   - Em que evento ou formação isso aconteceu? (bootcamps)
   - Que empresa, vaga ou currículo isso mostra? (career)
   - Que ferramenta isso usa? (tools)
4. **`relacionados` obrigatório em todo conteúdo,** inclusive no learn-tech, com a seção "Veja também no ecossistema" nas páginas de programa, artigo e área.
5. **Contrato de exibição:** um campo novo só entra na API junto com a tela que o mostra. Um teste aponta campo sem tela.
6. **Medição única a cada lote:** o comando `npm run aproveitamento` imprime os índices A, B, C, D2 e D3, juntando `hd:uso`, `cobertura`, a análise dos `relacionados` e a de campos. O lote só fecha com as metas batidas ou com a exceção aprovada pelo autor.

## Decisões do autor
1. Aprovar as definições e as metas dos índices.
2. Confirmar como `bloqueado` as 481 imagens de ex-empregador.
3. Definir o caminho dos 74 vídeos: YouTube, armazenamento próprio ou descarte por item.
4. Aprovar `relacionados` no learn-tech, que mexe na API e no site.
5. Definir qual conversa do Claude conduz esta frente. A sessão do notebook já trabalha no `uso` por arquivo hoje, na branch `feature/tasks-09-11-2026` da API.
