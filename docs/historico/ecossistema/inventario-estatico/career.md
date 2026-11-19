# Inventário do conteúdo estático do career (para a API learntech-content)

Data: 28/10/2026. Branch `feature/tasks-28-10-2026`. Levantamento somente leitura: nenhum arquivo do repositório foi alterado.
Lidos: `career/index.html`, `detalhe.html`, `main.js`, `js/*.js`, `assets/`; `learntech-content/content/career/*.json`, `src/schemas/career-tools.ts`; `docs/ecossistema/02-contratos.md` (2.3), `11-mapa-editorial.md`, `12-paginas-de-detalhe.md`, `revisao/career.md`.
Regra aplicada: só conteúdo reutilizável vai para a API; copy do site fica no código; o que já está na API não foi revisado (ver `revisao/career.md`), só se aponta o que falta acrescentar.

## 1. Como o site funciona

- Página única `index.html` com quatro seções trocadas pelo menu (Oportunidades, Empresas, Devs, Currículos), banner de destaques no topo, busca, paginação "Carregar mais" e um modal de empresa. `detalhe.html#tipo=empresas|vagas|perfis&id=<slug>` mostra a página de detalhe de um item da API.
- Fluxo de dados (`main.js` -> `catalog.js` -> `app.js`):
  1. O app nasce com as listas locais (`good-companies.js`, `jobs.js`, `perfis-dev.js`, `curriculos.js`) e o banner local (`launchBanner`).
  2. Em paralelo busca `/v1/career/{empresas,vagas,perfis,destaques}.json`. Se a resposta chega (1,5 s ou depois), `App.usarCatalogo` **substitui** empresas, vagas e perfis pelas listas da API e monta o banner a partir de `destaques.json`. Os currículos continuam sempre locais.
  3. Card com `slug` + `detalhe` abre `detalhe.html` (só API, sem contingência local). Card com `id === "brq"` abre o modal. Os demais abrem `site_url` em nova aba.
- O modal (`company-modal.js`) lê **sempre** a lista local `companies` e as vagas locais `companyOpportunities`. Como a BRQ não existe na API, com a API no ar o card da BRQ some e o modal fica inalcançável; ele só aparece quando a API falha.
- Currículos: seção em acordeão (`curriculos-render.js`), sem download, impressão nem orientação; só exibe o currículo preenchido. A busca procura em nome, título, localização, objetivo e resumo.

## 2. Tabela de itens

Classes: CONTEÚDO-API (já na API; o local é cópia manual) | CONTEÚDO-MIGRAR | CONTEÚDO-COMPLETAR | CONTEÚDO-REESCREVER | REMOVER | COPY.

| # | Item | Arquivo | O que é | Usado? | Já na API? | Classe | Destino na API | Telas | Observação |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 15 empresas antigas (Guiando ... Gupy) | `js/good-companies.js` | Lista de empresas (title, location, thumb, site_url, category) | Só como contingência quando a API falha | Sim, idênticas campo a campo | CONTEÚDO-API | `career/empresas.json` (já está) | index, seção Empresas | Local não tem as 10 que só a API tem: Cadastra, BairesDev, Itaú Unibanco, XP Inc., Serasa Experian, SERPRO, Pitang, Le Wagon, Digital House, Netuno. Contingência diverge da API |
| 2 | BRQ Digital Solutions (dados do modal) | `js/good-companies.js` (item `id: "brq"`), renderizado por `js/company-modal.js` | Empresa com campos extras: `modal_thumb`, `career_url`, `description`, `about` (fundada em 1993), `areas` (5), `work_model`, `culture` (6), `development` (5), `highlights` (6: "Mais de 30 anos", "Mais de 2.500 profissionais"...) | Só sem API (some em produção); `highlights` nunca é exibido | Não | CONTEÚDO-COMPLETAR (migrar + completar) | `career/empresas.json` com `slug: "brq"` e `detalhe` (ver 3.1) | index (card), `detalhe.html` (substitui o modal) | Texto bom e coerente, mas sem fonte nem data; números e "fundada em 1993" precisam de fonte (site/LinkedIn da BRQ). Áreas em inglês (nomes de oferta da própria BRQ). Thumbs `brq.jpg`/`brq-logo.jpg` existem em `assets/` |
| 3 | Vagas da BRQ (3) | `js/company-opportunities.js` | Anúncios reais do LinkedIn: Full Stack Pleno (Angular/Node/IA), Full Stack (.NET/AWS), Front-end React (híbrido, Interlagos). Campos: title, location, work_model, contract, summary, description, technologies, requirements, differentials, url | Só no modal (inalcançável com API); `contract` nunca é exibido | Não | REMOVER | Nenhum. No máximo, link "Vagas na BRQ" (career_url) em `detalhe.links` | modal (a aposentar) | Sem data de captura nem validade; vagas do LinkedIn expiram em semanas (IDs 4471138920, 4473040330, 4474541873). Texto copiado/parafraseado do anúncio, com erro ("Domínio em Angular, Hooks" — Hooks é React). Duas têm local/modelo "Não informado"/"Consultar". O mapa editorial (11) já diz que vagas expiram e não devem ser listadas |
| 4 | 16 plataformas de vagas | `js/jobs.js` | Lista (title, duration, thumb, site_url, category) | Só contingência | Sim, idênticas | CONTEÚDO-API | `career/vagas.json` (já está) | index, seção Oportunidades | Local não tem Santander Open Academy (só API, com detalhe) |
| 5 | 12 perfis dev | `js/perfis-dev.js` | Lista de pessoas/canais | Só contingência | Sim, idênticos | CONTEÚDO-API | `career/perfis.json` (já está) | index, seção Devs | Sem divergência |
| 6 | `launchBanner` (seleção GeekHunter / Rocketseat / Filipe Deschamps) | `js/banner-data.js` | Seleção editorial de 3 itens do catálogo para o carrossel; reaproveita os itens das listas, não tem texto próprio | Só contingência (com API usa `destaques.json`) | Sim (`career/destaques.json`, mesmos 3 títulos) | CONTEÚDO-API | `career/destaques.json` (já está) | index, banner | Não é banner promocional nem copy: é curadoria de conteúdo. Os rótulos "Oportunidade", "Empresa", "Dev" e o botão "Conferir" (`banner.js`) são COPY. Se a BRQ for para a API, é candidata a destaque de empresa |
| 7 | Rótulos do banner ("Oportunidade", "Empresa", "Dev", "Conferir") | `js/banner-data.js`, `js/banner.js` | Copy da interface | Sim | Não | COPY | Fica no código | index | - |
| 8 | Currículos (3): Marina Alves Ferreira, Rafael Martins Silva, Lucas Augusto Ferreira | `js/curriculos.js` (933 linhas) | Currículos completos e fictícios preenchidos: id, nome, titulo, localizacao, contato {telefone, email, linkedin, github?, portfolio}, objetivo, resumo, competencias[{categoria, itens}], experiencias[{cargo, empresa, descricaoEmpresa?, periodo, local, modelo, atividades, tecnologias}], experienciaAnterior[{empresa, cargo, periodo}], projetos[{nome, descricao, tecnologias}], formacao[{curso, instituicao, periodo, status}], certificados[], idiomas[{idioma, nivel}], comunidade[] | Sim, sempre (seção Currículos) | Não (nem schema) | CONTEÚDO-REESCREVER | Novo tipo `career/modelos-curriculo.json` (ver 3.2) | index, seção Currículos (e, se quiser, `detalhe.html#tipo=modelos-curriculo`) | O tema vale (é a única seção com conteúdo próprio), mas o material atual é fraco: a seção se chama "Modelos" e só oferece **exemplos preenchidos**, sem dizer para quem serve cada modelo, sem dicas por seção, sem fontes. Incoerências: Rafael e Lucas têm o mesmo emprego atual ("Coordenador de Educação e Tecnologia, CodeLab Formação Digital, Ago/2025 – atual"); Marina tem curso técnico 2015–2016 depois de bolsista de desenvolvimento web 2012–2014; Lucas começa suporte em 2013 e técnico em 2014. Possíveis dados reais (ver 4). Projeto "Portal de carreira" descreve este próprio site |
| 9 | Rótulos das seções do currículo ("Objetivo", "Resumo profissional", "Contato", "Competências", "Experiência profissional", "Experiência anterior", "Projetos", "Formação", "Cursos e certificados", "Idiomas", "Comunidade") | `js/curriculos-render.js` | Copy da interface | Sim | Não | COPY | Fica no código | index | - |
| 10 | Títulos, subtítulos, rótulos e ações das seções (`secoes` em `app.js`: "Empresas Legais", "Plataformas Jobs", "Dev Profiles", "Modelos de Currículos", "Ver Empresa"...) | `js/app.js` | Copy | Sim | Não | COPY | Fica no código | index | Idiomas misturados já apontados em `revisao/career.md` (achado 26) |
| 11 | `index.html`: meta description/og, cabeçalho, menu, placeholder da busca, "Carregando...", "Carregar Mais", "Fim da lista.", rodapé ("Curadoria estratégica...", "CONNECT WITH US", redes sociais do Douglas, direitos), rótulos do modal ("Sobre a empresa", "Atuação", "Modelo de trabalho", "Cultura", "Desenvolvimento", "Oportunidades", "Ver carreiras", "Visitar empresa") | `index.html` | Copy e estrutura | Sim | Não | COPY | Fica no código | index | Não há lista fixa de conteúdo no HTML; todos os cards vêm do JS. Os rótulos do modal saem junto com o modal se a BRQ for para `detalhe` |
| 12 | Textos fixos de `detalhe.html` / `detalhe.js` (rótulos por tipo, "Voltar", "Vídeo sobre <título>", estados de erro) | `detalhe.html`, `js/detalhe.js` | Copy | Sim | Não | COPY | Fica no código | detalhe | Sem contingência local: sem API a página de detalhe não abre |
| 13 | Modal de empresa (componente) | `js/company-modal.js`, `css/company-modal.css`, bloco `#company-modal` em `index.html` | Código acoplado a `id === "brq"` | Inalcançável com API | - | REMOVER (depois da migração da BRQ) | Substituído por `detalhe.html` | - | Ação de código, não de conteúdo; só depois de a BRQ ter `detalhe` na API |
| 14 | Miniaturas `./assets/thumb_*` usadas pela API (15 empresas, 16 vagas, 12 perfis) | `career/assets/` | Mídia referenciada por caminho relativo dentro dos JSON da API | Sim | O caminho está na API; o arquivo está no site | CONTEÚDO-API (mídia) | Manter; opcionalmente mover para `/media/career/` | index | Acoplamento: apagar ou renomear um arquivo em `career/assets` quebra a thumb servida pela API |
| 15 | 18 miniaturas órfãs (`thumb_good-companies/good-companies.jpg`; `thumb_jobs/` catho, fiemg, indeed, infojobs, jfempregos, kenoby, linktree, meseems, meuredator, myiyo, senac, starofservice, suasaulasparticulares, vagas; `thumb_perfis-dev/` coca-cola, perfis-dev, playcode) | `career/assets/` | Restos de versões antigas | Não (nem no site nem na API) | Não | REMOVER (ou reaproveitar se Indeed/InfoJobs/Catho/Vagas.com voltarem) | - | - | Também sem referência no código do career: `assets/error/oops-404-error.{jpg,webp}` e 6 logos em `assets/logo/` (amarelo, roxo, vermelho, bootcamps-verde, career-laranja, tools-azul); podem ser usados por outro site do ecossistema, conferir antes de apagar |

## 3. Propostas de tipos e campos

### 3.1 BRQ em `empresas.json` (sem campo novo)

O `detalheSchema` atual comporta tudo. Mapeamento sugerido:

| Campo local | Destino |
|---|---|
| `id: "brq"` | `slug: "brq"` |
| `title`, `location`, `site_url`, `category` | iguais (padronizar `category` com a taxonomia que for decidida) |
| `thumb` (`./assets/thumb_good-companies/brq.jpg`) | `thumb` (o schema aceita `./assets/`; ou subir para `/media/career/brq.webp`) |
| `modal_thumb` | `detalhe.imagens[0]` (`/media/career/detalhe/brq.webp`, com `alt`) |
| `description` | `detalhe.resumo` |
| `about`, `work_model`, `areas`, `culture`, `development` | `detalhe.paragrafos` (reescritos em prosa, como no Pitang: o que a empresa faz, áreas, modelo Anywhere Office, desenvolvimento/BRQ Academy, como se candidatar) |
| `highlights` | Entram no texto só com fonte; senão saem |
| `career_url` | `detalhe.links` ("Carreiras na BRQ") |
| (novo) | `detalhe.fontes` (página institucional e de carreiras da BRQ) e `detalhe.atualizadoEm` |
| `company-opportunities.js` | Não migra (REMOVER) |

Efeito: a BRQ volta a aparecer em produção, abre `detalhe.html` como as outras e o modal pode ser aposentado. Atualizar o contrato 2.3 (os campos `id`, `modal_thumb`, `about`... deixam de existir).

### 3.2 Novo tipo `career/modelos-curriculo.json`

Objetivo: transformar "currículos de exemplo" em **modelos que ensinam**, com dados claramente fictícios e fontes públicas (por exemplo, guias de currículo de serviços públicos de emprego, universidades e plataformas de recrutamento), citadas no próprio item.

| Campo | Tipo | Obrigatório | Nota |
|---|---|---|---|
| `slug` | slug | sim | URL do detalhe |
| `title` | texto | sim | Nome do modelo, ex.: "Transição de suporte técnico para Customer Success" (usado no card, busca e banner) |
| `category` | texto | sim | Área (Produto, Front-end, Suporte, Dados...) |
| `nivel` | enum `estagio` \| `junior` \| `pleno` \| `senior` \| `transicao` | sim | Para quem serve |
| `paraQuem` | texto | sim | Uma ou duas frases: situação em que o modelo ajuda |
| `ficticio` | literal `true` | sim | O build recusa `false`; a tela mostra o aviso |
| `pessoa` | `{ nome, titulo, cidade }` | sim | Nome fictício; só cidade/UF |
| `contato` | `{ email, telefone?, linkedin?, github?, portfolio? }` | sim | Build exige `email` em `@example.com`, `telefone` no padrão `(00) 00000-0000`, links em `example.com`/`example.dev` |
| `objetivo`, `resumo` | texto | sim | - |
| `competencias` | `[{ categoria, itens[] }]` | sim | - |
| `experiencias` | `[{ cargo, empresa, descricaoEmpresa?, inicio: AAAA-MM, fim: AAAA-MM \| "atual", local, modelo: presencial\|hibrido\|remoto, atividades[], tecnologias[] }]` | sim | Datas estruturadas permitem conferir sobreposição e ordem no build |
| `experienciaAnterior`, `projetos`, `formacao`, `certificados`, `idiomas`, `comunidade` | como hoje | não | `formacao.status` como enum |
| `dicas` | `[{ secao, texto }]` | sim (min. 3) | O que faz o modelo valer: por que o objetivo está assim, como escrever atividades com resultado etc. |
| `fontes` | `[{ label, url }]` | sim (min. 1) | Referências públicas que embasam as dicas |
| `atualizadoEm` | AAAA-MM-DD | sim | - |

Consumo: `catalog.js` passa a buscar o quinto arquivo; `App.usarCatalogo` deixa de manter `curriculos` local; seção Currículos lê da API (acordeão atual ou card + `detalhe.html#tipo=modelos-curriculo`). Alternativa coerente com o mapa editorial ("guias de carreira são artigos"): as dicas longas viram artigo no blog do learn-tech com etiqueta "Carreira", e o modelo aponta para o artigo em `fontes`/`links`.

### 3.3 Oportunidades (vagas de empresa)

Não recomendo criar tipo agora (vagas expiram; decisão do mapa editorial). Se o Douglas quiser mesmo assim: tipo `career/oportunidades.json` com `empresaSlug`, `title`, `url`, `capturadaEm`, `validaAte` obrigatórios e o build ocultando as vencidas. Hoje não há nenhuma vaga datada para popular.

### 3.4 Contingência local

Após a migração, os arquivos locais (`good-companies.js`, `jobs.js`, `perfis-dev.js`, `launchBanner`) ou são gerados da API no build ou saem. Mantidos à mão, continuam divergindo (hoje: 10 empresas e 1 vaga só na API, BRQ só no local).

## 4. Riscos

1. **LGPD nos currículos.** Nomes fictícios e e-mails `@example.com`, mas telefones em formato válido de celular real ((31) 98845-2176, (19) 98742-3158, (19) 98652-4173), handles `linkedin.com/in/marinaalvesdev`, `rafaelmartinsdev`, `lucasferreiratech`, `github.com/marinaalvesdev` e domínios `.dev` que podem pertencer a pessoas reais. A trajetória (coordenação em edtech, CRM/Salesforce Marketing Cloud, "Portal de carreira" = este site) e o emprego repetido em dois currículos sugerem base em currículo(s) real(is) anonimizado(s). Até confirmar a origem: não publicar na API como está; no reescrito, usar só placeholders inválidos e aviso visível de dado fictício.
2. **Publicar na API amplia o alcance.** O que hoje está só no JS do site passa a ser servido a qualquer consumidor; dados pessoais ou anúncios de terceiros copiados ficam mais expostos.
3. **Texto copiado de anúncio.** As vagas da BRQ parafraseiam anúncios do LinkedIn (direito autoral do anunciante e informação vencida); por isso REMOVER.
4. **Afirmações sem fonte sobre empresa** ("Mais de 2.500 profissionais", "fundada em 1993", "Atuação internacional"): só entram no `detalhe` com fonte e `atualizadoEm`.
5. **Regressão na migração da BRQ.** Hoje o card da BRQ depende de `id === "brq"` em `app.js`; ao migrar, retirar o desvio do modal junto, senão um item da API com `id` qualquer abriria um modal sem dados.
6. **Acoplamento de mídia.** A API aponta para `./assets/...` do site; limpar `career/assets` sem cuidado quebra thumbs da API. Só apagar as 18 órfãs listadas.
7. **Sem contingência no detalhe.** `detalhe.html` depende só da API; com a BRQ indo para lá, ela também deixa de ter versão offline (aceitável, mas é mudança de comportamento).
8. **Datas que envelhecem.** Modelos de currículo com "atual" e datas fixas ficam velhos; `atualizadoEm` e revisão periódica.

## 5. Itens por classe

- **CONTEÚDO-API (cópia local manual):** 15 empresas antigas de `good-companies.js`; 16 plataformas de `jobs.js`; 12 perfis de `perfis-dev.js`; `launchBanner` (= `destaques.json`); miniaturas `./assets/thumb_*` referenciadas pela API.
- **CONTEÚDO-MIGRAR:** nenhum puro (a BRQ migra, mas precisa ser completada).
- **CONTEÚDO-COMPLETAR:** BRQ (dados do modal) -> `empresas.json` com `slug: "brq"` + `detalhe` com fontes e data.
- **CONTEÚDO-REESCREVER:** 3 currículos de `curriculos.js` -> novo tipo `career/modelos-curriculo.json` (fictícios explícitos, dicas, fontes).
- **REMOVER:** 3 vagas da BRQ (`company-opportunities.js`); modal de empresa (após migrar a BRQ); 18 miniaturas órfãs.
- **COPY:** textos de `index.html` (menu, busca, rodapé, metas, rótulos do modal); `secoes` de `app.js`; rótulos do banner; rótulos de seção de `curriculos-render.js`; textos de `detalhe.html`/`detalhe.js`.
