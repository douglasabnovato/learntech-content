# 31/10/2026: Encontros Capivara Tech e Pcamp Pocket JF

Pedido: registrar como evento recorrente os encontros da Capivara Tech em Juiz de Fora. O autor esteve em todos. Conteúdo e imagens vêm do que está público na internet.

## Entregas
- Evento `bootcamps/eventos/capivara-tech-juiz-de-fora` (id 24): duas edições com data, a edição sem data descrita no texto, galeria com três artes do Luma e seis fontes em cinco domínios.
- Schema de edições ganhou campos opcionais: `numero`, `data`, `horario`, `local`, `tema`, `formato`, `programacao`, `participacao` e `link`. Os eventos antigos continuam válidos.
- Regra nova no build: data dentro do ano informado, número único por formato e ordem cronológica. Há teste em `tests/conteudo.test.ts`.
- Edições no bootcamps (`Detail.tsx`): passam a mostrar data, número e formato, tema, local, programação, o selo "Eu estive lá" e o link da edição. A key do React deixou de ser o ano, que se repetia.
- `scripts/baixar-imagens-externas.mjs` passou a baixar também as artes do Luma para `media/bootcamps/eventos/luma/`.

## Pendências
- Rodar `npm run midia:externa` na máquina do autor. O ambiente do Claude não acessa o Luma.
- Edições 1ª, 2ª e 4ª: não aparecem publicamente. Há duas páginas chamadas "3ª edição", e a do Moinho não tem data. Completar com o autor.
- Outros eventos da Capivara que não sejam Pcamp Pocket: não há registro público. Para incluir, basta acrescentar edições com outro `formato`.
- Fotos próprias: colocar em `hd/6-tech_community/capivara_tech/<data>/`.
- Nomes de organizadores e palestrantes ficaram de fora (dados de terceiros).
