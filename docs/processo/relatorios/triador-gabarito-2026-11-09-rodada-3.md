# Triador contra o gabarito (09/11/2026, rodada 3: itens novos, com as convenções de direitos)

Gerado por `npm run triador:gabarito -- --relatorio`. O triador leu só o material extraído e as regras, sem o `acervo.json`. A proposta de cada item foi comparada com a ficha que o acervo já tem.

**12 itens · direitos 67% · destinos 50% · uso por arquivo 19% · meta 80%: não atingida**

| Item | Direitos | Destinos (comuns/propostos/certos) | Uso igual | Confiança |
|---|---|---|---|---|
| HD-0015 | sim | sim (1/2/1) | 1/14 | 0.65 |
| HD-0018 | não | sim (1/1/1) | 2/2 | 0.55 |
| HD-0024 | sim | sim (1/2/3) | 3/24 | 0.8 |
| HD-0026 | sim | não (0/0/1) | 0/1 | 0.6 |
| HD-0031 | sim | não (0/2/1) | 4/13 | 0.75 |
| HD-0037 | não | não (0/1/5) | 1/2 | 0.45 |
| HD-0040 | sim | não (0/0/1) | 0/2 | 0.55 |
| HD-0046 | sim | sim (1/1/2) | 1/2 | 0.7 |
| HD-0049 | não | não (0/0/1) | 0/5 | 0.55 |
| HD-0050 | sim | sim (1/2/2) | 4/13 | 0.55 |
| HD-0052 | sim | sim (1/1/4) | 0/4 | 0.85 |
| HD-0054 | não | não (0/0/1) | 0/3 | 0.4 |

Regras de acerto: `scripts/lib/gabarito.mjs`.

## Leitura das três rodadas

| Rodada | Itens | Direitos | Destinos |
|---|---|---|---|
| 1 | 20 | 90% | 75% |
| 2 | 10 | 60% | 70% |
| 3 | 12 | 67% | 50% |
| Todas | 42 | 76% | 67% |

**Por que a meta não é atingida:** o gabarito compara uma proposta feita **antes** da produção com o que o acervo registrou **depois** dela. No acervo, o destino é onde o conhecimento acabou usado.
- Os itens `descartar` ou `referencia` do acervo têm destino, mesmo sem nada exibido (seção 7: "com o destino onde o conhecimento foi usado"). O triador propõe "sem destino" para eles: são 4 dos 6 erros de destino da rodada 3.
- Itens com 4 ou 5 destinos no acervo (HD-0037, HD-0052) receberam destinos durante a produção. Isso a leitura do material, sozinha, não prevê.
- Os direitos oscilam entre `sensivel-anonimizar` e `descartar` no material do ex-empregador, e entre `proprio` e `terceiro-citavel` no material pessoal antigo. A fronteira não é a mesma em todos os itens do acervo.

**Decisão do autor (#16):** o Claude não muda a meta nem a regra de acerto sozinho. Opções:
1. Aceitar o triador como **proponente**, com o A1 corrigindo: as fichas abaixo de 0,7 de confiança já viram pergunta.
2. Medir destinos por "pelo menos um destino certo", que daria 79% nas três rodadas (33 de 42), ainda abaixo da meta.
3. Revisar a convenção de direitos do material do ex-empregador e reaplicá-la no acervo antes de medir de novo.
