# Revisão editorial e técnica do conteúdo antigo do learn-tech

Data: 28/10/2026. Escopo: conteúdo existente antes de 27/10/2026. Método: só leitura de `learntech-content/content/learn-tech/` (fonte da verdade), `learn-tech/src/constants/*.js` (fallback local) e das telas que exibem esse conteúdo. Nenhum arquivo dos projetos foi alterado, nada de npm ou git. Fora do escopo: programas 404, 503 e 602, os 13 artigos com `publishedAt` 2026-10-27/28 e `rotina-desenvolvedor` (citados só quando interagem com o conteúdo antigo).

Limites da verificação: as imagens do Pixabay responderam 403 a requisições automatizadas (tanto da VM quanto do contêiner), por isso o peso e a disponibilidade delas **não foram medidos**; os vídeos do YouTube também não puderam ser conferidos (oEmbed bloqueado). O estudo da Anthropic citado no programa 801 foi conferido por fonte secundária (InfoQ).

## Resumo

- **34 programas antigos** na API: **4 completos** (1, 101, 801, 901) e **27 capas** sem `moduleContents`. As "30 capas" de origem incluem 404, 503 e 602, que viraram programas completos em 27-28/10; no fallback local elas ainda são capas com o título antigo.
- **Todas as 27 capas têm números inventados** no card (`lessons` de "08+ Lições" a "30+ Lições", `duration` de "05hr 30min" a "22hr 00min"), sem `description`, `level` nem `status`; 26 de 27 usam imagem hotlinkada do Pixabay (só 22 URLs distintas para 30 cards: a mesma imagem aparece em até 4 programas).
- **Os 4 completos não seguem o mesmo padrão**: o 1 diz "12 Lições" mas tem 21 passos; formatos de `lessons`/`duration` diferentes; quiz 18/12/12/8; fontes fracas no 1 e no 101; 56 emojis em títulos de seção; imagem do programa 1 é gerada por IA com texto sem sentido ("FULL-STACK LOGÍSTICA ... Cadiei de Supriítents").
- **11 páginas**: 7 idênticas entre local e API; `blog` (5 local x 18 API) e `categorias` (11 x 12) divergem. Achados graves: o formulário "Fala aê" **não envia nada** (só simula), mas é o canal de direitos LGPD da política e "vai direto para a equipe" no FAQ; política, termos, FAQ, Fala aê e Recursos se contradizem sobre "área de membros"; a política não cita Turnstile, YouTube nem Cloudflare; "Sem cadastro" convive com identificação obrigatória.
- **Links/rotas**: `/blogs` (Blog.jsx:17) não existe no App.jsx; cards de categoria parecem clicáveis e não levam a lugar nenhum; categoria "IA" (programa 801) não existe em `categorias.json`; slug `database` não bate com `data-base`.
- Total: **41 achados** na tabela (10 alta, 19 média, 12 baixa; a linha 14 é só uma conferência positiva). 19 dependem de decisão do Douglas; os demais são correções seguras.

## Tabela de achados

| # | Onde (arquivo e campo/id) | Problema | Gravidade | Ação recomendada | Decisão do Douglas? |
|---|---|---|---|---|---|
| 1 | `programas/{2,3,4,102,103,104,201-204,301-304,401-403,501,502,504,601,603,604,701-704}.json`, campos `lessons` e `duration` | Números sem conteúdo por trás ("20+ Lições", "15hr 20min", "30+ Lições", "22hr 00min"). Prometem carga horária que não existe | alta | Trocar por texto honesto ("Em produção" / "Em breve") ou remover; o card exige os campos por PropTypes (`ProgramsCard.jsx:115-116`) | sim (texto do card) |
| 2 | Capas, ausência de `status` na API; `learn-tech/src/pages/detail/Detail.jsx:311` e `enroll/Description.jsx:13-14` | O card já mostra "Em breve" (resolvido por `statusDoPrograma`, `conteudo.js`), mas o acesso direto a `/program/web/2` abre a página de detalhe com botão "Acessar", que leva a "Carregando conteúdo..." infinito | média | Na página de detalhe, esconder "Acessar" quando não houver `enrollDetails` e mostrar "Programa em produção" | não |
| 3 | `media/learn-tech/programas/1.webp` (campo `image` do programa 1) | Imagem gerada por IA (marca do gerador no canto) com texto "FULL-STACK LOGÍSTICA / Construa Sistemas Inteligents para la Cadiei de Supriítents": assunto errado (logística, full-stack) e texto com erros em português/espanhol | alta | Substituir por imagem própria de landing page, sem texto embutido | sim (nova imagem) |
| 4 | `media/learn-tech/programas/1-poster.webp` e `programsData.js:5` (`video` YouTube `pWDF8csG9Qo`, poster local `1-program-curso-em-video.webp`/`1-poster-demo.webp`) | Pôster é captura de vídeo de terceiro (canal Curso em Vídeo, segundo o nome do arquivo), com pessoa identificável e marcas do YouTube; o vídeo embutido não tem crédito no programa, contra o princípio "Fonte sempre creditada" (`sobre.json`) | alta | Creditar canal e vídeo em `sources`, ou trocar o pôster por imagem própria; confirmar licença | sim |
| 5 | `programas/1.json` `lessons` ("12 Lições") x `modules[].lessonsCount` (soma 21) | Contagem errada; os outros 3 completos batem (13, 13, 14) | média | `lessons: "21 passos"` | não |
| 6 | `programas/1.json` `lessons`/`duration` x 101/801/901 | Formato divergente: "12 Lições"/"10hr e 30min" contra "13 passos"/"8h estimadas" | baixa | Padronizar para "N passos"/"Nh estimadas" | não |
| 7 | `programas/1.json` `letslearn[0]` | "aplicações web full-stack" — o programa é só front-end estático | média | "Construir uma página web completa com HTML, CSS e JavaScript" | não |
| 8 | `programas/1.json` `enrollDetails.transitionText` | Promete "conferir as avaliações de quem já transformou sua carreira": não há avaliações no site (o `testimonialData.js` é órfão e fictício, ver #33) | alta | Reescrever sem avaliações | não |
| 9 | `programas/1.json` `materials` ("Slides Completos", "Repositório de Código Fonte", "Arquivos do Projeto") e `programas/101.json` `materials[0]` ("Repositório com o projeto por módulo") | Materiais anunciados não existem: nenhum link de slides ou repositório no JSON | alta | Publicar os materiais com link ou trocar por "Passos e código dentro de cada módulo" | sim (se vai criar repositório) |
| 10 | `programas/1.json` `enrollDetails.moduleOverviews` (módulo 0 "Análise de Requisitos"; módulo 1 "Atributos ARIA"; módulo 2 "Tokens de design") | A ementa promete tópicos que os passos de `moduleContents` não cobrem (nenhum passo de requisitos, ARIA citado 0 vezes como tópico, nenhum token) | média | Alinhar a ementa aos passos reais ou acrescentar os passos | não |
| 11 | `programas/1.json` `whyNow.paragraphs[0]` e `sources[0]` (gitnux.org) | "mais de 95% dos sites" apoiado num agregador de estatísticas, não na fonte primária | baixa | Citar W3Techs diretamente | não |
| 12 | `programas/101.json` `whyNow.paragraphs[0]` | "cerca de 162,5 milhões de downloads anuais no npm" para React é incompatível com a ordem de grandeza pública do npm (dezenas de milhões por semana); fonte é blog de fornecedor (svar.dev) e blog pessoal (saschb2b.com) | média | Conferir em npmjs.com/npm-stat e no State of JS oficial; trocar as fontes | não |
| 13 | `programas/801.json` `sources[1]` | Rótulo diz "Mercado de programação 2026", URL é `.../mercado-de-programacao-2025` | baixa | Corrigir rótulo ou link | não |
| 14 | `programas/801.json` `about`, `enrollDetails.introductionParagraphs` | Dados do estudo da Anthropic (52 júniores, 50% x 67%, ~2 min sem significância, maior perda em depuração, ≥65% com uso para explicação) conferem com a cobertura da InfoQ | — | Nenhuma (registrado como verificado) | não |
| 15 | `programas/1.json`, `101.json`, `801.json`, `901.json` (`sections[].title`, `highlightsTitle`, `ctaTitle`, `tips`) | 56 emojis em títulos (19, 12, 12, 13) | baixa | Remover se a regra editorial for "sem emojis"; manter os ícones já previstos em `icon` | sim (padrão visual) |
| 16 | Os 4 completos: `quiz` (18/12/12/8), `modules[].component` ("ModuleZero..." no 1, "ModuleRenderer" nos demais), `moduleContents[].lessonsCount` só no 901, `sources` (2/2/2/3) | Estrutura inconsistente entre completos; 901 tem 2 questões por módulo contra 3 nos outros | baixa | Fixar padrão (3 questões por módulo, mínimo 3 fontes primárias) e alinhar | não |
| 17 | `programas/{1,101,801,901}.json` `marketUsage.companies: []` | Campo vazio em todos os completos; seção "Quem usa no mercado" fica genérica, sem nenhuma empresa | baixa | Preencher com empresas que tenham fonte pública ou remover a lista | não |
| 18 | `programas/101.json`, `801.json`, `901.json` campo `image` | Completos usam a mesma imagem de capas (901 = 2, 204, 304; 801 = 303, 504) | média | Imagem própria para cada completo, servida em `/media/` | sim (imagens) |
| 19 | 26 capas + 101/801/901 (`image`) e 4 artigos antigos (`img`, `illustrationImg`) | Hotlink no `cdn.pixabay.com` (1280 px, JPEG): dependência externa, sem controle de peso; a CDN bloqueou acesso automatizado nesta revisão | média | Baixar, converter para WebP ≤ 100 KB e servir por `/media/` | sim (migração de mídia) |
| 20 | `programas/601.json` `title` | Termina com ponto final ("...colaborativos.") | baixa | Remover o ponto | não |
| 21 | Títulos das capas 2, 103, 201, 401 | Inconsistências: "Do Zero ao Deployment" (anglicismo), "Guia Completo" (promessa), "Aprenda UX/UI para criar..." (frase de chamada, não título), "Banco de Dados na prática" (caixa diferente dos demais) | baixa | Padronizar títulos no formato "Tema: resultado" | não |
| 22 | `programas/40x.json` `category` "Data Base"; `categorias.json` `title` "DataBase", `slug` "database"; `estatisticas.json` `category` "database"; programas `categoryFilter` "data-base" | Mesma categoria escrita de 4 formas; slug do card de categoria não bate com o filtro dos programas | média | Usar "Banco de Dados" / `data-base` em todos (ou o slug escolhido) | sim (muda rota `/program/{categoryFilter}/...`) |
| 23 | `paginas/categorias.json` `itens` | Não existe categoria "IA" (programa 801 com `categoryFilter: "ia"`); existem "Comunicação", "Gestão" e "Tecnologia" sem nenhum programa | média | Acrescentar "IA"; decidir se categorias sem programa ficam | sim |
| 24 | `paginas/categorias.json` `itens[projetos].description` | "com sucesso garantido" — promessa | média | "...com previsibilidade" | não |
| 25 | `learn-tech/src/components/category/CategoryCard.jsx` (usado por `categorias.json`) | Card tem `cursor-pointer` e hover, mas não é link: o usuário clica e nada acontece | média | Levar a `/programs?categoria=slug` ou tirar a aparência de clicável | sim (navegação) |
| 26 | `paginas/estatisticas.json` `itens[].count` ("3+ Javascript", "2+ HTML", "3+ Jira", "3+ Aplicativos" em `english`) | Números sem definição nem fonte (não dizem se são programas, recursos ou ferramentas); não batem com o catálogo (ex.: 0 programas de Jira, 1 completo de React). Selo exibe slugs crus ("gestao", "comunicação", "database") | alta | Calcular a partir do catálogo (programas por categoria) ou remover a seção; se ficar, explicar o que é contado | sim |
| 27 | `paginas/sobre.json` `processSteps[3]` e `differentiators[2]` | "Resolvemos um problema real, de um cliente real" e "quando aplicamos o conteúdo a um cliente real" — não há caso de cliente publicado nos programas antigos (só o 503, novo e anonimizado) | média | Reescrever no condicional ou apontar o 503 como exemplo | sim |
| 28 | `learn-tech/src/pages/falaae/FalaAe.jsx:78-84` + `paginas/faq.json` itens 8 e 10 + `paginas/privacidade.json` seção `direitos` | O formulário só faz `setSubmitted(true)`; nada é enviado. FAQ diz que "vai direto para a equipe"; a política manda pedir exclusão de dados por ele. Pedido LGPD se perde | alta | Ligar o formulário a um destino real (endpoint na API ou serviço de formulário) e, até lá, publicar um e-mail de contato na política | sim |
| 29 | `paginas/privacidade.json` seção `membros` x `paginas/termos.json` seções `sobre` e `membros` x `paginas/faq.json` itens 2 e 3 x `FalaAe.jsx:37-40` x `Recursos.jsx:65` x `ProgramsCard.jsx:19` | Política: "não tem e não terá área de membros". Termos, FAQ, motivo do Fala aê e roadmap do Recursos: área de membros "a caminho" | alta | Decidir a direção e alinhar os 6 lugares | sim |
| 30 | `paginas/privacidade.json` seções `dados-coletados` e `cookies` x `learntech-content/src/turnstile.ts:9`, `src/app.ts:89-91`, `public/sdk/identificacao.js:54` | Política diz "Não coletamos IP ... nem dados do seu navegador" e não cita o Cloudflare Turnstile: quando ativo, o widget roda no navegador e a API envia o IP (`remoteip`) ao Cloudflare. Também não cita operadores (Cloudflare, Vercel) | alta | Acrescentar Turnstile e operadores; reescrever "não armazenamos IP" | sim (texto jurídico) |
| 31 | `paginas/privacidade.json` seção `cookies` x `components/videoGrid/VideoModal.jsx:23`, `paginas/mentorias.json`, programa 1 (`video`) | "Não utiliza cookies de rastreamento", mas os vídeos são embutidos de `youtube.com/embed` (define cookies do Google) | média | Trocar para `youtube-nocookie.com` ou declarar na política | sim |
| 32 | `paginas/faq.json` itens 2 e 3; `Detail.jsx:297` ("Sem cadastro e sem login: é só acessar"); `Hero.jsx` ("sem cadastro") x `public/sdk/identificacao.js:15,129` | Identificação por nome e e-mail é obrigatória por padrão (sem botão "Agora não"; `data-obrigatorio` não é passado em `services/identificacao.js`). "Não precisa se cadastrar" fica ambíguo para o visitante | média | Dizer "sem senha; pedimos nome e e-mail uma vez" no FAQ e no detalhe, ou tornar opcional | sim |
| 33 | `learn-tech/src/constants/testimonialData.js` | 6 depoimentos com nomes e cargos ("João Ferreira", "Giovanna Sant'Anna"...) sem origem; `ReviewsCard` não é importado por nenhuma tela (órfão) | média | Apagar o arquivo e o componente, ou substituir por depoimentos reais com autorização | não (está fora do ar) |
| 34 | `paginas/termos.json` `lastUpdated` "19 de julho de 2026" | Anterior à identificação por nome/e-mail e ao Turnstile; termos não citam a identificação; política está em 27/09 | média | Revisar e datar junto com a política | sim |
| 35 | `paginas/termos.json` seção `acesso-livre` | "Acesso Livre ... é composto por curadoria de material público" — o 901 (acervo próprio da graduação) e os novos 404/503/602 são autorais | baixa | "curadoria e conteúdo autoral" | não |
| 36 | `learn-tech/src/pages/home/blog/Blog.jsx:17` | "Veja Todos" aponta para `/blogs`, rota inexistente (cai no 404); a home mostra os 18 artigos sob "Top Artigos", sem limite | alta | Criar rota `/blog` com a lista e limitar a home a 3-6 itens | sim (nova rota) |
| 37 | `paginas/blog.json` itens `javascript-fundamentos`, `react-interfaces-modernas`, `nodejs-backend-rapido`, `scrum-projetos-ageis`, campo `readingTime` | "5-6 min" para textos de 352-388 palavras (cerca de 2 min) | baixa | "2 min" | não |
| 38 | `learn-tech/src/pages/home/blog/BlogOne.jsx:23-28` | `new Date("2026-07-10")` é lido em UTC e exibido no fuso do Brasil: a data aparece um dia antes (09 de julho) | média | Formatar com `timeZone: "UTC"` ou montar a data a partir do texto | não |
| 39 | `paginas/blog.json` item `scrum-projetos-ageis` (`highlights[1]`, `body[1]`, `bodyContinued[0]`) | Usa "Time de Desenvolvimento" e "cerimônias"; o Scrum Guide 2020 (a fonte citada) fala em "Developers" e "eventos", e define o Scrum Master como líder que serve | média | Atualizar termos para o Guia 2020 | não |
| 40 | `paginas/blog.json` item `react-interfaces-modernas` `quote` | "quais peças essa página é feita" (regência) | baixa | "de quais peças essa página é feita" | não |
| 41 | `paginas/blog.json` 4 itens antigos (`img`, `illustrationImg`, `tag`, `body`) | Imagens do Pixabay sem relação (árvore em React, robô de IA em Node); tag "Javascript"; "nosso módulo de JavaScript" sem link para programa; título-chamada ("Domine o JavaScript ... incríveis.") com ponto final | baixa | Imagens próprias; tag "JavaScript"; link para o programa 1 (módulo 3) ou 901; títulos sem ponto | não |
| 42 | `paginas/mentorias.json` (8 vídeos) | Nenhum item informa canal ou autor, contra "Fonte sempre creditada"; descrição "direto de quem já mentorou muita gente" sem atribuição | média | Acrescentar `canal` e `url` do canal; mostrar na `VideoGrid` | não (texto) / sim (se mudar o componente) |

Observação: a linha 14 não é achado; registra que os números do estudo citado no 801 foram conferidos.

## Paridade local x API

| Recurso | Local (`learn-tech/src/constants`) | API (`learntech-content/content/learn-tech`) | Diferença |
|---|---|---|---|
| Programas | 33 (`programsData.js`) | 34 | 901 só na API |
| 404, 503, 602 | Capas com título antigo ("Segurança de Dados: Protegendo Bancos contra Invasões", "MVP na Prática: Como Validar seu Produto com Baixo Custo", Scrum "20+ Lições/15hr") e `status: "novidade"` | Completos | Sem API, o visitante vê capa "Em breve" para programas que existem |
| Programa 1 | `video` YouTube, `image` asset local | `video: null`, `image` `/media/` | `comMidiaLocal` completa o vídeo só se o local estiver no bundle |
| `status` | Presente em todos (lancado/novidade) | Ausente em todos | Derivado em `statusDoPrograma` (conteudo.js); D1 do `06-conferencia.md` já está resolvido no card |
| 101, 801 e capas | Iguais à API, salvo `status` | — | — |
| blog | 5 itens; `rotina-desenvolvedor` só com capa | 18 itens | 13 artigos novos só na API; os 4 antigos são idênticos |
| categorias | 11 (sem "Fundamentos") | 12 | "Fundamentos" só na API; "IA" em nenhum |
| sobre, aprender, carreira, privacidade, termos, mentorias, faq, navegacao, estatisticas | iguais | iguais | Nenhuma |
| `CategoriesAll.jsx` (página `/category`) | Texto fixo no componente | Não vem da API | Sem "IA" e sem "Fundamentos"; tem "Fullstack", "Trabalho em equipe" e "Performance", que não existem em `categorias.json` |

## UX de conteúdo

- **Programa → programa**: não há "próximo programa" nem pré-requisito clicável. O 101 diz "parte de onde a landing page parou" e o 901 é a base de todos, mas nenhum JSON tem campo de trilha (ex.: `nextProgram`, `prerequisites`). Sugestão: trilha Fundamentos 901 → Web 1 → Frontend 101, com links no detalhe.
- **Artigo → programa**: nenhum artigo antigo aponta para um programa ("nosso módulo de JavaScript" sem link). "Continue lendo" (`BlogOne.jsx:21`) pega os 3 primeiros do array, sem relação de tema.
- **Categoria → programas**: cards de categoria não navegam (#25); a página `/category` é texto fixo, divergente da API.
- **Outros sites**: só há links de saída em `About.jsx:133` (bootcamps), `Career.jsx:134` (career) e `Recursos.jsx:224` (tools). Programas e artigos não apontam para ferramentas (tools) nem eventos (bootcamps), embora o mapa editorial já relacione itens (ex.: Excel em tools, CodeXperience em bootcamps).
- **Promessas de painel**: `Detail.jsx` mostra para todo programa "Conteúdo em ordem, do primeiro arquivo até a publicação" (falso para 801 e 901) e "Seu progresso fica salvo neste navegador" (só o quiz é salvo, segundo o relatório `learn-tech/docs/claudeia/01-relatorio.md`). `Recursos.jsx:77` promete "Novas trilhas todo mês".
- **O que falta para uma capa virar programa** (padrão dos completos): `description`, `level`, `about`, `letslearn`, `materials` reais, `modules` + `moduleContents` (lessonsCount = passos), `enrollDetails.moduleOverviews` alinhado aos passos, `quiz` com 3 questões por módulo, `sources` primárias, `whatYouBuild`, `whyNow`, `appliedIn`, `forWho`, imagem própria em `/media/`, e `lessons`/`duration` calculados.

## Capas

Estado: **capa** = só card (título, categoria, números inventados, imagem Pixabay). Fontes conforme `learntech-content/docs/ecossistema/11-mapa-editorial.md` (seções 2, 3.3 e 5). "Apoio" = fonte parcial ou indireta, inferida desta revisão.

| id | título | estado | fonte no hd | prioridade |
|---|---|---|---|---|
| 2 | HTML5 e CSS3 Moderno: Do Zero ao Deployment | capa | DOC-002 (glossário de tags, fila 3 do mapa) | alta |
| 3 | Web Design Responsivo: Criando sites que se adaptam a qualquer tela | capa | sem fonte (apoio: módulo 2 do programa 1) | média |
| 4 | JavaScript para Iniciantes: A Base da Web Moderna | capa | DOC-001 (exercício "Vitrine a partir de JSON", fila 2 do mapa) | alta |
| 102 | Next.js e Tailwind CSS: Performance e Estilo na Prática | capa | sem fonte (mapa 4.1: acervo não cobre Next.js) | baixa |
| 103 | Vue.js 3: Guia Completo para Desenvolvimento Ágil | capa | sem fonte (mapa 4.1: não cobre Vue) | baixa |
| 104 | Estado Global com Redux e Context API em Aplicações Reais | capa | sem fonte | baixa |
| 201 | Aprenda UX/UI para criar interfaces modernas, criativas e funcionais | capa | sem fonte | baixa |
| 202 | Figma para Iniciantes: Do Protótipo ao Design System | capa | sem fonte | baixa |
| 203 | Psicologia das Cores e Tipografia aplicada ao Produto Digital | capa | sem fonte (apoio fraco: DOC-018, slides de terceiro) | baixa |
| 204 | UX Research: Métodos de Pesquisa para Validar Ideias | capa | sem fonte (apoio: DOC-006 briefing; EV-007 Matriz CSD, se houver material) | baixa |
| 301 | Back-end descomplicado: APIs, lógica de negócios e integração eficiente | capa | sem fonte (mapa 4.1: não cobre back-end) | baixa |
| 302 | Node.js e Express: Criando APIs RESTful Escaláveis | capa | sem fonte | baixa |
| 303 | Arquitetura de Microsserviços com Docker e Kubernetes | capa | sem fonte (mapa 4.1: não cobre Docker) | baixa |
| 304 | Python para Backend: Do Django ao FastAPI | capa | sem fonte | baixa |
| 401 | Banco de Dados na prática: SQL, NoSQL e modelagem para aplicações reais | capa | sem fonte (mapa 4.1: não cobre banco de dados) | baixa |
| 402 | PostgreSQL Avançado: Queries Complexas e Performance | capa | sem fonte | baixa |
| 403 | MongoDB: Do Zero ao CRUD em Aplicações NoSQL | capa | sem fonte | baixa |
| 501 | Produtos Digitais: da ideia ao lançamento com metodologias ágeis | capa | DOC-004 e DOC-006 (projeto final), DOC-007 (leitura complementar), fila 5 do mapa | média |
| 502 | Gestão de Backlog: Priorização para Product Owners | capa | sem fonte direta (apoio: DOC-006, escopo e MVP) | baixa |
| 504 | Métricas de Produto: North Star, OMTM e Retenção | capa | DOC-007 (fila 5 do mapa); apoio DOC-053 (indicadores) | média |
| 601 | Projetos Tech: desenvolva habilidades práticas com cases reais e colaborativos. | capa | sem fonte direta (apoio: DOC-004/006 como case; mapa 4.2 sugere `hd/programa-projetos`, hoje vazia) | média |
| 603 | Liderança Técnica: Como Gerir Equipes de Desenvolvedores | capa | sem fonte direta (apoio: DOC-003, mentoria de gestão, já usada no 602) | baixa |
| 604 | Git e GitHub Workflow: Colaboração em Projetos de Código Aberto | capa | sem fonte (apoio: DOC-003, seção GitHub Projects citada no mapa 3.5) | média |
| 701 | English for Tech: aprimore seu inglês focado em carreira e programação | capa | DOC-035 (referência citada; conteúdo escrito do zero), fila 4 do mapa | alta |
| 702 | Vocabulary for Developers: Termos Técnicos e Documentação | capa | sem fonte | baixa |
| 703 | Job Interview Prep: Como Passar em Entrevistas de TI em Inglês | capa | sem fonte direta (apoio: DOC-008, DOC-025, já usados em artigos) | baixa |
| 704 | Daily Scrum English: Melhore sua Comunicação em Daily Meetings | capa | sem fonte | baixa |
| 404 | (era "Segurança de Dados: Protegendo Bancos contra Invasões") | convertido em 27-28/10 (fora do escopo) | DOC-010, DOC-011, DOC-028 | — |
| 503 | (era "MVP na Prática: Como Validar seu Produto com Baixo Custo") | convertido em 27-28/10 (fora do escopo) | DOC-004, DOC-006 | — |
| 602 | Scrum e Kanban: Agilidade na Gestão de Projetos Tech | convertido em 27-28/10 (fora do escopo) | DOC-003, DOC-022 | — |

Fora das capas, o mapa aponta como maior material de programa ainda não usado o **"Excel para indicadores operacionais"** (DOC-050, DOC-052, DOC-053), que não tem capa hoje; pode ocupar o lugar de uma capa de Data Base sem fonte (ex.: 401) se o Douglas preferir não aumentar o catálogo.

Resumo das capas: 4 com fonte direta no hd (2, 4, 501, 701; 504 com fonte parcial), 6 só com apoio parcial, 17 sem fonte.

## O que é seguro corrigir sem decisão

Correções de texto ou dado que não mudam navegação, aparência nem política:

- #5 e #6: `lessons`/`duration` do programa 1 ("21 passos", "10h estimadas").
- #7: "full-stack" no `letslearn` do programa 1.
- #8: `transitionText` do programa 1 sem "avaliações".
- #10: alinhar ementa (`moduleOverviews`) do programa 1 aos passos.
- #11, #12, #13: trocar fontes fracas por primárias e conferir o número de downloads do React; corrigir rótulo da fonte do 801.
- #16 e #17: padronizar quiz/fontes e preencher ou remover `companies`.
- #20 e #21: pontuação e padronização de títulos das capas.
- #24: "sucesso garantido" em `categorias.json`.
- #35: "curadoria e conteúdo autoral" nos termos.
- #37, #39, #40, #41: tempo de leitura, termos do Scrum Guide 2020, regência e tag dos artigos antigos.
- #38: fuso da data em `BlogOne.jsx`.
- #2: esconder "Acessar" em programa sem `enrollDetails`.
- #33: apagar `testimonialData.js` e `ReviewsCard.jsx` (código órfão).
- #42: acrescentar canal/autor nos itens de `mentorias.json`.
- Atualizar `programsData.js` para refletir os títulos de 404/503/602 e incluir o 901 (paridade; só o fallback).

## O que precisa de decisão do Douglas

- **Capas** (#1): manter as 27 no catálogo com "Em produção", ocultar as sem fonte, ou reduzir o catálogo às que têm fonte (2, 4, 501, 504, 701).
- **Imagens** (#3, #4, #18, #19): imagem nova do programa 1, crédito ou troca do pôster/vídeo do Curso em Vídeo, e migração do Pixabay para `/media/`.
- **Materiais prometidos** (#9): criar repositório e slides ou retirar da lista.
- **Emojis** (#15): padrão editorial.
- **Categorias** (#22, #23, #25): nome único para banco de dados (afeta a rota), criar "IA", destino das categorias sem programa, cards clicáveis e a página `/category` fixa.
- **Estatísticas** (#26): o que os números contam, ou remover.
- **Sobre** (#27): manter "cliente real" só com caso publicado.
- **Formulário e LGPD** (#28, #30, #31, #34): destino real do Fala aê, e-mail de contato, menção a Turnstile, Cloudflare, Vercel e YouTube, e revisão dos termos.
- **Área de membros** (#29): existe ou não; alinhar política, termos, FAQ, Fala aê, Recursos e `accessType`.
- **Identificação** (#32): obrigatória ou opcional, e o texto "sem cadastro".
- **Blog** (#36): rota `/blog` com a lista completa e limite na home.
- **Navegação entre programas, artigos e sites**: campos de trilha e links cruzados (seção UX).
