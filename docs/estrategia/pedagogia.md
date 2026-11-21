# Pedagogia: como o conteúdo ensina

**Estado: proposta do Claude (20/11/2026), a aprovar pelo autor.** Ver [`visao.md`](visao.md).

O learn-tech já tem uma estrutura forte ([`modelos.md`](../processo/modelos.md)): 4 módulos, de 12 a 22 passos, um projeto fictício do começo ao fim e um quiz de 12 questões. Este documento diz **com que método** essa estrutura é preenchida, para que todo programa ensine do mesmo jeito.

## 1. Objetivos de aprendizagem (taxonomia de Bloom)

A taxonomia de Bloom, na versão revisada por Anderson e Krathwohl (2001), ordena o que alguém consegue fazer com um conhecimento: **lembrar, entender, aplicar, analisar, avaliar e criar**.

| Onde | Como usar |
|---|---|
| Programa | `letslearn` e `whatYouBuild` começam por um verbo observável ("montar", "comparar", "decidir"), nunca por "conhecer" ou "aprender sobre" |
| Módulos | sobem de nível: o módulo 0 entende, os módulos 1 e 2 aplicam e analisam, o módulo 3 avalia ou cria (o projeto fecha) |
| Quiz | das 3 questões de cada módulo, pelo menos 1 é de aplicação ou de análise (um caso, um trecho de código, uma escolha entre opções), e não só de memória |

**Por nível do programa:**
- **Iniciante:** chega até aplicar.
- **Intermediário:** chega até analisar e avaliar.
- **Avançado:** chega até avaliar e criar.

## 2. Ensino de adultos (andragogia)

Princípios de Malcolm Knowles sobre como adultos aprendem, e o que cada um pede ao conteúdo:

| Princípio | O que o conteúdo faz |
|---|---|
| O adulto precisa saber **por que** aprende | `whyNow` e `marketUsage` vêm antes dos módulos, com números com fonte e data |
| Aprende a partir da **experiência** | cada módulo tem um caso real, do autor (anonimizado pela seção 7 das regras) ou público, com fonte |
| Quer **aplicar já** | todo passo termina em algo que se faz: um código, uma planilha, uma decisão |
| É orientado a **problema**, não a matéria | o título do programa diz o problema ou o resultado, como "do briefing à validação" |
| Tem **motivação interna** | `forWho` diz para quem é e para quem não é, sem promessa |

## 3. Trilhas por nível

O learn-tech organiza os 49 programas de dois jeitos: **12 categorias** (por tema: Web, Frontend, Backend, Marketing e CRM...) e **3 trilhas por objetivo** (`trilhas.json`: primeira vaga em front-end, do marketing ao CRM tech e primeiros freelas). Regras de sequência:

- Todo programa diz o **anterior** e o **seguinte** da categoria (já está em [`modelos.md`](../processo/modelos.md)).
- Uma categoria completa vai do Iniciante ao Intermediário. Uma categoria só com Iniciante, como IA e Fundamentos hoje, fica marcada como incompleta no plano, com o próximo programa sugerido.
- Uma trilha por objetivo nova só entra quando houver programas de pelo menos dois níveis para ela.
- Os pontos de entrada de quem está começando são a trilha **Fundamentos** (901) e a **Carreira e Soft Skills** (1001 a 1005).

## 4. Quiz como verificação

O quiz não é enfeite: ele mostra se o objetivo do módulo foi atingido.

- Cada questão se liga a um passo do módulo. O plano do lote diz qual.
- As alternativas erradas são **erros comuns** de quem começa, e não absurdos.
- A `explanation` diz o porquê da resposta certa e o erro por trás da alternativa errada mais tentadora.

## 5. Aprender fazendo (projeto)

- Todo programa tem um projeto fictício do começo ao fim (regra de [`modelos.md`](../processo/modelos.md)), com dados fictícios ([`regras-editoriais.md`](../processo/regras-editoriais.md), seção 1).
- O projeto final do módulo 3 é algo que o leitor pode mostrar: um repositório, uma planilha, um protótipo ou um plano.
- Nos treinamentos do autor (programas que reproduzem um curso que ele fez), a sequência e os exercícios do curso original são preservados. A metodologia do curso conta mais que a de Bloom quando as duas divergem.

## 6. Artigos

O artigo ensina uma ideia só. O `lead` diz o problema, os `highlights` são o que o leitor leva, e o `bodyContinued` termina com um próximo passo: um programa, uma ferramenta ou um evento do ecossistema.

## Checklist do revisor

- [ ] `letslearn` e `whatYouBuild` começam por verbo observável.
- [ ] Os módulos sobem de nível de Bloom, e o último chega ao nível do programa.
- [ ] Pelo menos 1 questão de aplicação ou de análise por módulo, com alternativas erradas que são erros comuns.
- [ ] `whyNow` tem número com fonte e data, e cada módulo tem um caso real.
- [ ] O programa cita o anterior e o seguinte da categoria.
- [ ] O artigo termina com um próximo passo dentro do ecossistema.
