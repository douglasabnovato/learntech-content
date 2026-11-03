# 01/11/2026 — processo: revisão de como o autor usa o Claude

## Pedido
Estudar e revisar como o autor usa o Claude para desenvolver, manter, analisar e arquitetar software; apontar acertos e erros; documentar as melhorias como referência; organizar o uso de várias conversas, com os resultados compartilhados entre elas.

## Feito
- `docs/processo/como-trabalhamos.md`: papéis, acertos, 10 ajustes com métrica, fluxo de entrega alvo (PR com CI e prévia), modelo de pedido, conversas múltiplas, evidência mínima e revisão semanal.
- `docs/processo/ESTADO.md`: ponto de entrada de toda conversa nova.
- `docs/processo/conversas/`: modelo de registro e este primeiro registro.
- `scripts/publicar.sh`: publicação de uma branch com um comando, parando no primeiro erro.
- `.github/pull_request_template.md` nos cinco repositórios.

## Decisões
- A memória entre conversas é o repositório (versionado), não o chat. Um projeto no claude.ai é opcional, como atalho.
- Até o autor vincular o GitHub, continua valendo: o Claude não faz commit nem push. Depois do vínculo, a proposta é o Claude enviar as branches de feature e abrir o PR, sem merge na `main`. Essa proposta depende da confirmação do autor.

## Aprendizados e ajustes de processo
- Sessões longas perdem detalhes no resumo de contexto → uma conversa por frente, com registro.
- Testes que o Claude não consegue rodar atrasam o ciclo → a CI do PR vira a verificação (precisa do vínculo com o GitHub).

## Pendências
- Autor: vincular a conta do GitHub ao Claude (claude.ai, Configurações → Conectores → GitHub) e confirmar a regra nova de PR. Ler `como-trabalhamos.md` e ajustar o que não fizer sentido.
- Claude, na próxima conversa: com o vínculo feito, conectar os 5 repositórios, abrir os PRs da branch `feature/tasks-01-11-2026-c` e ler a CI.

## Para a próxima conversa ler
`docs/processo/ESTADO.md`, `PROXIMOS-PASSOS.md`, `docs/engenharia/guia-etapas-manuais.md`.


## Continuação, 22h50 às 23h30: plano aprovado (itens 1 a 10)
- **Engenharia:**
  - middleware de segurança e `no-store` na API, com teste novo (a rodar no Vitest);
  - `onError` com log JSON;
  - `cache-e-versionamento.md`;
  - `npm run auditar`;
  - `programasCatalogo.js` gerado, com teste.
- **Conteúdo:**
  - relacionados em todos os eventos;
  - deduplicação de imagens;
  - 2ª fonte em 13 itens;
  - correções da revisão independente;
  - regras do ex-empregador consolidadas.
- **Processo:** commits sugeridos por tema (`docs/engenharia/commits-sugeridos-2026-11-01-c.md`) e `ESTADO.md` atualizado.
- **Aprendizado:** o diagnóstico tinha subestimado a API (afirmou que não havia log de erro). Toda nota precisa citar o arquivo que a sustenta, e a releitura do código vem antes de pontuar.
