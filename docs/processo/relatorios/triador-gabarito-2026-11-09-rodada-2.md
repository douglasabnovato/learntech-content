# Triador contra o gabarito (09/11/2026, rodada 2: itens novos, com limite de 3 destinos)

Gerado por `npm run triador:gabarito -- --relatorio`. O triador leu só o material extraído e as regras, sem o `acervo.json`. A proposta de cada item foi comparada com a ficha que o acervo já tem.

**10 itens · direitos 60% · destinos 70% · uso por arquivo 79% · meta 80%: não atingida**

| Item | Direitos | Destinos (comuns/propostos/certos) | Uso igual | Confiança |
|---|---|---|---|---|
| HD-0022 | sim | sim (2/3/3) | 2/4 | 0.75 |
| HD-0030 | não | sim (2/2/2) | 26/26 | 0.85 |
| HD-0033 | sim | não (0/1/3) | 1/1 | 0.5 |
| HD-0034 | não | sim (1/1/1) | 3/7 | 0.45 |
| HD-0038 | sim | não (0/2/1) | 2/2 | 0.7 |
| HD-0041 | sim | sim (1/1/4) | 0/2 | 0.85 |
| HD-0044 | não | sim (1/1/1) | 4/4 | 0.85 |
| HD-0048 | sim | sim (1/1/2) | 2/3 | 0.75 |
| HD-0051 | não | não (1/3/2) | 3/4 | 0.7 |
| HD-0055 | sim | sim (1/1/5) | 1/3 | 0.55 |

Regras de acerto: `scripts/lib/gabarito.mjs`.

## Leitura das duas rodadas

| Rodada | Itens | Direitos | Destinos |
|---|---|---|---|
| 1 (instruções iniciais) | 20 | 90% | 75% |
| 2 (itens novos, no máximo 3 destinos) | 10 | 60% | 70% |
| Juntas | 30 | 80% | 73% |

- **Direitos:** os 4 erros da rodada 2 seguem uma convenção do acervo que não estava escrita. Peças de marca, encartes, assinaturas e material de fornecedor do ex-empregador ficam com `descartar`; documentos de processo, com `sensivel-anonimizar`. A convenção agora está em `.claude/agents/triador.md`.
- **Destinos:** o limite de 3 cortou o excesso, mas abriu erros de escolha. No HD-0033 e no HD-0038, o triador escolheu um programa vizinho. Itens com 4 ou mais destinos no acervo (HD-0041, HD-0055) só acertam em parte.
- **Fase 1:** ainda não fechada. A meta de destinos (80%) não foi atingida. A próxima rodada precisa de itens que não entraram nas duas primeiras, para não medir o triador nos itens em que ele foi ajustado.
