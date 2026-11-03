# 2026-11-03 — conteudo: issues dos quatro sites como fonte de conteúdo

## Pedido
- Analisar as issues dos quatro sites, comentar em cada uma e fechar as cobertas e as duplicadas.
- Usar as que sobraram como insumo de conteúdo da API, com processo e plano de ação.
- Depois do A1, trabalhar de forma independente até terminar e apresentar as escolhas para o autor corrigir.

## Feito
- **Comentários de análise:** 139 issues com um comentário cada; 45 fechadas (33 cobertas e 12 duplicadas). Evidência: contagem por repositório no chat.
- **Plano e execução do lote:** `lotes/2026-11-03-issues.md`, com triagem das 94 issues, lotes, evidências e log de escolhas.
- **Conteúdo:**
  - 19 fichas no lote 1 e 7 escolas no lote 2;
  - fontes em 5 programas e no artigo de editais;
  - 5 artigos com capa no lote 3;
  - campo `status` dos programas, com teste, e o ADR 9;
  - capa nova do programa 1.
  - Evidência: `npm run verificar`, com 63 testes e o build.
- **Cópias para os sites:** `npm run copias`. Os testes dos sites passam: learn-tech 24, career 12, tools 7.
- **Comentários de entrega e perguntas:** 30 de entrega e 30 de perguntas do lote R.

## Decisões
- A tabela "Log de escolhas" do relatório do lote, com 21 itens, foi decidida pelo Claude com autorização do autor e está sujeita à revisão dele.

## Aprendizados e ajustes de processo
- As issues viram uma fonte de insumo igual ao hd: mesmas etapas, A1 e A2. A diferença é que o item não entra no `acervo.json` (escolha 19, a confirmar).
- Os sites leem a API de produção. Para conferir no navegador antes do deploy, redirecione o fetch para o `dist/` local (detalhe no relatório).

## Placar
69/100. Conteúdo do acervo 84%, engenharia 85%, pendências do autor 38%, publicação 0%.

## Pendências
- **Autor:** item 16 de `PROXIMOS-PASSOS.md`. Revisar o log de escolhas, responder às perguntas nas issues, publicar a branch (A2) e fechar as issues entregues depois do deploy.
- **Claude, na próxima conversa:**
  - transformar em conteúdo as respostas às perguntas;
  - incluir links de volta das fichas antigas para as novas;
  - acrescentar os itens de fonte fraca quando houver fonte nova.

## Para a próxima conversa ler
`docs/processo/lotes/2026-11-03-issues.md` e os comentários "Perguntas para virar conteúdo" nas issues.
