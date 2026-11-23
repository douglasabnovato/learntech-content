# O motor "2 por dia"

Atualizado em 22/11/2026 (decisão 108 do autor, [#49](https://github.com/douglasabnovato/learntech-content/issues/49)). A curadoria da hd-codes vira material em 2 turnos por dia, um item por turno. O objetivo é que os sites cresçam todo dia sem esperar a gravação, e que cada página publicada já seja um roteiro pronto.

## As peças

| Peça | Como funciona | Issue |
|---|---|---|
| **Fila** | `content/fila.yml`: os itens 🟢 da triagem, na ordem das levas (L1 → L2 → L3 …). Um comando escolhe o próximo item | [#43](https://github.com/douglasabnovato/learntech-content/issues/43) |
| **2 turnos** | às **09h** e às **15h**, hora de Brasília. Cada turno pega o próximo item, lê só aquela pasta da hd-codes, escreve o material, roda o `npm run validar` e abre o PR com o rótulo `conteudo-hd` | [#44](https://github.com/douglasabnovato/learntech-content/issues/44) |
| **Junto do PR** | o rascunho do roteiro no Studio D (etapa 6 de [`fluxo-ponta-a-ponta.md`](fluxo-ponta-a-ponta.md)) | studio-d |
| **Placar** | o `cobertura.json` conta os itens da hd-codes publicados por site. O painel fixado mostra o que foi publicado hoje, na semana e no total, e o que falta na fila | [#45](https://github.com/douglasabnovato/learntech-content/issues/45) |

## O freio
- Um item 🟡 não entra sem o ok do autor (A1).
- Um `validar` que falha não abre PR.
- Nenhuma pasta 🔴 é lida ([`hd-codes.md`](hd-codes.md)).
- O merge é do autor (decisão 109). Sem merge, o turno seguinte não empilha um segundo PR sobre o mesmo arquivo.
- A espera máxima é de 4 h: um turno que trava é registrado e o seguinte segue.

## O ritmo
- **Fora da `5-expertise`:** 1 item por turno. Com 2 itens por dia, 5 dias por semana, são cerca de 40 materiais por mês.
- **Na `5-expertise`:** 1 **capítulo** por turno, porque o padrão não admite superficialidade ([`padrao-disciplina.md`](padrao-disciplina.md)). Uma disciplina leva de 2 a 10 turnos e fecha quando todos os capítulos estiverem prontos.

## O que o motor não faz
- Não grava, não posta e não faz merge nem deploy.
- Não cria repositório novo. O `onibus-horarios` (decisão 111) só depois do piloto, com o autor.
- Não publica vídeo: os 74 vídeos continuam esperando a [#15](https://github.com/douglasabnovato/learntech-content/issues/15) (decisão 110).
