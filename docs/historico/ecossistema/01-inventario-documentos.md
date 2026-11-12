# Inventário de documentos: hd/blogs-pdf-docs

Atualizado em 2026-10-27. Fonte: `hd/blogs-pdf-docs/` (92 arquivos). Documento de trabalho para decidir o que vira conteúdo do ecossistema LearnTECH (learn-tech, tools, career, bootcamps). Nada em `hd/` foi alterado; a leitura foi feita por extração de texto (primeiras páginas, sumário, OCR quando o PDF era imagem).

Regra geral: preservar o conteúdo, não as fontes e marcas. Obras de terceiros entram como referência citada (autor e obra, trechos curtos, resumo breve). Documentos sensíveis viram ensino anonimizado. Este inventário não contém nomes de pessoas físicas de terceiros, documentos, telefones, e-mails nem endereços; onde o nome de arquivo tem nome de pessoa, ele aparece mascarado com `*`.

## 1. Resumo

### Por tipo de arquivo

| Tipo | Arquivos |
|---|---|
| pdf | 59 |
| docx | 14 |
| doc | 9 |
| xlsx | 4 |
| epub | 1 |
| jpg | 1 |
| log | 1 |
| mp4 | 1 |
| txt | 1 |
| xls | 1 |
| **Total** | **92** |

A tabela da seção 3 tem **60 IDs**: a maioria é um arquivo; grupos coesos (provas de Excel, editais, provas e gabaritos de exame) ocupam uma linha.

### Por categoria de direitos

| Direitos | IDs | Arquivos |
|---|---|---|
| proprio | 5 | 5 |
| terceiro-citavel | 38 | 56 |
| sensivel-anonimizar | 16 | 30 |
| descartar | 1 | 1 |

### Por destino (um ID pode ter vários destinos)

| Destino | IDs | Arquivos |
|---|---|---|
| learn-tech | 38 | 63 |
| career | 32 | 61 |
| bootcamps | 13 | 28 |
| tools | 6 | 21 |
| sem destino | 6 | 6 |

### Situação de publicação

| Já publicado? | IDs |
|---|---|
| Sim | 1 |
| Parcial | 23 |
| Não | 35 |
| - | 1 |

Principais achados:

- Só o material de Salesforce Marketing Cloud (DOC-030) já está ligado a algo publicado (ficha em tools). Os "Parcial" indicam que a entidade ou o tema já existe (ex.: Cadastra em career/empresas, evento do IF, pasta digital_library como referência), mas o material deste acervo ainda não foi usado.
- O maior potencial está em career (processo seletivo, leitura de vagas, testes técnicos, pipeline de candidaturas) e em estudos de caso para learn-tech (site institucional, Excel para indicadores, LGPD, gestão de múltiplos projetos).
- A biblioteca digital (18 arquivos) parece conter cópias sem licença de livros comerciais: entra só como bibliografia citada.
- DOC-058 contém credencial de acesso de terceiro. DOC-050 e a Prova9 (DOC-052) contêm nomes e matrículas reais de funcionários.
- Duplicatas: `Material  C* 2.docx` e `Material  C* 3.docx` são idênticos; Prova5.doc e "Prova Excel ASSIST. DE APOIO.doc" têm o mesmo enunciado.

## 2. Legenda dos campos

| Campo | Significado |
|---|---|
| ID | Identificador estável deste inventário (DOC-001...). Use-o em issues, no cobertura.json e nas propostas. |
| Caminho | Relativo a `hd/`. Grupos listam o padrão e a quantidade. `*` mascara nome de pessoa no nome do arquivo. |
| Tipo | Extensão do arquivo. |
| Do que se trata | Uma frase, sem dados pessoais. |
| Direitos | `proprio`: produzido pelo autor, publicável após revisão. `terceiro-citavel`: obra ou material de terceiro; só como referência (citação curta com autor e obra, resumo breve, link para a fonte oficial). `sensivel-anonimizar`: tem dados pessoais, de clientes, de empregadores ou internos; só entra como ensino anonimizado (nome fictício, dados fictícios ou genéricos). `descartar`: lixo técnico sem valor de conteúdo. |
| Competências/temas | O que se aprende a partir do material. |
| Nível | iniciante, intermediário ou avançado (do conteúdo derivado). |
| Estratégia | Como o material vira conteúdo: artigo com citação e resumo; programa learn-tech; guia career anonimizado; estudo de caso com nome fictício; cobertura de evento; exercício prático; template. |
| Destinos | learn-tech (programas e páginas), tools (catálogo de ferramentas), career (empresas, vagas, perfis, guias), bootcamps (eventos e formações vividas pelo autor). "-" = nenhum. |
| Já publicado? | Conferido em `content/cobertura.json` e nos JSON de `content/` em 2026-10-27. Sim; Parcial (tema ou entidade já existe, mas este material não foi usado); Não. |
| Observação | Cuidados de privacidade, duplicatas e pendências. |

## 3. Inventário por pasta


### Raiz (blogs-pdf-docs/) (11 arquivos)

| ID | Caminho | Tipo | Do que se trata | Direitos | Competências/temas | Nível | Estratégia | Destinos | Já publicado? | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| DOC-001 | `blogs-pdf-docs/Catálogo de Livros Infantis - JSON.docx` | docx | Catálogo de livros infantis em JSON (id, título, autor, preço, preço promocional, lote, categoria, imagem de mockup) para uma vitrine de loja. | proprio | JSON, modelagem de dados, catálogo de e-commerce, renderização de listas | iniciante | exercício prático (modelar JSON e renderizar vitrine com filtros por categoria e lote) | learn-tech | Não | Títulos e autores são de livros publicados; usar dados fictícios ou poucos itens no exercício. Ver dúvida sobre cliente real. |
| DOC-002 | `blogs-pdf-docs/Dicionário de tags HTML.pdf` | pdf | Lista comentada das tags HTML mais usadas (estrutura, formulário, mídia), material promocional de terceiro. | terceiro-citavel | HTML, semântica, formulários | iniciante | referência; escrever glossário próprio de tags com exemplos e link para MDN | learn-tech | Parcial (o tema já está no programa 2 - HTML5 e CSS3) | Autoria não identificada no texto (newsletter). Não republicar o PDF. |
| DOC-003 | `blogs-pdf-docs/IA - Mentor PM + PO + Projetos.docx` | docx | Transcrição longa de conversa com assistente de IA usado como mentor de gestão: portfólio de projetos, rotina, ansiedade, kanban no GitHub, roteiros para cobrir eventos e montar aulas. | sensivel-anonimizar | gestão de múltiplos projetos, kanban, priorização, storytelling de tarefas, uso de IA como mentor, roteiro de aula gravada, cobertura de eventos | intermediário | artigo próprio + guia prático (prompts e rotina) sem dados de clientes; extrair lista de eventos para cobertura | learn-tech, career, bootcamps | Não | Contém nomes de empregadores, clientes, colegas e trechos de WhatsApp. Usar só a metodologia. Fonte rica de pautas: eventos citados viram itens de bootcamps. |
| DOC-004 | `blogs-pdf-docs/Instituto Salus.docx` | docx | Proposta comercial de website institucional (seções, objetivos, conteúdo sugerido, funcionalidades SPA, orçamento) para uma escola técnica da área da saúde. | sensivel-anonimizar | levantamento de requisitos, arquitetura de informação, escopo, proposta comercial, SPA responsiva | intermediário | estudo de caso com nome fictício (ex.: "Instituto Aurora de Educação em Saúde"); valores em proporção ou removidos | learn-tech, career | Não | Projeto de cliente. Remover nome real, localização, parceiros e valores. Junto com "Projeto Instituto Salus.docx" forma um case completo. |
| DOC-005 | `blogs-pdf-docs/PERFIL - Técnica simples que fez meu perfil ser encontrado por Recrutadores em 48h.pdf` | pdf | Guia curto de terceiro sobre otimizar perfil do LinkedIn para buscas de recrutadores usando palavras-chave (título, sobre, experiências, competências). | terceiro-citavel | marca pessoal, LinkedIn, palavras-chave, recrutamento | iniciante | artigo próprio com resumo breve e citação curta | career | Não | Autor não identificado no texto extraído; foco original em vagas de dados. Adaptar para dev. |
| DOC-006 | `blogs-pdf-docs/Projeto Instituto Salus.docx` | docx | Briefing do mesmo projeto: visão do negócio, portfólio de cursos por modalidade, escopo de funcionalidades (inscrição, cards de curso, formulários) e status. | sensivel-anonimizar | briefing, stakeholder, escopo, MVP, mockup, requisitos funcionais | intermediário | estudo de caso com nome fictício (mesmo case do item anterior) | learn-tech, career | Não | Contém nome do stakeholder, local do negócio e parceria institucional: não copiar. |
| DOC-007 | `blogs-pdf-docs/[pt] [leve 3] deep tech radar latam 2026.pdf` | pdf | Relatório de mercado (82 p.) de uma consultoria de inovação sobre empresas deep tech na América Latina: ativos regionais, maturidade tecnológica (TRL), propriedade intelectual e capital. | terceiro-citavel | inovação, deep tech, TRL, propriedade intelectual, ecossistema de startups | avançado | artigo com resumo e citação (obra: Deep Tech Radar LatAm 2026, Emerge) | career, learn-tech | Não | Arquivo de 112 MB: nunca hospedar; apenas citar e linkar a fonte oficial. |
| DOC-008 | `blogs-pdf-docs/agibank-processo-seletivo-candidatos.pdf` | pdf | Guia de candidato de um banco digital descrevendo 6 etapas (teste cultural, triagem, recrutador, liderança, stakeholder, desafio) até oferta e integração. | sensivel-anonimizar | processo seletivo, fit cultural, entrevistas, desafio técnico | iniciante | guia career anonimizado: "como é um processo seletivo e como se preparar" (etapas genéricas) | career, learn-tech | Não | O próprio documento se declara "Público"; não há nomes de pessoas. Pode ser citado como exemplo ou generalizado. |
| DOC-009 | `blogs-pdf-docs/elevoc_dnn_kernel.log` | log | Log técnico de driver de áudio (supressão de ruído) gerado pelo sistema. | descartar | - | - | nenhuma | - | - | Lixo técnico, sem valor de conteúdo. |
| DOC-010 | `blogs-pdf-docs/lgpd-ey.pdf` | pdf | Aviso de privacidade de ferramenta de recrutamento de uma consultoria global, salvo durante uma candidatura. | terceiro-citavel | LGPD, dados pessoais em recrutamento, direitos do titular | iniciante | artigo com citação curta: "o que acontece com seus dados quando você se candidata" | career, learn-tech | Parcial (LGPD aparece só na página de privacidade do próprio site) | Usar como exemplo real de aviso de privacidade; não reproduzir inteiro. |
| DOC-011 | `blogs-pdf-docs/react-native-avancado.pdf` | pdf | Gabarito de exercício online de uma faculdade sobre React Native avançado (criptografia AES com CryptoJS, persistência, segurança) com 10 questões. | terceiro-citavel | React Native, criptografia simétrica, persistência local, segurança mobile | avançado | quiz próprio inspirado nos temas (questões reescritas) + módulo de programa mobile | learn-tech, tools | Não | Questões pertencem à instituição; resultado pessoal não entra. Não há programa de mobile no learn-tech ainda. |

### bni/ (2 arquivos)

| ID | Caminho | Tipo | Do que se trata | Direitos | Competências/temas | Nível | Estratégia | Destinos | Já publicado? | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| DOC-012 | `blogs-pdf-docs/bni/bni.docx` | docx | Anotações de reunião virtual de grupo de networking empresarial: objetivo do grupo, metodologia e pitch pessoal do autor. | sensivel-anonimizar | networking, pitch pessoal, posicionamento, freelancer para pequenos negócios | iniciante | guia career (networking com propósito e pitch) + cobertura anônima de evento | career, bootcamps | Não | Contém lista de cerca de 15 participantes e identificador de acesso: nada disso entra. |
| DOC-013 | `blogs-pdf-docs/bni/bni.jpg` | jpg | Captura de tela (1366x765) da sala de reunião virtual do mesmo encontro. | sensivel-anonimizar | networking | - | não publicar; no máximo imagem ilustrativa própria | - | Não | Provável presença de rostos e nomes de participantes (imagem não inspecionada visualmente). |

### cases/ (21 arquivos)

| ID | Caminho | Tipo | Do que se trata | Direitos | Competências/temas | Nível | Estratégia | Destinos | Já publicado? | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| DOC-014 | `blogs-pdf-docs/cases/DH_Programa_do_Curso_CTD-1.pdf` | pdf | Programa de estudo (28 p.) de uma formação de desenvolvedor certificada de uma escola de habilidades digitais. | terceiro-citavel | currículo de formação dev, front-end, back-end, banco de dados | iniciante | referência curricular para comparar trilhas; cobertura se o autor cursou | learn-tech, bootcamps | Não | Instituição: Digital House. Ver dúvida sobre participação. |
| DOC-015 | `blogs-pdf-docs/cases/DH_Programa_do_Curso_Web_Full_Stack10-04.pdf` | pdf | Programa (12 p.) de curso de desenvolvimento web full stack da mesma escola. | terceiro-citavel | full stack, ementa, carga horária | iniciante | referência curricular; artigo comparando formações | learn-tech, career, bootcamps | Não | Mesmo caso do item anterior. |
| DOC-016 | `blogs-pdf-docs/cases/EBOOK FINAL revisado.pdf` | pdf | E-book (64 p.) de uma marca de estilo de vida sobre produtividade, mindset, fitness, mobilidade e nutrição. | terceiro-citavel | produtividade, mindset, saúde e rotina | iniciante | referência com citação curta em artigo de rotina | learn-tech | Não | Autoria não confirmada (texto cita coautores pessoas físicas). Ver dúvidas. |
| DOC-017 | `blogs-pdf-docs/cases/EDITAL-TREINAMENTO-PROFISSIONAL.pdf` | pdf | Edital público de universidade federal (2019) para bolsista de treinamento profissional em projeto de informações sobre pesquisa. | terceiro-citavel | bolsas acadêmicas, requisitos, seleção por histórico, currículo e entrevista | iniciante | guia career: como ler um edital de bolsa/estágio interno | career, bootcamps | Não | Documento público. |
| DOC-018 | `blogs-pdf-docs/cases/Experience_Summit_-_Marketing_Digital_Estrat_gico.pdf` | pdf | Slides (25 p.) de palestra sobre marketing digital estratégico para o setor de arquitetura e design (personas, renda, funil "da inspiração à conversão"). | terceiro-citavel | marketing digital, personas, segmentação, funil de conversão | intermediário | cobertura de evento (se assistiu) + artigo sobre personas com citação | bootcamps, learn-tech | Não | Nome do palestrante no metadado não deve ser usado; citar o evento. |
| DOC-019 | `blogs-pdf-docs/cases/Gmail - DEV.netuno - Bootcamp 23.1.pdf` | pdf | E-mail impresso convidando para formação intensiva full stack remota (Bootcamp 23.1) de uma comunidade de plataforma open source, com resumo da stack. | terceiro-citavel | Linux, HTML, CSS, JavaScript, back-end, full stack remoto | iniciante | cobertura de evento (se participou) ou referência | bootcamps | Não | Contém e-mail pessoal do autor no cabeçalho: não reproduzir o PDF. |
| DOC-020 | `blogs-pdf-docs/cases/Guia para começar do zero uma carreira em Desenvolvimento de Software em 2022 _ ITuring.pdf` | pdf | Guia (33 p.) de uma escola online sobre começar do zero em desenvolvimento: mentalidade, áreas, quando começar, quando estar pronto. | terceiro-citavel | transição de carreira, áreas de atuação, primeiro emprego | iniciante | artigo próprio com resumo e citação | career, learn-tech | Parcial (página carreira do learn-tech trata o tema, sem citar esta obra) | Material de 2022; atualizar dados. |
| DOC-021 | `blogs-pdf-docs/cases/Meu produto digital.docx` | docx | Mapa mental do autor (2024) sobre projeto pessoal: infoprodutos, especialização, carreira, empreender, identidade visual, plataforma de portfólio. | proprio | marca pessoal, produto digital, planejamento de carreira, portfólio | iniciante | artigo/template "plano de marca pessoal do dev" | career, learn-tech | Não | Pode virar modelo baixável. |
| DOC-022 | `blogs-pdf-docs/cases/MinhaRotinaPerformance 2026.xlsx` | xlsx | Grade semanal de rotina por blocos de horário (inglês, estudo/plataforma, projetos, aulas, reuniões, descanso). | sensivel-anonimizar | time-blocking, rotina, mindset, produtividade | iniciante | artigo de rotina e hacks de produtividade + template de planilha com projetos genéricos | learn-tech, career | Não | Nomes de projetos e clientes viram rótulos genéricos ("Projeto A", "Cliente B"). |
| DOC-023 | `blogs-pdf-docs/cases/O poder - Apostila.pdf` | pdf | Apostila (20 p.) sobre criatividade: criatividade x inovação, perigo da rotina, problemas como impulso, método de geração de ideias. | terceiro-citavel | criatividade, inovação, resolução de problemas, brainstorming | iniciante | artigo com resumo e citação curta | learn-tech | Não | Autoria/curso de origem não identificados. |
| DOC-024 | blogs-pdf-docs/cases/TP_*-Edital_2018.pdf + cases/TP_Edital-2017-Maratona_Programacao.pdf (6 arquivos) | pdf | Editais públicos de treinamento profissional (2017-2018) de universidade federal: maratona de programação, totem/app de atendimento, entrega contínua, governança de TI (GLPI), sistema de segurança, gestão acadêmica. | terceiro-citavel | editais, projetos universitários, entrega contínua, governança de TI, maratona de programação | iniciante | guia career (bolsas e projetos na graduação) + cobertura se o autor foi bolsista | career, bootcamps, tools | Parcial (evento ufjf-dcc-cc-noturno já publicado, sem estes projetos) | Documentos públicos; contêm nomes de orientadores, não copiar. |
| DOC-025 | `blogs-pdf-docs/cases/caderno-de-oportunidades.docx` | docx | Diário de candidaturas com capturas de plataformas de recrutamento (testes de JavaScript, React, resolução de problemas) e anotações de etapas. | sensivel-anonimizar | testes técnicos, plataformas de assessment, organização de candidaturas | iniciante | guia career anonimizado: "como funcionam testes técnicos online e como se preparar" | career | Parcial (empresas citadas já estão em career/empresas) | Capturas exibem nome do autor e identificadores de candidatura; não publicar imagens. |
| DOC-026 | `blogs-pdf-docs/cases/jobs-tech.xlsx` | xlsx | Planilha de gestão de candidaturas (empresa, requisitos, vaga, etapas, status), aba de indicações, textos de experiência e faixas salariais de referência. | sensivel-anonimizar | pipeline de candidaturas, leitura de requisitos, faixa salarial, indicação | iniciante | template career de pipeline + artigo sobre requisitos mais pedidos para júnior | career | Parcial (empresas do processo seletivo publicadas em career/empresas) | Aba de indicações tem nomes de pessoas e links pessoais: excluir. Salários só como faixa genérica. |
| DOC-027 | `blogs-pdf-docs/cases/jojb - CRM Developer Jr - Cadastra - 17-08-2026.pdf` | pdf | Anúncio público de vaga júnior de CRM Developer (Marketing Cloud, SQL, SSJS, AMPscript, Node.js), benefícios e etapas do processo. | sensivel-anonimizar | leitura de vaga, CRM, Salesforce Marketing Cloud, benefícios, etapas | iniciante | guia career: como ler uma vaga, reconhecer empresa boa e se preparar | career, tools | Parcial (Cadastra consta em career/empresas) | Vaga é pública; pode citar a empresa ou generalizar. Nenhum dado pessoal. |
| DOC-028 | `blogs-pdf-docs/cases/os 10 princípios da lgpd.docx` | docx | Capturas de uma "pílula de conscientização" interna de empresa sobre os 10 princípios da LGPD (Lei 13.709). | sensivel-anonimizar | LGPD, princípios de tratamento de dados, conformidade | iniciante | artigo próprio sobre os 10 princípios a partir do texto da lei (fonte pública), sem as imagens internas | learn-tech, career | Não | Material interno de empregador: usar a lei como fonte, não as capturas. |
| DOC-029 | `blogs-pdf-docs/cases/programming_for_everybody_Le_Wagon_compressed.pdf` | pdf | Folheto de programa online gratuito de 8 semanas (HTML, CSS, terminal e GitHub, Ruby, JavaScript) de uma escola de bootcamps. | terceiro-citavel | introdução à programação, HTML, CSS, Git, Ruby, JavaScript | iniciante | cobertura (se participou) ou referência | bootcamps, learn-tech | Não | PDF de imagens (texto obtido por OCR). |

### certificate-souforce_abc/ (1 arquivo)

| ID | Caminho | Tipo | Do que se trata | Direitos | Competências/temas | Nível | Estratégia | Destinos | Já publicado? | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| DOC-030 | `blogs-pdf-docs/certificate-souforce_abc/Marketing Cloud Essentials por Souforce.docx` | docx | Anotações do autor sobre curso de Salesforce Marketing Cloud (contratação, jornada do cliente, studios de e-mail, mobile, social, web) com 39 capturas e progresso. | proprio | CRM, automação de marketing, jornada do cliente, Email Studio | intermediário | programa learn-tech de CRM/automação com case de empresa fictícia; enriquecer ficha em tools | tools, learn-tech | Sim (tools: Salesforce Marketing Cloud, via cobertura.json) | Capturas são do curso (terceiro): não publicar. Nome do instrutor não entra. |

### convocacao-nacional/ (1 arquivo)

| ID | Caminho | Tipo | Do que se trata | Direitos | Competências/temas | Nível | Estratégia | Destinos | Já publicado? | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| DOC-031 | `blogs-pdf-docs/convocacao-nacional/metodo-rgv-*.txt` | txt | Arquivo vazio (0 bytes) reservado para anotações de um evento/palestra sobre um método de vendas. | proprio | vendas, palestra | - | levantar material antes de decidir (possível cobertura de evento) | bootcamps | Não | Sem conteúdo. O evento também aparece no item IA - Mentor. |

### digital_library/ (18 arquivos)

| ID | Caminho | Tipo | Do que se trata | Direitos | Competências/temas | Nível | Estratégia | Destinos | Já publicado? | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| DOC-032 | `blogs-pdf-docs/digital_library/0. Livros-grátis.pdf` | pdf | Corrente com lista de cerca de 300 obras clássicas em domínio público (Machado de Assis, Shakespeare, Fernando Pessoa). | terceiro-citavel | literatura, domínio público | iniciante | referência: apontar para o portal oficial Domínio Público | learn-tech | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Links não verificados; não republicar a lista. |
| DOC-033 | `blogs-pdf-docs/digital_library/1. Como Fazer Amigos - Influenciar Pessoas.pdf` | pdf | Livro de Dale Carnegie sobre relacionamento e influência. | terceiro-citavel | comunicação, relacionamento, influência | iniciante | artigo com citação curta e resumo | career, learn-tech | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Provável cópia sem licença: nunca publicar o arquivo. |
| DOC-034 | `blogs-pdf-docs/digital_library/2. Como Organizar Sua Vida Financeira Inteligência Financeira Pessoal na Prática.pdf` | pdf | Livro coordenado por Gustavo Cerbasi sobre finanças pessoais. | terceiro-citavel | finanças pessoais, orçamento, reserva | iniciante | artigo com citação: finanças para quem começa na tecnologia | career | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Provável cópia sem licença: nunca publicar o arquivo. |
| DOC-035 | `blogs-pdf-docs/digital_library/3. Método Vergara - v.1.9.1 - 2019.pdf` | pdf | E-book de Mairo Vergara sobre aprender inglês como habilidade adquirida. | terceiro-citavel | inglês, aprendizagem | iniciante | referência citada nos programas de inglês (701-704) | learn-tech | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Distribuído gratuitamente pelo autor; mesmo assim, linkar a fonte oficial. |
| DOC-036 | `blogs-pdf-docs/digital_library/4. As 6 Chaves para Conquistar suas Metas - Paulo Vieira.pdf` | pdf | Livro de Paulo Vieira sobre metas e realização pessoal. | terceiro-citavel | metas, planejamento pessoal | iniciante | referência breve em artigo de metas | learn-tech | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Provável cópia sem licença: nunca publicar o arquivo. |
| DOC-037 | `blogs-pdf-docs/digital_library/5. Pai Rico, Pai Pobre - Robert T. Kiyosaki - done.pdf` | pdf | Livro de Robert Kiyosaki sobre educação financeira. | terceiro-citavel | finanças pessoais, ativos e passivos | iniciante | citação curta em artigo de finanças | career | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Provável cópia sem licença: nunca publicar o arquivo. "done" no nome sugere leitura concluída. |
| DOC-038 | `blogs-pdf-docs/digital_library/6. Por Que Fazemos O Que Fazemos - Mario Sergio Cortella.pdf` | pdf | Livro de Mario Sergio Cortella sobre propósito e trabalho. | terceiro-citavel | propósito, carreira, motivação | iniciante | citação curta em artigo de carreira | career | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Provável cópia sem licença: nunca publicar o arquivo. |
| DOC-039 | `blogs-pdf-docs/digital_library/7. Cartas entre Amigos - trechos.pdf` | pdf | Trechos de livro de Fábio de Melo e Gabriel Chalita (cartas sobre ganhar e perder). | terceiro-citavel | reflexão, filosofia de vida | - | sem uso previsto (fora de tecnologia) | - | Não (fora do escopo em cobertura.json) | Provável cópia sem licença: nunca publicar o arquivo. Fora do escopo do ecossistema. |
| DOC-040 | `blogs-pdf-docs/digital_library/8. Casais Inteligentes Enriquecem Juntos - Gustavo Cerbasi.pdf` | pdf | Livro de Gustavo Cerbasi sobre finanças do casal. | terceiro-citavel | finanças pessoais | iniciante | referência opcional | career | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Provável cópia sem licença: nunca publicar o arquivo. Pouca aderência ao público dev. |
| DOC-041 | `blogs-pdf-docs/digital_library/9. O Cacador de Pipas - Khaled Hosseini-original.pdf` | pdf | Romance de Khaled Hosseini. | terceiro-citavel | literatura (ficção) | - | sem uso previsto | - | Não (fora do escopo em cobertura.json) | Provável cópia sem licença: nunca publicar o arquivo. Ficção fica fora, conforme cobertura.json. |
| DOC-042 | `blogs-pdf-docs/digital_library/10. O Corpo Fala - Pierre Wel e Roland Tompakow.pdf` | pdf | Livro de Pierre Weil e Roland Tompakow sobre comunicação não verbal. | terceiro-citavel | comunicação não verbal, entrevistas, apresentações | iniciante | artigo com citação: linguagem corporal em entrevistas e dailies | career, learn-tech | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Provável cópia sem licença: nunca publicar o arquivo. |
| DOC-043 | `blogs-pdf-docs/digital_library/11. google - a biografia - steven levy.pdf` | pdf | Biografia do Google por Steven Levy. | terceiro-citavel | cultura de empresas de tecnologia, história da computação, produto | iniciante | artigo com resumo e citação (cultura e produto) | career, learn-tech | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Provável cópia sem licença: nunca publicar o arquivo. |
| DOC-044 | `blogs-pdf-docs/digital_library/12. O Poder do Hábito.pdf` | pdf | Livro de Charles Duhigg sobre o ciclo do hábito. | terceiro-citavel | hábitos, rotina, produtividade | iniciante | artigo com citação: rotina de estudo | learn-tech | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Provável cópia sem licença: nunca publicar o arquivo. |
| DOC-045 | `blogs-pdf-docs/digital_library/13. Em Busca de Nós Mesmos - Clóvis de Barros Filho Pedro Calabrez.epub` | epub | Livro de Clóvis de Barros Filho e Pedro Calabrez sobre filosofia e autoconhecimento. | terceiro-citavel | autoconhecimento, filosofia | iniciante | referência opcional | learn-tech | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Provável cópia sem licença: nunca publicar o arquivo. |
| DOC-046 | `blogs-pdf-docs/digital_library/14. A Arte da Felicidade - Dalai Lama.pdf` | pdf | Livro do Dalai Lama com Howard Cutler sobre felicidade. | terceiro-citavel | bem-estar | - | sem uso previsto | - | Não (fora do escopo em cobertura.json) | Provável cópia sem licença: nunca publicar o arquivo. Pouca aderência. |
| DOC-047 | `blogs-pdf-docs/digital_library/15. Essencialismo - Greg-McKeown.epub_.pdf` | pdf | Livro de Greg McKeown sobre foco no essencial. | terceiro-citavel | priorização, foco, produtividade | iniciante | artigo com citação: priorização de projetos | learn-tech, career | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Provável cópia sem licença: nunca publicar o arquivo. |
| DOC-048 | `blogs-pdf-docs/digital_library/16. Ansiedade - Como Enfrentar o Ma - Augusto Cury.pdf` | pdf | Livro de Augusto Cury sobre ansiedade. | terceiro-citavel | saúde mental, ansiedade | iniciante | referência cuidadosa (não é orientação clínica) | learn-tech | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Provável cópia sem licença: nunca publicar o arquivo. Tema sensível: indicar ajuda profissional. |
| DOC-049 | `blogs-pdf-docs/digital_library/17. Arrume a Sua Cama - William H. Mcraven.pdf` | pdf | Livro de William H. McRaven sobre pequenos hábitos e disciplina. | terceiro-citavel | disciplina, hábitos | iniciante | citação curta em artigo de rotina | learn-tech | Parcial (pasta digital_library marcada como referência em cobertura.json; obra não citada no conteúdo) | Provável cópia sem licença: nunca publicar o arquivo. |

### excel-bcc/ (18 arquivos)

| ID | Caminho | Tipo | Do que se trata | Direitos | Competências/temas | Nível | Estratégia | Destinos | Já publicado? | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| DOC-050 | `blogs-pdf-docs/excel-bcc/C*.xls` | xls | Planilha de treino de Excel (PROCV, tabela dinâmica, formatação condicional, gráfico, validação, classificação) montada sobre base real de funcionários de um contact center. | sensivel-anonimizar | Excel: PROCV, tabela dinâmica, validação de dados | iniciante | exercício prático recriado com dados fictícios | learn-tech, tools | Não | Contém matrícula e nomes de operadores, supervisores e gerentes: nunca publicar. |
| DOC-051 | blogs-pdf-docs/excel-bcc/Material  C*.docx, Material  C* 2.docx, Material  C* 3.docx (3 arquivos) | docx | Comunicado interno (2016) de seleção para promoção em contact center com etapas (inscrição via gestor, provas de qualidade, Excel e redação, apresentação e banca) e material de estudo. | sensivel-anonimizar | processo seletivo interno, promoção, preparação para provas | iniciante | guia career anonimizado: seleção interna e promoção | career | Não | Versões 2 e 3 são idênticas byte a byte. O nome do arquivo tem nome de pessoa: não usar. |
| DOC-052 | blogs-pdf-docs/excel-bcc/Prova*.doc (9 arquivos) + prova 2.xlsx + prova 6.xlsx | doc, xlsx | Conjunto de provas práticas de Excel de seleções para representante, assistente e supervisor (TMA, metas, SE aninhado, média, formatação condicional, gráficos combinados) e duas resoluções. | sensivel-anonimizar | Excel, fórmulas condicionais, indicadores (TMA, % de meta), gráficos, formatação condicional | iniciante a intermediário | programa learn-tech "Excel para indicadores operacionais" com exercícios reescritos e dados fictícios | learn-tech, career, tools | Não | Prova5 e "Prova Excel ASSIST. DE APOIO" têm o mesmo enunciado. Prova9 traz nomes de colaboradores: substituir. |
| DOC-053 | blogs-pdf-docs/excel-bcc/RESUMO DE ATENDIMENTO.pdf, RESUMO DE MONITORAÇÃO.pdf, RESUMO DE SGQ I.pdf (3 arquivos) | pdf | Resumos de estudo sobre conceitos de atendimento (inbound/outbound, não conformidade), monitoria de qualidade por quadrantes e princípios de gestão da qualidade. | sensivel-anonimizar | qualidade no atendimento, monitoria, ISO 9001, indicadores | iniciante | artigo próprio sobre qualidade e métricas de atendimento (genérico) | learn-tech, career | Não | Citam a empresa contratante; generalizar. Autoria (do autor ou da empresa) a confirmar. |

### ifsudestejf/ (10 arquivos)

| ID | Caminho | Tipo | Do que se trata | Direitos | Competências/temas | Nível | Estratégia | Destinos | Já publicado? | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| DOC-054 | blogs-pdf-docs/ifsudestejf/PROVA*.pdf exceto PROVA B (5 arquivos) | pdf | Provas de exames de seleção para cursos técnicos (integrado e subsequente, 2015-2016) de instituto federal, 40 a 50 questões de múltipla escolha. | terceiro-citavel | exame de seleção, português, matemática, conhecimentos gerais | iniciante | guia de preparação para exame de curso técnico com questões citadas e links oficiais | learn-tech, career, bootcamps | Parcial (evento if-sudeste-mg-informatica publicado, sem estas provas) | Documento público. Cabeçalho indica IFMG, embora a pasta se chame ifsudestejf. |
| DOC-055 | blogs-pdf-docs/ifsudestejf/Gabarito - *.pdf + PROVA B - Gabarito*.pdf (3 arquivos) | pdf | Gabaritos preliminares de uma página dos mesmos exames. | terceiro-citavel | exame de seleção | iniciante | apoio ao guia acima (não republicar) | learn-tech | Não | Documento público. |
| DOC-056 | blogs-pdf-docs/ifsudestejf/GABARITO SUBSEQUENTE 2016.1.pdf + gabarito  INTEGRADO 2016.1.pdf (2 arquivos) | pdf | Cadernos de prova com gabarito por área (linguagens, matemática etc.) do exame 2016/1, 44 a 48 p. | terceiro-citavel | exame de seleção, interpretação de texto | iniciante | apoio ao guia acima | learn-tech | Não | Documento público. |

### plataforma-spe/ (2 arquivos)

| ID | Caminho | Tipo | Do que se trata | Direitos | Competências/temas | Nível | Estratégia | Destinos | Já publicado? | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| DOC-057 | `blogs-pdf-docs/plataforma-spe/seu proximo emprego.docx` | docx | Anotações com 32 capturas de um curso online pago de empregabilidade (introdução, comece aqui, uso de ChatGPT, mapa de carreiras, LinkedIn). | terceiro-citavel | empregabilidade, LinkedIn, IA na busca de emprego, mapa de carreiras | iniciante | referência; artigo próprio com resumo breve, sem capturas | career | Não | Curso pago: só citação e resumo. Capturas podem exibir nome do instrutor. |
| DOC-058 | `blogs-pdf-docs/plataforma-spe/seu-proximo-emprego.docx` | docx | Arquivo de acesso à mesma plataforma de curso. | sensivel-anonimizar | - | - | não usar como conteúdo | - | Não | ALERTA: contém credencial de acesso (login e senha) de uma terceira pessoa. Não copiar; recomenda-se tirar do acervo e trocar a senha. |

### programa-pitang/ (1 arquivo)

| ID | Caminho | Tipo | Do que se trata | Direitos | Competências/temas | Nível | Estratégia | Destinos | Já publicado? | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| DOC-059 | `blogs-pdf-docs/programa-pitang/douglasabnovato-Programa-Pitang.mp4` | mp4 | Vídeo vertical do próprio autor (cerca de 50 s, 478x850) sobre o Programa Pitang, programa de formação de uma empresa de software (conteúdo do vídeo não assistido; inferido pelo nome). | proprio | formação profissional, programa de talentos, comunicação em vídeo | iniciante | cobertura de evento com vídeo no YouTube do autor (link) | bootcamps | Não | Subir como Shorts ou não listado e referenciar por link; conferir se aparecem terceiros. |

### tp-integra-ufjf/ (7 arquivos)

| ID | Caminho | Tipo | Do que se trata | Direitos | Competências/temas | Nível | Estratégia | Destinos | Já publicado? | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| DOC-060 | blogs-pdf-docs/tp-integra-ufjf/Edital_TP_NRC_2017_*.pdf (7 arquivos) | pdf | Editais públicos (2017) do núcleo de recursos computacionais de universidade federal: governança de TI, controle de frequência, gerência de rede, gestão acadêmica, sistema de segurança, previsão de vagas, entrega contínua. | terceiro-citavel | projetos de TI acadêmicos, governança, redes, entrega contínua, sistemas acadêmicos | iniciante | cobertura (se o autor foi bolsista) + estudo de caso de projetos de TI na universidade | bootcamps, career, learn-tech | Não | O arquivo "APOIO_A_GESTAO_ACADEMICA" contém na verdade o projeto de governança de TI (nome trocado). Nomes de orientadores não entram. |

## 4. Propostas de conteúdo

Formato de cada item: **título proposto** (IDs de origem). Formato. Objetivo de aprendizagem. Itens marcados com (forte) são as prioridades sugeridas.

### learn-tech

1. **Do briefing ao MVP: o site institucional de uma escola técnica (forte)** (DOC-004, DOC-006). Formato: programa learn-tech (6 módulos: entrevista com stakeholder, requisitos funcionais e não funcionais, mapa de seções, mockup no Figma, proposta e escopo, MVP em React) com quiz e repositório de código; empresa com nome fictício. Objetivo: Ao final, a pessoa consegue conduzir um levantamento de requisitos, transformar o briefing em mapa de seções e mockup, delimitar um MVP e escrever uma proposta de escopo.
2. **Excel para indicadores operacionais (forte)** (DOC-050, DOC-052, DOC-053). Formato: programa learn-tech com exercícios práticos reescritos (TMA, % de meta, SE aninhado, PROCV, tabela dinâmica, formatação condicional, gráfico combinado) e planilhas com dados fictícios. Objetivo: Ao final, a pessoa consegue montar uma planilha de indicadores de equipe, aplicar regras de pontuação com fórmulas condicionais e apresentar os resultados em gráfico, como pedem provas práticas de seleção.
3. **Gerir vários projetos sem travar: kanban, sprints e IA como mentora (forte)** (DOC-003, DOC-022, DOC-044, DOC-047, DOC-049). Formato: artigo + página de mentoria (rotina com time-blocking, coluna Ideias, storytelling de card, prompts de IA) com citações curtas de Duhigg, McKeown e McRaven; template de grade semanal. Objetivo: Ao final, a pessoa consegue organizar frentes paralelas em um board, planejar a semana em blocos e usar IA para priorizar sem perder o próprio julgamento.
4. **LGPD para quem desenvolve: os 10 princípios na prática** (DOC-028, DOC-010). Formato: módulo no programa 404 (Segurança de Dados) + artigo, a partir do texto da Lei 13.709 e de um aviso de privacidade real citado. Objetivo: Ao final, a pessoa consegue explicar os 10 princípios e identificar, numa funcionalidade, finalidade, necessidade e transparência no tratamento de dados.
5. **React Native: persistência segura e criptografia** (DOC-011). Formato: módulo de um futuro programa mobile + quiz próprio (questões reescritas sobre AES, chaves, IV e armazenamento). Objetivo: Ao final, a pessoa consegue escolher onde e como guardar dados sensíveis num app e cifrar/decifrar valores com uma biblioteca de criptografia simétrica.
6. **Vitrine a partir de JSON** (DOC-001). Formato: exercício prático no programa 4 (JavaScript) com catálogo fictício. Objetivo: Ao final, a pessoa consegue modelar um catálogo em JSON e renderizar cards com filtro por categoria e preço promocional.
7. **Glossário de tags HTML comentado** (DOC-002). Formato: página de referência no programa 2 com exemplos próprios e link para MDN. Objetivo: Ao final, a pessoa consegue escolher a tag semântica certa para estrutura, formulário e mídia.
8. **Criatividade e geração de ideias para devs** (DOC-023). Formato: artigo com resumo e citação curta. Objetivo: Ao final, a pessoa consegue aplicar um método simples de geração de ideias a um problema de produto.
9. **Qualidade no atendimento: monitoria, quadrantes e ISO 9001** (DOC-053). Formato: artigo genérico (sem nome de empresa) ligado a produtos digitais e suporte. Objetivo: Ao final, a pessoa consegue explicar como a qualidade de atendimento é medida e como isso vira requisito de software.
10. **Deep tech: do laboratório ao produto** (DOC-007). Formato: artigo com resumo e citação do relatório, ligado ao programa 501/504. Objetivo: Ao final, a pessoa consegue explicar TRL, o papel da propriedade intelectual e por que tecnologia não é sinônimo de negócio.
11. **Aprender inglês como habilidade** (DOC-035). Formato: referência citada nos programas 701-704. Objetivo: Ao final, a pessoa consegue montar uma rotina de prática de inglês baseada em método, e não em "dom".
12. **Como se preparar para o exame de seleção de curso técnico** (DOC-054, DOC-055, DOC-056). Formato: guia com estrutura da prova, tipos de questão e links oficiais (sem republicar provas). Objetivo: Ao final, a pessoa consegue planejar o estudo para um exame de instituto federal e treinar com provas oficiais.

### career

1. **Como é um processo seletivo e como se preparar (forte)** (DOC-008, DOC-051, DOC-025, DOC-026). Formato: guia career anonimizado: etapas típicas (teste cultural, triagem, recrutador, liderança, stakeholder, desafio, oferta, integração), seleção interna e promoção, checklist por etapa. Objetivo: Ao final, a pessoa consegue reconhecer em que etapa está, o que é avaliado em cada uma e preparar respostas e entregas adequadas.
2. **Como ler uma vaga e reconhecer uma boa empresa (forte)** (DOC-027, DOC-026). Formato: guia career com uma vaga pública como exemplo (requisitos obrigatórios x desejáveis, benefícios, modelo de trabalho, etapas) e checklist de sinais de empresa saudável. Objetivo: Ao final, a pessoa consegue separar requisito de desejo, estimar o fit e decidir se e como se candidatar.
3. **Testes técnicos online: o que esperar e como treinar** (DOC-025, DOC-011). Formato: guia career anonimizado (plataformas de assessment, JavaScript, React, problem solving, tempo de prova). Objetivo: Ao final, a pessoa consegue se preparar para testes cronometrados e montar um plano de treino.
4. **Pipeline de candidaturas: planilha modelo** (DOC-026). Formato: template baixável (empresa, requisitos, etapa, status, próxima ação) sem dados reais + artigo. Objetivo: Ao final, a pessoa consegue acompanhar várias candidaturas e aprender com cada etapa.
5. **Perfil encontrável: palavras-chave no LinkedIn** (DOC-005, DOC-057). Formato: artigo próprio com citação curta. Objetivo: Ao final, a pessoa consegue ajustar título, sobre, experiências e competências para aparecer em buscas de recrutadores.
6. **Seus dados quando você se candidata** (DOC-010). Formato: artigo com trecho citado de um aviso de privacidade real. Objetivo: Ao final, a pessoa consegue ler um aviso de privacidade de recrutamento e exercer seus direitos de titular.
7. **Networking com propósito e pitch de 60 segundos** (DOC-012, DOC-003). Formato: guia career (sem nomes de participantes). Objetivo: Ao final, a pessoa consegue apresentar o que faz e o próximo passo em menos de um minuto num grupo de negócios.
8. **Proposta de freelancer: escopo, prazo e preço** (DOC-004, DOC-006). Formato: estudo de caso com nome fictício e valores em proporção. Objetivo: Ao final, a pessoa consegue escrever uma proposta comercial clara para um pequeno cliente.
9. **Bolsas e projetos na universidade: como ler um edital** (DOC-017, DOC-024, DOC-060). Formato: guia career. Objetivo: Ao final, a pessoa consegue identificar requisitos, carga horária e critérios de seleção de bolsas de treinamento profissional.
10. **Marca pessoal e produto digital do dev** (DOC-021). Formato: artigo + template de mapa mental. Objetivo: Ao final, a pessoa consegue desenhar o próprio plano de marca, portfólio e produtos.
11. **Comunicação não verbal em entrevistas e dailies** (DOC-042, DOC-033). Formato: artigo com citações curtas (Weil e Tompakow; Carnegie). Objetivo: Ao final, a pessoa consegue perceber e ajustar postura e escuta em entrevistas e reuniões.
12. **Escolher uma formação para começar em dev** (DOC-020, DOC-014, DOC-015, DOC-029, DOC-019). Formato: artigo comparativo de formatos (graduação, técnico, bootcamp, curso gratuito) citando as ementas. Objetivo: Ao final, a pessoa consegue comparar formações por conteúdo, carga, custo e prática.
13. **Finanças pessoais para o primeiro salário em tecnologia** (DOC-034, DOC-037, DOC-026). Formato: artigo com citações curtas (Cerbasi, Kiyosaki) e faixas salariais genéricas. Objetivo: Ao final, a pessoa consegue montar orçamento e reserva a partir do primeiro salário.
14. **O que a história do Google ensina sobre cultura de empresa tech** (DOC-043, DOC-038). Formato: artigo com resumo e citação (Steven Levy; Cortella). Objetivo: Ao final, a pessoa consegue identificar sinais de cultura de engenharia e propósito numa empresa.

### bootcamps

1. **Programa Pitang** (DOC-059). Formato: cobertura de formação com vídeo no YouTube do autor (link). Objetivo: Ao final, a pessoa consegue entender como funciona um programa de formação de empresa e o que o autor viveu nele.
2. **Treinamento Profissional no NuRC/ICE da UFJF** (DOC-024, DOC-060, DOC-017). Formato: cobertura (se confirmada a participação). Objetivo: Ao final, a pessoa consegue ver como um projeto de TI universitário (entrega contínua, governança, sistemas acadêmicos) forma experiência prática.
3. **Eventos citados na conversa de mentoria** (DOC-003, DOC-031). Formato: novas páginas de cobertura: StartInterns Challenge, encontro sobre blockchain Stellar, Conferência ABC Day, HackTown, Elementech JF, palestra do Método RGV, eventos de networking e de produtos. Objetivo: Ao final, a pessoa consegue conhecer o evento, o que foi aprendido e como aproveitar um evento parecido.
4. **Experience Summit (arquitetura e design)** (DOC-018). Formato: cobertura (se assistiu). Objetivo: Ao final, a pessoa consegue relacionar marketing digital e personas a um setor fora da tecnologia.
5. **Bootcamp 23.1 (comunidade Netuno), Programming for Everybody (Le Wagon), Digital House** (DOC-019, DOC-029, DOC-014, DOC-015). Formato: cobertura de formação, apenas para as confirmadas. Objetivo: Ao final, a pessoa consegue comparar formatos de bootcamp a partir da experiência real do autor.
6. **Reunião de grupo de networking empresarial** (DOC-012). Formato: cobertura anônima (sem lista de participantes nem prints). Objetivo: Ao final, a pessoa consegue saber como funciona uma reunião desse tipo e se vale para ela.

### tools

1. **Salesforce Marketing Cloud: enriquecer a ficha** (DOC-030, DOC-027). Formato: atualizar ficha existente (studios, Journey Builder, AMPscript, SSJS). Objetivo: Ao final, a pessoa consegue saber para que serve a ferramenta e o que uma vaga de CRM espera dela.
2. **Microsoft Excel / Google Planilhas** (DOC-052, DOC-050). Formato: nova ficha. Objetivo: Ao final, a pessoa consegue saber quando usar planilha e onde praticar.
3. **GLPI** (DOC-024). Formato: nova ficha (software livre de service desk e inventário citado em edital de governança de TI). Objetivo: Ao final, a pessoa consegue conhecer uma ferramenta livre de gestão de chamados.
4. **CryptoJS** (DOC-011). Formato: nova ficha (biblioteca de criptografia em JavaScript). Objetivo: Ao final, a pessoa consegue saber quando usar e quais cuidados ter.
5. **GitHub Projects** (DOC-003). Formato: complementar a ficha do GitHub com boards de projeto. Objetivo: Ao final, a pessoa consegue gerir tarefas em kanban no próprio repositório.

## 5. Dúvidas para o Douglas validar

1. Instituto Salus (DOC-004, DOC-006): confirma que o case pode ser publicado com nome fictício? Sugestão: "Instituto Aurora de Educação em Saúde". O projeto foi aprovado/entregue? Valores somem ou ficam em proporção?
2. Catálogo de livros infantis (DOC-001): é de um cliente real (loja) ou exercício seu? Se for cliente, também vira case com nome fictício.
3. Agibank (DOC-008): o guia se declara público. Prefere citar o banco pelo nome como exemplo ou generalizar como "um banco digital"?
4. Cadastra (DOC-027): citar a vaga pelo nome (a empresa já está em career/empresas) ou generalizar? Você participou do processo?
5. IA - Mentor (DOC-003): autoriza usar a metodologia (prompts, rotina, kanban) em artigo, sem nomes de empregador, clientes e colegas? Quais eventos citados ali você quer cobrir?
6. Projetos citados na rotina (DOC-022, DOC-003): ABC da Construção, ByteClass, Volta Express, MedTrem, facilAdmin podem aparecer pelo nome ou viram rótulos genéricos?
7. EBOOK "Só Vai HealthStyle" (DOC-016): é de sua autoria ou coautoria? Se for seu, muda para `proprio`.
8. Resumos de atendimento, monitoria e SGQ (DOC-053) e o comunicado de seleção interna (DOC-051): foram escritos por você (resumo de estudo) ou são material da empresa? Autoriza citar a empresa de contact center?
9. Participação confirmada em: Programa Pitang (DOC-059), Bootcamp 23.1 Netuno (DOC-019), Le Wagon (DOC-029), Digital House (DOC-014, DOC-015), Experience Summit (DOC-018), Treinamento Profissional UFJF/NuRC (DOC-017, DOC-024, DOC-060), grupo de networking BNI (DOC-012)? Só o que for confirmado vira página em bootcamps.
10. Vídeo Pitang (DOC-059): pode subir no seu YouTube (público ou não listado)? Aparecem outras pessoas?
11. Provas do IF (DOC-054 a DOC-056): a pasta se chama ifsudestejf, mas os cabeçalhos são do IFMG. Qual instituição você cursou e qual relação com estas provas?
12. Arquivo vazio do Método RGV (DOC-031): há anotações em outro lugar? Era um evento a cobrir?
13. DOC-058 contém login e senha de outra pessoa numa plataforma de curso. Sugestão: tirar do acervo e avisar a pessoa para trocar a senha. O curso (DOC-057) foi seu ou de terceiro?
14. Biblioteca digital (DOC-032 a DOC-049): confirma que os PDFs ficam só como bibliografia (sem hospedar)? Quais livros entram de fato nos artigos? Ficção e autoajuda sem relação com tecnologia ficam fora (DOC-039, DOC-041, DOC-046)?
15. Captura do BNI (DOC-013): não foi inspecionada visualmente; confirma que não será publicada?
16. Provas de Excel (DOC-052): eram de processos seletivos em que você participou? Posso reescrever os enunciados como exercícios próprios do LearnTECH?
17. Deep Tech Radar (DOC-007): o acesso foi público (download livre) ou restrito a participantes? Isso define se podemos linkar.
18. Atualizar `content/cobertura.json` com a pasta `hd/blogs-pdf-docs` depois das decisões acima?
