# Lote 2026-11-09: documentos do hd (issue #14)

Os 502 documentos pendentes dos itens do hd receberam um uso. O texto de cada um foi extraído e comparado com o conteúdo publicado em cada destino do item. Este lote é a tabela do A1: o autor confirma as referências e escolhe o que vira conteúdo novo.

Sem nomes de arquivo, de pessoas ou de clientes: só item, contagem e tema.

## 1. Uso marcado (na `developer`, commit 19cec65)

| Uso | Arquivos | Regra |
|---|---|---|
| `fonte` | 196 | O texto do documento casa com um destino do item, que fica em `destino` |
| `referencia` | 196 | O item inteiro é de referência: material de terceiro, do ex-empregador ou com dados pessoais |
| `referencia` | 109 | Item publicado, mas o documento não tem trecho próprio no texto: serviu de base. A maioria é código das landing pages do HD-0025 |
| pendente | 1 | Áudio do HD-0006, que espera transcrição |

**A confirmar no A1:** as 305 referências. Para trocar uma por `fonte` ou `descartado`, basta dizer o item.

## 2. O que os documentos têm e o conteúdo ainda não tem

Foram procurados os termos que aparecem nos documentos dos itens publicados e em nenhum arquivo de `content/`. A maioria do que sobra são nomes de pessoas, marcas parceiras e códigos internos, que não entram por privacidade. Restaram estes temas:

| # | Item | Tema que falta | Proposta | Destino |
|---|---|---|---|---|
| 1 | HD-0022 | Ferramentas de e-mail e dados que aparecem nos controles de CRM: Campaign Monitor, Omnisend, GetResponse, Databox e Rock Content | Cinco fichas novas em `tools/ferramentas`, com pesquisa pública | tools |
| 2 | HD-0036 | Cashback, funis por etapa e valor do cliente no tempo (LTV) nos reports de growth | Artigo "Cashback e LTV no varejo: quando o desconto paga a recompra" | learn-tech/blog |
| 3 | HD-0021, HD-0024 | Programa de pontos de parceiro e régua de fidelidade por unidade de negócio | Seção nova no programa 1101: régua de fidelidade com parceiro de pontos | learn-tech/programas/1101 |
| 4 | HD-0025 | Máscaras de campo (CPF, CNPJ, telefone) nos formulários das landing pages. O programa de indicação já está no 106; a máscara não | Exercício no programa 106: máscara e validação de campo no front, antes do envio ao CRM | learn-tech/programas/106 |
| 5 | HD-0015 | Guia de tipografia e espaçamento dos templates de e-mail | Aprofundar o programa 1102 com um guia de estilo de e-mail (fontes seguras, pesos, espaçamento) | learn-tech/programas/1102 |
| 6 | HD-0007 | HackerRank entre as plataformas de teste técnico da trilha | Ficha em `tools/ferramentas` e citação no programa 1005 | tools, learn-tech/programas/1005 |
| 7 | HD-0006 | Rotina do "dia ideal" com hábitos e apps de agenda e notas | Exercício "monte seu dia ideal" no programa 1004 | learn-tech/programas/1004 |
| 8 | HD-0012 | Rodadas de seleção e credenciamento em editais estaduais de inovação | Parágrafo de aprofundamento no artigo de editais de fomento | learn-tech/blog |

Ficam de fora:
- a nutrição esportiva do HD-0003, que não tem relação com tecnologia;
- o texto de boas-vindas do HD-0013 e a programação do HD-0011, que já estão resumidos nas páginas dos eventos.

## 3. Fotos pendentes (issue #13)

10 fotos foram marcadas `similar`: estão a dHash até 10 de uma foto exibida do mesmo evento. As outras 325 imagens foram agrupadas (dHash até 10) e estão em folhas de contato numeradas, com uma foto por grupo. As folhas ficam só na máquina do autor, fora do git.

| Item | Imagens | Grupos na folha |
|---|---|---|
| HD-0010 (hackathon) | 131 | 124 |
| HD-0011 (Fator S) | 145 | 128 |
| HD-0013 (TDC) | 20 | 14 |
| HD-0025 (landing pages) | 12 | 12 |
| HD-0007 (hack dev) | 9 | 8 |
| HD-0009 (GDG) | 4 | 4 |
| HD-0008 (cursos) | 4 | 4 |

**A1 das fotos:** o autor diz, por item, os números que vão para a galeria (`exibido`). Os parecidos de cada grupo escolhido viram `similar`, e o resto vira `descartado` com o motivo "fora da seleção da galeria". Fotos com documento, comprovante ou dado pessoal à vista vão para `descartado` mesmo se escolhidas.

## 4. Produção (A1 de 09/11: "todos")

O autor aprovou os oito temas e pediu que o Claude escolhesse pelo menos quatro fotos por item. Ele ajusta depois, trocando ou acrescentando.

| # | Entrega |
|---|---|
| 1, 6 | Seis fichas novas em `tools/ferramentas` (91 → 97): `campaign-monitor`, `omnisend`, `getresponse`, `databox`, `rock-content`, `hackerrank` |
| 2 | Artigo `cashback-e-ltv-no-varejo-quando-o-desconto-paga-a-recompra`, com capa gerada |
| 3 | 1101: passo "Régua de fidelidade com programa de pontos de coalizão" |
| 4 | 106: passo "Máscara e validação de CPF, CNPJ, telefone e CEP" |
| 5 | 1102: passo "Guia de estilo tipográfico do e-mail" |
| 6 | 1005: HackerRank citado no passo de testes técnicos |
| 7 | 1004: passo "Exercício: monte o seu dia ideal em blocos" |
| 8 | Artigo de editais: parágrafo "Rodadas e credenciamento" |

### Fotos

| Item | Escolhidas | Onde aparecem |
|---|---|---|
| HD-0010 (hackathon) | 6: foto oficial, encerramento, organizadores, salão, chegada com brindes, arte da nova data | galeria do evento, 28 a 33 |
| HD-0011 (Fator S) | 6: abertura, equipe, pitch no palco, plateia, dois canvas | galeria do evento, 30 a 35 |
| HD-0007 (hack dev) | 2: agenda da rotina (sem o painel de tarefas, que tinha nomes de terceiros) e favoritos da trilha | capa do programa 1005 e capa do artigo do hack dev |

Também entraram:
- **HD-0013 (TDC):** 13 fotos já estavam na galeria. O `hd:uso` não as via porque a pasta da galeria (`tdc-innovation-2023`) tem outro nome que o slug do evento. Isso foi corrigido no script, com teste.
- **HD-0025:** 11 "imagens" eram metadado do macOS (`__MACOSX/._nome`) e viraram `tecnico`, com regra e teste.

Ficaram de fora, com o motivo:
- **HD-0009 (GDG):** as 4 pendentes são capturas do Instagram, com nomes e curtidas. A galeria já tem 7 fotos.
- **HD-0013:** as pendentes são capturas do app do evento e de um formulário de inscrição.
- **HD-0008:** são folhas e telas de cursos de terceiro, cujos direitos não são do autor.
- **HD-0007:** programa e artigo têm só uma imagem de capa cada. Por isso, duas das quatro fotos escolhidas não têm lugar. Mostrar mais pede uma galeria no learn-tech.

### Pontos para o autor
- **Rock Content:** o site oficial redireciona para outro domínio, e a ficha está marcada "Página em revisão". Decidir o link e se a ficha fica.
- **Preços sem confirmação:** os preços de Campaign Monitor, Databox e HackerRank não foram confirmados na página oficial, e as fichas não citam valores. Os da Omnisend e da GetResponse vieram com ressalvas.
- **Teto do contrato:** o 106 ficou com 8 fontes, acima do máximo de 6, e o 1101 com 23 passos, acima do teto de 22. O build não confere esses limites.

## 5. Todas as fotos com critério (09/11, segunda rodada)

O autor pediu que cada foto não usada tivesse uma justificativa. Cada grupo da folha de contato recebeu uma decisão, e os parecidos do grupo seguem a mesma decisão.

| Decisão | Critério |
|---|---|
| `exibido` | Mostra o evento acontecendo (pessoas, equipe, palco, pitch, canvas, programação), está nítida e não repete uma foto já exibida |
| `similar` | Mesma cena de uma exibida, em rajada ou de outro ângulo: as fotos dos slides da mesma palestra, as do mesmo palco, as da mesma plateia |
| `descartado` | Um dos motivos gravados no acervo: documento ou comprovante à vista; crachás com nomes; captura de rede social ou app com nomes de terceiros; cartão de contato; selfie do autor sem a atividade do evento; foto pessoal fora do tema; ambiente vazio; foto escura; slide ilegível; arte repetida; divulgação de outro evento; retrato de terceiro sem contexto |
| `referencia` | Material de terceiro sem direito de exibição (HD-0008), imagem do ex-empregador (HD-0025) e capturas do hack dev que não têm espaço de imagem (HD-0007) |

| Item | Exibidas novas | Similar | Descartadas | Referência |
|---|---|---|---|---|
| HD-0010 hackathon | 9, galeria 34 a 42 | 8 grupos | 101 grupos | — |
| HD-0011 Fator S | 13, galeria 36 a 48 | 89 grupos | 20 grupos | — |
| HD-0009 GDG | 4, galeria 7 a 10 (foto recortada da captura, sem a parte do Instagram) | — | — | — |
| HD-0013 TDC | 1, galeria 11 | 1 | 2 | — |
| HD-0007, HD-0008, HD-0025 | — | — | 1 | 11 |

Resultado: o hd fica **93,0% usado**. Os 38 pendentes são os 37 vídeos (#15, que ficam com o autor) e o áudio do HD-0006.

Se o autor discordar de uma decisão, basta trocar o `uso` do arquivo. Uma foto descartada pode virar `exibido` sem perder nada.

## Próximos passos
- O áudio do HD-0006 é transcrito e marcado.
- Os vídeos seguem na #15.
