# Regras editoriais do ecossistema

> Histórico. A versão vigente está em `docs/processo/regras-editoriais.md`.

Atualizado em 2026-10-29. Estas regras foram definidas pelo Douglas e valem para todo conteúdo novo ou revisado nos quatro sites. Elas substituem qualquer regra anterior que diga o contrário.

## 1. O que preservar

O objetivo é preservar as informações de **treinamento, matérias, metodologias e ferramentas**. O conteúdo é o que importa. A forma de citar a origem muda conforme o site.

| Site | Nomes e marcas | Fonte |
|---|---|---|
| **learn-tech, programas** | O programa reproduz o treinamento que o Douglas fez como aluno, com as mesmas matérias, metodologia, ferramentas, exercícios e sequência. O nome e a logo da escola **não aparecem** durante as aulas. | A escola e o material original são citados nas **fontes, ao final** do programa. |
| **learn-tech, blog** | Ferramentas, empresas e plataformas podem ser citadas pelo nome. | Fontes ao final do artigo. |
| **career, empresas** | Tudo original: nome, logo e informações reais da empresa. | Site oficial e fontes públicas. |
| **career, currículos** | Os dados pessoais do candidato (nome, telefone, e-mail, links) são fictícios, como o schema exige. A **experiência mantém o peso**: se a experiência é no iFood, continua iFood. | Fontes das dicas. |
| **tools** | Nome, logo e informações oficiais da ferramenta. | Site oficial e documentação. |
| **bootcamps** | Eventos reais com os nomes reais. Fotos de pessoas só em cobertura de evento. | Página oficial do evento, quando houver. |

## 2. Quando trocar um nome

Uma troca só acontece quando o Douglas pede ou quando o documento é sensível, como o projeto de um cliente. Nesses casos, o termo novo **mantém a intenção e o peso** do original. Uma "empresa exemplo" genérica não serve.

- Uber → "plataforma digital de mobilidade que revolucionou o transporte urbano".
- Agibank → "um banco digital"; Cadastra → "uma agência de CRM". Essas trocas foram aprovadas em 29/10/2026.
- Empresa fictícia de currículo: a `descricaoEmpresa` precisa dizer o porte, o segmento e o ritmo, que é o que dá peso à experiência.

## 3. Vídeos, preços e números

Não há restrição. Entra o que ensinar bem, sempre com a fonte. Preços e números que mudam rápido levam a data da consulta no texto ou na fonte.

## 4. Método de cada card ou página de detalhe

1. Ler o site oficial: documentação, página "sobre" ou guia.
2. Confirmar em uma segunda fonte confiável, como documentação técnica, MDN, Wikipédia ou um relatório do setor.
3. Escrever o `resumo` e de 2 a 4 `paragrafos`: o que é, para que serve, quem usa e onde aparece no ecossistema.
4. Preencher `links` oficiais, `fontes`, `relacionados` e `atualizadoEm`.
5. Validar (`npm run validar`), gerar as cópias (`npm run copias`) e conferir a página.

## 5. Relacionados (decisão D15)

`detalhe.relacionados` liga um item a outros conteúdos do ecossistema. No `content/` basta `{ "tipo": "...", "id": "..." }`:

| tipo | id |
|---|---|
| `programas` | id do programa (`"101"`) |
| `blog` | id do artigo |
| `eventos` | slug do evento |
| `empresas`, `vagas`, `perfis`, `ferramentas`, `hospedagens` | slug do item |

O build recusa um alvo que não existe e um item que relaciona a si mesmo. Na publicação, o build completa cada relacionado com `projeto`, `titulo` e `url`: a página de detalhe quando o alvo tem uma, senão o site oficial. As páginas de detalhe do tools e do career mostram a seção "Veja também no ecossistema".

## 6. Tempo de leitura (decisão D16)

O `readingTime` dos artigos é conferido no build: total de palavras ÷ 200, arredondado para cima. Se o valor estiver diferente, o build mostra o valor certo. Em 29/10/2026, os 19 artigos foram recalculados, porque todos estavam com o tempo maior que o real.

## 7. Imagens externas (decisão D17)

Imagens do Pixabay ligadas direto ao site de terceiros quebram se o link mudar. O script `npm run midia:externa` baixa essas imagens para `media/learn-tech/imagens/` e troca os links. Ele precisa de internet e roda na máquina do Douglas.
