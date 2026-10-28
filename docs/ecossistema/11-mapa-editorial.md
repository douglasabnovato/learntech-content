# Mapa editorial do acervo hd

Situação em 28/10/2026. Base: `01-inventario-documentos.md` (DOC-001 a DOC-060), `01-inventario-eventos.md` (EV-001 a EV-007), `03-modelo-canonico.md`, `04-matriz-conteudo.md`, `08-piloto-codexperience.md`, `09-relatorio-2026-10-28.md`, `10-uso-do-hd.md`, `content/cobertura.json` e os JSON publicados em `content/`. Os arquivos brutos do `hd` não foram relidos.

Princípio do Douglas: não é preciso usar todos os arquivos; é preciso ter tudo catalogado e explorado com qualidade, sabendo para qual tipo de conteúdo da API cada item serve. Este documento responde a isso: cada um dos 67 itens do inventário recebe um tipo primário e, quando houver, tipos secundários entre os 7 tipos abaixo, com estado, onde já está publicado, potencial e próxima ação.

| Código | Tipo de conteúdo | Recurso na API |
|---|---|---|
| programa | learn-tech · programa de aprendizado | `content/learn-tech/programas/{id}.json` |
| artigo | learn-tech · artigo do blog | `content/learn-tech/paginas/blog.json` (`itens[].id`) |
| ferramenta | tools · ferramenta | `content/tools/ferramentas.json` (chave `title`) |
| empresa | career · empresa | `content/career/empresas.json` (chave `title`) |
| vaga | career · vaga/oportunidade | `content/career/vagas.json` (chave `title`) |
| profissional | career · profissional (perfil) | `content/career/perfis.json` (chave `title`) |
| evento | bootcamps · evento/formação | `content/bootcamps/eventos/{slug}.json` |

Career, tools e bootcamps terão página de detalhe por item (texto, imagens, vídeo do YouTube, site oficial e redes). Por isso um item do `hd` pode servir de duas formas: **criar** um item novo ou **enriquecer** a página de detalhe de um item que já existe (por exemplo, o vídeo do Programa Pitang na página da empresa Pitang).

## 1. Regra de decisão

### 1.1 Perguntas para classificar um item

Responda na ordem. A primeira resposta "sim" define o tipo primário; as seguintes que também forem "sim" viram tipos secundários.

| # | Pergunta | Se sim | Exemplo no acervo |
|---|---|---|---|
| 1 | O material permite montar aprendizagem estruturada, com sequência, prática e verificação (módulos, passos, exercícios, quiz)? | programa | Provas de Excel (DOC-052), caso anonimizado do site institucional (DOC-004, DOC-006) |
| 2 | É opinião, guia, resumo, relato ou reflexão que se lê de uma vez, sem sequência de estudo? | artigo | Guia de processo seletivo de um banco digital (DOC-008), livros da biblioteca |
| 3 | Fala de um software, biblioteca ou serviço que alguém usa para trabalhar ou estudar? | ferramenta | Anotações de Salesforce Marketing Cloud (DOC-030) |
| 4 | Fala de uma organização (empresa, escola, comunidade) que contrata, forma ou reúne pessoas? | empresa | Digital House, Le Wagon, Netuno, Pitang (DOC-014, 029, 019, 059) |
| 5 | É uma oportunidade com inscrição (vaga, bolsa, programa seletivo) que outra pessoa pode aproveitar hoje? | vaga | Santander Open Academy (EV-005) |
| 6 | Apresenta uma pessoa pública que serve de referência na área, com trabalho aberto (canal, blog, livro técnico)? | profissional | Só pistas nas capturas de 2022 (EV-004) |
| 7 | É uma vivência do Douglas com data (evento, formação, desafio), com prova de participação? | evento | CodeXperience 2023 (EV-001), Startup Way Challenge 2023 (EV-007) |
| - | Nenhuma das anteriores, ou o item não pode sair do computador | nenhum | Log de driver (DOC-009), credencial de terceiro (DOC-058) |

Desempates usados neste mapa:

- **Programa vence artigo** quando o material tem exercício ou passo a passo reaproveitável (provas, briefing, gabaritos).
- **Evento exige prova.** Sem certificado, foto, vídeo ou confirmação do Douglas, a organização vira **empresa** e a vivência fica como tipo secundário a confirmar (decisão 11 do relatório `09`).
- **Guias de carreira são artigos.** O career só exibe listas; o texto longo fica no blog do learn-tech com a etiqueta "Carreira" (decisão 1 do `09`). Se o career ganhar uma seção de guias, esses artigos passam a ser lidos de lá, sem mudar a classificação.
- **Página de detalhe conta como uso.** Quando o item só acrescenta texto, imagem, vídeo ou link a algo que já existe na API, o tipo é o do item existente e a ação começa com "enriquecer".

### 1.2 Critérios de qualidade

Cada item recebe **alto**, **médio** ou **baixo** potencial pela soma destes critérios:

| Critério | Pergunta | Peso |
|---|---|---|
| Fonte própria | Foi produzido ou vivido pelo Douglas (foto, vídeo, anotação, projeto)? Material próprio diferencia o ecossistema; material de terceiro só vira citação e resumo | alto |
| Direitos | Pode ser publicado? `proprio` sim; `terceiro-citavel` só como referência; `sensivel-anonimizar` só a lição, com nomes fictícios; `descartar` nunca | eliminatório |
| Profundidade | Rende um programa ou uma página de detalhe completa, ou só uma citação? | alto |
| Atualidade | O assunto ainda vale em 2026? Material de 2016 a 2022 precisa de atualização antes de sair | médio |
| Valor para quem está começando | Ajuda alguém em transição ou no primeiro emprego a decidir ou fazer algo concreto? | alto |

Leitura da escala: **alto** = fonte própria ou exclusiva, com profundidade e utilidade imediata; **médio** = bom apoio, mas de terceiro, datado ou dependente de confirmação; **baixo** = só citação, fora do escopo ou não publicável.

Regras de privacidade aplicadas nas descrições: sem dados pessoais; o processo seletivo do banco aparece como "um banco digital", a vaga de CRM como "uma agência de CRM" e o caso de cliente com nome fictício.

## 2. Tabela principal

Estados: **publicado** (o conteúdo derivado já está na API), **publicado em parte** (parte usada, parte ainda rende), **planejado** (destino definido, ainda não feito), **referência** (só apoio ou citação opcional), **não publicável** (nada sai). A coluna "Onde está publicado" usa ids reais da API no formato `recurso/id`.

| ID | Descrição curta | Tipo primário | Tipos secundários | Estado | Onde está publicado | Potencial | Próxima ação |
|---|---|---|---|---|---|---|---|
| DOC-001 | Catálogo de livros infantis em JSON para uma vitrine de loja | programa | artigo | planejado | - | médio | Exercício "Vitrine a partir de JSON" com dados fictícios para tirar o programa 4 da capa |
| DOC-002 | Dicionário de tags HTML de uma newsletter (terceiro) | programa | artigo | planejado | - | médio | Glossário próprio de tags com exemplos e link para a MDN, como módulo do programa 2 |
| DOC-003 | Conversa longa com IA usada como mentora de gestão de projetos e rotina | programa | artigo, evento | publicado | programas/602; blog/rotina-desenvolvedor; ferramentas/GitHub (ampliada) | alto | Extrair a lista de eventos citados e confirmar quais viram evento; artigo de prompts de mentoria |
| DOC-004 | Proposta de site institucional de uma escola técnica de saúde (caso anonimizado) | programa | artigo | publicado | programas/503; blog/proposta-freelancer-escopo-prazo-preco | alto | Nenhuma urgente; reaproveitar como projeto final do programa 501 |
| DOC-005 | Guia de terceiro sobre palavras-chave no perfil do LinkedIn | artigo | - | publicado | blog/perfil-encontravel-linkedin | médio | Nenhuma |
| DOC-006 | Briefing do mesmo caso anonimizado (escopo, MVP, cursos) | programa | artigo | publicado | programas/503; blog/proposta-freelancer-escopo-prazo-preco | alto | Nenhuma; manter junto do DOC-004 |
| DOC-007 | Relatório de mercado sobre deep tech na América Latina (terceiro) | artigo | programa | planejado | - | médio | Artigo "Deep tech: do laboratório ao produto" com citação e link oficial; referência nos programas 501 e 504 |
| DOC-008 | Guia de candidato de um banco digital com as etapas do processo seletivo | artigo | - | publicado | blog/processo-seletivo-como-se-preparar | alto | Nenhuma; manter o banco anonimizado |
| DOC-009 | Log técnico de driver de áudio | - | - | não publicável | - | baixo | Nenhuma (descartar) |
| DOC-010 | Aviso de privacidade de ferramenta de recrutamento de uma consultoria global | artigo | programa | publicado | blog/lgpd-seus-dados-ao-se-candidatar; programas/404 | médio | Nenhuma |
| DOC-011 | Gabarito de exercício de React Native avançado (criptografia, persistência) | programa | ferramenta | publicado | programas/404; ferramentas/CryptoJS | médio | Quiz próprio para um futuro programa mobile; enriquecer a página de detalhe do CryptoJS |
| DOC-012 | Anotações de reunião de um grupo regional de networking empresarial | artigo | evento | publicado | blog/networking-pitch-60-segundos | médio | Evento só se a participação for confirmada e sem participantes |
| DOC-013 | Captura de tela da sala virtual da mesma reunião | - | - | não publicável | - | baixo | Nenhuma (tem participantes) |
| DOC-014 | Programa de curso de formação dev de uma escola digital (Digital House) | empresa | artigo, evento | publicado | empresas/Digital House; blog/escolher-formacao-dev | médio | Conferir o site oficial da Digital House; ementa como texto na página de detalhe da empresa |
| DOC-015 | Programa de curso full stack da mesma escola | empresa | artigo | publicado | empresas/Digital House; blog/escolher-formacao-dev | baixo | Junto com o DOC-014 na página de detalhe |
| DOC-016 | E-book de estilo de vida sobre produtividade e saúde | artigo | - | referência | - | baixo | Confirmar autoria; se for do Douglas, artigo próprio de rotina e saúde |
| DOC-017 | Edital público de bolsa de treinamento profissional (universidade federal, 2019) | artigo | vaga | publicado | blog/bolsas-universidade-como-ler-edital | médio | Conferir se o programa de bolsas TP ainda existe; se sim, item em vagas |
| DOC-018 | Slides de palestra sobre marketing digital para arquitetura e design | artigo | evento | planejado | - | baixo | Artigo sobre personas e funil com citação; evento só se assistiu |
| DOC-019 | E-mail de convite para o Bootcamp 23.1 de uma comunidade open source (Netuno) | empresa | artigo, evento, vaga | publicado | empresas/Netuno; blog/escolher-formacao-dev | médio | Evento se a participação for confirmada; página de detalhe da Netuno com a stack do bootcamp |
| DOC-020 | Guia de uma escola online para começar do zero em desenvolvimento (2022) | artigo | - | publicado | blog/escolher-formacao-dev | médio | Atualizar dados de 2022 na próxima revisão do artigo |
| DOC-021 | Mapa mental do autor sobre marca pessoal e produto digital (2024) | artigo | - | planejado | - | médio | Artigo "Marca pessoal e produto digital do dev" com template baixável |
| DOC-022 | Grade semanal de rotina por blocos de horário | programa | artigo | publicado | programas/602; blog/rotina-desenvolvedor | alto | Template de planilha com rótulos genéricos para download |
| DOC-023 | Apostila sobre criatividade e geração de ideias (terceiro) | artigo | - | planejado | - | baixo | Artigo curto com resumo e citação |
| DOC-024 | Editais de treinamento profissional de universidade federal (2017-2018), 6 arquivos | artigo | ferramenta, evento | publicado em parte | blog/bolsas-universidade-como-ler-edital; ferramentas/GLPI | médio | Evento de formação se o Douglas foi bolsista; enriquecer a página de detalhe do GLPI |
| DOC-025 | Diário de candidaturas com testes técnicos online | artigo | - | publicado | blog/testes-tecnicos-online | alto | Nenhuma (capturas não saem) |
| DOC-026 | Planilha de gestão de candidaturas e faixas salariais | artigo | empresa | publicado | blog/como-ler-uma-vaga; blog/processo-seletivo-como-se-preparar | alto | Template baixável de pipeline sem dados reais; pistas para empresas novas |
| DOC-027 | Anúncio público de vaga júnior de CRM de uma agência de CRM | artigo | ferramenta | publicado | blog/como-ler-uma-vaga; ferramentas/Salesforce Marketing Cloud | alto | Usar a lista de requisitos na página de detalhe do Salesforce Marketing Cloud |
| DOC-028 | Pílula interna de empresa sobre os 10 princípios da LGPD | programa | artigo | publicado | programas/404; blog/lgpd-seus-dados-ao-se-candidatar | alto | Nenhuma (a fonte publicada é a lei) |
| DOC-029 | Folheto de programa gratuito de introdução à programação (Le Wagon) | empresa | artigo, evento | publicado | empresas/Le Wagon; blog/escolher-formacao-dev | médio | Evento só se participou; programa gratuito como texto na página de detalhe da empresa |
| DOC-030 | Anotações do autor de curso de Salesforce Marketing Cloud | ferramenta | programa | publicado | ferramentas/Salesforce Marketing Cloud | alto | Página de detalhe completa (studios, Journey Builder, AMPscript); avaliar programa de CRM com empresa fictícia |
| DOC-031 | Arquivo vazio reservado a anotações de palestra de vendas | - | evento | não publicável | - | baixo | Levantar o material; se houver, vira evento |
| DOC-032 | Lista de obras em domínio público | - | - | não publicável | - | baixo | Nenhuma; no máximo link para o portal oficial |
| DOC-033 | Livro sobre relacionamento e influência (Carnegie) | artigo | - | publicado | blog/comunicacao-nao-verbal-entrevistas | médio | Nenhuma (só citação) |
| DOC-034 | Livro sobre organização financeira pessoal (Cerbasi) | artigo | - | publicado | blog/financas-primeiro-salario-tech | médio | Nenhuma (só citação) |
| DOC-035 | E-book sobre aprender inglês como habilidade (Vergara) | programa | artigo | planejado | - | médio | Referência citada no programa 701 ao tirá-lo da capa; artigo sobre rotina de inglês |
| DOC-036 | Livro sobre metas (Paulo Vieira) | artigo | - | referência | - | baixo | Citação opcional num artigo de metas |
| DOC-037 | Livro sobre educação financeira (Kiyosaki) | artigo | - | publicado | blog/financas-primeiro-salario-tech | baixo | Nenhuma |
| DOC-038 | Livro sobre propósito e trabalho (Cortella) | artigo | - | publicado | blog/cultura-de-empresa-tech | médio | Nenhuma |
| DOC-039 | Trechos de livro de reflexões pessoais | - | - | não publicável | - | baixo | Nenhuma (fora do escopo) |
| DOC-040 | Livro sobre finanças do casal (Cerbasi) | artigo | - | publicado | blog/financas-primeiro-salario-tech | baixo | Nenhuma |
| DOC-041 | Romance de ficção | - | - | não publicável | - | baixo | Nenhuma (fora do escopo) |
| DOC-042 | Livro sobre comunicação não verbal (Weil e Tompakow) | artigo | - | publicado | blog/comunicacao-nao-verbal-entrevistas | médio | Nenhuma |
| DOC-043 | Biografia do Google (Steven Levy) | artigo | empresa | publicado | blog/cultura-de-empresa-tech | médio | Resumo histórico com citação na página de detalhe de Google Careers |
| DOC-044 | Livro sobre o ciclo do hábito (Duhigg) | artigo | - | publicado | blog/rotina-desenvolvedor | médio | Nenhuma |
| DOC-045 | Livro de filosofia e autoconhecimento | artigo | - | referência | - | baixo | Citação opcional em artigo de soft skills |
| DOC-046 | Livro sobre felicidade | - | - | não publicável | - | baixo | Nenhuma (fora do escopo) |
| DOC-047 | Livro sobre foco no essencial (McKeown) | artigo | - | publicado | blog/rotina-desenvolvedor | médio | Nenhuma |
| DOC-048 | Livro sobre ansiedade | artigo | - | referência | - | baixo | Só com indicação de ajuda profissional, num artigo de saúde mental na carreira |
| DOC-049 | Livro sobre pequenos hábitos e disciplina (McRaven) | artigo | - | publicado | blog/rotina-desenvolvedor | baixo | Nenhuma |
| DOC-050 | Planilha de treino de Excel sobre base real de um contact center | programa | ferramenta | publicado em parte | ferramentas/Microsoft Excel | alto | Recriar como exercício com dados fictícios no programa "Excel para indicadores" |
| DOC-051 | Comunicado de seleção interna para promoção num contact center (3 arquivos) | artigo | - | publicado | blog/processo-seletivo-como-se-preparar | médio | Nenhuma |
| DOC-052 | Provas práticas de Excel de seleções internas e resoluções (11 arquivos) | programa | ferramenta, artigo | publicado em parte | ferramentas/Microsoft Excel; ferramentas/Google Planilhas | alto | Programa "Excel para indicadores operacionais" com exercícios reescritos; páginas de detalhe de Excel e Planilhas |
| DOC-053 | Resumos de estudo sobre atendimento, monitoria e gestão da qualidade | artigo | programa | planejado | - | médio | Artigo "Qualidade de atendimento vira requisito de software"; módulo de indicadores no programa de Excel |
| DOC-054 | Provas de exames de seleção para cursos técnicos de instituto federal (5 arquivos) | artigo | vaga, evento | planejado | - | médio | Guia de preparação com links oficiais; ligar ao evento if-sudeste-mg-informatica |
| DOC-055 | Gabaritos preliminares dos mesmos exames (3 arquivos) | artigo | - | referência | - | baixo | Apoio ao guia do DOC-054 (não republicar) |
| DOC-056 | Cadernos de prova com gabarito do exame 2016/1 (2 arquivos) | artigo | - | referência | - | baixo | Apoio ao guia do DOC-054 (não republicar) |
| DOC-057 | Anotações de curso pago de empregabilidade | artigo | - | publicado | blog/perfil-encontravel-linkedin | baixo | Nenhuma |
| DOC-058 | Arquivo de acesso a plataforma de curso com credencial de terceiro | - | - | não publicável | - | baixo | Tirar do acervo e avisar para trocar a senha |
| DOC-059 | Vídeo vertical do autor sobre o Programa Pitang (cerca de 50 s) | evento | empresa | publicado em parte | empresas/Pitang | alto | Subir no YouTube do Douglas; vídeo na página de detalhe da Pitang; evento se a participação for confirmada |
| DOC-060 | Editais do núcleo de recursos computacionais de universidade federal (2017), 7 arquivos | artigo | evento | publicado | blog/bolsas-universidade-como-ler-edital | médio | Evento de formação UFJF se confirmado; estudo de caso de projetos de TI na universidade |
| EV-001 | CodeXperience Zona da Mata 2023: 621 fotos e 1 vídeo do autor | evento | artigo | publicado em parte | eventos/codexperience (galeria 16); blog/eventos-de-comunidade-tech | alto | Vídeo MVI_5108 no YouTube em content.videoUrl; trocar o vídeo provisório |
| EV-002 | Minas Summit 2024: certificado de participação e material da viagem | evento | - | planejado | eventos/minas-summit (sem material do hd) | alto | Corrigir o certificado (aponta para 2025), texto da edição 2024 na página de detalhe |
| EV-003 | Material de organização do CodeXperience 2024 e 2025 (deck, roteiro, proposta, arte) | evento | artigo, ferramenta | publicado em parte | eventos/codexperience (arte 2025 e textos das edições) | alto | Seções 2024 e 2025 com 2 a 4 slides; artigo "Como organizar um evento de comunidade" |
| EV-004 | Capturas de 2022 sobre vagas, mentorias e conteúdos de carreira | vaga | profissional, artigo | referência | - | médio | Usar como pistas para novas vagas e perfis, sem publicar as capturas |
| EV-005 | Capturas de 2024 sobre programas com bolsa e avaliação institucional | vaga | evento, empresa | publicado em parte | vagas/Santander Open Academy | médio | Evento se o programa foi concluído; empresa Ada Tech quando o site oficial for conferido |
| EV-006 | Material de marca de um ex-empregador do varejo | - | - | não publicável | - | baixo | Nenhuma (marca de terceiros) |
| EV-007 | Startup Way Challenge 2023: regulamento e cronograma | evento | artigo, ferramenta | publicado em parte | eventos/startup-way-challenge-2023 | médio | Ideia da equipe, fase alcançada, Lean Canvas ou pitch; artigo sobre Matriz CSD e Lean Canvas |

### 2.1 Totais da tabela

| Estado | Itens |
|---|---|
| publicado | 33 |
| publicado em parte | 8 |
| planejado | 10 |
| referência | 7 |
| não publicável | 9 |
| **Total** | **67** |

| Potencial | Itens |
|---|---|
| alto | 16 |
| médio | 29 |
| baixo | 22 |

Diferença em relação ao `10-uso-do-hd.md`: o EV-003 passa de "não usado" para "publicado em parte", porque a arte da landing de 2025 (`codexperience-2025.webp`) e os textos das edições 2024 e 2025 já estão no `codexperience.json`, e o `cobertura.json` o registra como publicado. O que falta dele (deck, roteiro e slides) continua na fila.

## 3. Visão por tipo

### 3.1 Contagem

| Tipo | Primário | Secundário | Total de itens que alimentam | Já existe na API (28/10/2026) |
|---|---|---|---|---|
| learn-tech · programa de aprendizado | 11 | 4 | 15 | 34 programas, 7 completos com `moduleContents` (1, 101, 404, 503, 602, 801, 901) e 27 capas |
| learn-tech · artigo do blog | 35 | 17 | 52 | 18 artigos (13 vindos do hd, 5 antigos) |
| tools · ferramenta | 1 | 7 | 8 | 60 ferramentas (+11 hospedagens em `hospedagens.json`) |
| career · empresa | 4 | 4 | 8 | 25 empresas |
| career · vaga/oportunidade | 2 | 3 | 5 | 17 vagas/oportunidades |
| career · profissional (perfil) | 0 | 1 | 1 | 12 perfis |
| bootcamps · evento/formação | 5 | 11 | 16 | 22 eventos/formações |
| nenhum (não publicável ou sem destino) | 9 | - | 9 | - |

Um item pode contar em mais de um tipo; por isso a soma da coluna "Total" passa de 67. A soma da coluna "Primário" é exatamente 67.

### 3.2 Itens por tipo

- **programa**: primário DOC-001, DOC-002, DOC-003, DOC-004, DOC-006, DOC-011, DOC-022, DOC-028, DOC-035, DOC-050, DOC-052; secundário DOC-007, DOC-010, DOC-030, DOC-053.
- **artigo**: primário DOC-005, DOC-007, DOC-008, DOC-010, DOC-012, DOC-016, DOC-017, DOC-018, DOC-020, DOC-021, DOC-023, DOC-024, DOC-025, DOC-026, DOC-027, DOC-033, DOC-034, DOC-036, DOC-037, DOC-038, DOC-040, DOC-042, DOC-043, DOC-044, DOC-045, DOC-047, DOC-048, DOC-049, DOC-051, DOC-053, DOC-054, DOC-055, DOC-056, DOC-057, DOC-060; secundário DOC-001, DOC-002, DOC-003, DOC-004, DOC-006, DOC-014, DOC-015, DOC-019, DOC-022, DOC-028, DOC-029, DOC-035, DOC-052, EV-001, EV-003, EV-004, EV-007.
- **ferramenta**: primário DOC-030; secundário DOC-011, DOC-024, DOC-027, DOC-050, DOC-052, EV-003, EV-007.
- **empresa**: primário DOC-014, DOC-015, DOC-019, DOC-029; secundário DOC-026, DOC-043, DOC-059, EV-005.
- **vaga**: primário EV-004, EV-005; secundário DOC-017, DOC-019, DOC-054.
- **profissional**: primário nenhum; secundário EV-004.
- **evento**: primário DOC-059, EV-001, EV-002, EV-003, EV-007; secundário DOC-003, DOC-012, DOC-014, DOC-018, DOC-019, DOC-024, DOC-029, DOC-031, DOC-054, DOC-060, EV-005.

### 3.3 learn-tech · programa de aprendizado

**Já existe:** 7 programas completos; 3 deles saíram do hd (404 a partir de DOC-010, 011 e 028; 503 a partir de DOC-004 e 006; 602 a partir de DOC-003 e 022). Outras 27 capas aguardam módulos.

**Fila priorizada:**

1. **Excel para indicadores operacionais** (DOC-052, DOC-050, DOC-053): programa novo ou módulo de um programa de dados, com exercícios reescritos (TMA, % de meta, SE aninhado, PROCV, tabela dinâmica, gráfico combinado) e planilhas fictícias para baixar. É o maior material ainda não usado com cara de programa. Depende de D6 em `07-validar.md` (origem das provas).
2. **Programa 4, JavaScript para Iniciantes** (DOC-001): sair da capa com o exercício "Vitrine a partir de JSON" como projeto do módulo de arrays e DOM.
3. **Programa 2, HTML5 e CSS3** (DOC-002): sair da capa com um glossário comentado de tags semânticas como apoio.
4. **Programa 701, English for Tech** (DOC-035): o método de aprender inglês como habilidade entra como referência citada; o conteúdo do programa é escrito do zero.
5. **Programas 501 e 504, produto** (DOC-007, DOC-004, DOC-006): o caso anonimizado vira projeto final do 501; o relatório de deep tech, leitura complementar sobre TRL e propriedade intelectual.
6. **Programa mobile, a criar** (DOC-011): só depois de validar a competência `react-native`; o 404 já cobre a parte de criptografia.
7. **Programa de CRM e automação de marketing, a avaliar** (DOC-030, DOC-027): com empresa fictícia; o material é próprio, mas o público iniciante é pequeno.

### 3.4 learn-tech · artigo do blog

**Já existe:** 18 artigos. Do hd vieram 13: `eventos-de-comunidade-tech`, `processo-seletivo-como-se-preparar`, `como-ler-uma-vaga`, `testes-tecnicos-online`, `perfil-encontravel-linkedin`, `networking-pitch-60-segundos`, `proposta-freelancer-escopo-prazo-preco`, `bolsas-universidade-como-ler-edital`, `financas-primeiro-salario-tech`, `comunicacao-nao-verbal-entrevistas`, `cultura-de-empresa-tech`, `escolher-formacao-dev`, `lgpd-seus-dados-ao-se-candidatar`; e `rotina-desenvolvedor` foi completado com DOC-022, 044, 047 e 049.

**Fila priorizada:**

1. **Como organizar um evento de comunidade** (EV-003): relato próprio da organização do CodeXperience 2024 (roteiro, abertura, apoiadores, landing page). Fonte própria e exclusiva; reaproveita as imagens da seção 2024.
2. **Marca pessoal e produto digital do dev** (DOC-021): mapa mental próprio, com template.
3. **Qualidade de atendimento vira requisito de software** (DOC-053): genérico, sem empresa.
4. **Como se preparar para o exame de um instituto federal** (DOC-054, apoio de DOC-055 e DOC-056): só links oficiais, sem republicar provas.
5. **Matriz CSD e Lean Canvas na prática** (EV-007): se houver material da equipe, fica muito melhor.
6. **Deep tech: do laboratório ao produto** (DOC-007).
7. **Criatividade e geração de ideias para devs** (DOC-023) e **personas e funil** (DOC-018): curtos, de terceiro, prioridade baixa.
8. **Soft skills e saúde mental na carreira** (DOC-036, DOC-045, DOC-048): só com citação curta e indicação de ajuda profissional.

### 3.5 tools · ferramenta

**Já existe:** 60 ferramentas. Do hd: 4 novas (Microsoft Excel, Google Planilhas, GLPI, CryptoJS) e 2 ampliadas (Salesforce Marketing Cloud, GitHub).

**Fila priorizada (páginas de detalhe):**

1. **Salesforce Marketing Cloud** (DOC-030, DOC-027): página de detalhe com studios, Journey Builder, AMPscript e SSJS, e o que uma vaga júnior de CRM pede da ferramenta. É a ficha com mais material próprio.
2. **Microsoft Excel e Google Planilhas** (DOC-052, DOC-050): página de detalhe com os recursos cobrados em provas práticas e link para o programa de Excel quando ele existir.
3. **Vite, Tailwind CSS, Canva** (EV-003): a landing page do CodeXperience 2024 como exemplo real de uso, com link para o repositório se for público.
4. **Canva, Whimsical** (EV-007): exemplo de uso em Lean Canvas e cronograma, se houver material da equipe.
5. **GLPI** (DOC-024): contexto de governança de TI em projeto universitário.
6. **CryptoJS** (DOC-011): cuidados de uso, com link para o módulo do programa 404.
7. **GitHub** (DOC-003): seção de GitHub Projects (kanban no repositório), ligada ao programa 602.

Ferramenta nova: o acervo não tem candidata forte além das já criadas; os inventários estimavam +3 a 5 fichas a partir dos editais e do deck, mas nenhuma delas tem material próprio.

### 3.6 career · empresa

**Já existe:** 25 empresas. Do hd: Pitang, Le Wagon, Digital House e Netuno (decisão 11 do `09`).

**Fila priorizada (páginas de detalhe):**

1. **Pitang** (DOC-059): vídeo do Douglas sobre o Programa Pitang, depois de subir no YouTube. É o único item com vídeo próprio ligado a uma empresa.
2. **Netuno** (DOC-019): stack do Bootcamp 23.1 e link oficial já conferido (`dev.netuno.org`).
3. **Digital House e Le Wagon** (DOC-014, DOC-015, DOC-029): ementa resumida dos programas e link oficial (o da Digital House ainda não foi conferido).
4. **Google Careers** (DOC-043): resumo histórico de cultura de engenharia com citação curta da biografia.
5. **Empresas novas a partir das planilhas de candidatura** (DOC-026): só as que tiverem dados públicos confirmados; nunca a aba de indicações.
6. **Ada Tech** (EV-005): só depois de conferir o site oficial.

A agência de CRM do DOC-027 já estava na lista de empresas antes deste mapa. A vaga não entra na página de detalhe dela, para manter a decisão de citá-la como "uma agência de CRM" nos textos.

### 3.7 career · vaga/oportunidade

**Já existe:** 17 itens, quase todos plataformas de vagas; do hd veio a Santander Open Academy (categoria "Scholarships").

**Fila priorizada:**

1. **Pistas das capturas de 2022** (EV-004): cadastrar plataformas, comunidades e programas de mentoria que ainda existam, com link para a fonte oficial e sem os prints.
2. **Bolsas de treinamento profissional da universidade federal** (DOC-017, DOC-024, DOC-060): item recorrente na categoria "Scholarships", se o programa continuar ativo.
3. **Exame de seleção de cursos técnicos de instituto federal** (DOC-054): oportunidade anual de formação gratuita, com link para a página oficial de editais.
4. **Bootcamps abertos de comunidades** (DOC-019): só se houver nova turma com inscrição aberta.

### 3.8 career · profissional (perfil)

**Já existe:** 12 perfis (criadores de conteúdo e referências técnicas).

**Fila:** o hd quase não alimenta este tipo. A única fonte são as capturas de 2022 (EV-004), que mostram posts de mentores e criadores de conteúdo de front-end; elas servem só de pista para pesquisar perfis públicos. Ver a seção 4.

### 3.9 bootcamps · evento/formação

**Já existe:** 22 eventos. Do hd: `codexperience` (galeria de 16 fotos e artigo cruzado) e `startup-way-challenge-2023` (novo).

**Fila priorizada (criar ou enriquecer):**

1. **CodeXperience 2024 e 2025** (EV-003): seções próprias na página de detalhe `codexperience`, com 2 a 4 slides do deck de abertura sem logos que exijam autorização, o papel do Douglas na organização e o link do repositório da landing page. Material próprio de organizador, sem equivalente no acervo.
2. **CodeXperience 2023** (EV-001): trocar o vídeo provisório pelo MVI_5108 no YouTube do Douglas; ampliar a galeria só se necessário (restam 168 candidatas).
3. **Minas Summit 2024** (EV-002): corrigir `certificate` (aponta para `minas-summit-2025-certificado.pdf`, mas o certificado do acervo é de 2024), escrever o texto da edição 2024 a partir da ficha de pesquisa e, se o Douglas confirmar, mencionar a ida em grupo de Juiz de Fora (sem dados dos participantes).
4. **Startup Way Challenge 2023** (EV-007): acrescentar ideia da equipe, fase alcançada e uma imagem própria (Lean Canvas ou slide do pitch).
5. **Programa Pitang** (DOC-059): página de formação com o vídeo, se a participação for confirmada.
6. **Treinamento Profissional na UFJF** (DOC-024, DOC-060, DOC-017): página de formação se o Douglas foi bolsista.
7. **Eventos citados na conversa de mentoria** (DOC-003, DOC-031): levantar com o Douglas quais foram vividos e se há fotos ou certificados.
8. **Formações confirmáveis** (DOC-014, DOC-015, DOC-019, DOC-029, EV-005, DOC-018, DOC-012): só viram evento com prova de participação; até lá ficam como empresa ou vaga.
9. **if-sudeste-mg-informatica** (DOC-054): link para o guia de exame, sem republicar provas.

## 4. Lacunas

### 4.1 Tipos com pouco material no hd

| Tipo | Situação | Por quê |
|---|---|---|
| career · profissional (perfil) | Nenhum item primário; só pistas no EV-004 | O acervo guarda documentos e eventos, não registros de pessoas que o Douglas acompanha. Os perfis existentes vieram de outra fonte |
| career · vaga/oportunidade | 2 itens primários, ambos capturas | Vagas expiram; o acervo tem anúncios antigos (DOC-027 de 2026, editais de 2017 a 2019) que servem para ensinar a ler vagas, não para listar |
| tools · ferramenta | 1 item primário (DOC-030) | O acervo cita ferramentas, mas quase nunca mostra o uso delas pelo Douglas; sem isso a página de detalhe fica genérica |
| bootcamps · evento/formação | 5 primários, 3 com material próprio forte | Muitas formações sem prova de participação (Pitang, Netuno, Le Wagon, Digital House, UFJF, Santander/Ada, Experience Summit) |
| learn-tech · programa | 11 primários, mas 27 capas abertas | O acervo cobre bem produto, LGPD, rotina e Excel; não cobre back-end, banco de dados, Vue, Next.js nem Docker |

Em contrapartida, artigo é o tipo com mais material (35 primários), muito dele de terceiros: o gargalo do blog é fonte própria, não volume.

### 4.2 Sugestões para a pasta hd/programa-projetos

A pasta está vazia. Ela é o lugar natural para material **próprio**, que é o critério de maior peso. Sugestões, por tipo que ajudam a preencher:

| Material a acrescentar | Alimenta | Cuidados |
|---|---|---|
| README, capturas e decisões técnicas dos projetos do Douglas (por exemplo, a landing page do CodeXperience 2024 e os sites de clientes já anonimizados) | programa (projeto final), ferramenta (página de detalhe com uso real), artigo | Clientes com nome fictício; sem chaves, senhas nem dados de usuários |
| Lista dos profissionais que o Douglas acompanha, com link do canal, blog ou repositório público e uma linha do que aprendeu com cada um | profissional | Só pessoas públicas e trabalho aberto; nada de contatos pessoais |
| Palestrantes do CodeXperience que autorizarem aparecer, com o link da palestra | profissional, evento | Autorização por escrito |
| Fotos, certificados e materiais de 2024 e 2025 do CodeXperience que estejam em outra pasta ou no celular | evento | Mesmo fluxo do piloto: WebP sem EXIF, rostos com autorização |
| Certificados e prints de conclusão das formações citadas (Pitang, Netuno, Le Wagon, Digital House, Santander/Ada, Treinamento Profissional na UFJF) | evento | Basta um comprovante por formação para destravar a página |
| Material da equipe StartInterns no Startup Way (Lean Canvas, Matriz CSD, pitch) | evento, artigo | Autorização dos integrantes para o pitch gravado |
| Vagas abertas que o Douglas acompanha agora, salvas como link e data | vaga, empresa | Guardar só o link oficial e a data; nada de dados de candidatura |
| Anotações de uso de ferramentas no trabalho (o que resolveu, onde travou) | ferramenta, artigo | Sem nome de empregador quando houver dado interno |
| Gravações curtas do Douglas explicando um conceito (como o vídeo do Pitang) | programa, artigo, evento | Subir no YouTube e guardar só o link no catálogo |

Ao acrescentar material, registrar o item com id novo no inventário (DOC-061 em diante, ou um prefixo próprio como PRJ-001) e classificá-lo com a regra da seção 1 antes de produzir conteúdo.

## 5. Fila dos 10 itens de maior potencial

Ordem por: fonte própria, profundidade, valor para iniciantes e reaproveitamento entre sites, descontando o que depende de decisão pendente.

| # | Itens | Tipo | O que fazer | Depende de |
|---|---|---|---|---|
| 1 | EV-003 | evento (enriquecer), artigo | Seções 2024 e 2025 na página `codexperience` e artigo "Como organizar um evento de comunidade" | Papel do Douglas em 2025; escolha dos slides |
| 2 | DOC-052, DOC-050, DOC-053 | programa, ferramenta | Programa "Excel para indicadores operacionais" e páginas de detalhe de Excel e Google Planilhas | D6 de `07-validar.md` |
| 3 | EV-001 | evento (enriquecer) | Vídeo MVI_5108 no YouTube e em `content.videoUrl` | Upload no YouTube do Douglas |
| 4 | DOC-059 | empresa (enriquecer), evento | Vídeo na página de detalhe da Pitang; formação se confirmada | Upload e confirmação de participação |
| 5 | EV-002 | evento (enriquecer) | Corrigir o certificado e escrever a edição 2024 do Minas Summit | Ano(s) em que o Douglas foi |
| 6 | DOC-030, DOC-027 | ferramenta (enriquecer) | Página de detalhe do Salesforce Marketing Cloud | Nenhuma |
| 7 | DOC-001 | programa | Programa 4 sai da capa com o projeto "Vitrine a partir de JSON" | Confirmar se o catálogo era de cliente |
| 8 | DOC-003 | evento, artigo | Lista de eventos vividos para novas páginas; artigo sobre IA como mentora | Quais eventos o Douglas quer cobrir |
| 9 | EV-007 | evento (enriquecer), artigo | Material da equipe e artigo sobre Matriz CSD e Lean Canvas | Material da equipe |
| 10 | DOC-002, DOC-035 | programa | Programas 2 (HTML) e 701 (inglês) saem da capa com as referências citadas | Nenhuma |

## 6. Como manter este mapa

1. Item novo no `hd`: classificar com a seção 1, acrescentar uma linha na tabela principal e atualizar as contagens.
2. Item publicado: mudar o estado, preencher "Onde está publicado" com ids reais e registrar no `cobertura.json`.
3. Conferir que cada id aparece uma única vez na tabela principal (validação usada nesta versão: script Python que extrai os ids da seção 2 e compara com DOC-001 a DOC-060 e EV-001 a EV-007).

