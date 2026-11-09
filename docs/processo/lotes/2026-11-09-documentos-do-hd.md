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

## Próximos passos
- O autor escolhe no A1 quais propostas da seção 2 seguem. Cada uma vira um lote de produção com o contrato do site.
- O áudio do HD-0006 é transcrito e marcado.
- Fotos (#13) e vídeos (#15) seguem nas suas issues.
