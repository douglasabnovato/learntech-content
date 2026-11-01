# 01/11/2026: cobertura entre projetos (lote 2026-10-30)

Pedido do autor: garantir que todo o conteúdo do hd esteja na API e apareça no máximo de projetos que cada tema permitir. Criar a lista única de próximos passos do autor e um processo que se ajusta a cada remessa.

## Medição (`npm run cobertura -- 2026-10-30`)
| Projetos alcançados | Antes | Depois |
|---|---|---|
| 1 | 44 | 29 |
| 2 | 11 | 23 |
| 3 | 0 | 3 |

Nenhum item ficou sem destino e não há destino inexistente.

## Entregas
- **bootcamps:**
  - Três formações que o autor concluiu viraram eventos: cursos Na Prática (Fundação Estudar), Imersão Hardwork Power (DNC) e Treinamento de Alta Performance (Geronimo Theml). Todas ligadas aos programas 1001 a 1004.
  - Os eventos ganharam `relacionados`: o build confere se o alvo existe e publica título e URL. A página de detalhe mostra a seção "Veja também no ecossistema". Ligações em 11 eventos (Hackathon, Fator S, Startup Way, GDG, TDC, Capivara, Jogos Universitários, CodeXperience e as três formações).
- **learn-tech:** dois artigos novos:
  - "Bastidores de um hackathon de comunidade", a partir dos registros do autor na organização (HD-0010);
  - "Do problema ao pitch: Matriz CSD, Canvas e pitch num ideathon", a partir do Fator S e do Startup Way (HD-0011 e EV-007).
- **career:** a régua de níveis de habilidade do projeto Hack Dev (HD-0007) virou dica no modelo de currículo de front-end júnior.
- **acervo:** destinos que já tinham sido usados na página da ABC, nos modelos de currículo e nas fichas do tools foram registrados.
- **Engenharia:** schema de eventos com `relacionados`, regra de integridade, teste (evento com relacionado inexistente e resolução da URL), tipo e seção no site bootcamps. Script `cobertura-projetos.mjs` (`npm run cobertura`).
- **Processo:** etapa 7b "Cobertura entre projetos", seção "Melhoria contínua" no README e `PROXIMOS-PASSOS.md` na raiz da API.

## Itens que ficam num projeto só, e por quê
- **Dados e peças do ex-empregador** (bases de leads e de clientes, imagens internas, manuais e apresentações de fornecedor, relatórios com dados pessoais, vídeos com pessoas identificáveis):
  HD-0016, 0017, 0018, 0026, 0029, 0030, 0031, 0034, 0038, 0040, 0042, 0044, 0046, 0047, 0050, 0054.

  O conhecimento foi usado no learn-tech (ou no tools), e os arquivos não podem ser expostos. Levar esse material à career ou ao bootcamps exporia a empresa.
- **Produção do autor sobre CRM que já sustenta programas e a ABC de forma genérica:**
  HD-0015 (templates de e-mail), 0032 (régua de expansão), 0039 (LGPD), 0043 (modularização), 0045 (QA), 0051 (webinar).

  Cabem no learn-tech, que ensina o método. Na career, a página da ABC já cita esse tipo de entrega de forma genérica.
- **Material pessoal de estudo:** HD-0001 (planner) e HD-0005 (e-books de terceiros sobre equipes e tempo).
- **Fotos de evento:** HD-0009 (GDG) e HD-0013 (TDC). O evento já se liga ao artigo de eventos de comunidade por `relacionados`.
- **Outros com destino único natural:**
  - HD-0012: boletim de fomento, publicado como artigo; o Fator S liga ao artigo.
  - HD-0037: favoritos que viraram fichas.
  - HD-0049: fotos de evento corporativo, citado de forma genérica na página da ABC.

## Validação
- Validação: 0 erros. Totais: 49 programas, 27 eventos, 80 ferramentas, 27 empresas, 6 áreas e 4 modelos de currículo.
- tsc da API e do bootcamps sem erros; cópias de reserva atualizadas.
- `leva:status`: LEVA ABERTA (faltam os vídeos, a transcrição e a aprovação).

## Retrospectiva
- A métrica de cobertura deixou visível que 80% dos itens alimentavam um projeto só. A partir de agora, ela roda em toda remessa (etapa 7b).
- Ligações entre projetos passaram a ser dado verificado no build, e não link solto no texto.
- A cópia de reserva de categorias do learn-tech (`categoriesData.js`) não é gerada pelo `exportar-copias`, então categorias novas só aparecem com a API no ar. Fica como melhoria de engenharia.
