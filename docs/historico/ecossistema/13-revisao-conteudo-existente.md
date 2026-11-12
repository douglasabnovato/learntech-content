# Revisão do conteúdo que já existia (28/10/2026)

Revisão só de leitura do conteúdo publicado antes de 27/10 nos 4 sites. O conteúdo novo (piloto, primeiro lote e páginas de detalhe) ficou fora.

Os relatórios completos, com a tabela de cada item, estão em `revisao/`:
- `learn-tech.md`: 41 achados;
- `bootcamps.md`: 21 eventos e 12 achados transversais;
- `career.md`: 30 achados;
- `tools.md`: 67 itens.

**Limitação.** As máquinas da revisão não abriam os sites externos. Preços, encerramentos e mudanças foram conferidos por busca na web, com fontes nos relatórios. Os links marcados "não verificado" precisam de um clique manual.

## 1. Situação geral

| Site | Itens revisados | Estado | Gravidade alta |
|---|---|---|---|
| learn-tech | 34 programas (4 completos antigos e 27 capas), 11 páginas, 4 artigos antigos | 41 achados (10 de gravidade alta); 19 precisam de decisão | 10 |
| bootcamps | 21 eventos | 2 bons, 12 precisam de ajuste, 7 fracos | Eventos fora dos dados locais; formações sem prova; páginas próprias que são rascunho |
| career | 21 empresas, 16 plataformas, 12 perfis, BRQ, currículos | 30 achados | BRQ invisível com a API ligada; currículos com possível dado real |
| tools | 56 ferramentas e 11 hospedagens | 30 ok, 32 a revisar, 5 a remover | Preços desatualizados; dados locais atrasados |

## 2. Problemas que se repetem nos 4 sites

| # | Problema | Onde | Ação |
|---|---|---|---|
| T1 | **Dados locais desatualizados.** Quando a API não responde, o visitante vê outra versão: 5 eventos somem, 15 ferramentas faltam, a BRQ aparece e as empresas novas não | bootcamps `events.data.ts`, tools `data/*.js`, career `js/*.js`, learn-tech `constants/*` | Gerar os dados locais a partir da API no build, ou atualizar de uma vez (seguro, sem decisão) |
| T2 | **Promessas e números sem base.** Lições e horas inventadas nas 27 capas; "avaliações", slides e repositório que não existem no programa 1; estatísticas sem fonte; "+130 eventos" no GDG; "2.500 profissionais" na BRQ | learn-tech, bootcamps, career | Tirar o que não tem fonte ou trocar por um dado real com data |
| T3 | **Afirmações sobre o Douglas sem confirmação.** 12 formações "concluídas" sem ano nem certificado; papel em eventos indefinido; texto em 1ª e 3ª pessoa misturados | bootcamps | **Decisão:** confirmar cada formação e escolher a voz dos textos |
| T4 | **Privacidade e formulários.** O "Fala aê" e a inscrição do BQ não enviam nada; a política diz que não coleta IP (o Turnstile envia o IP ao Cloudflare) e que não usa cookies (o YouTube grava cookies); "sem cadastro" contradiz o formulário de identificação | learn-tech, bootcamps | Corrigir os textos (seguro) e decidir o que fazer com os formulários (decisão) |
| T5 | **Português e inglês misturados** em títulos, rótulos e categorias | career, learn-tech, tools | Traduzir a interface (seguro); a lista de categorias é decisão |
| T6 | **Links fracos ou quebrados.** Página interna ou que exige login; site institucional em vez de página de carreiras; domínios antigos; `/blogs` inexistente; WhatsApp de exemplo | todos | Corrigir (seguro), menos o que exige escolha de destino |
| T7 | **Imagens.** 22 imagens do Pixabay para 30 capas; imagem do programa 1 gerada por IA com texto errado; favicons do Google borrados; capturas acima de 300 KB; logos de terceiros como capa | learn-tech, tools, career, bootcamps | Trocar por capas próprias (`scripts/gerar-capa.py`) ou otimizar |
| T8 | **Campos usados para outra coisa.** `duration` como rótulo livre no career; um único `certificate` por evento; só dois estados de evento (concluído e meta) | career, bootcamps | Ajuste de schema (decisão de engenharia) |

## 3. Os 15 achados mais importantes

| # | Site | Achado | Gravidade | Decisão? |
|---|---|---|---|---|
| 1 | learn-tech | O "Fala aê" simula o envio, mas a política manda pedir a exclusão de dados (LGPD) por ele | alta | sim: ligar a algum lugar ou trocar por e-mail |
| 2 | learn-tech | A política de privacidade não reflete Turnstile, IP, cookies do YouTube e operadores (Cloudflare, Vercel) | alta | não (texto) |
| 3 | learn-tech | A área de membros é descrita como "não terá" na política e "a caminho" no FAQ, nos termos e no roadmap | alta | sim |
| 4 | learn-tech | As 27 capas mostram lições e horas inventadas | alta | não: tirar os números até haver conteúdo |
| 5 | learn-tech | Programa 1: imagem gerada por IA com texto errado, pôster de terceiro com pessoa identificável, promessas não cumpridas | alta | não (trocar a imagem e ajustar o texto) |
| 6 | career | A BRQ só aparece quando a API falha | alta | sim: levar para a API com detalhe ou retirar |
| 7 | career | Currículos com telefones em formato real e links que podem ser de pessoas reais | alta | sim: confirmar a origem |
| 8 | career | Polywork encerrada (2025), Movile incorporada ao iFood (2023), GeekHunter comprada (2023) e duplicada | média | Polywork não; os demais sim |
| 9 | bootcamps | 5 eventos só na API (somem sem ela); CodeXperience local antigo | alta | não |
| 10 | bootcamps | Páginas próprias de BQ e ByteClass ligadas como "site oficial", mas são rascunhos (imagens faltando, `wa.me/SEUNUMERO`, formulário que só faz `console.log`) | alta | sim: concluir, esconder ou desligar o link |
| 11 | bootcamps | 12 formações "concluídas" sem prova; Driven (1.450 h) e UFJF são as afirmações mais fortes | alta | sim |
| 12 | bootcamps | Só dois estados: eventos assistidos viram "ementa dominada" e o BQ organizado vira "meta de estudo" | média | sim: criar "participei/organizei" |
| 13 | tools | Railway, Hashnode, Postman e Heroku com preço ou situação desatualizados | média | só o Heroku (remover ou avisar) |
| 14 | tools | 4 links errados (CodePen, CodeSandbox, GitLab Pages, brModelo); "Imagens Gratuitas" é post de blog; Pusher não é hospedagem | média | os dois últimos sim |
| 15 | todos | Dados locais desatualizados (T1) | alta | não |

**Correção de um registro anterior.** O certificado do Minas Summit publicado (`minas-summit-2025-certificado.pdf`) é mesmo de 2025, no nome do Douglas, e não está errado como diziam os documentos 01, 07, 10 e 11 (já corrigidos). Falta só publicar o de 2024, que está no hd.

## 4. Plano proposto

| Onda | O que | Decisão? | Esforço |
|---|---|---|---|
| A | **Correções seguras:** regenerar os dados locais a partir da API (T1); tirar números inventados das capas; ajustar preços, URLs e links quebrados no tools e no career; remover a Polywork; traduzir a interface; texto da política de privacidade; trocar a imagem do programa 1 por capa própria; criar a página `/blogs` | não | cerca de 3 h |
| B | **Decisões do Douglas** (lista na seção 5) | sim | conversa de 20 min |
| C | **Aplicar as decisões:** BRQ, currículos, formações, BQ e ByteClass, categorias, terceiro estado de evento, formulários | depende de B | 2 a 4 h |
| D | **Conteúdo:** preencher capas com fonte no hd (2, 4, 501, 701 e 504 parcial); páginas de detalhe para Git, Trello, Vite, VisuAlg, Tailwind, Vercel e Netlify; seções 2024 e 2025 do CodeXperience; certificado de 2024 do Minas Summit | parcial | lotes como o de 28/10 |

## 5. Decisões que dependem do Douglas

1. **"Fala aê":** ligar a um destino real (e-mail, API) ou trocar por um e-mail de contato?
2. **Área de membros:** vai existir? A política e o FAQ precisam dizer a mesma coisa.
3. **BRQ:** levar para a API com página de detalhe, ou retirar? E as 3 vagas dela?
4. **Currículos de exemplo:** são fictícios ou baseados em pessoas reais?
5. **Formações:** quais você concluiu de fato, e em que ano? (12 itens, com a lista em `revisao/bootcamps.md`)
6. **BQ e ByteClass:** são projetos seus, não eventos vividos. Ficam no bootcamps? E as páginas próprias: concluir, esconder ou desligar o link?
7. **Estado de evento:** criar um terceiro estado ("participei" ou "organizei")?
8. **Voz dos textos:** 1ª pessoa, 3ª pessoa ou sem o autor?
9. **Critério da lista de empresas do career** e o que fazer com Movile, GeekHunter e Revelo duplicadas.
10. **Categorias** do tools e do career (há uma proposta em `revisao/tools.md`).
11. **Heroku, Mockingbird, Fronteditor, "Imagens Gratuitas" e Pusher:** manter, mover ou remover?
12. **Certificado de 2024 do Minas Summit:** publicar como link?
