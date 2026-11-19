# Inventário de conteúdo estático do site bootcamps

Levantamento somente leitura em 28/10/2026, branch `feature/tasks-28-10-2026`. Nenhum arquivo do repositório foi alterado. Base: `bootcamps/src`, `bootcamps/public`, `bootcamps/index.html`, `learntech-content/content/bootcamps/eventos/*.json`, `learntech-content/media/bootcamps`, `learntech-content/src/schemas/bootcamps.ts` e os docs `02-contratos.md`, `11-mapa-editorial.md`, `revisao/bootcamps.md`. Seguindo a regra do dono, o que já está na API não foi revisado de novo; a revisão por evento está em `revisao/bootcamps.md`. Aqui só se registra o que existe no site, o que já está na API e o que falta acrescentar.

Classes usadas:

- CONTEÚDO-API: o dado já vem da API; o que existe no site é uma cópia local mantida à mão (reserva).
- CONTEÚDO-MIGRAR: conteúdo bom que só existe no site; deve ir para a API como está.
- CONTEÚDO-COMPLETAR: conteúdo aproveitável mas incompleto; vai para a API depois de completar.
- CONTEÚDO-REESCREVER: o tema vale, mas o texto atual é ruim; sai do site e volta reescrito a partir de fontes públicas confiáveis, com referências.
- REMOVER: rascunho, placeholder, dado falso ou material de terceiro; sai do site.
- COPY: texto de interface do site (títulos, botões, rodapé, mensagens); fica no código.

## 1. Como o site funciona

- Rotas (`src/app/router/AppRouter.tsx`): `/` (Home), `/event/:slug` (Detail), `*` (NotFound). O `vercel.json` reescreve tudo para `index.html`, mas a Vercel serve primeiro os arquivos estáticos. Por isso `/eventos-vivos/...` abre as páginas HTML próprias de `public/`.
- Dados: `useEvents` chama `eventApi.getAll()`, que faz `GET {VITE_API_URL}/v1/bootcamps/eventos.json`. `useEventBySlug` chama `eventApi.getBySlug()`, que faz `GET /v1/bootcamps/eventos/{slug}.json`. O tempo limite é de 5 s. `resolverMidia` troca `/media/...` pela URL absoluta da API. Se a API falhar, demorar, responder fora do formato ou se `VITE_API_URL` não estiver configurada, o site usa `src/entities/event/api/events.data.ts` (17 eventos, com imagens importadas de `src/assets/instituicoes/*.jpg`).
- Home: separa os eventos por `status` (`concluido` em "Concluídos", `desejado` em "Metas de estudo") e mostra um contador. Não há filtro por categoria nem busca.
- Detail: mostra capa, `longDescription`, Media Center (`videoUrl` + `gallery`), Edições (`editions`: ano, selo e highlight; a `image` não é exibida), ementa (`curriculum`, com título "Ementa dominada" ou "Plano de estudos" conforme o status) e a chamada final (`officialLink`, `certificate` via PDFViewer, `links`).
- `main.tsx` injeta o SDK de identificação da API (`carregarIdentificacao`).
- As páginas `public/eventos-vivos/bq-agenda-tech` e `public/eventos-vivos/byteclass.dev` são HTML/CSS/JS puro, sem ligação com a API. Só são alcançadas pelo botão de `officialLink` dos eventos 15 e 14, cujo valor está na API (`/eventos-vivos/.../index.html`, aceito pelo `caminhoDoSite` do schema).

## 2. Tabela de itens

### 2.1 Dados de eventos (src)

| item | arquivo/tela | o que é | usado? | já na API? | classe | destino na API | telas | observação |
|---|---|---|---|---|---|---|---|---|
| 15 eventos idênticos (42-sp, rocketseat-ignite, caelum-java, dio-santander-python, freecodecamp-js-algorithms, driven-fullstack, w3schools-referencia, xpeducacao-minicamp, curso-em-video-algoritmos, if-sudeste-mg-informatica, ufjf-dcc-cc-noturno, startse-techacademy, byteclass-dev, bq-agenda-tech, minas-summit) | `events.data.ts` / Home, Detail | reserva local | só como reserva | sim, iguais campo a campo | CONTEÚDO-API | `bootcamps/eventos/{slug}.json` (existe) | Home, Detail | Única diferença: a capa é `.jpg` local e na API é `.webp`. Em minas-summit muda só o caminho de `certificate` e de `editions[].image` |
| gdg-jf | `events.data.ts` | reserva local | reserva | sim | CONTEÚDO-API | existe | Detail | Na reserva local a galeria está vazia; a API tem 2 fotos |
| codexperience | `events.data.ts` | reserva local defasada | reserva | sim, e mais completo | CONTEÚDO-API | existe | Home, Detail | A reserva local está atrasada em `description`, `longDescription`, `videoUrl`, `gallery` (0 x 16), `curriculum`, `links` (3 x 8) e `editions` (0 x 3) |
| fator-s-challenge, hackathon-inovacao-social-jf, tdc-innovation, smc-2012, startup-way-challenge-2023 | só na API | eventos sem reserva local | sim, quando a API responde | sim | CONTEÚDO-API | existe | Home, Detail | Se a API cair, somem da Home e o detalhe deles dá 404 |
| 19 imagens `src/assets/instituicoes/*.jpg` | importadas em `events.data.ts` | capas (logos de instituições) | só na reserva | sim (`media/bootcamps/instituicoes/*.webp`, 18 arquivos) | CONTEÚDO-API | `media/bootcamps/instituicoes` | Home, Detail | São 4,1 MB que vão para o bundle só por causa da reserva. `minas-summit-2026.jpg` é um placeholder usado em todas as edições |
| `src/assets/arquivos/minas-summit-2025-certificado.pdf` | `events.data.ts` | certificado | só na reserva | sim (`media/arquivos/...pdf`) | CONTEÚDO-API | existe | Detail | São 644 KB que vão para o bundle |
| `src/assets/cubo.png`, `logo-icon-1.png`, `profile/profile.jpeg` | nenhum import | sobras | não | não | REMOVER | não se aplica | nenhuma | `profile.jpeg` é foto do autor. Se for usada um dia, o lugar é um perfil de autor na API (career/learn-tech), não o bootcamps |
| `src/assets/logo-icon.png` | MainLayout, Footer | marca learnTECH | sim | não | COPY | não se aplica | todas | Identidade visual do site |
| `types.ts` (enums `category`, `status`, `editions.status`) | modelo | contrato | sim | espelhado em `schemas/bootcamps.ts` | COPY (código) | não se aplica | todas | Mudar os enums exige mudar os dois lados (ver seção 3) |

### 2.2 Textos embutidos em componentes

| item | arquivo/tela | o que é | usado? | já na API? | classe | destino na API | telas | observação |
|---|---|---|---|---|---|---|---|---|
| Título e subtítulo da Home ("Eventos learnTECH", "Bootcamps, formações e encontros que atravessaram minha jornada técnica", "concluídos / no radar") | `Home.tsx` | chamada | sim | não | COPY | não se aplica | Home | Fica no código |
| Grupos "Concluídos" / "Metas de estudo" | `Home.tsx` | rótulos derivados de `status` | sim | não | COPY | não se aplica | Home | O rótulo "Metas de estudo" depende do enum. Com um novo estado (seção 3) vira mapa de rótulos no código |
| Selos de status "Concluído", "Meta", "Meta de estudo", "Realizada", "Anunciada" | `EventCard.tsx`, `Detail.tsx` | rótulos de enum | sim | não | COPY | não se aplica | Home, Detail | Mesmo caso |
| Títulos de seção "Media Center", "Highlights da jornada", "Edições", "Ementa dominada", "Plano de estudos", "Explorar esse ecossistema", "Pronto para conhecer?" | `Detail.tsx` | copy | sim | não | COPY | não se aplica | Detail | "Ementa dominada" é afirmação forte para eventos assistidos; é ajuste de copy, não de API |
| Frase do CTA "Acesse a plataforma oficial da {institution} para conferir os conteúdos e programas de formação" | `Detail.tsx` | copy com dado interpolado | sim | não | COPY | não se aplica | Detail | Não serve para eventos e notícias. Pode passar a variar conforme o tipo (seção 3) |
| Botões "Acessar a programação" / "Conhecer a programação", "Ver certificado", "Abrir certificado", "Abrir em nova aba", "Fechar", "Voltar", "Voltar ao topo", "Tentar de novo" | `CTAButton.tsx`, `PDFViewerButton.tsx`, `Detail.tsx`, `BackToTopButton.tsx`, `Home.tsx` | copy | sim | não | COPY | não se aplica | Detail, todas | Fica no código |
| Mensagem de erro "Falha ao carregar os bootcamps da learnTECH." | `useEvents.ts` | copy | quase nunca (a API cai na reserva) | não | COPY | não se aplica | Home | Fica no código |
| Página 404 ("Trilha Perdida", "Ops! Essa jornada ainda não foi mapeada.", texto e botão) | `NotFound.tsx` | copy | sim | não | COPY | não se aplica | 404 | Fica no código |
| Rodapé: descrição "Ecossistema de aceleração para desenvolvedores focado em tracks práticas e bootcamps intensivos.", "Connect with us", créditos e "Feito com React + TypeScript + Vite" | `Footer.tsx` | copy | sim | não | COPY | não se aplica | todas | A descrição não bate com o site (é um histórico pessoal, não uma aceleradora) e mistura inglês. É ajuste de copy |
| Redes do autor (GitHub, LinkedIn, Instagram douglasabnovato) | `Footer.tsx` | links pessoais | sim | não no bootcamps | COPY | opcional: perfil de autor compartilhado, se um dia existir na API | todas | Hoje fica no código |
| `<title>`, meta description e og do `index.html` ("Douglas Novato") | `index.html` | SEO | sim | não | COPY | não se aplica | todas | O nome diverge de "Douglas A. B. Novato" do rodapé e de "Abnovato" nos links |
| Rótulos de categoria (enum exibido cru em maiúsculas pelo `Badge`) | `Badge.tsx`, `EventCard.tsx`, `Detail.tsx` | sem mapa de rótulos | sim | o valor vem da API | COPY | não se aplica | Home, Detail | Não há lista de categorias nem filtros embutidos. Se o enum mudar, criar mapa de rótulos no código |
| `context.txt` | raiz do bootcamps | prompt de IA para o desenvolvimento | não (não é servido) | não | REMOVER (do repositório público) | não se aplica | nenhuma | Fala em "Instrutor da ByteClass" e em "mock que simula latência", o que está desatualizado |

### 2.3 BQ Agenda Tech (`public/eventos-vivos/bq-agenda-tech/`)

| item | arquivo/tela | o que é | usado? | já na API? | classe | destino na API | telas | observação |
|---|---|---|---|---|---|---|---|---|
| Proposta do evento ("é tomar café e entender de tecnologia"; integrar serviços/produtos ao universo tech para criar, validar e acelerar negócios; pilares Integração, Negócios e Comunidade) | `index.html` (hero, "Realização & Propósito"), `Readme.md` | descrição | sim | em parte (`description`/`longDescription` do evento 15 resumem a ideia) | CONTEÚDO-COMPLETAR | `bq-agenda-tech.json`: novos campos `proposta`/`pilares[]` ou acréscimo de texto | Detail | É conteúdo próprio e aproveitável. Falta: nome oficial (a página diz "BQ Café e Tecnologia", a API diz "BQ Agenda Tech") e a data |
| Formato e público ("Inscrições Gratuitas, Vagas Limitadas"; autônomos e devs; "Palestrantes do Mês", sugerindo edição mensal) | `index.html` | formato | sim | não | CONTEÚDO-COMPLETAR | campos novos `formato` (presencial, gratuito, periodicidade) e `publico` | Detail | Periodicidade e gratuidade não confirmadas |
| Local (BQ Spazio Coworking, Shopping Spazio Design, Ladeira Alexandre Leonel, 113, São Mateus, Juiz de Fora - MG, 36033-240; link de busca no Google Maps) | `index.html` (#local) | endereço | sim | não (só "BQ Spazio, em Juiz de Fora") | CONTEÚDO-MIGRAR | campo novo `local` {nome, endereco, cidade, mapaUrl} | Detail | Endereço público de um estabelecimento comercial; dado bom. O iframe do Maps tem parâmetro `pb` com ids aparentemente inventados (`0x6a0f000000000000`, `4v17000000000003`). Usar só o link de busca |
| Realização (Organização BQ Spazio + Douglas; apoiador "Vol"; parceiros "Marlon (Movie Maker)" e "Coffee Break") | `index.html`, `Readme.md` | créditos | sim | sim, por extenso no `longDescription` (Volta Express Brasil, Marlon) | CONTEÚDO-COMPLETAR | campo novo `realizacao[]` {papel, nome, url?, logo?, autorizado} | Detail | Faltam nomes completos, links e autorização dos terceiros. "Vol" está truncado |
| Programação / palestrantes ("Marcus" e "Lucas", tema "Aguardando Confirmação", fotos `./assets/inspiracao/homer-*.jpg`) | `script.js` (`speakersData`) | rascunho | sim (renderiza) | não | REMOVER | futuro `programacao[]`/`palestrantes[]` quando confirmado | Detail | Caminho quebrado: a pasta `assets/inspiracao/` não existe (os arquivos estão em `assets/imgs/`). As imagens são do personagem Homer (terceiro). Não há programação real |
| Formulário "Garanta sua vaga" (nome, e-mail, WhatsApp, stack) | `index.html` + `script.js` | inscrição | sim | não | REMOVER | futuro campo `inscricao` {url, aberta} apontando para Sympla/Google Forms etc. | página BQ | Não envia nada: faz `console.log` e mostra `alert` "Inscrição realizada com sucesso". Engana o visitante e coleta dado pessoal sem aviso de privacidade |
| Logos de "Realização & Apoio" (`assets/imgs/iron-1..3.jpg`) | `index.html` | imagens | sim (os arquivos existem) | não | REMOVER | `realizacao[].logo` com logos reais autorizados | página BQ | São cenas do filme Homem de Ferro (material de terceiro com direitos), usadas como logo de "BQ Spazio e Douglas" e de "Marlon" |
| Fotos do espaço (`bq-1..3.jpg`, `bq-agenda-tech-1/2.jpg`) e capturas `tela-1..6.jpg` | `assets/imgs` | imagens | não (nenhum HTML as referencia) | a capa da API é `instituicoes/bq-agenda-tech.webp` | REMOVER | só voltam como `gallery` se forem fotos próprias ou autorizadas | nenhuma | `bq-agenda-tech-1` e `bq-1` são fotos do coworking; `tela-1` é captura do site bq.escritorios. Material de terceiro sem autorização registrada |
| Logos `assets/logo/logo-1/2(.png, -removebg)` | `assets/logo` | identidade do evento | não referenciados | não | CONTEÚDO-COMPLETAR | `media/bootcamps/eventos/bq-agenda-tech/logo.webp` se for arte própria | Home, Detail (capa) | Conferir se é arte própria antes de publicar |
| Convites `convites/apoiador.html`, `palestrante.html`, `parceiro.html` | páginas soltas | cartas-convite | não ligadas pelo site | não | REMOVER (do site público) | não se aplica | nenhuma | Copy comercial. Os 6 botões apontam para `wa.me/SEUNUMERO`. O texto ("Vitrine qualificada", "decisores") é material de prospecção, não conteúdo do ecossistema |
| `Readme.md` (checklist do projeto) | pasta | notas internas | servido publicamente como arquivo | não | REMOVER (do `public/`) | não se aplica | nenhuma | Checklist marcando como feitas coisas que não estão (palestrantes, inscrições) |
| Rodapé "© 2026 BQ Café e Tecnologia", favicons próprios | `index.html`, `public/` | copy/marca | sim | não | COPY | não se aplica | página BQ | Some junto com a página |

O que existe de conteúdo aproveitável no BQ: a proposta (café + tecnologia para aproximar serviços e produtos do mundo tech e gerar negócios), os três pilares, o formato pretendido (presencial, gratuito, vagas limitadas, palestrantes convidados), o local com endereço completo e a lista de papéis da realização (organização, apoio, parceiro audiovisual, coffee break).

O que é rascunho: data ("Aguardando Data"), palestrantes e temas, fotos Homer com caminho quebrado, logos do Homem de Ferro, WhatsApp `SEUNUMERO`, formulário que não envia e finge sucesso, iframe de mapa com id inventado, fotos e capturas do site da BQ, convites e Readme.

### 2.4 ByteClass (`public/eventos-vivos/byteclass.dev/`)

| item | arquivo/tela | o que é | usado? | já na API? | classe | destino na API | telas | observação |
|---|---|---|---|---|---|---|---|---|
| Proposta e slogan ("A cada Byte construindo seu futuro"; escola de formação prática com mentoria presencial/híbrida) | `index.html`, `readme.md` | descrição | sim | sim (`byteclass-dev.json`, `description`/`longDescription`) | CONTEÚDO-API | existe | Detail | Não revisado aqui (já está na API). Em `revisao/bootcamps.md` está como "fraco" e com decisão pendente do dono |
| Níveis M1-M5 (título, descrição, nível de saída) | `main.js` (`trainingTracks`), `readme.md` | trilha | sim | sim, como `curriculum` (5 itens) | CONTEÚDO-API | existe | Detail | Os rótulos de saída ("Iniciante", "Estudante", "Developer", "Senior Path", "Ready for Market") são copy da landing |
| Trilhas Frontend/Backend/Fullstack com stacks (React, Vue, Tailwind; Node, PHP/Laravel, Python) | `readme.md`, botões de filtro | trilhas | os filtros não filtram nada (o código só troca a classe "active") | sim, por extenso no `longDescription` ("3 trilhas") | CONTEÚDO-COMPLETAR | campo novo `trilhas[]` {nome, foco, tecnologias[]} | Detail | O filtro da landing é decorativo |
| "27 tecnologias" (lista no `main.js`) | `main.js` (`technologies`) | stack | sim | só o número, no texto | CONTEÚDO-COMPLETAR | campo novo `tecnologias[]` com nomes que batam com `tools/ferramentas.json` | Detail; cruzamento com tools | A lista mistura "Glassmorphism" e "UI/UX" (técnica e área, não tecnologia). Sem esses dois são 25 |
| Local (Edifício Stella Central, Sala 902, Juiz de Fora; atendimento seg-sex 9h-18h) | `index.html` | sede | sim | sim (endereço no `longDescription`) | CONTEÚDO-COMPLETAR | campo novo `local` | Detail | Sede física e horário não confirmados (decisão pendente em `revisao/bootcamps.md`) |
| Timeline "On the Road" (Jan/2026 Meetup Dev JF, Fev/2026 Workshop Full Stack, Mar/2026 BQ Café e Tecnologia) | `index.html` | agenda | sim | não | REMOVER (ou COMPLETAR se confirmado) | se confirmados, viram eventos próprios ou `editions[]` | Detail | O BQ de março/2026 contradiz o BQ "sem data". Sem prova de que aconteceram |
| Depoimentos ("A experiência na Sala 902 mudou meu mindset..." — "Aluno ByteClass"; "Aluno em Destaque, Contratado via ByteClass") | `index.html` | prova social | sim | não | REMOVER | não se aplica | página ByteClass | Depoimentos sem autor identificável. Publicar como reais seria publicar prova social inventada |
| Contatos (`wa.me/seu-numero`, `wa.me/seu-numero-aqui`, "(32) 99999-9999", `contato@byteclass.dev`, `instagram.com/byteclass`, links `#` de "Sobre", "Portal do Aluno (Em breve)", "Trabalhe Conosco" e redes "GH IN LI") | `index.html` | contato | sim | não | REMOVER | se reais: `links[]` do evento | página ByteClass | Placeholders e links mortos. O domínio e o Instagram não foram conferidos (a rede para sites externos está bloqueada) |
| Formulário "Assine o Daily Code e receba a Grade M1-M5 (PDF)" | `index.html` | captação | sim | não | REMOVER | não se aplica | página ByteClass | `<form>` sem `action` e sem JS: recarrega a página. O PDF da grade não existe |
| Ilustrações (`byteclass_hero`, `tech_wall_bg`, `jornada_mapa`, `aluno_focado`, `edificio_stella`, `byteclass_rocket`) | `assets/` | imagens pixel art (6 PNG, cerca de 11 MB) | sim | a capa da API é `instituicoes/byteclass-dev.webp` | CONTEÚDO-COMPLETAR (só `jornada_mapa` e `byteclass_hero`, se forem arte própria) | `media/bootcamps/eventos/byteclass-dev/*.webp` em `gallery` | Detail | São ilustrações, não fotos: `edificio_stella.png` não mostra o prédio real, e a landing usa como "Infraestrutura Sala 902". Converter para webp. Origem/licença não registrada |
| `readme.md` (inclui "Panfletos originais" e copywriting) | pasta | notas | servido publicamente | não | REMOVER (do `public/`) | não se aplica | nenhuma | Tem a menção "Mentoria com quem vive o mercado (Douglas Novato, CTO)". O texto dos panfletos é a fonte das trilhas, que já estão na API |

O que existe de conteúdo aproveitável na ByteClass: a proposta e o slogan, os níveis M1-M5 (já na API), as 3 trilhas com suas stacks, a lista de tecnologias (depois de limpa), o local e o horário (a confirmar) e talvez o mapa da jornada como imagem.

O que é rascunho: WhatsApp e telefone de exemplo, links `#`, Instagram e e-mail não conferidos, formulário sem envio, PDF inexistente, filtros que não filtram, depoimentos sem autor, timeline Jan-Mar/2026 sem prova, ilustrações vendidas como foto da sede, "Portal do Aluno (Em breve)".

### 2.5 Outros arquivos de `public/`

| item | arquivo/tela | o que é | usado? | já na API? | classe | destino na API | telas | observação |
|---|---|---|---|---|---|---|---|---|
| favicons, `site.webmanifest`, `apple-touch-icon` | `public/` | marca | sim | não | COPY | não se aplica | todas | Fica no código |

## 3. Propostas de campos e tipos novos (só acréscimos; os campos atuais não mudam)

Todos opcionais em `eventoSchema` e espelhados em `types.ts`, para não quebrar o site atual nem a validação do `eventApi.ts`.

1. `tipo`: `formacao | evento | comunidade | processo-seletivo | referencia | iniciativa-propria`. Permite trocar a copy do CTA e dos títulos ("Ementa dominada" x "Programação") sem mexer no `status`. Telas: Home (agrupamento opcional), Detail.
2. `papel`: `participante | organizador | staff | palestrante | candidato | fundador`. Resolve BQ e ByteClass (organizador/fundador) e 42-sp (candidato) sem criar um terceiro `status` agora. Tela: Detail (selo).
3. `periodo`: {`inicio`: "AAAA-MM", `fim`?: "AAAA-MM"} ou `ano`. Hoje só 9 de 22 eventos têm data, e só no texto. Telas: card e Detail.
4. `local`: {`nome`, `endereco`?, `cidade`, `uf`, `mapaUrl`? (urlAbsoluta), `online`?: boolean}. Primeiro uso: BQ (endereço completo da página) e ByteClass (a confirmar). Depois: CodeXperience, Fator S, Hackathon. Tela: Detail (nova seção "Onde").
5. `realizacao[]`: {`papel`: organizacao | apoio | parceiro | patrocinio, `nome`, `url`?, `logo`? (urlOuMidia), `autorizado`: boolean}. O build publica só os itens com `autorizado: true`. Primeiro uso: BQ. Tela: Detail.
6. `programacao[]`: {`data`?, `horario`?, `titulo`, `palestrante`?, `url`?}. Vazio até haver confirmação. Serve para a próxima edição do BQ e para trilhas assistidas (Minas Summit, TDC). Tela: Detail.
7. `inscricao`: {`url` (urlAbsoluta), `aberta`: boolean, `ate`?: data}. Substitui os formulários falsos por link para uma plataforma real. Tela: Detail (botão, só se `aberta`).
8. `trilhas[]`: {`nome`, `foco`, `tecnologias[]`} e `tecnologias[]` (strings que batam com os nomes de `tools/ferramentas.json`, para link cruzado com o site tools). Primeiro uso: ByteClass.
9. `certificates[]`: lista de {`ano`, `url`, `label`}, mantendo o `certificate` atual por compatibilidade. Resolve o Minas Summit 2024 e o CodeXperience 2023 (pendências do mapa 11).
10. `paginaPropria`: em vez de `officialLink` apontar para `/eventos-vivos/...`, o Detail passa a renderizar a página do evento com os campos 4 a 8. Com isso as duas landings estáticas podem sair de `public/` e o `caminhoDoSite` deixa de ser necessário (manter no schema até migrar).

Nenhum tipo novo é necessário para BQ e ByteClass se os campos acima entrarem em `evento`. Alternativa, caso o dono não queira a ByteClass como "evento vivido": tipo novo `iniciativa` (`content/bootcamps/iniciativas/{slug}.json`) para projetos próprios (ByteClass, BQ), com os mesmos campos `local`, `realizacao`, `trilhas`, `inscricao`. Isso exige endpoint novo e uma tela ou seção nova no bootcamps.

Reserva local: gerar `events.data.ts` a partir do build do learntech-content (ou trocar por um JSON copiado de `dist/`) em vez de mantê-lo à mão. Isso elimina as divergências de codexperience e gdg-jf e a ausência dos 5 eventos, e permite tirar os 4,7 MB de `src/assets/instituicoes` e `src/assets/arquivos` do bundle (a reserva pode apontar para URLs absolutas da API ou não ter imagem).

## 4. Riscos

1. Formulário enganoso no BQ: diz "Inscrição realizada com sucesso" sem gravar nada e pede nome, e-mail e WhatsApp sem aviso de privacidade. É o problema mais grave e está publicado. A página é aberta pelo botão do evento 15.
2. Material de terceiros com direitos: cenas do Homem de Ferro como logos da realização, imagens do Homer como palestrantes (caminho quebrado, mas os arquivos estão publicados em `public/`), fotos e capturas do site bq.escritorios. Tudo é servido publicamente, mesmo o que não é referenciado.
3. Prova social e dados inventados na ByteClass: depoimentos sem autor, "Contratado via ByteClass", telefone (32) 99999-9999, timeline Jan-Mar/2026 sem confirmação. Não migrar nada disso para a API.
4. Remover as páginas estáticas quebra o `officialLink` dos eventos 14 e 15 na API (CTA levaria a 404 no Vercel, porque o rewrite manda para o SPA e a rota cai no NotFound). Antes de remover, é preciso esvaziar `officialLink` ou trocar pela renderização via campos novos. Isso é uma alteração na API, e a regra atual é só acrescentar; o dono precisa autorizar.
5. Reserva local defasada: com a API fora, o site mostra 17 eventos em vez de 22, o CodeXperience antigo e 5 detalhes com 404. Se `events.data.ts` for apagado sem substituto, a Home fica vazia.
6. Campos novos precisam entrar ao mesmo tempo no `eventoSchema` (zod) e em `types.ts`. O `eventApi.getBySlug` só valida `slug`, `content` e `curriculum`, então campos extras não quebram o site, mas também não aparecem até o Detail ser alterado.
7. Terceiros nomeados sem autorização (Marlon, Lucas, Marcus, "Vol"/Volta Express, BQ Spazio como "organização principal"). O `realizacao[].autorizado` proposto evita publicar sem confirmação.
8. Identidade do autor inconsistente ("Douglas Novato" no `index.html` e nas páginas BQ/ByteClass, "Douglas A. B. Novato" no rodapé, "douglasabnovato" nos links). É copy, mas se repete nos textos da API.
9. Peso: 11 MB de PNG na ByteClass e 4,7 MB de imagens/PDF no bundle só por causa da reserva.
10. Verificação externa não feita: domínio `byteclass.dev`, Instagram `@byteclass` e o local real da BQ Spazio não foram conferidos (rede bloqueada). Os endereços vieram só das páginas.
11. Divergência com `revisao/bootcamps.md`: lá se diz que `iron-1..3.jpg` não existem. Na verdade os arquivos existem em `assets/imgs/` e carregam (o problema é o conteúdo, cenas de filme). O que está quebrado são as fotos `homer-*` (o caminho `assets/inspiracao/` não existe).
