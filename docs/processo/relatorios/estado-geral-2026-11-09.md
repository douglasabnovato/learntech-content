# Estado geral do learnTECH (09/11/2026, fim do dia)

Raio-x da API, dos quatro sites e da pasta hd. Números conferidos nos repositórios, no GitHub e na produção. Sem nome de arquivo nem dado pessoal.

## 1. Resumo

| Frente | Situação |
|---|---|
| **API (learntech-content)** | A `developer` está 15 commits à frente da `main`, com CI verde. A produção responde (0,24 s), mas **ainda não tem o trabalho de 09/11**: falta o deploy |
| **4 sites** | Os quatro estão no ar (HTTP 200) e com CI verde na `main` e na branch de integração. Cada um tem de 1 a 3 commits esperando a `main` |
| **hd** | 3.631 arquivos (5,95 GB), dos quais 2.683 são únicos. **93,0% usados**; os 37 pendentes são todos vídeos (#15) |
| **Placar** (`npm run progresso`) | 69/100. A parte de publicação está em 0% porque a `developer` ainda não foi levada para a `main` |

**O que depende do autor para tudo aparecer na produção:**
1. Levar as cinco branches de integração para a `main`.
2. Fazer o deploy da API (`npm run deploy`).

Sem o deploy, as fichas novas do tools não abrem, as 41 fotos novas das galerias dão 404 e o artigo novo não aparece. Conferido na produção: a foto `fator-s-challenge/48.webp` responde 404.

## 2. API

### Conteúdo: `developer` × produção

| Recurso | `developer` | Produção | Diferença |
|---|---|---|---|
| Programas (learn-tech) | 49 | 49 | 1101, 106, 1102, 1004 e 1005 com passos novos; o 1005 com capa e galeria |
| Artigos do blog | 46 | 45 | + cashback e LTV; editais aprofundado; hack dev com capa e galeria |
| Áreas | 6 | 6 | — |
| Eventos (bootcamps) | 27 | 27 | +41 fotos nas galerias: hackathon 42, Fator S 48, GDG 10, TDC 11 |
| Empresas (career) | 43 | 43 | — |
| Vagas / perfis / modelos de currículo | 24 / 14 / 5 | 24 / 14 / 5 | — |
| Ferramentas (tools) | 97 | 91 | + Campaign Monitor, Omnisend, GetResponse, Databox, Rock Content, HackerRank |
| Hospedagens | 12 | 12 | — |

### Engenharia (na `developer`)
- **Galeria** no programa e no artigo (ADR 12), com `alt` obrigatório.
- **Destinos do acervo** em formato único `projeto/recurso/id`, conferidos no build (#18).
- **Fase 1 do fluxo de agentes** (#16), entregue com o triador como proponente, por decisão do autor:
  - `npm run hd:extrair`;
  - o agente triador;
  - `npm run a1`;
  - `npm run triador:gabarito`.
- **`hd:uso`** com duas correções: a pasta da galeria pode ter nome diferente do slug do evento (caso do TDC), e o metadado do macOS conta como técnico.
- **Testes:** 123, com `validar`, typecheck e build verdes.

### Issues abertas (16)

| Tipo | Issues |
|---|---|
| Entregues na `developer`, fecham na `main` | #12, #14, #16, #18 |
| Decisão do autor | #4 votação de temas, #5 identificação opcional, #9 deploy automático, #15 vídeos, #19 `aproveitamento`, #20 relacionados |
| Em andamento | #13 fotos: falta só confirmar com o autor; o resto está feito |

## 3. Os quatro sites

| Site | Produção | Integração × `main` | CI | Issues abertas | O que espera a `main` |
|---|---|---|---|---|---|
| learn-tech (Vercel) | 200, 0,58 s | `developer-mvp-2026` +3 | verde | 49 | galeria no programa e no artigo (#136), cópias do blog e do catálogo |
| bootcamps (Pages) | 200, 0,33 s | `developer` +3 | verde | 34 | cópia dos eventos com as 41 fotos novas |
| career (Pages) | 200, 0,24 s | `developer-mvp-2026-2` +1 | verde | 15 | regra "o Claude para na developer" no CLAUDE.md |
| tools (Pages) | 200, 0,27 s | `developer` +2 | verde | 24 | cópia com as 6 fichas e o sitemap |

Na verificação na tela (seção 6 do lote `2026-11-09-documentos-do-hd.md`), todos os quatro sites foram abertos contra a API local, e tudo o que é novo apareceu.

**Próximas issues por site, sem depender do autor:**
- **learn-tech:** #135 (Dia a dia e Competências das áreas), #134 (busca sem acento), #133 (imagens órfãs), #131 (SEO).
- **bootcamps:** #75 (contraste), #74 (Prettier na CI), #73 (Lighthouse), #70 (busca).
- **career:** #33 (acessibilidade), #31 (12 MB de assets órfãos), #30 (Lighthouse e e2e).
- **tools:** #60 (contraste), #59 (404 e CSP), #55 (miniaturas WebP).

## 4. Pasta hd

### Tamanho
- 3.631 arquivos e 5,95 GB.
- 2.683 arquivos únicos, por hash.
- 948 cópias idênticas, que seguem o uso do original.
- 100% inventariados e extraídos para o triador (`hd/.extraido/`, fora do git).

### Uso por pasta (arquivos únicos)

| Pasta | exibido | fonte | similar | referência | técnico | descartado | pendente |
|---|---|---|---|---|---|---|---|
| `0-planner` | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| `3-soft_skills` | 5 | 30 | 1 | 25 | 0 | 3 | 0 |
| `6-tech_community` | 118 | 3 | 129 | 2 | 0 | 129 | **37** |
| `7-abc-projetos` | 0 | 162 | 0 | 2.018 | 20 | 0 | 0 |
| **Total** | **123** | **196** | **130** | **2.045** | **20** | **132** | **37** |

### Uso por tipo

| Tipo | exibido | fonte | similar | referência | técnico | descartado | pendente |
|---|---|---|---|---|---|---|---|
| Imagem | 123 | 0 | 130 | 1.710 | 11 | 132 | 0 |
| Documento | 0 | 96 | 0 | 236 | 0 | 0 | 0 |
| Código | 0 | 100 | 0 | 67 | 0 | 0 | 0 |
| Vídeo | 0 | 0 | 0 | 30 | 0 | 0 | **37** |
| Áudio | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| Outro | 0 | 0 | 0 | 1 | 9 | 0 | 0 |

**Usados (exibido, fonte, similar e referência): 2.494 de 2.683, ou 93,0%.** Os 37 vídeos pendentes são 31 do hackathon e 6 do Fator S. Eles ficam com o autor (#15): subir no YouTube e trocar o link no conteúdo.

### Itens do acervo (122)

| Estado | Itens |
|---|---|
| `publicado` | 67 |
| `referencia` | 43 |
| `publicado-em-parte` | 6 |
| `planejado` | 3 |
| `nao-publicavel` | 3 |

- **Lotes:** 2026-10-27 (67 itens, 51 fechados) e 2026-10-30 (55 itens, 52 fechados).
- **Itens em parte ou planejados:**
  - quase todos esperam um dado do autor (participação confirmada, vídeo no YouTube, certificado);
  - dois são conteúdo novo já planejado: um artigo de marca pessoal e um guia de preparação ligado a um evento.

## 5. Fluxo de agentes

| Fase | Estado |
|---|---|
| 0. Contratos | entregue (06/11) |
| 1. Triador | entregue (09/11). O gabarito, em 42 itens, deu direitos 76% e destinos 67%. O triador é proponente, e o A1 corrige |
| 2. Produtores | próxima: começa pelo produtor do bootcamps |
| 3. Verificador | issue #10 |
| 4. Piloto | `6-tech_community/gdg_jf` de ponta a ponta |
| 5. Escala | mídia no R2 (issue #8) |

## 6. O que o autor precisa fazer

| # | Ação | Destrava |
|---|---|---|
| 1 | Levar as cinco branches de integração para a `main` | publicação no placar e o fechamento de #12, #14, #16, #18 e #136 |
| 2 | `npm run deploy` da API | fichas, fotos, capas, galeria e artigo novos na produção |
| 3 | Subir os 37 vídeos no YouTube | o hd chega a 100% (#15) |
| 4 | Decidir a ficha da Rock Content | o site oficial redireciona para outro domínio |
| 5 | Decidir #4, #5, #9, #19 e #20 | as issues que dependem de escolha |
