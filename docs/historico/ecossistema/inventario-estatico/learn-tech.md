# Inventário do conteúdo estático do learn-tech

Data: 28/10/2026. Branch: `feature/tasks-28-10-2026`. Método: só leitura de `learn-tech/src` e `learntech-content` (conteúdo, schemas, docs). Nada foi alterado, sem npm nem git. Contagens locais obtidas avaliando os arquivos de `constants/` com Node (imports substituídos por stubs); contagens da API lidas dos JSON em `learntech-content/content/learn-tech/`.

Regra aplicada (Douglas): vai para a API só conteúdo reutilizável por outros projetos; o copy do site fica no código; a API não está em revisão (só acréscimos); as 11 páginas já publicadas não mudam agora.

## 1. Como o site funciona

**Rotas** (`App.jsx`, todas com `lazy`): `/` Home (Hero, Stats, Category, Programs, QuickAccess, Blog), `/programs`, `/program/:category/:id` (Detail), `/program/:category/:id/enroll` (EnrollPrograms: Description, TabContent, ModuleRenderer, Quiz), `/category` (CategoriesAll), `/blog/:id` (BlogOne), `/softskills`, `/mentorias`, `/resources` (Recursos), `/about`, `/aprender`, `/careers`, `/falaae`, `/terms`, `/privacy`, `*` NotFound. Navbar e Footer em todas.

Não roteadas (órfãs): `pages/account/sigin/SignIn.jsx`, `pages/account/signup/SignUp.jsx`, `pages/error/under-construction.jsx`. Link quebrado: `Blog.jsx:17` aponta para `/blogs`.

**Fluxo de dados** (`services/conteudo.js`):

- `buscarRecurso(caminho)` faz `fetch(${VITE_API_URL}/v1/${caminho})` com tempo limite de 5 s, cache em memória e deduplicação de requisições.
- `useApi(caminho, local, adaptar)` começa com o dado local (fallback do bundle), troca pelo da API quando chega e volta ao local se falhar (aviso no console). Sem `VITE_API_URL`, usa só o local.
- `hidratar` converte `icon: "FaCode"` em componente (via `constants/icones.js`) e `/media/...` em URL absoluta.
- `usePagina(nome, local)` lê `learn-tech/paginas/{nome}.json`; listas locais entram como `{ itens }`.
- `useProgramas()` lê `learn-tech/programas.json` (resumo); `usePrograma(id)` lê `learn-tech/programas/{id}.json`. Ambos passam por `comMidiaLocal`, que completa `video`, `videoPoster` e `image` com o local quando a API não tem, e deriva `status` (`statusDoPrograma`: com módulos = "lancado"; senão, status local ou "novidade").
- `services/identificacao.js` injeta `${API_URL}/sdk/identificacao.js` (identificação por nome/e-mail).

**Telas que leem da API**: Navbar (`navegacao`), About (`sobre`), Aprender (`aprender`), Career (`carreira`), Privacidade (`privacidade`), Termos (`termos`), FalaAe (`faq`), Blog e BlogOne (`blog`), Category da home (`categorias`), Stats (`estatisticas`), Mentorias e Softskills (`mentorias`, chaves `mentoriasData`/`softSkillsData`), Programs da home e `/programs` (`useProgramas`), Detail e EnrollPrograms (`usePrograma`; Description, TabContent, ModuleRenderer e Quiz recebem o programa por props).

**Telas que não leem da API** (texto fixo no JSX): Hero, QuickAccess, Recursos, CategoriesAll, partes fixas de FalaAe (motivos e formulário), Footer, NotFound, SignIn/SignUp/UnderConstruction (órfãs).

**Divergência cópia local x API** (o visitante vê catálogos diferentes conforme a API responda):

| Recurso | Local | API | Diferença |
|---|---:|---:|---|
| programas | 33 | 34 | 901 só na API |
| programas 404, 503, 602 | capas, `status: "novidade"`, 0 módulos; títulos antigos em 404 e 503 | completos: 5 módulos e 15 questões cada | sem API aparecem como "Em breve" |
| programa 1 | `video` YouTube e `image`/`videoPoster` locais; `quiz` = `quizData.js` | `video: null`; quiz de 18 questões | o quiz é idêntico (18 = 18, JSON igual); o vídeo só existe no front |
| `status` | presente em todos (3 "lancado", 30 "novidade") | ausente | derivado em `statusDoPrograma` |
| blog | 5 artigos | 18 | 13 só na API; os 5 locais existem na API |
| categorias | 11 | 12 | "Fundamentos" só na API; "IA" em nenhum dos dois |
| sobre, aprender, carreira, faq (10), navegacao (5), mentorias (4+4), privacidade, termos, estatisticas (23) | iguais | iguais | nenhuma (incluindo `lastUpdated`) |

## 2. Inventário

Legenda de classe: CONTEÚDO-API (já vem da API; o local é cópia manual), CONTEÚDO-MIGRAR, CONTEÚDO-COMPLETAR, CONTEÚDO-REESCREVER, REMOVER, COPY. Para as 11 páginas já na API a coluna "classe" registra também a natureza (copy ou conteúdo); nenhuma delas muda agora.

### 2.1 constants/

| item | arquivo/tela | o que é | usado? | já na API? | classe | destino na API | telas que consomem | observação |
|---|---|---|---|---|---|---|---|---|
| programsData | `constants/programsData.js` (2702 linhas) | catálogo de 33 programas (cards + 3 completos: 1, 101, 801) | sim, fallback de `useProgramas`/`usePrograma` e fonte de vídeo/imagem do programa 1 em `comMidiaLocal` | sim, `programas.json` e `programas/{id}.json` (34) | CONTEÚDO-API (conteúdo) | `learn-tech/programas` (existente) | Home Programs, `/programs`, Detail, EnrollPrograms | cópia defasada: falta 901; 404/503/602 como capa com título antigo; tem `status`, que a API não tem. Único acréscimo possível na API: mídia do programa 1 (ver 2.3) |
| quizData | `constants/quizData.js` (18 questões, módulos 0-5) | quiz do programa 1 | sim, só via `programsData` (`quiz: quiz1`) | sim, idêntico a `programas/1.json` `quiz` | CONTEÚDO-API (conteúdo) | já em `programas/1.json` | Quiz em EnrollPrograms | duplicata exata, não é um quiz independente; não precisa de tipo novo |
| blogData | `constants/blogData.js` | 5 artigos (4 antigos + `rotina-desenvolvedor`) | sim, fallback de Blog/BlogOne | sim, `paginas/blog.json` (18) | CONTEÚDO-API (conteúdo) | `paginas/blog` (existente) | Home Blog, `/blog/:id` | 13 artigos só na API |
| categoriesData | `constants/categoriesData.js` | taxonomia: 11 categorias (ícone, gradiente, título, slug, descrição) | sim, fallback da Category da home | sim, `paginas/categorias.json` (12) | CONTEÚDO-API (conteúdo: taxonomia) | `paginas/categorias` | Home Category | sem "Fundamentos"; mistura classes Tailwind (copy visual) com taxonomia |
| aboutData | `constants/aboutData.js` | hero, 4 passos do método, citação, 3 diferenciais | sim | sim, `paginas/sobre.json` | CONTEÚDO-API (natureza: COPY institucional) | `paginas/sobre` | `/about` | igual à API |
| aprenderData | `constants/aprenderData.js` | 4 técnicas de estudo (recuperação ativa, repetição espaçada, Feynman, prática deliberada) + 2 fontes | sim | sim, `paginas/aprender.json` | CONTEÚDO-API (natureza: conteúdo; hero e fecho são copy) | `paginas/aprender` | `/aprender` | igual; as 2 fontes (Dunlosky 2013, Karpicke & Blunt 2011) não cobrem Feynman nem prática deliberada |
| careerData | `constants/careerData.js` | hero, 4 pontos de planejamento (PDI, portfólio, rede), 6 plataformas de vaga, fecho | sim | sim, `paginas/carreira.json` | CONTEÚDO-API (natureza: misto, predominantemente copy) | `paginas/carreira` | `/careers` | as 6 plataformas duplicam o tipo `career/vagas`; Gupy, Vagas.com e We Work Remotely não existem em `career/vagas.json` (ver 2.3) |
| falaaeData | `constants/falaaeData.js` | 10 perguntas frequentes | sim | sim, `paginas/faq.json` | CONTEÚDO-API (natureza: COPY institucional) | `paginas/faq` | `/falaae` | FAQ fala do próprio produto, não é reutilizável |
| navbarData | `constants/navbarData.js` | 5 itens de menu | sim | sim, `paginas/navegacao.json` | CONTEÚDO-API (natureza: COPY) | `paginas/navegacao` | Navbar | menu é copy por definição |
| premiosData | `constants/premiosData.js` | 2 listas de 4 vídeos do YouTube cada: `softSkillsData` (soft skills) e `mentoriasData` (PDI, liderança), com título, descrição, `youtubeId`, `start` | sim | sim, `paginas/mentorias.json` | CONTEÚDO-API (natureza: conteúdo, curadoria de vídeos de terceiros) | `paginas/mentorias` | `/softskills`, `/mentorias` | não há prêmio nenhum: o nome vem do rótulo "Prêmios" do QuickAccess. Itens sem canal/autor (achado #42 da revisão) |
| privacyData | `constants/privacyData.js` | política de privacidade (8 seções) | sim | sim, `paginas/privacidade.json` | CONTEÚDO-API (natureza: COPY legal) | `paginas/privacidade` | `/privacy` | igual; ver riscos |
| termsData | `constants/termsData.js` | termos de uso (9 seções) | sim | sim, `paginas/termos.json` | CONTEÚDO-API (natureza: COPY legal) | `paginas/termos` | `/terms` | igual |
| statsData | `constants/statsData.js` | 23 cards "N+ tecnologia" (ex.: "3+ Javascript", "3+ Jira", "1+ Professores") com classes de cor e categoria | sim | sim, `paginas/estatisticas.json` | CONTEÚDO-API (natureza: COPY decorativo, de baixa qualidade) | `paginas/estatisticas` | Home Stats | números sem definição nem fonte e que não batem com o catálogo; não é conteúdo reutilizável. Fica como está agora; candidato a REMOVER da tela ou a ser calculado do catálogo quando a API voltar a ser revisada |
| testimonialData | `constants/testimonialData.js` | 6 depoimentos com nome e cargo, sem origem | não (nenhum import; `ReviewsCard` também não é importado) | não | REMOVER | nenhum | nenhuma | fictício e órfão; o programa 1 ainda promete "avaliações" (achado #8). Depoimento só volta se for real e autorizado (tipo proposto em 3.2) |
| icones | `constants/icones.js` | registro nome→componente dos ícones citados na API | sim, `hidratar` | não se aplica | COPY (código de suporte) | nenhum | todas as telas com `icon` vindo da API | ícone novo no conteúdo precisa entrar aqui |
| dados.test.js | `constants/dados.test.js` | teste dos dados locais | teste | não se aplica | COPY (teste) | nenhum | nenhuma | — |

### 2.2 Telas e componentes com texto ou listas fixas

| item | arquivo/tela | o que é | usado? | já na API? | classe | destino na API | telas que consomem | observação |
|---|---|---|---|---|---|---|---|---|
| Hero | `pages/home/hero/Hero.jsx` | chamada, título, texto "Acesso livre, sem cadastro", 2 botões, carrossel de 4 fotos | sim, `/` | não | COPY | nenhum | Home | "sem cadastro" conflita com a identificação obrigatória (#32) |
| QuickAccess | `pages/home/quickaccess/QuickAccess.jsx` | 2 cards: "Comportamentos / Soft Skills" e "Prêmios / Mentorias" | sim, `/` | não | COPY | nenhum | Home | rótulo "Prêmios" não corresponde ao conteúdo (vídeos de PDI) |
| Softskills | `pages/home/quickaccess/softskills/Softskills.jsx` | eyebrow e subtítulo longo fixos; lista vem da API | sim, `/softskills` | lista sim (`mentorias.softSkillsData`) | COPY (texto) + CONTEÚDO-API (lista) | `paginas/mentorias` | `/softskills` | subtítulo cita "três eixos" sem fonte; é copy |
| Mentorias | `pages/home/quickaccess/mentorias/Mentorias.jsx` | eyebrow e subtítulo fixos (SMART, 70/20/10); lista da API | sim, `/mentorias` | lista sim (`mentorias.mentoriasData`) | COPY (texto) + CONTEÚDO-API (lista) | `paginas/mentorias` | `/mentorias` | "é o que gestores de verdade usam" sem fonte (copy) |
| Recursos | `pages/recursos/Recursos.jsx` | hero, 6 recursos "já no ar", 4 itens de roadmap "em breve", CTA, faixa do Tools "42 ferramentas · 9 hospedagens" | sim, `/resources` | não | COPY | nenhum | `/resources` | roadmap do produto é copy por regra. Números do Tools defasados: a API tem 60 ferramentas e 11 hospedagens. Roadmap promete "área de membros", "certificado", "novas trilhas todo mês" (#29) |
| CategoriesAll | `pages/home/category/CategoriesAll.jsx` | "mapa do território": 5 áreas (Front, Back, Fullstack, Comportamentais e Método, Diferenciais), cada uma com 2-3 parágrafos, cards de categoria (título + descrição) e fecho | sim, `/category` | não (os cards repetem descrições de `categorias` em texto próprio) | CONTEÚDO-COMPLETAR | NOVO `learn-tech/areas.json` (ver 3.1) | `/category`; potencialmente career e bootcamps (explicar áreas de atuação) | texto bom e reutilizável, mas sem nenhuma fonte; cards divergem da taxonomia (tem "Fullstack", "Trabalho em equipe", "Performance"; não tem "Fundamentos" nem "IA"); repete "sucesso garantido". Completar: fontes públicas, cards por slug de `categorias`, tirar promessas |
| FalaAe (motivos/formulário) | `pages/falaae/FalaAe.jsx` | 5 motivos de contato com placeholders, formulário em 4 etapas, textos de confirmação | sim, `/falaae` | FAQ sim (`faq`); motivos não | COPY | nenhum | `/falaae` | o formulário só faz `setSubmitted(true)`: nada é enviado, mas o texto diz que "vai direto para a equipe" (#28) |
| Footer | `components/footer/Footer.jsx` | slogan, 7 links internos, 5 links externos (MIT OCW, CS50, freeCodeCamp, MDN, Stack Overflow), copyright em inglês | sim, todas | não | COPY | nenhum | todas | rodapé fica no código por regra; slogan fala em "livros e cursos" que o site não oferece; "Resolvemos Juntos" aponta para `/aprender` |
| Navbar | `components/nav/Navbar.jsx` | menu | sim | sim (`navegacao`) | CONTEÚDO-API (natureza: COPY) | `paginas/navegacao` | todas | — |
| Detail | `pages/detail/Detail.jsx` | rótulos ("Vamos aprender", "Currículo", "Fontes", "Materiais") e painel fixo "Este programa é aberto" com 4 promessas | sim | conteúdo do programa sim (`usePrograma`) | COPY | nenhum | `/program/:category/:id` | promessas fixas valem para todo programa: "do primeiro arquivo até a publicação" (falso para 801 e 901), "progresso salvo neste navegador" (só o quiz usa localStorage; o progresso dos módulos é `useState`), "sem cadastro" (#32) |
| Description | `pages/enroll/Description.jsx` | renderiza `enrollDetails` do programa | sim | sim | COPY (rótulos) | nenhum | enroll | em capa sem `enrollDetails` fica "Carregando conteúdo..." para sempre (#2) |
| EnrollPrograms | `pages/enroll/EnrollPrograms.jsx` | página do programa com barra de progresso e lista de módulos | sim | sim | COPY (rótulos) | nenhum | enroll | progresso só em memória |
| ModuleRenderer / TabContent / Tabs | `pages/enroll/tabContent/*`, `components/tabs/Tabs.jsx` | renderizam `moduleContents`; `ICONES` local de módulo | sim | sim | COPY (rótulos e mapa de ícones) | nenhum | enroll | — |
| Quiz | `pages/enroll/quiz/Quiz.jsx` | renderiza `program.quiz`, guarda respostas em localStorage | sim | sim | COPY (rótulos) | nenhum | enroll | — |
| Programs (lista) | `pages/programs/Programs.jsx`, `pages/home/programs/Programs.jsx`, `components/programs/ProgramsCard.jsx` | busca, filtro, "Ver mais", "Em breve"/"Aprenda" | sim | sim (`useProgramas`) | COPY | nenhum | `/programs`, `/` | placeholder em inglês ("Search programs...") |
| Blog / BlogOne / BlogCard | `pages/home/blog/*`, `components/blog/BlogCard.jsx` | lista e artigo; textos "Este conteúdo está em preparação", "Continue lendo" | sim | sim (`blog`) | COPY | nenhum | `/`, `/blog/:id` | "Veja todas" leva a `/blogs` (rota inexistente); a home lista os 18 |
| Category / CategoryCard | `pages/home/category/Category.jsx`, `components/category/CategoryCard.jsx` | cards de categoria | sim | sim (`categorias`) | CONTEÚDO-API | `paginas/categorias` | `/` | card parece clicável e não navega (#25) |
| Stats / StatsCard | `pages/home/stats/Stats.jsx`, `components/stats/StatsCard.jsx` | grade de estatísticas | sim | sim (`estatisticas`) | CONTEÚDO-API (natureza: COPY ruim) | `paginas/estatisticas` | `/` | ver statsData |
| About / Aprender / Career | `pages/about/About.jsx`, `pages/aprender/Aprender.jsx`, `pages/career/Career.jsx` | estrutura da página vem da API; títulos de seção, CTAs e faixas de links para bootcamps/career fixos | sim | dados sim | COPY (textos fixos) | nenhum | `/about`, `/aprender`, `/careers` | About diz "13 experiências catalogadas", a API tem 22 eventos em `bootcamps/eventos` |
| VideoGrid / VideoModal | `components/videoGrid/*` | grade e modal de vídeos (`youtube.com/embed`) | sim | não se aplica | COPY | nenhum | `/softskills`, `/mentorias` | embed com cookies do Google (#31) |
| PageTopBanner / Breadcrumb / LearnTechTitle / ScrollToTop | `components/*` | elementos de layout | sim | não se aplica | COPY | nenhum | várias | — |
| NotFound | `pages/error/not-found.jsx` | página 404 | sim, `*` | não | COPY | nenhum | rota `*` | cita "equipe de sucesso do cliente", que não existe; emoji no texto. Reescrever o copy no próprio código |
| UnderConstruction | `pages/error/under-construction.jsx` | página "em construção" | não (não está no `App.jsx`, nenhum import) | não | REMOVER | nenhum | nenhuma | órfã; promete "conteúdo fantástico" |
| SignIn / SignUp | `pages/account/sigin/SignIn.jsx`, `pages/account/signup/SignUp.jsx` | telas de login/cadastro em inglês | não (não roteadas) | não | REMOVER | nenhum | nenhuma | órfãs; "Sign Ip", link para `/forgot-password` inexistente; contradizem "sem cadastro" |
| ReviewsCard | `components/reviews/ReviewsCard.jsx` | card de depoimento | não | não | REMOVER | nenhum | nenhuma | par do `testimonialData` |
| VideoPlayerMP4 | `components/player/VideoPlayerMP4.jsx` | player de MP4 | não (nenhum import) | não se aplica | REMOVER (código órfão) | nenhum | nenhuma | — |
| Imagens órfãs | `assets/setups/*.avif` (6), `pages/home/hero/assets/*.JPG` (4), `pages/error/imgs/*.jpg` (2), `components/logo/assets/logo192.png`, `assets/logo/logo192.png` | imagens sem referência em `src` | não (grep sem ocorrência; `index.html` usa favicons de `public/`) | não | REMOVER | nenhum | nenhuma | conferir `public/` e build antes de apagar |

### 2.3 Itens pontuais de acréscimo (não mudam o que já está na API)

| item | arquivo/tela | o que é | usado? | já na API? | classe | destino na API | telas que consomem | observação |
|---|---|---|---|---|---|---|---|---|
| Mídia do programa 1 | `programsData.js:1-5,13-15` | vídeo YouTube `pWDF8csG9Qo` e pôster/imagem locais | sim, via `comMidiaLocal` | não (`video: null`) | CONTEÚDO-COMPLETAR | `programas/1.json` campo `video` (hoje nulo) + crédito em `sources` | Detail, EnrollPrograms; outros consumidores do programa | é acréscimo de campo vazio; depende de decisão sobre crédito e licença do vídeo do Curso em Vídeo (#4). Sem isso, a API não é fonte completa do programa (D16) |
| 3 plataformas de vaga | `careerData.js` `platforms` (Gupy, Vagas.com, We Work Remotely) | plataformas de vaga com descrição | sim, na página carreira | só dentro de `paginas/carreira.json`; não em `career/vagas.json` (17 itens) | CONTEÚDO-MIGRAR (opcional) | acrescentar 3 itens em `career/vagas.json` (`title`, `site_url`, `thumb`, `category`, `duration`) | site career; futuramente a página carreira poderia referenciar `career/vagas` | `thumb` precisa ser imagem servida pelo career ou por `/media/`; sem `site_url` no learn-tech hoje. Decisão do Douglas |

## 3. Proposta de novos tipos de conteúdo

### 3.1 `learn-tech/areas.json` (a partir de CategoriesAll) — recomendado

Recurso: `GET /v1/learn-tech/areas.json` (lista). Agrupa as categorias em áreas de atuação, com texto explicativo e fontes. Reutilizável por career (explicar áreas de vaga) e bootcamps (classificar formações).

| campo | tipo | observação |
|---|---|---|
| `id` | slug (`front`, `back`, `fullstack`, `comportamentais`, `diferenciais`) | estável |
| `title` | texto | "Técnicas do Front" |
| `subtitle` | texto | "O que as pessoas veem" |
| `icon` | nome de ícone (registrado em `icones.js`) | o gradiente fica no código |
| `paragraphs` | texto[] (mín. 1) | do JSX atual, revisado |
| `categorias` | slug[] de `paginas/categorias` | substitui os cards com descrição própria; o build pode conferir que cada slug existe |
| `closing` | texto, opcional | — |
| `sources` | `{ label, url }[]` (mín. 1) | obrigatório, para cumprir "fonte sempre creditada" |
| `updatedAt` | data `AAAA-MM-DD` | — |

O texto introdutório e o fecho da página (`/category`) continuam copy no JSX. Consumidor: `CategoriesAll.jsx` via `useApi("learn-tech/areas.json", local)`. Antes de publicar: decidir o que fazer com "Fullstack", "Trabalho em equipe" e "Performance" (não são categorias) e incluir "Fundamentos" e "IA".

### 3.2 `learn-tech/depoimentos.json` — só se houver depoimentos reais

Não há depoimento real hoje (o `testimonialData` é fictício). Se o Douglas coletar depoimentos, campos sugeridos: `id`, `nome`, `papel`, `texto`, `programaId` (opcional, referência a `programas`), `data`, `autorizacao` (booleano, obrigatório `true`), `origem` (onde foi coletado), `foto` (`/media/`, opcional). Consumidores: Detail (prova social do programa) e About.

### 3.3 Não são necessários agora

- **Quizzes**: já são parte de cada programa (`programas/{id}.json` `quiz`); `quizData.js` é cópia do programa 1. Um recurso separado só faria sentido se outro projeto quisesse quizzes sem o programa.
- **Glossário** e **trilhas**: não existem como conteúdo estático no site (nada a migrar). O mapa editorial aponta material no hd (DOC-002 glossário de tags) e a revisão sugere campos de trilha (`prerequisites`, `nextProgram`); são conteúdo novo, a escrever.

## 4. Riscos

1. **Fallback defasado**: sem API, somem o 901, 13 artigos e a categoria "Fundamentos", e 404/503/602 aparecem como "Em breve". Atualizar a cópia local ou removê-la (ADR de remoção dos fallbacks) é decisão pendente; enquanto houver cópia manual, qualquer acréscimo na API (inclusive o `areas.json`) aumenta a divergência.
2. **Números fixos no copy que dependem da API**: Recursos ("42 ferramentas · 9 hospedagens", API 60/11) e About ("13 experiências", API 22 eventos). Envelhecem a cada acréscimo; podem ser lidos de `tools/*.json` e `bootcamps/eventos.json` sem mudar a API.
3. **Promessas falsas em copy**: formulário do Fala aê não envia nada (e é o canal LGPD da política); painel do Detail promete progresso salvo e conteúdo "até a publicação" para todos; "sem cadastro" com identificação obrigatória; roadmap de "área de membros" contradiz a política. Fica no código, mas precisa ser corrigido no código.
4. **Conteúdo sem fonte** ao migrar CategoriesAll: publicar na API dá ao texto status de conteúdo reutilizável; sem fontes, contraria a regra editorial. Por isso a classe é COMPLETAR e `sources` é obrigatório no tipo proposto.
5. **Taxonomia inconsistente**: categorias no código (CategoriesAll), na API (`categorias`, 12) e nos programas (`categoryFilter` "ia", "data-base") não batem; um tipo `areas` que referencie slugs vai expor isso no build.
6. **Estatísticas**: `estatisticas.json` está na API como página, mas é copy decorativo com números sem significado; outro projeto que consumir esse recurso herda dados sem definição. Não muda agora, só registrado.
7. **Mídia do programa 1**: acrescentar o vídeo à API sem resolver crédito/licença publica para outros consumidores um conteúdo de terceiro sem atribuição.
8. **Remoções**: antes de apagar imagens órfãs, conferir referências fora de `src` (`public/`, `index.html`, CSS) e o build; `dados.test.js` pode depender de `testimonialData` (não depende hoje: grep sem ocorrência).
9. **Nome enganoso**: `premiosData`/"Prêmios" descreve vídeos de PDI e soft skills; se outro projeto consumir `paginas/mentorias`, as chaves `mentoriasData`/`softSkillsData` são nomes de variável do front, não um contrato claro.
