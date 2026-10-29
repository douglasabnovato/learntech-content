# Revisão editorial e técnica do site bootcamps (conteúdo já existente)

Revisão somente leitura feita em 28/10/2026. Nenhum arquivo do repositório foi alterado. Base: `learntech-content/content/bootcamps/eventos/*.json` (fonte da verdade), `learntech-content/src/schemas/bootcamps.ts`, `learntech-content/media/bootcamps/`, `bootcamps/src/entities/event/api/events.data.ts` e `eventApi.ts`, `bootcamps/src/pages/detail/Detail.tsx`, `bootcamps/public/eventos-vivos/`, `learntech-content/docs/ecossistema/01-inventario-eventos.md`, `11-mapa-editorial.md`, `02-contratos.md` e `bootcamps/docs/claudeia/01-relatorio.md`.

Fora do escopo (novos em 27-28/10): `startup-way-challenge-2023.json` e as fotos 7-16 da galeria do `codexperience`. Citados só quando há relação.

Limite da verificação externa: a rede da VM e do container estava bloqueada para os sites dos eventos. Só foi possível conferir por busca na web: Minas Summit 2026 (17 e 18/06/2026, Minascentro, 4a edição, fonte Itatiaia) e StartSe TechAcademy (lançado em 28/03/2022, 12 semanas, gratuito, com certificado, fonte startse.com/artigos). Os demais links foram avaliados pelo formato e pelo contexto, não pelo status HTTP.

## 1. Resumo

- Eventos na API: 22 (21 no escopo). Eventos em `events.data.ts` (reserva local): 17.
- Só na API: 5 (`fator-s-challenge`, `hackathon-inovacao-social-jf`, `tdc-innovation`, `smc-2012`, `startup-way-challenge-2023`).
- Só no local: 0. Diferentes entre os dois lados: 2 (`codexperience` muito defasado no local; `gdg-jf` sem galeria no local).
- Estado geral dos 21 no escopo: bom 2, precisa ajuste 12, fraco 7.
- Status: 18 `concluido`, 3 `desejado` (42-sp, xpeducacao-minicamp, bq-agenda-tech). Nenhum dos 3 `desejado` é de fato "meta de estudo", que é o rótulo que o site mostra (`Detail.tsx`, selo "Meta de estudo").
- Com ano ou data em algum campo: 9 de 21. As 12 formações (ids 2 a 13) não dizem quando foram feitas nem trazem prova (certificado, link de certificação).
- Que mencionam o Douglas (1a ou 3a pessoa): 6 (42-sp em 1a pessoa; codexperience, hackathon, tdc, smc e bq em 3a pessoa). Os outros 15 descrevem só a instituição.
- Capa: 16 de 21 usam a identidade visual (logo) da instituição; 3 usam foto própria (fator-s, hackathon, tdc-grade); `smc-2012` reaproveita o logo do DCC/UFJF.
- Galeria com fotos: 5 (codexperience 16, fator-s 5, hackathon 4, gdg-jf 2, tdc 2). Vídeo: 2 (42-sp e codexperience; o do codexperience é provisório segundo o mapa 11).
- Certificado publicado: 1 (minas-summit, 2025). Acervo tem mais 2 não publicados (Minas Summit 2024 e CodeXperience 2023).
- `curriculum` vazio: 1 (minas-summit, a seção some da página).
- `officialLink` vazio: 1 (smc-2012). Apontando para página de inscrição/ingresso de edição passada: 2 (codexperience: Sympla 2025; fator-s: notícia "inscrições abertas" do Sebrae). Apontando para notícia de jornal: 1 (hackathon). Apontando para páginas estáticas próprias: 2 (byteclass-dev, bq-agenda-tech).
- Páginas em `public/eventos-vivos`: 2 (byteclass.dev e bq-agenda-tech), ambas ligadas como "site oficial", ambas com placeholders, formulários que não gravam nada e, no BQ, imagens quebradas.

## 2. Tabela por evento

| slug | estado geral | principais problemas | ação recomendada | precisa de decisão do Douglas? |
|---|---|---|---|---|
| 42-sp | precisa ajuste | `status: desejado` vira selo "Meta de estudo", mas o texto diz que foi aprovado para a Piscina e cedeu a vaga. Texto em 1a pessoa (único). "Missão presencial de 7 dias em abril de 2026, na sede de uma empresa parceira" precisa de confirmação (formato e data). `videoUrl` 1-fUC6_yntE não identificado (não foi possível abrir). `category: fullstack` não combina (seleção em lógica/Python). Capa é o logo da 42. | Padronizar a voz; trocar `category` para `outros`; conferir o vídeo; deixar explícito no `description` que é processo seletivo. | Sim: confirmar formato/data da etapa presencial, o que é o vídeo e se o status deve continuar `desejado` (ou se precisa de um terceiro estado). |
| rocketseat-ignite | fraco | Sem ano, sem certificado, sem trilha concluída. `curriculum` genérico (Jest, React Query) sem prova de que foi cursado. `longDescription` é texto institucional. O Ignite pode ter sido descontinuado/reformulado pela Rocketseat (não conferido, rede bloqueada); o `officialLink` /ignite pode estar morto. | Conferir o link; incluir ano, trilha e link do certificado; reescrever o texto com o que foi feito (projetos/desafios). | Sim: confirmar se concluiu, quando e qual trilha. |
| caelum-java | fraco | Sem ano nem curso (Caelum tinha cursos FJ-11, FJ-21 etc.; "Formação Java" é vago). `curriculum` inclui Spring Boot e Hibernate/JPA, mas o texto diz que a formação "prepara a base para" esses frameworks: contradição. `officialLink` é a home da Alura. | Ajustar o `curriculum` ao texto; trocar o link por página da Alura/Caelum mais específica ou certificado. | Sim: qual curso, ano, presencial ou online, se tem certificado. |
| dio-santander-python | precisa ajuste | Sem ano (o Santander Bootcamp tem várias edições e trilhas). Texto lista "Excel e IA" e AWS, que variam por edição. `officialLink` genérico (`dio.me`). `category: outros` ok. | Incluir ano/edição e o link do certificado DIO (a DIO gera URL pública). | Sim: ano e trilha concluída. |
| freecodecamp-js-algorithms | precisa ajuste | Sem ano e sem link da certificação (o freeCodeCamp gera URL pública de certificado por usuário). O currículo "JavaScript Algorithms and Data Structures" foi reformulado pelo freeCodeCamp (versão legada x nova); não conferido. "centenas de horas" é texto do site. | Adicionar o link público do certificado em `certificate` ou `links`. | Sim: confirmar conclusão e fornecer o link do certificado. |
| driven-fullstack | fraco | Afirma "1.450 horas", "9 meses", "pagamento após empregabilidade" (dados comerciais da Driven, sem fonte e possivelmente desatualizados). Sem ano, turma ou projetos. Status `concluido` sem prova. | Tirar números comerciais ou citar fonte; incluir turma, ano e projetos do portfólio. | Sim: confirmar se concluiu a formação inteira (é a afirmação mais forte do site). |
| w3schools-referencia | fraco | Não é evento nem formação ("referência de uso contínuo"); `status: concluido` e a seção "Ementa dominada" não fazem sentido. Capa é logo de terceiro. | Mover para o site tools (ferramenta/referência) ou retirar do bootcamps; se houver certificado W3Schools, reescrever como certificação. | Sim: manter, mover ou remover. |
| xpeducacao-minicamp | precisa ajuste | `status: desejado`, mas o texto descreve o programa sem dizer se o Douglas fez. "Certificado garantido a todos" é regra comercial a conferir. Sem ano. | Reescrever conforme a resposta (fez/não fez). | Sim: participou do Minicamp? Em que ano? |
| curso-em-video-algoritmos | precisa ajuste | Sem ano e sem certificado (o Curso em Vídeo emite certificado). Texto genérico. Link ok pelo formato. | Incluir ano e certificado, se houver. | Sim: ano e certificado. |
| gdg-jf | precisa ajuste | Números verificáveis sem fonte: "ativa desde 2014", "mais de 130 eventos", "a cada duas semanas". "Participação frequente" sem período. Galeria com 2 fotos (2022 e 2023) que não constam do inventário do hd (origem não documentada). Local (`events.data.ts`) sem galeria. | Conferir os números na página do GDG (gdg.community.dev mostra o histórico); trocar "frequente" por período real; registrar a origem das 2 fotos. | Sim: período de participação e se as fotos são próprias/autorizadas. |
| if-sudeste-mg-informatica | precisa ajuste | Sem anos de início/conclusão. `curriculum` genérico de curso técnico. O mapa 11 (DOC-054) sugere ligar ao guia de exame; não feito. | Incluir período; ligar ao artigo/guia quando existir. | Sim: anos e conclusão. |
| ufjf-dcc-cc-noturno | precisa ajuste | `status: concluido` afirma graduação concluída; sem anos. O `smc-2012` diz "durante a graduação", então o curso estava em andamento em 2012. Material do hd (DOC-024, DOC-060, editais de treinamento profissional) não usado. | Incluir período e situação real (concluído, trancado, em andamento). | Sim: concluiu a graduação? Em que ano? Foi bolsista do treinamento profissional? |
| startse-techacademy | fraco | `longDescription` fala da StartSe em geral (Data For Leaders, IA para Todos com IBM) e não do TechAcademy nem do Douglas. O TechAcademy foi lançado em 03/2022, 12 semanas, gratuito, com certificado (startse.com/artigos); nada disso está no texto. `curriculum` genérico. `officialLink` /techacademy pode não existir mais (não conferido). | Reescrever com ano, duração e o que foi cursado; tirar as menções a outros produtos da StartSe. | Sim: confirmar participação/conclusão e certificado. |
| byteclass-dev | fraco | Não é evento vivido: é uma escola/projeto (aparentemente do próprio Douglas) descrita em tom publicitário ("transformar iniciantes em desenvolvedores seniores", sede na Sala 902 do Edifício Stella Central, "27 tecnologias", mentoria de "CTO"). `status: concluido` mostra "Concluído" e "Ementa dominada". `officialLink` leva à página estática com WhatsApp placeholder (`wa.me/seu-numero`, `wa.me/seu-numero-aqui`), timeline de "eventos" Jan-Mar/2026 sem confirmação e formulário que não envia nada. Assets de 11 MB. | Tirar do ar ou marcar como projeto próprio até haver confirmação; corrigir placeholders e formulário antes de qualquer link público. | Sim: a ByteClass existe como escola com sede física? Qual o papel do Douglas? Deve ficar no bootcamps? |
| bq-agenda-tech | fraco | Evento ainda não realizado e organizado pelo Douglas, mas aparece como "Meta de estudo". `category: fullstack` incoerente (encontro de café e negócios). Texto usa "Douglas Novato" (nome diferente de Douglas Abnovato) e cita terceiros pelo primeiro nome (Marlon). Nome divergente: JSON "BQ Agenda Tech", página "BQ Café e Tecnologia". Página estática: "Próxima edição: (Aguardando Data)", palestrantes "Marcus" e "Lucas" com "Aguardando Confirmação" e fotos em `./assets/inspiracao/homer-*.jpg` (pasta inexistente; imagem de personagem de terceiro), logos de apoio `iron-1/2/3.jpg` inexistentes, WhatsApp `wa.me/SEUNUMERO` nos 3 convites, formulário que só faz `console.log` (`script.js:37-55`). | Despublicar a página ou trocar por "em organização"; corrigir nome, categoria e imagens quebradas; tirar nomes de terceiros sem confirmação. | Sim: manter no site antes de ter data? Nome oficial do evento? Como se assina (Novato x Abnovato)? Precisa de terceiro estado ("organizo")? |
| minas-summit | precisa ajuste | `longDescription` não menciona o Douglas nem as edições em que ele foi. Certificado publicado (`/media/arquivos/minas-summit-2025-certificado.pdf`) foi lido: é de 2025, dias 05 e 06/06/2025, nome do Douglas, FCJ Venture Builder; está CORRETO. O inventário/mapa 11 tratam como erro, mas o que falta é o certificado de 2024 (26 e 27/06/2024, 16 h) do hd, que não está publicado. Edição 2025 sem data no `highlight`. Edição 2026 (17-18/06/2026, conferida) marcada `realizado`, o que é verdade para o evento, mas não diz se o Douglas foi. `curriculum: []` (seção some). `coverImage` e as 5 `editions[].image` usam artes "2026" (e `editions[].image` nem é exibido). `description` promocional ("o principal evento"). | Acrescentar participação 2024 e 2025 no texto e nos `highlight`; incluir data de 2025; publicar o certificado 2024 (via `links`, já que `certificate` aceita um só); preencher `curriculum` com trilhas assistidas. | Sim: foi em 2026 também? Organizou a ida em grupo de JF em 2024 (planilha do hd)? |
| codexperience | precisa ajuste | Na API está rico (3 edições, galeria, 8 links), mas: `officialLink` e o link "Ingressos" apontam para o Sympla de 2025 (evento passado); deveria ser o site oficial. `videoUrl` WW8qL1QAhOE é provisório (mapa 11); o vídeo próprio MVI_5108 do hd não foi usado. Edição 2024 usa o logo como imagem e não tem material próprio, embora o hd tenha deck e roteiro da abertura (EV-003). Edição 2023 diz "Participação com certificado", mas o certificado não está publicado e o arquivo do hd se chama "staff". Papel em 2025 não informado (proposta de apoio no hd sugere organização). No `events.data.ts` a entrada está defasada (texto antigo, sem galeria, sem edições, 3 links). | Trocar `officialLink` para `https://codexperience.com.br/` e o rótulo "Ingressos" para "Sympla 2025"; publicar certificado 2023; subir MVI_5108. | Sim: papel em 2023 (participante ou staff) e em 2025; qual vídeo usar. |
| fator-s-challenge | precisa ajuste | O texto em momento algum diz que o Douglas participou nem qual foi a equipe dele; cita o projeto Fuser sem dizer se é dele. `officialLink` é notícia de "inscrições abertas" do Sebrae (página de inscrição antiga). Fotos existem (5). | Acrescentar o papel do Douglas e a equipe; mover a notícia para `links` como "Matéria". | Sim: o Fuser era da equipe do Douglas? Qual foi o resultado? Tem certificado? |
| hackathon-inovacao-social-jf | bom | `officialLink` é matéria da Tribuna de Minas (não é página oficial). Não diz o que a equipe do Douglas fez nem o resultado. Galeria inclui "selfie". | Mover a matéria para `links`; acrescentar a solução da equipe. | Opcional: qual foi a solução e o resultado. |
| tdc-innovation | bom | Datas e local verificáveis e coerentes; capa é a grade do organizador (arte de terceiro). Sem certificado (o TDC emite para quem assiste online). | Publicar certificado, se houver; capa pode ser a foto da transmissão (`1.webp`). | Opcional: tem certificado? |
| smc-2012 | precisa ajuste | `officialLink: ""` (o botão não aparece mais, mas o evento fica sem nenhuma fonte). Capa é o logo do DCC/UFJF com alt "uma das sedes". Sem prova de participação. Datas (21 a 24/11/2012) não conferidas. | Incluir link de anais ou página do evento (SBC/ERI-MG) em `links`. | Sim: tem certificado ou comprovante? |

## 3. Achados transversais

| # | onde | problema | gravidade | ação | decisão? |
|---|---|---|---|---|---|
| T1 | `events.data.ts` x API | Reserva local tem 17 eventos e a API 22. Os 5 só na API (`fator-s-challenge`, `hackathon-inovacao-social-jf`, `tdc-innovation`, `smc-2012`, `startup-way-challenge-2023`) somem da Home e dão 404 se a API cair (`eventApi.ts` `getBySlug` cai em `events.find`). `codexperience` local está defasado (texto 2025 antigo, sem galeria, sem edições, 3 de 8 links, sem vídeo) e `gdg-jf` local sem as 2 fotos. | Alta | Gerar `events.data.ts` a partir da API (ou do build do learntech-content) em vez de manter à mão. | Não |
| T2 | `Detail.tsx` (selo e títulos) | Só existem 2 estados: `concluido` ("Concluído", "Ementa dominada") e `desejado` ("Meta de estudo", "Plano de estudos"). Eventos assistidos (gdg, tdc, fator-s, hackathon, smc, minas-summit) ganham "Ementa dominada"; organizados (bq, byteclass) e o processo seletivo cedido (42-sp) ganham "Meta de estudo". | Alta | Ajustar rótulos por tipo (formação x evento) e/ou criar estado "organizo"/"participei". | Sim (muda regra do schema e do site) |
| T3 | 12 formações (ids 2-13) | Nenhuma tem ano, duração cursada, certificado ou link de verificação. Todas estão `concluido`. É a parte mais frágil do site em credibilidade. | Alta | Para cada uma: ano, certificado (PDF em `media/arquivos/` ou URL pública) e 1-2 frases do que foi feito. | Sim (confirmar conclusão de cada uma) |
| T4 | `public/eventos-vivos/` | As duas páginas estão ligadas como "site oficial" (`officialLink`) e são rascunhos: placeholders de WhatsApp (`seu-numero`, `SEUNUMERO`), imagens inexistentes no BQ (`assets/inspiracao/homer-*.jpg`, `assets/imgs/iron-1..3.jpg`), palestrantes sem confirmação, formulários que não gravam (BQ só `console.log`; ByteClass sem `action`), datas Jan-Mar/2026 já passadas na timeline da ByteClass, 11 MB de PNG na ByteClass. | Alta | Tirar o link até as páginas ficarem prontas ou trocar por aviso "em organização". | Sim (manter publicado?) |
| T5 | minas-summit `certificate` + inventário/mapa 11 | O PDF publicado é o certificado de 2025 (05-06/06/2025) e está certo. O inventário (EV-002) e o mapa 11 (fila item 3) afirmam que "aponta para 2025 mas o acervo tem 2024" como se fosse erro. O real problema é que o de 2024 falta e o schema aceita um só `certificate`. | Média | Corrigir a nota nos docs; publicar 2024 via `links` ou mudar o schema para lista de certificados. | Não (para publicar 2024); sim se mudar schema |
| T6 | `officialLink` | Usado de forma inconsistente: notícia de jornal (hackathon), página de inscrição passada (fator-s), ingresso de edição passada (codexperience), home genérica (alura, dio.me, driven, xpeducacao), vazio (smc), página estática própria (byteclass, bq). O CTA diz "Acesse a plataforma oficial da {instituição} para conferir os conteúdos e programas de formação", texto errado para notícias e eventos. | Média | Regra: `officialLink` = site oficial vigente; notícias e Sympla vão para `links` com rótulo e ano. Ajustar o texto do CTA para eventos. | Não |
| T7 | voz do texto | Mistura de 1a pessoa (42-sp), 3a pessoa "Douglas" (codexperience, hackathon, tdc, smc), "Douglas Novato" (bq) e texto institucional sem o autor (15 eventos). | Média | Escolher uma voz e um nome; reescrever. | Sim (voz e nome) |
| T8 | `category` | Enum só tem frontend/backend/fullstack/mobile/outros. `fullstack` usado para eventos e referências que não são formação full stack (minas-summit, codexperience, bq, startse, w3schools, xpeducacao, tdc, 42-sp). | Baixa | Usar `outros` para eventos ou ampliar o enum (ex.: evento, comunidade, academico). | Sim se ampliar o enum |
| T9 | `coverImage` | 16 de 21 capas são logos/identidade visual de terceiros (instituicoes/*.webp); alt diz "Identidade visual de ...". Minas Summit usa arte "2026" para todas as edições; `editions[].image` não é exibido (`Detail.tsx` não usa). | Baixa | Trocar por foto própria quando houver; tirar `editions[].image` ou exibi-lo. | Não |
| T10 | material do hd não usado | Ver seção 5: certificado Minas Summit 2024; certificado CodeXperience 2023; vídeo MVI_5108; deck/roteiro da abertura 2024 e proposta 2025 do CodeXperience; Pitang, UFJF treinamento, Santander/Ada etc. | Média | Seguir a fila do mapa 11. | Sim (autorizações e confirmações) |
| T11 | privacidade | BQ (JSON e Readme da página) cita terceiros pelo primeiro nome (Marlon, Lucas, Marcus) e empresas apoiadoras sem confirmação; foto de personagem de desenho como palestrante. Regra do próprio ecossistema é não identificar terceiros sem autorização. | Média | Tirar nomes até confirmar. | Sim |
| T12 | `content.links` / datas passadas | codexperience "Ingressos" para evento de 29/11/2025; byteclass "acompanhe pelo Discord" sem link; minas-summit edição 2027 "anunciado" sem fonte. | Baixa | Renomear/retirar chamadas de ação vencidas. | Não |

## 4. Seguro corrigir sem decisão x precisa de decisão

### Seguro corrigir sem decisão

1. Regenerar `bootcamps/src/entities/event/api/events.data.ts` a partir dos JSON da API (inclui os 5 que faltam, o `codexperience` atual e a galeria do `gdg-jf`).
2. `codexperience.content.officialLink` para `https://codexperience.com.br/`; renomear o link "Ingressos" para "Sympla 2025".
3. `fator-s-challenge` e `hackathon-inovacao-social-jf`: mover notícias de `officialLink` para `links` ("Matéria", "Inscrições 2023") e deixar `officialLink` com o site do organizador (Sebrae/Moinho) ou vazio.
4. `minas-summit`: acrescentar a data 05-06/06/2025 no `highlight` de 2025 (vem do certificado publicado) e a data 17-18/06/2026 já está correta (conferida).
5. `caelum-java`: alinhar `curriculum` com o texto (Spring/JPA são "próximo passo", não ementa).
6. `startse-techacademy`: tirar as menções a Data For Leaders e IA para Todos e incluir o que é público (lançamento em 03/2022, 12 semanas, gratuito).
7. `category: outros` para `tdc-innovation`, `minas-summit`, `codexperience`, `bq-agenda-tech`, `42-sp`.
8. Corrigir a nota de EV-002 no `01-inventario-eventos.md` e no `11-mapa-editorial.md` (certificado publicado é 2025 e está certo; falta o de 2024).
9. Texto do CTA em `Detail.tsx` para eventos (não falar em "programas de formação").
10. Tirar do ar as imagens quebradas/placeholder do BQ (ou ocultar a seção de palestrantes) e os links `wa.me/seu-numero`.

### Precisa de decisão do Douglas

1. Conclusão e ano de cada formação: Rocketseat Ignite, Caelum, DIO/Santander, freeCodeCamp, Driven, Curso em Vídeo, StartSe, IF Sudeste, UFJF (graduação concluída?).
2. Se o W3Schools continua no bootcamps, vai para o tools ou sai.
3. XP Educação Minicamp: participou? Em que ano?
4. 42-sp: confirmar o formato e a data da etapa presencial, o vídeo do `videoUrl` e qual selo deve aparecer.
5. ByteClass: existe como escola com sede física? Qual o papel do Douglas? Deve ficar no site?
6. BQ Agenda Tech / BQ Café e Tecnologia: nome oficial, se fica publicado antes de ter data, se os nomes de terceiros podem aparecer e qual nome do autor usar.
7. Criar terceiro estado (ex.: "organizo" ou "participei") e/ou ampliar `category`.
8. Minas Summit: foi em 2026? Organizou a ida em grupo em 2024? Quais trilhas assistiu (para o `curriculum`)?
9. CodeXperience: papel em 2023 (o certificado do hd se chama "staff" mas diz participação de 18 h) e em 2025; qual vídeo usar.
10. Fator S: o projeto Fuser era da equipe dele? Resultado e certificado.
11. GDG JF: período real de participação e se as 2 fotos são próprias.
12. SMC 2012 e TDC 2023: há certificado?
13. Voz única dos textos (1a ou 3a pessoa).

## 5. Material no hd ainda não usado (inventário de eventos e mapa 11)

| Item | Onde está | Evento | Situação |
|---|---|---|---|
| Certificado Minas Summit 2024 (26-27/06/2024, 16 h) | `hd/eventos/event-minassummit` (EV-002) | minas-summit | Não publicado; texto da edição 2024 não fala do Douglas |
| Ida em grupo JF-BH 2024 (planilha com CPF/RG) | EV-002 | minas-summit | Só como texto, sem dados; planilha nunca publicar |
| Certificado CodeXperience 2023 (18 h, arquivo "staff") | EV-003 | codexperience | Não publicado; `highlight` 2023 diz "com certificado" |
| Vídeo MVI_5108 (17 s) | EV-001 | codexperience | `videoUrl` atual é provisório |
| 162 fotos candidatas restantes de 2023 | EV-001 | codexperience | Fora do escopo (fotos 7-16 recém-publicadas) |
| Deck e roteiro da abertura 09/11/2024 | EV-003 | codexperience (2024) | Edição 2024 usa o logo; 2-4 slides sugeridos |
| Proposta de apoio 2025 e captura da landing 24/11/2025 | EV-003 | codexperience (2025) | Só a arte 2025 foi usada |
| Santander Open Academy / Ada Tech (2024) | EV-005 | possível evento novo | Depende de confirmação de conclusão |
| Vídeo do Programa Pitang | DOC-059 | possível evento novo | Mapa 11 fila item 4 |
| Editais de treinamento profissional UFJF | DOC-024, DOC-060 | ufjf-dcc-cc-noturno ou novo | Se foi bolsista |
| Provas de seleção do IF | DOC-054 | if-sudeste-mg-informatica | Ligar a um guia, sem republicar provas |
| Netuno Bootcamp 23.1, Le Wagon, Digital House, Experience Summit | DOC-019, DOC-029, DOC-014 e outros | possíveis eventos | Só com prova de participação |
| Startup Way Challenge 2023 | EV-007 | startup-way-challenge-2023 | Fora do escopo (criado em 27-28/10) |

## 6. Páginas em `public/eventos-vivos`

| Página | O que é | Ligação | Estado |
|---|---|---|---|
| `byteclass.dev/index.html` | Landing page estática (HTML/CSS/JS puro, estética pixel art) da escola ByteClass, com trilha, "jornada" Jan-Mar/2026, sede física e formulário "receber grade" | `officialLink` do evento `byteclass-dev` (JSON e `events.data.ts:377`) | Desatualizada e com placeholders: `wa.me/seu-numero` e `wa.me/seu-numero-aqui`, formulário sem `action`, datas passadas, 6 PNG somando ~11 MB, `instagram.com/byteclass` não conferido |
| `bq-agenda-tech/index.html` + `convites/{apoiador,palestrante,parceiro}.html` | Landing do "BQ Café e Tecnologia" e 3 páginas de convite | `officialLink` do evento `bq-agenda-tech` (JSON e `events.data.ts:402`); os convites não são ligados pelo site | Rascunho: "(Aguardando Data)", palestrantes "Aguardando Confirmação" com fotos em pasta inexistente, logos `iron-*.jpg` inexistentes, `wa.me/SEUNUMERO` nos convites, inscrição que só faz `console.log` (coleta nome, e-mail e WhatsApp sem destino nem aviso de privacidade) |

Fontes externas consultadas: [Itatiaia, Minas Summit 2026](https://www.itatiaia.com.br/economia/negocios/minas-summit-2026-reune-11-mil-pessoas-para-debater-inovacao-e-negocios-em-bh/); [StartSe, lançamento do TechAcademy](https://www.startse.com/artigos/startse-lanca-techacademy-para-formar-gratuitamente-500-mil-programadores/).
