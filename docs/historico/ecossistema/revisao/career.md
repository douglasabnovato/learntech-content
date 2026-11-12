# Revisão editorial e técnica do career (conteúdo antigo)

Data: 28/10/2026. Revisão somente leitura. Nenhum arquivo do repositório foi alterado.
Fora do escopo: Pitang, Le Wagon, Digital House, Netuno e Santander Open Academy (itens novos com detalhe).

Fontes lidas: `learntech-content/content/career/{empresas,vagas,perfis,destaques}.json`, `learntech-content/src/schemas/career-tools.ts`, `career/index.html`, `career/js/{app,catalog,api,config,banner-data,good-companies,jobs,perfis-dev,company-modal,company-opportunities,curriculos}.js`, `learntech-content/docs/ecossistema/02-contratos.md` (2.3), `11-mapa-editorial.md` (3.6 a 3.8), `career/docs/claudeia/01-relatorio.md`.

Limite da conferência na web: o acesso direto aos sites foi bloqueado pelo proxy (curl e WebFetch sem resposta). A situação das plataformas foi conferida por busca em notícias. Os links de perfis, empresas pequenas e vagas da BRQ no LinkedIn não puderam ser abertos e ficam como "conferir no navegador".

## 1. Resumo

| Item | Número |
|---|---|
| Empresas antigas revisadas (API) | 21 (15 com thumb local em `./assets`, 6 com favicon do Google) |
| Empresa só local (BRQ, com modal) | 1, ausente da API |
| Plataformas de vagas antigas | 16 (iguais na API e no local) |
| Perfis | 12 (iguais na API e no local) |
| Destaques do banner | 3 (GeekHunter, Rocketseat, Filipe Deschamps), iguais na API e no local |
| Vagas da BRQ (`company-opportunities.js`) | 3 links do LinkedIn, sem data |
| Currículos (`curriculos.js`) | 3 modelos (Marina, Rafael, Lucas), só locais |
| Plataformas encerradas ou absorvidas, confirmadas por fonte | 2 (Polywork, Movile) |
| Itens com situação a conferir | 6 (Impulso, Trampos, Bossabox, Handcom, Viva Eventos, Revelo vagas) |
| Diferenças de paridade API x local | 7 itens (6 empresas só na API, BRQ só no local) mais 5 itens novos só na API (fora do escopo) |
| Imagens órfãs em `career/assets` | 18 arquivos sem referência no código |
| Achados na tabela | 30 |

Leitura geral: os dados estão íntegros e a API está em paridade com o local para vagas, perfis e destaques. Os problemas são de curadoria (critério da lista, itens desatualizados, duplicados entre seções), de rótulo (campo `duration` usado com sentidos diferentes, idiomas misturados) e de arquitetura (BRQ e currículos só locais, a BRQ some quando a API responde).

## 2. Tabela de achados

| # | Onde (arquivo e item) | Problema | Gravidade | Ação recomendada | Decisão do Douglas? |
|---|---|---|---|---|---|
| 1 | `career/js/app.js` `usarCatalogo` + `good-companies.js` item `brq` | Com a API ativa, `state.dados.companies` passa a ser a lista da API, que não tem a BRQ. O card da BRQ e o modal só aparecem quando a API falha. Hoje, em produção (API configurada em `config.js`), a BRQ provavelmente não aparece | Alta | Levar a BRQ para `empresas.json` com `slug` e `detalhe` (página de detalhe), ou decidir retirá-la. Aposentar o modal fixo em `id === "brq"` | Sim (manter a BRQ e com qual conteúdo) |
| 2 | `vagas.json` / `jobs.js` item Polywork | A Polywork mudou de produto em 2023 e foi descontinuada em janeiro de 2025 (fontes no fim) | Alta | Remover | Não |
| 3 | `vagas.json` / `jobs.js` item Movile (`movile.com.br/carreiras-movile`) | Em abril de 2023 o iFood incorporou a Movile, com demissão de quase toda a equipe restante. A página de carreiras da holding não faz mais sentido | Alta | Remover ou trocar por carreiras do iFood (como empresa, não como plataforma) | Sim (trocar por iFood?) |
| 4 | `curriculos.js` (3 currículos) | Nomes fictícios e e-mails `@example.com`, mas telefones com formato real e válido ((31) 98845-2176, (19) 98742-3158, (19) 98652-4173) e perfis `linkedin.com/in/...`, `github.com/...` e domínios `.dev` que podem pertencer a pessoas reais. Rafael e Lucas têm o mesmo emprego atual ("CodeLab Formação Digital, Ago/2025 – atual"), o que sugere base em currículos reais anonimizados | Alta (LGPD, se houver base real) | Confirmar a origem. Trocar telefones por formato claramente inválido (ex.: (00) 00000-0000), handles por `exemplo`, domínios por `.example`, e exibir o aviso "currículo fictício" na tela | Sim (origem dos dados) |
| 5 | `index.html` e `app.js` `secoes.companies` | O critério da lista é "Me contaram que essas empresas eram legais para trabalhar". Sem critério explícito, a lista mistura empresa local de Juiz de Fora, big tech, banco, órgão público (SERPRO, que contrata por concurso), plataforma de vagas (GeekHunter, Gupy, Revelo) e escola (Trybe, Rocketseat) | Média | Escrever um critério verificável (ex.: "empresas com página de carreiras ativa e vagas tech no Brasil") e um subtítulo em primeira pessoa honesto | Sim |
| 6 | `vagas.json` campo `duration` (16 itens) | O campo virou rótulo livre: "Atualizado", "Global", "Professional", "Local", "Específico", "Freelance/Projetos", "Comunidade", "Geral", "International", "Ecossistema", "Reviews/Jobs", "Plataforma", "Freelance", "Aulas". Mistura idioma, alcance, modelo e status. "Atualizado" não diz quando | Média | Renomear no schema para `tipo` ou `alcance` com valores fechados em português (ex.: Brasil, Global, Local, Freelance) e criar `revisadoEm` (AAAA-MM) | Sim (nome do campo e valores) |
| 7 | `perfis.json` campo `duration` e `category` | `duration` virou "especialidade" e repete a categoria em 4 itens (Seniority/Seniority, Architecture/Architecture, Fullstack/Fullstack, Frontend/Frontend) | Baixa | Usar `duration` como especialidade em português e `category` como tipo de perfil (pessoa, canal, comunidade) | Sim (padrão) |
| 8 | `empresas.json` `category` (21 itens) | Todas em inglês (Telecom Tech, Events Tech, Software House, Big Tech, Banking, Public Sector Tech...), enquanto o site é pt-BR. Granularidade desigual: "E-commerce" para Promobit (agregador de ofertas), "Customer Success" para SenseData, "Education" para Trybe e Rocketseat | Média | Taxonomia curta em português (ex.: Software, Fintech e banco, Educação, RH e recrutamento, Setor público, Saúde, Varejo) | Sim (taxonomia) |
| 9 | `empresas.json` `location` | "Remote" em 11 itens x "Remoto" na BairesDev; "Juiz de Fora / Remote" e "Global / Remote" misturam idiomas; "Remote" descreve modelo de trabalho, não local (a sede de Promobit, SenseData, TecnoSpeed, Revelo, Gupy etc. fica oculta) | Média | Separar `location` (cidade sede) de modelo de trabalho, ou padronizar em português ("Remoto") | Não (padronizar idioma); Sim (separar campo) |
| 10 | `empresas.json` itens GeekHunter, Gupy, Revelo | Os três também são plataformas de vagas. GeekHunter e Revelo aparecem nas duas listas (empresas e vagas). A GeekHunter foi comprada pela Howdy.com em 2023 | Média | Manter cada um em uma só seção. Sugestão: plataforma em vagas; empresa só se a intenção for "trabalhar na GeekHunter" | Sim |
| 11 | `empresas.json` `site_url` de Rocketseat, GeekHunter, Gupy | Apontam para páginas da Gupy (`*.gupy.io`). Funcionam como página de vagas, mas dependem do ATS (se a empresa trocar de ATS, o link quebra) | Baixa | Preferir a página de carreiras do próprio domínio, quando existir | Não |
| 12 | `empresas.json` `site_url` de BairesDev, XP Inc., Serasa Experian, SERPRO, ProDoctor, Guiando, Viva Eventos, Nova Tendência, Handcom, App Masters, Promobit, SenseData, TecnoSpeed, Revelo | Site institucional, não página de carreiras (a lista é de carreira). Só Trybe, Cadastra, Itaú, Google e os três `gupy.io` levam a carreiras | Média | Trocar por página de carreiras quando existir (ex.: BairesDev, XP, Serasa e SERPRO têm páginas próprias; conferir URLs) | Não |
| 13 | `empresas.json` Handcom (`http://v2.handcom.com.br/`) | URL sem HTTPS e com subdomínio "v2" (versão antiga do site). A partir da máquina do Douglas respondeu 403 | Média | Conferir no navegador; trocar por `https://` e domínio principal ou remover | Sim, se o site não existir mais |
| 14 | `empresas.json` Google Careers (`careers.google.com`) | Domínio antigo; o Google redireciona para `google.com/about/careers`. Título "Google Careers" é nome de página, não de empresa | Baixa | Trocar URL e título para "Google" | Não |
| 15 | `empresas.json` thumbs de Cadastra, BairesDev, Itaú, XP, Serasa, SERPRO | Usam `google.com/s2/favicons?...&sz=128`: imagem pequena e borrada no card, dependência externa e requisição ao Google a cada visita | Média | Baixar logos oficiais para `./assets/thumb_good-companies/` ou para a mídia da API (`/media/career/`) | Não |
| 16 | `empresas.json` Promobit | Comprada pela Méliuz em 2021; é agregador de ofertas, não empresa de tecnologia com destaque de carreira | Baixa | Conferir se ainda contrata dev de forma independente; categoria "E-commerce" imprecisa | Sim (manter?) |
| 17 | `vagas.json` Impulso (`app.impulso.team/painel`) | Link para painel logado. Não achei notícia de atividade recente da Impulso; o link não pôde ser aberto | Média | Conferir no navegador; se o painel exigir login ou estiver fora, remover | Sim |
| 18 | `vagas.json` Trampos (`trampos.co/oportunidades/?tr=desenvolvedor`) | Plataforma voltada a comunicação e criação; situação atual não confirmada | Média | Conferir no navegador | Sim, se inativa |
| 19 | `vagas.json` Bossabox (`app.bossabox.com/profile/jobs/active-products`) | A empresa quase fechou em 2022 e voltou ao breakeven em 2024 montando squads. O link aponta para área logada de perfil | Média | Trocar pelo domínio público (`bossabox.com`) e categoria "Squads"; conferir se ainda aceita profissionais | Não |
| 20 | `vagas.json` Revelo (`app.careers.revelo.com/#/international/...`) | Rota interna de app com `#`, frágil. O rótulo "International" indica a área de vagas no exterior; conferir se a rota ainda existe | Média | Trocar pela página pública de candidatos da Revelo | Não |
| 21 | `vagas.json` Superprof, Glassdoor, Abler | Superprof é marketplace de aulas, Glassdoor é avaliação de empresas, Abler é ATS. Não são plataformas de vagas tech no sentido do título "Plataformas Jobs" | Baixa | Criar categoria "Renda extra / Aulas" e "Pesquisa de empresa", ou retirar | Sim |
| 22 | `vagas.json` GeekHunter, Abler, 99freelas, Workana, Bossabox | `site_url` aponta para rotas internas (`/vagas`, `/app/vagas`, `/projects`, `/jobs`) | Baixa | Conferir se ainda abrem sem login | Não |
| 23 | `perfis.json` Rodrigo Branas (`app.branas.io/`) | Aponta para o app do curso (área de aluno), não para o perfil público | Baixa | Trocar por `branas.io` ou YouTube/LinkedIn público | Não |
| 24 | `perfis.json` Gabs Ferreira (`http://gabsferreira.com/`) | Sem HTTPS | Baixa | Conferir e trocar por `https://` | Não |
| 25 | `perfis.json` Programador BR, Código Fonte TV, O Dev Tá Ligado | São canais e marcas, não pessoas, numa seção chamada "Dev Profiles" | Baixa | Assumir a seção como "Referências" (pessoas e canais) ou separar | Sim |
| 26 | `index.html` e `app.js` textos | Idiomas misturados: "Plataformas Jobs", "Dev Profiles", "Empresas Legais", "CONNECT WITH US", "Ver Mais", "Carregar Mais". Placeholder da busca fala em "mentores", mas não há seção de mentores | Média | Padronizar em pt-BR: "Plataformas de vagas", "Perfis de referência", "Empresas", "Siga nas redes", "Ver mais", "Carregar mais" | Não |
| 27 | `index.html` rodapé | Os três links sociais estão preenchidos (GitHub, LinkedIn, Instagram de douglasabnovato), não vazios. O texto é "Todos os direitos reservados" sobre uma curadoria de links de terceiros | Baixa | Só traduzir o rótulo; conferir se o Instagram está ativo | Não |
| 28 | `company-opportunities.js` (3 vagas BRQ no LinkedIn) | Vagas reais sem data de captura nem de validade; vagas do LinkedIn expiram em semanas. Os dados da BRQ (`about`, "Mais de 2.500 profissionais", "Mais de 30 anos") não têm fonte nem data | Média | Mover para `detalhe` da BRQ na API com `fontes` e `atualizadoEm`; vagas viram links com data ou saem | Sim |
| 29 | Paridade API x local (`good-companies.js`) | Local tem 16 empresas (15 + BRQ); API tem 21 antigas. Faltam no local: Cadastra, BairesDev, Itaú Unibanco, XP Inc., Serasa Experian, SERPRO. Vagas, perfis e destaques estão idênticos (16, 12, 3) | Média | Decidir se o local é só contingência. Se for, gerar os arquivos locais a partir da API no build, para não divergir de novo | Sim (papel dos dados locais) |
| 30 | `career/assets/` | 18 imagens sem referência no código: `thumb_good-companies/good-companies.jpg`; `thumb_jobs/` catho, fiemg, indeed, infojobs, jfempregos, kenoby, linktree, meseems, meuredator, myiyo, senac, starofservice, suasaulasparticulares, vagas; `thumb_perfis-dev/` coca-cola, perfis-dev, playcode. Kenoby (comprada pela Gupy) e Linktree são restos de versões antigas | Baixa | Apagar ou reaproveitar se Indeed, InfoJobs, Catho ou Vagas.com voltarem à lista | Sim (voltar com algum?) |

## 3. Estado por lista

### 3.1 Empresas (21 antigas da API + BRQ local)

| # | Empresa | Estado | Motivo curto |
|---|---|---|---|
| 1 | Guiando | revisar | Site institucional; categoria "Telecom Tech" em inglês; critério local JF |
| 2 | Viva Eventos | revisar | Empresa pequena de eventos em JF; confirmar que contrata dev e que o site está ativo |
| 3 | Nova Tendência | revisar | Site institucional; categoria vaga ("Consultancy") |
| 4 | Handcom | revisar | `http://v2.` e 403 na checagem; pode estar fora do ar |
| 5 | App Masters | ok | Link em inglês (`/en`); trocar para versão pt ou página de carreiras |
| 6 | ProDoctor | ok | Trocar URL por página de carreiras, se houver |
| 7 | Promobit | revisar | Comprada pela Méliuz (2021); categoria imprecisa |
| 8 | SenseData | ok | Site institucional |
| 9 | TecnoSpeed | ok | Site institucional; "Remote" é modelo, sede é Maringá/PR (conferir) |
| 10 | Revelo | remover? | Duplicada em vagas; é plataforma, não empresa-alvo |
| 11 | Google Careers | revisar | URL antiga; título deveria ser "Google"; candidata a detalhe (mapa editorial DOC-043) |
| 12 | Trybe | ok | Link de carreiras; conferir se a página ainda existe |
| 13 | Rocketseat | ok | Destaque do banner; link Gupy |
| 14 | GeekHunter | remover? | Duplicada em vagas; comprada pela Howdy (2023) |
| 15 | Gupy | revisar | É ATS; link de carreiras próprio funciona como empresa, mas sobrepõe com o papel de plataforma |
| 16 | Cadastra | revisar | Favicon do Google; só existe na API; possivelmente a "agência de CRM" citada no mapa editorial (conferir antes de qualquer detalhe) |
| 17 | BairesDev | revisar | Favicon; "Remoto" x "Remote"; site institucional |
| 18 | Itaú Unibanco | revisar | Favicon; só na API |
| 19 | XP Inc. | revisar | Favicon; site institucional; só na API |
| 20 | Serasa Experian | revisar | Favicon; site institucional; só na API |
| 21 | SERPRO | revisar | Favicon; empresa pública (ingresso por concurso), destoa do critério |
| - | BRQ Digital Solutions (local) | revisar | Some quando a API carrega; dados sem fonte; candidata natural a página de detalhe |

Candidatas a página de detalhe: BRQ (já tem conteúdo pronto no modal), Google (fila do mapa editorial), Rocketseat (destaque do banner), e as empresas de Juiz de Fora se houver vivência do Douglas para contar (Guiando, ProDoctor, App Masters, TecnoSpeed).

### 3.2 Plataformas de vagas (16 antigas)

| # | Plataforma | duration | Estado | Motivo curto |
|---|---|---|---|---|
| 1 | Coodesh | Atualizado | ok | "Atualizado" sem data |
| 2 | GeekHunter | Atualizado | ok | Destaque do banner; comprada pela Howdy; duplicada em empresas |
| 3 | LinkedIn | Global | ok | - |
| 4 | Polywork | Professional | remover | Descontinuada em jan/2025 |
| 5 | Programadores JF | Local | revisar | Comunidade local; conferir se `programador.emjuizdefora.com` está ativo |
| 6 | Programathor | Específico | ok | Rótulo "Específico" sem sentido |
| 7 | Bossabox | Freelance/Projetos | revisar | Link de área logada; empresa mudou de modelo |
| 8 | Impulso | Comunidade | revisar | Link de painel logado; atividade não confirmada |
| 9 | Trampos | Geral | revisar | Situação não confirmada |
| 10 | Revelo | International | revisar | Rota interna com `#`; conferir |
| 11 | Movile | Ecossistema | remover | Incorporada pelo iFood em 2023 |
| 12 | Glassdoor | Reviews/Jobs | revisar | É avaliação de empresa; recategorizar |
| 13 | Abler | Plataforma | revisar | É ATS; rota interna |
| 14 | 99freelas | Freelance | ok | - |
| 15 | Superprof | Aulas | revisar | Marketplace de aulas, não vaga tech |
| 16 | Workana | Freelance | ok | - |

### 3.3 Perfis (12)

| # | Perfil | Tipo | Estado | Motivo curto |
|---|---|---|---|---|
| 1 | Tiago Gouvêa | pessoa pública | ok | Conferir link |
| 2 | Gabs Ferreira | pessoa pública | revisar | `http://` |
| 3 | Filipe Deschamps | pessoa pública | ok | Destaque do banner; "Clean Code" como especialidade é impreciso (conteúdo dele é notícias/carreira) |
| 4 | Lucas Montano | pessoa pública | ok | "Seniority" repetido em categoria |
| 5 | Rodrigo Branas | pessoa pública | revisar | Link para app do curso |
| 6 | Programador BR | canal/marca | revisar | Não é pessoa; conferir atividade |
| 7 | Código Fonte TV | canal | ok | Canal ativo e relevante; é canal, não pessoa |
| 8 | Tania Rascia | pessoa pública | ok | Único perfil internacional, conteúdo em inglês |
| 9 | O Dev Tá Ligado | canal/marca | revisar | Conferir atividade e relevância |
| 10 | Vinicius Gomes | pessoa pública | revisar | Domínio `vinniciusgomes.dev` com dois "n"; conferir |
| 11 | Mario Souto | pessoa pública | ok | "Next.js Expert" em inglês |
| 12 | João Fernando Baraky | pessoa pública | ok | - |

Todos os perfis são de pessoas ou marcas com presença pública; não há dado pessoal privado. O mapa editorial já registra que os perfis vieram de outra fonte, sem critério documentado.

### 3.4 Destaques do banner

| Destaque | Item | Estado | Motivo curto |
|---|---|---|---|
| vaga | GeekHunter | ok | Existe nas duas fontes; aparece também em empresas |
| empresa | Rocketseat | ok | - |
| perfil | Filipe Deschamps | ok | - |

`destaques.json` e `launchBanner` em `banner-data.js` têm os mesmos três títulos. Se a BRQ for para a API, é a candidata natural a destaque de empresa.

### 3.5 BRQ e currículos (só locais)

| Item | O que é | Dados de terceiros | Atualização | Destino sugerido |
|---|---|---|---|---|
| BRQ (`good-companies.js`, `company-modal.js`) | Empresa com modal de detalhe (sobre, áreas, cultura, desenvolvimento) | Só dados institucionais | Sem data e sem fonte | `empresas.json` com `slug: brq` e `detalhe` (fontes e `atualizadoEm`) |
| Vagas BRQ (`company-opportunities.js`) | 3 vagas reais do LinkedIn (Full Stack Pleno Angular/Node, Full Stack .NET, Front-end React) | Não | Sem data; vagas do LinkedIn expiram | Sair da lista ou virar links datados no `detalhe.links` |
| Marina Alves Ferreira | Modelo de currículo (produto e educação, BH) | Telefone e handles com formato real | Experiências até "atual" | Confirmar origem; anonimizar contatos |
| Rafael Martins Silva | Modelo de currículo (UX writing e frontend, interior de SP) | Idem | Datas até Fev/2026 | Idem |
| Lucas Augusto Ferreira | Modelo de currículo (suporte técnico, Campinas) | Idem | "Ago/2025 – atual" | Idem; indentação diferente dos outros dois no arquivo |

Os currículos não estão no schema nem na API. Como são conteúdo editorial longo, migrar só faz sentido se forem mantidos; nesse caso, um tipo `curriculo` próprio na API ou artigos no blog (seguindo a regra "guias de carreira são artigos" do mapa editorial).

## 4. Paridade API x dados locais

| Lista | API (antigos) | Local | Diferença |
|---|---|---|---|
| Empresas | 21 (+4 novas fora do escopo) | 16 | Local sem Cadastra, BairesDev, Itaú, XP, Serasa, SERPRO; API sem BRQ |
| Vagas | 16 (+1 nova fora do escopo) | 16 | Idênticos campo a campo |
| Perfis | 12 | 12 | Idênticos campo a campo |
| Destaques | 3 títulos | 3 títulos (`launchBanner`) | Idênticos |
| BRQ, vagas BRQ, currículos | - | só local | Não existem na API nem no schema |

Consequência prática: com a API no ar, a BRQ some; com a API fora, somem as 6 empresas novas antigas e os 5 itens com detalhe. O site mostra listas diferentes conforme a disponibilidade da API.

## 5. Seguro corrigir sem decisão

- Remover Polywork (descontinuada).
- Padronizar rótulos da interface em pt-BR (achado 26) e "CONNECT WITH US".
- Trocar `careers.google.com` pela URL atual e `http://` por `https://` onde o site responder em HTTPS (Gabs Ferreira, Handcom se existir).
- Trocar links de áreas logadas por páginas públicas (Bossabox, Revelo vagas, Rodrigo Branas, Impulso se existir).
- Padronizar "Remote"/"Remoto" e o idioma de `location`.
- Baixar logos para substituir os 6 favicons do Google.
- Trocar `site_url` institucional por página de carreiras quando ela existir no domínio da empresa.
- Copiar as 6 empresas que faltam no local (ou gerar o local a partir da API), para a contingência ficar igual à API.
- Listar e apagar as 18 imagens órfãs (apagar só após a decisão sobre reaproveitar Indeed, InfoJobs, Catho, Vagas.com).

## 6. Precisa de decisão do Douglas

1. BRQ: manter, levar para a API como página de detalhe (e com quais fontes), e o que fazer com as 3 vagas do LinkedIn.
2. Currículos: origem dos dados (fictícios do zero ou baseados em pessoas reais), anonimização dos contatos e se continuam no site.
3. Critério da lista "Empresas legais" e, a partir dele, o destino de SERPRO, Promobit, Viva Eventos, Gupy, GeekHunter e Revelo.
4. Itens duplicados entre empresas e vagas (GeekHunter, Revelo): em qual seção ficam.
5. Movile: remover ou trocar por iFood.
6. Impulso, Trampos, Handcom, Programadores JF, Programador BR, O Dev Tá Ligado: confirmar no navegador se estão ativos; remover os inativos.
7. Campo `duration`: novo nome, valores fechados e data de revisão (muda o schema e o contrato 2.3).
8. Taxonomia de `category` em português para empresas, vagas e perfis.
9. Escopo de "Plataformas de vagas": se aulas (Superprof), avaliação (Glassdoor) e ATS (Abler) ficam.
10. Escopo de "Perfis": só pessoas ou pessoas e canais.
11. Papel dos dados locais: contingência gerada da API ou fonte paralela.

## 7. Fontes da conferência na web

- Polywork descontinuada em jan/2025: https://dev.to/n4ze3m/top-polywork-alternatives-in-2025-51n6 ; mudança de produto em 2023: https://dev.to/conr/polywork-is-dead-to-me-153j
- iFood incorpora a Movile (abr/2023): https://startups.com.br/negocios/ifood-incorpora-a-movile-que-pode-vender-mais-ativos/
- Bossabox quase fecha e volta ao breakeven (dez/2024): https://startups.com.br/negocios/apos-quase-fechar-bossabox-alcanca-breakeven-e-triplica-em-2024/
- Howdy.com compra a GeekHunter (ago/2023): https://forbes.com.br/forbes-money/2023/08/howdy-com-compra-geekhunter-e-mira-r-175-milhoes-em-receita-ate-2024/
- Méliuz compra a Promobit: https://www.moneytimes.com.br/meliuz-compra-promobit-por-r-13-milhoes/
