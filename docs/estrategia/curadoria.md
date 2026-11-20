# Curadoria: o que é do autor, o que é público e como se cita

**Estado: proposta do Claude (20/11/2026), a aprovar pelo autor.** Ver [`visao.md`](visao.md).

O learnTECH mistura três origens de conteúdo. Este documento diz como reconhecer cada uma e o que ela exige. Os direitos de uso já estão definidos no acervo ([`agentes.md`](../processo/agentes.md)): `proprio`, `terceiro-citavel`, `sensivel-anonimizar` e `descartar`.

## 1. As três origens

| Origem | Exemplo | Direito no acervo | O que exige |
|---|---|---|---|
| **Do autor** | o relato de um evento, um deck próprio, uma anotação de estudo | `proprio` | a confirmação dos fatos que só ele sabe; a voz de [`storytelling.md`](storytelling.md) |
| **Curadoria pública** | uma ferramenta, uma empresa, um evento que ele quer ir, um conceito técnico | `terceiro-citavel` | fonte oficial e uma segunda fonte de outro domínio ([`pesquisa.md`](../processo/pesquisa.md)) |
| **Misto** | um curso que ele fez, um evento que ele foi, uma empresa onde trabalhou | `terceiro-citavel` ou `sensivel-anonimizar` | o fato público com fonte, e a experiência dele separada, como relato |

No misto, o texto deixa claro o que é fato público e o que é a experiência do autor. O leitor nunca deve confundir um com o outro.

## 2. Como citar

- **Toda página de detalhe tem fontes de 2 domínios diferentes**, e todo número tem fonte e data ([`regras-editoriais.md`](../processo/regras-editoriais.md), seção 4).
- **O material do curso** que o autor fez aparece só em `sources`, no fim do programa, e não nas aulas (seção 1).
- **O material do autor** (o hd) não é citado como fonte pública: ele é a origem do relato. O plano do lote guarda o id do acervo (HD-0000), nunca o nome do arquivo.
- **Imagem** só com direito de uso, servida por `/media` e com `alt` ([`checklists.md`](../processo/checklists.md)).

## 3. Quando pesquisar na internet

Pesquisa-se para **aperfeiçoar** o que vem do hd, nunca para substituí-lo:

| Situação | Pesquisar? |
|---|---|
| Número, preço ou data | sim, sempre |
| Item do hd com informação antiga (curso de anos atrás, ferramenta que mudou de nome) | sim, para atualizar (regra 3 da seção "Nada sai do site") |
| Fato que só o autor sabe (se foi bolsista, se o evento foi gratuito para ele) | **não**: pergunta ao autor (lista em `PROXIMOS-PASSOS.md`) |
| Conceito estável (sintaxe, definição) | pode vir do conhecimento técnico; o redator lista nas observações o que não conferiu |
| A pesquisa contradiz o relato do autor | registra a divergência nas observações e pergunta ao autor; o texto não escolhe sozinho |

O método e o orçamento de buscas estão em [`pesquisa.md`](../processo/pesquisa.md).

## 4. O que não se publica

Arquivos com dados de terceiros, marca de cliente ou credenciais ficam no hd como `referencia` ([`regras-editoriais.md`](../processo/regras-editoriais.md), seção 6). O conhecimento que eles mostram pode virar conteúdo, sem a origem.

## Checklist do revisor

- [ ] O plano do lote diz a origem do item: do autor, curadoria pública ou misto.
- [ ] No misto, o fato público e a experiência do autor estão separados no texto.
- [ ] Fontes de 2 domínios, números com fonte e data, e o material do curso só em `sources`.
- [ ] Fato que só o autor sabe foi perguntado, e não pesquisado.
- [ ] Nenhum nome de arquivo do hd no conteúdo nem no plano (só o id do acervo).
