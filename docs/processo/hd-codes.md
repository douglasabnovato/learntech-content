# hd-codes: o HD de códigos e cursos do autor

Atualizado em 22/11/2026 ([#49](https://github.com/douglasabnovato/learntech-content/issues/49)). A hd-codes é a fonte do Desafio hd-codes: ela vira material nos 4 sites, nos repositórios dos cursos e no Studio D.

## Regras de acesso
- **Só leitura.** Nada é escrito, movido ou apagado na hd-codes pelo Claude. O inventário grava o mapa e o cache fora dela (`--saida .hd-local`, [#42](https://github.com/douglasabnovato/learntech-content/issues/42)).
- **Só esta pasta.** Nenhuma outra pasta do disco do autor é aberta ou listada.
- **Pastas 🔴 não são abertas:** a `4-experiences` (material de trabalho com dados de terceiros) e todo arquivo com nome de contrato, currículo, documento pessoal ou senha. O inventário pula a pasta com `--ignorar 4-experiences`.
- **Nomes de arquivo e de pasta não vão para o repositório.** O `acervo.json` guarda só hash, tipo, tamanho e decisão ([`seguranca-privacidade.md`](seguranca-privacidade.md)). Os itens são citados pelo ID `HC-nnn`.
- **Material de terceiros** (apostila, livro, curso pago) entra só como resumo com as palavras do Claude e com o crédito, ou só como link. O PDF nunca é publicado.

## O que tem (catálogo de 22/11/2026)
204 itens (1 item = 1 pasta ou 1 arquivo = 1 material), com 15.167 arquivos fora das pastas 🔴. São 195 itens que viram material e 9 que ficam só catalogados.

| Leva | Itens | Arquivos | Vira | Site |
|---|---|---|---|---|
| L1 evento bqagendatech | 1 | 107 | página do evento e bastidores | bootcamps |
| L2 trilha Fundamentos da web | 15 | 274 | 1 aula por módulo | learn-tech |
| L3 diário de bootcamp | 13 | 422 | relato de cada formação, com o link do repositório | learn-tech |
| L4 projetos, modelos e identidade | 4 | 372 | cases, modelos e logos | learn-tech, tools e os 4 sites |
| L5 coberturas de evento | 8 | 683 | 1 cobertura por evento | bootcamps |
| L6 carreira | 13 | 265 | guias de carreira (sem enunciado de teste de empresa) | career |
| L7 guia dos cursos (bacharelado, técnico e ADS) | 93 | 8.505 | 1 página por disciplina ([`padrao-disciplina.md`](padrao-disciplina.md)) | learn-tech |
| L8 leituras, desafios e referências | 57 | 4.539 | referências e "desafio da semana" | vários |

**Cor de cada item:**
- 🟢 entra na fila sem ok;
- 🟡 precisa do ok do autor (A1);
- 🔴 não sai.

O catálogo completo, com os caminhos, fica fora do repositório, no orquestrador do autor.

## A `000-catalogado` (decisões 106 e 113)
A caixa de entrada esvazia sem apagar nada, e o autor vê o progresso: o que está fora da `000-catalogado` é o que falta, ou o que é 🔴.

1. **Espelhar o caminho:** o item vai para `000-catalogado/<caminho original>`.
2. **A unidade é a pasta:** ela só é arrastada quando todos os itens dela estão publicados ou marcados como "não usa".
3. **O 🔴 não se move.**
4. **O aviso:** depois do merge e do deploy, o Claude manda a "lista de arraste nº N". Ela traz a origem, o destino, o número de arquivos e o link do conteúdo no ar.
5. **Quem arrasta é o autor.** Depois, o Claude confere só lendo: a contagem no destino, os hashes iguais aos do acervo e a origem vazia.
6. **O inventário continua lendo a `000-catalogado`.** A identificação é pelo hash, então um arquivo movido continua "já registrado" (`tests/hd-inventario.test.ts`).

Na hd-codes **não existe A3**: a baixa do hd é este arraste, feito pelo autor ([`README.md`](README.md), etapa 9).

## Inventário
```
npm run hd:inventariar -- --hd <pasta da hd-codes> --saida .hd-local --ignorar 4-experiences
```
O inventário só roda depois do merge da [#42](https://github.com/douglasabnovato/learntech-content/issues/42). O `--registrar` cria os itens no `acervo.json`, que entram pela triagem ([`README.md`](README.md), etapas 2 e 3).
