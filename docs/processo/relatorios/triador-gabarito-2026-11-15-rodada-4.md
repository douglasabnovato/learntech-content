# Triador contra o gabarito (15/11/2026, rodada 4: com a ficha de análise e os princípios)

Gerado por `npm run triador:gabarito -- --relatorio`. O triador leu só o material extraído e as regras, sem o `acervo.json`. A proposta de cada item foi comparada com a ficha que o acervo já tem.

**25 itens · direitos 68% · destinos 64% · uso por arquivo 45% · meta da fase 1 (80%): não atingida**

| Item | Direitos | Destinos (comuns/propostos/certos) | Uso igual | Confiança |
|---|---|---|---|---|
| HD-0008 | sim | sim (3/3/7) | 12/32 | 0.65 |
| HD-0010 | sim | sim (2/2/2) | 2/4 | 0.85 |
| HD-0011 | sim | sim (2/2/2) | 1/3 | 0.85 |
| HD-0015 | sim | não (0/1/1) | 1/14 | 0.72 |
| HD-0017 | sim | sim (1/1/1) | 9/24 | 0.7 |
| HD-0018 | não | sim (1/1/1) | 2/2 | 0.6 |
| HD-0023 | sim | sim (1/2/5) | 50/87 | 0.6 |
| HD-0024 | sim | sim (1/1/3) | 2/11 | 0.75 |
| HD-0025 | sim | sim (2/2/4) | 10/32 | 0.78 |
| HD-0026 | não | não (0/1/1) | 1/1 | 0.45 |
| HD-0027 | sim | sim (2/2/4) | 4/8 | 0.6 |
| HD-0028 | sim | sim (1/2/3) | 7/10 | 0.6 |
| HD-0029 | não | sim (1/1/1) | 2/2 | 0.75 |
| HD-0031 | sim | não (0/2/1) | 12/13 | 0.75 |
| HD-0036 | sim | sim (2/3/6) | 3/13 | 0.6 |
| HD-0037 | não | não (0/1/5) | 1/2 | 0.5 |
| HD-0040 | não | não (0/1/1) | 2/2 | 0.5 |
| HD-0042 | não | sim (2/2/3) | 2/9 | 0.55 |
| HD-0045 | sim | não (0/1/2) | 5/9 | 0.6 |
| HD-0046 | sim | sim (1/1/2) | 2/2 | 0.75 |
| HD-0047 | sim | sim (1/2/2) | 5/6 | 0.55 |
| HD-0049 | não | não (0/0/1) | 0/5 | 0.7 |
| HD-0050 | sim | não (0/1/2) | 4/13 | 0.6 |
| HD-0052 | sim | sim (1/1/4) | 0/4 | 0.85 |
| HD-0054 | não | não (0/0/1) | – (sem uso proposto) | 0.5 |

Regras de acerto: `scripts/lib/gabarito.mjs`.

## Como a rodada foi feita
- Entrega 5 do método de produção a partir do hd, por ordem do autor: "Sim, rode".
- 25 itens: os 13 do hd que nunca tinham passado pelo gabarito e os 12 da rodada 3, para comparar antes e depois.
- 5 agentes em paralelo, com o mesmo brief: o `triador.md`, a [ficha de análise](../analise-da-tarefa.md), os princípios P-01 a P-08, o perfil e a trajetória do autor.
- Proibido ler: `acervo.json`, `cobertura.json`, lotes, relatórios, conversas, propostas anteriores e o histórico do git.
- As propostas ficaram fora do git. Nada foi para a API.

## Resultado

| Grupo | Itens | Direitos | Destinos |
|---|---|---|---|
| Itens novos | 13 | 85% | 92% |
| Itens da rodada 3 (antes: 67% e 50%) | 12 | 50% | 33% |
| Total | 25 | 68% | 64% |

Meta para sair do AU0 ([`agentes.md`](../agentes.md)): 85%, acima da meta da fase 1 (80%), em direitos e destinos, numa rodada com 20 itens ou mais. **Não atingida.**

## Leitura
1. **12 itens tiveram erro: 11 de material de ex-empregador e o HD-0049, que está como `proprio`.** São 8 erros de direitos e 9 de destinos. Nos outros itens do próprio autor e nos de terceiros, o acerto foi total. Esse material fica sempre com o autor em qualquer nível de autonomia, mas pesa na média.
2. **6 dos 8 erros de direitos são a mesma fronteira.** O triador propôs `sensivel-anonimizar`, e o acervo tem `descartar`, mas com estado `referencia` e destino. Pela regra do triador, `descartar` é "sem valor ou de risco". Ou seja, o acervo usa `descartar` para material que serve de referência, e a regra escrita não diz isso.
3. **Dois casos parecem inconsistentes no próprio gabarito:** HD-0049 (fotos de um evento em São Paulo, da pasta do ex-empregador) está como `proprio`, e HD-0054 (vídeos) como `sensivel-anonimizar`. Precisam da confirmação do autor antes de servirem de gabarito.
4. **6 dos 9 erros de destino estão na trilha de CRM (1101 a 1107).** Os outros 3 são HD-0026 (blog), HD-0037 (tools) e HD-0049 (career). Os programas são vizinhos, e o triador escolhe o programa ao lado do certo.
5. **A confiança está calibrada.** Com confiança de pelo menos 0,75, 6 de 8 itens acertaram direitos e destinos. Com pelo menos 0,85, o patamar do AU1, os 3 itens acertaram tudo. A amostra é pequena, mas a direção é boa.
6. **Os 12 itens da rodada 3 pioraram.** A ficha fez o triador tratar o material de ex-empregador com mais cuidado (P-02) e propor `sensivel-anonimizar`, o lado seguro. Já o acervo usa `descartar`.

## O que depende do autor
- **Decidir a convenção de direitos do material de ex-empregador:** quando é `descartar` e quando é `sensivel-anonimizar`, se os dois podem ter estado `referencia`. Com a decisão, a regra do triador e os itens do acervo ficam iguais, e a medição volta a ser justa.
- **Confirmar HD-0049 e HD-0054** no gabarito.
- **O nível continua AU0.** A próxima rodada precisa de 20 itens ou mais. Como o hd tem só 55 itens com material extraído, a rodada seguinte deve vir de uma leva nova, depois da learntech-content#15 (D-07).

## Nova medição com a convenção da D-11 (15/11/2026)

O autor adotou a convenção proposta ("Sim, adote"): `sensivel-anonimizar` para material de ex-empregador com conhecimento aproveitável, e `descartar` só para o que não tem uso. Os 9 itens `descartar` do acervo eram todos de ex-empregador, com estado `referencia` e destino, e passaram a `sensivel-anonimizar`. A regra do `triador.md` foi ajustada.

As mesmas 25 propostas, medidas de novo:

| Grupo | Itens | Direitos | Destinos |
|---|---|---|---|
| Itens novos | 13 | 100% | 92% |
| Itens da rodada 3 | 12 | 83% | 33% |
| Total | 25 | 92% | 64% |

- **Direitos passam as duas metas (80% e 85%).** Os 2 erros que restam são os itens que parecem inconsistentes no gabarito (HD-0049 e HD-0054), à espera do autor.
- **Destinos continuam abaixo da meta**, a maior parte na trilha de CRM (1101 a 1107).
- **Cuidado com o viés:** o gabarito mudou depois que as propostas foram vistas. A mudança seguiu uma regra decidida pelo autor e aplicada a todos os itens, e não item por item. Mesmo assim, esta medição sozinha não basta para sair do AU0. A próxima rodada, com itens novos, confirma ou não o resultado.
