# Regras editoriais

Definidas pelo autor e válidas para todo conteúdo novo ou revisado. Substituem `docs/ecossistema/16-regras-editoriais.md`, que fica como histórico. Qualquer regra nova entra aqui. Claude não cria regra por conta própria.

## 1. O que preservar
O objetivo é preservar o **treinamento, as matérias, as metodologias e as ferramentas**. Conteúdo estático antigo dos sites **não é excluído**: ele é trabalhado e aperfeiçoado até entrar na API com página completa.

| Site | Nomes e marcas | Fonte |
|---|---|---|
| learn-tech, programas | O programa reproduz o treinamento que o autor fez como aluno: matérias, metodologia, ferramentas, exercícios e sequência. Nome e logo da escola **não** aparecem nas aulas. Exercícios usam **dados fictícios**. | A escola e o material aparecem só em `sources`, no fim do programa |
| learn-tech, blog | Ferramentas, empresas e plataformas podem ser citadas pelo nome | Fontes no fim do artigo |
| career, empresas | Tudo original: nome, logo e informações reais | Site oficial e fontes públicas |
| career, currículos | Dados pessoais do candidato fictícios (o schema exige). A experiência mantém o peso | Fontes das dicas |
| tools | Nome, logo e informações oficiais | Site oficial e documentação |
| bootcamps | Eventos reais com os nomes reais. Fotos de pessoas só em cobertura de evento. O relato do autor é preservado, em terceira pessoa | Página oficial do evento, quando houver |

## 2. Trocar nomes
- Só quando o autor pede ou quando o material é sensível, como o projeto de um cliente ou um ex-empregador.
- O termo novo **mantém a intenção e o peso** do original. Exemplo: Uber vira "plataforma digital de mobilidade que revolucionou o transporte urbano".
- Uma "empresa exemplo" genérica não serve.

## 3. Nada sai do site
- **Item descontinuado:** fica, com etiqueta (`pricing: "Descontinuado"` no tools, `duration: "Descontinuado"` no career). A página conta a história e as alternativas.
- **Item sem fonte suficiente:** ganha uma página simples, que termina com "Página em revisão: as informações acima são básicas e serão completadas em breve.". O autor completa depois.
- **Nome que mudou:** usa o nome atual, mantendo o antigo para reconhecimento. Exemplos: "draw.io (diagrams.net)" e "Magnific (antigo Freepik)".

## 4. Fontes e números
- Toda página de detalhe tem fontes de **2 domínios diferentes**, exceto as marcadas "Página em revisão". O build confere.
- Todo número (preço, percentual, quantidade, ranking) tem fonte aberta e data ("em outubro de 2026"). **Número sem fonte não entra.**
- Preços e vídeos podem entrar, sempre com a fonte.
- O texto publicado nunca fala do processo de pesquisa ("não pôde ser aberto", "nesta revisão", "o card aponta"). Isso vai só nas observações do lote. O build confere.

## 5. Tom
Claro, didático e direto, sem marketing e sem promessa ("passe na entrevista", "guia completo"). Títulos fiéis ao conteúdo.

## 6. Nada do acervo se descarta
- Todo item do hd tem lugar na trajetória acadêmica ou profissional do autor (ver `trajetoria-do-autor.md`). Antes de classificar, situe o item nessa linha do tempo.
- Nomes de pastas e arquivos são pistas de pesquisa (ano, evento, empresa, ferramenta). Pesquise a partir deles.
- Material original pode ser exposto quando o autor autoriza. Junto dele, explique em que caso se aplica, complemente com informação atual e cite outras instituições nas fontes.
- Arquivos com dados de terceiros, marca de cliente ou credenciais não saem do hd. Mas o conhecimento que eles mostram (método, ferramenta, processo) vira conteúdo. No acervo, esses itens ficam como `referencia` e trazem os destinos onde o conhecimento foi usado.
- Mesmo conteúdo estático ou curto já mapeado deve ganhar informação nova: contexto, fontes, relação com outros projetos.
- Imagens parecidas e textos repetidos: publique só uma versão. Para imagens, use `python scripts/imagens-parecidas.py <pasta>`.
