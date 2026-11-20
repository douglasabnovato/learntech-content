# Visão do learnTECH

**Estado: proposta do Claude (20/11/2026), a aprovar pelo autor.** Regra editorial só o autor cria. Até a aprovação, estes documentos orientam a produção, mas não substituem [`regras-editoriais.md`](../processo/regras-editoriais.md). Se houver conflito, vale a regra editorial.

## Nas palavras do autor (20/11/2026)

> "o projeto learntech é um ecossistema para eu compartilhar os meus cursos, experiencias e aprendizados e curadorias de conteúdos publicos [...] isso tudo vem de uma api que é alimentada de uma pasta de arquivos chamada hd [...] usaremos ferramentas, metodologias estrategias de pedagogia, marketing, storytelling, para compartilhar os meus conteúdos"

## Em uma frase

O acervo pessoal do autor (a pasta hd) vira conteúdo curado na API. A API alimenta quatro vitrines públicas, e cada vitrine conta uma parte da trajetória dele, com método de ensino, de narrativa e de divulgação.

## Proposta de valor por produto

| Produto | Verbo | Para quem | O que entrega | Onde o autor aparece |
|---|---|---|---|---|
| learn-tech | aprender | quem está entrando ou crescendo em tecnologia | 49 programas em 12 categorias e 3 trilhas por objetivo, com módulos, passos e quiz, e 46 artigos | o programa reproduz o treinamento que ele fez; o artigo traz o relato |
| bootcamps | viver | quem quer saber que eventos valem a pena | 27 eventos de tecnologia, negócios e startups, os que ele foi e os que quer ir | o relato do autor, em terceira pessoa |
| tools | equipar | quem monta o ambiente de estudo e de trabalho | 97 ferramentas e 12 hospedagens de uso real | o uso no dia a dia, de forma genérica |
| career | conectar | quem procura empresa, vaga ou modelo de currículo | 43 empresas, 24 vagas, 14 perfis e 7 modelos de currículo | a experiência dele com a empresa e as vagas para conversar |
| learntech-content (API) | uma fonte só | os quatro sites | JSON validado por schema, servido na borda | o hd é a origem |

Contagens da API em 20/11/2026 (`content/`).

## Os públicos

1. **Quem está começando:** estudante, quem faz transição de carreira, quem procura a primeira vaga. Precisa de ordem, de exemplos e de saber o que vem depois.
2. **Quem já trabalha e quer crescer:** dev, analista de CRM ou marketing, pessoa de produto. Precisa de prática aplicada e de casos reais.
3. **Quem quer conversar com o autor:** recrutador, empresa, comunidade, organizador de evento. Precisa ver a trajetória e o jeito de trabalhar.

## O fio que une tudo

A trajetória do autor ([`trajetoria-do-autor.md`](../processo/trajetoria-do-autor.md)): da universidade e do contact center até o desenvolvimento, o produto, o CRM e a IA. Cada conteúdo responde à pergunta: **em que momento da trajetória isto aconteceu, e o que ensina a quem está nesse momento agora?** O detalhe está em [`storytelling.md`](storytelling.md).

## Os documentos da estratégia

| Documento | Pergunta que responde |
|---|---|
| [`pedagogia.md`](pedagogia.md) | Como o conteúdo ensina? |
| [`storytelling.md`](storytelling.md) | Como o conteúdo conta a história do autor? |
| [`marketing.md`](marketing.md) | Como o conteúdo chega a quem precisa, e como sabemos que chegou? |
| [`curadoria.md`](curadoria.md) | O que é do autor, o que é público, e como se cita? |

Cada documento termina com os itens que o revisor confere. Esses itens estão reunidos em [`checklists.md`](../processo/checklists.md), na seção "Estratégia".

## O que fica de fora

- **Serviço pago e domínio próprio** (P-04, custo zero).
- **Retirar a identificação obrigatória** (D-06 e P-05: uma regra recusada não volta como sugestão).
- **Publicar em nome do autor fora do ecossistema**, como posts no LinkedIn. O Claude prepara o texto, e o autor publica.
- **Dado pessoal de terceiro, nome de cliente e link interno de ex-empregador** ([`regras-editoriais.md`](../processo/regras-editoriais.md), seção 7).
- **Promessa de resultado**, como "passe na entrevista" ou "guia completo" (seção 5).

## Checklist do revisor

- [ ] O item serve a pelo menos um dos três públicos, e o plano do lote diz qual.
- [ ] O item se encaixa num momento da trajetória, ou o plano diz que é curadoria pública pura.
- [ ] Nada do que está em "O que fica de fora".
