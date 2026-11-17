# Perfil do autor nos três papéis

Entrega 2 do método de produção a partir do hd, aprovado pelo autor em 15/11/2026 ("aprovo o plano"). Responde à pergunta 4 da [ficha de análise](analise-da-tarefa.md): que competência o item ensina, em que nível e com que evidência.

**Estado: proposta do Claude, a confirmar pelo autor.** Até a confirmação, a ficha usa este perfil marcando "perfil a confirmar".

Fontes:
- [`trajetoria-do-autor.md`](trajetoria-do-autor.md);
- o currículo público do site pessoal (`douglasabnovato.dev`, `src/entities/resume/model/resume.data.ts`, lido em 15/11/2026);
- os programas da API (`content/learn-tech/programas/`);
- os repositórios do learnTECH e o `engenharia`.

Contatos e o emprego atual não entram, como em `trajetoria-do-autor.md`.

## Como ler os níveis

| Nível | Significa | Como o conteúdo fala |
|---|---|---|
| **Aplicou** | Usou no trabalho ou num projeto, com entrega | Relato de quem fez: o passo a passo, o erro e o ajuste |
| **Conduziu** | Decidiu e coordenou: escopo, time ou processo | Por que se escolheu assim e o que se trocou por quê |
| **Ensinou** | Formou outras pessoas no tema | Didática: ordem, exercício e erro comum de quem começa |

Um tema pode ter mais de um nível. O nível vem da evidência, e não de uma autoavaliação.

## 1. Engenharia de software

| Competência | Nível proposto | Evidência |
|---|---|---|
| Front-end web (HTML, CSS, JavaScript, React) | Aplicou, ensinou | Dev front-end em React (2020–2021) e na Jamboo (2022–2023). Programas 1 a 4 e 101 a 106 na API. Cursos da ByteClass (2025–2026) |
| Back-end, APIs e dados | Aplicou | A API learntech-content: Cloudflare Workers, Hono, D1, Zod, testes automatizados (171 em 17/11/2026) e o contrato com os 4 sites. SQL e SSJS no Marketing Cloud (2025–2026) |
| Fundamentos (algoritmos e estrutura de dados) | Ensinou | Monitor de Estrutura de Dados em C na UFJF (2010–2011). Programa 901 |
| Qualidade e entrega (CI, testes, ruleset) | Conduziu | Qualidade e ISO na CodeJr (2014–2016). Régua de 12 critérios, CI e `main` protegida nos 5 repositórios do learnTECH |
| Integração e automação de CRM | Aplicou | Base integrada do ERP ao Salesforce Marketing Cloud e rotinas automatizadas (2025–2026). Programas 1101 a 1107 |

**O que só o autor conta:** a transição do suporte para o desenvolvimento, o código que sustenta uma operação de varejo e a engenharia de um ecossistema inteiro em plano gratuito.

## 2. Product manager

| Competência | Nível proposto | Evidência |
|---|---|---|
| Descoberta e MVP | Conduziu | Volta Express Brasil, desde 2021: produto conduzido desde a ideação, em 13 versões e 3 pivotagens. Nasceu em hackathon. Programas 501 e 503 |
| Gestão de time e de backlog | Conduziu | Time de desenvolvimento da Volta Express, que chegou a 8 pessoas. Programa 502. Coordenação de equipe na ByteClass |
| Métricas e crescimento | Aplicou | Growth hacker na ABC da Construção (2023–2025). Painéis mensais no Looker Studio (2025–2026). Programa 504 |
| Do briefing à proposta | Aplicou | Modelos de levantamento, briefing e proposta (learn-tech#73 a #76). Artigo "Do briefing" no lote de 03/11 |
| Produto educacional | Conduziu | ByteClass (2025–2026): 8 cursos e 3 trilhas produzidos, 20 atualizados e 6 turmas. O próprio learnTECH, com 49 programas |

**O que só o autor conta:** as pivotagens de uma startup real, o que um MVP de baixo custo ensina, e como decidir o escopo de um produto educacional.

## 3. Arquiteto de IA

| Competência | Nível proposto | Evidência |
|---|---|---|
| Orquestração de agentes | Conduziu | Sessões com papéis (orquestrador, sessões de projeto e de apoio) e regras R1 a R17 (`engenharia/ia/orquestracao.md`, 13/11/2026) |
| Agentes com papel único e contrato | Conduziu | Fluxo do hd até a tela: triador, produtores, revisor e verificador, com estados no schema ([`agentes.md`](agentes.md)) |
| Avaliação de agentes | Conduziu | Gabarito do triador em quatro rodadas (55 itens, 67 medições) e a decisão de deixá-lo como proponente pelo acerto medido (D-03) |
| Governança e segurança de IA | Conduziu | Regras contra a lavagem de permissão, hook de comandos proibidos, revisor independente e evidência obrigatória ("Atende" com comando, data e resultado) |
| Programar com IA, ensinando | Ensinou | Programa 801, "Programar com IA sem Perder o Aprendizado" |

**O que só o autor conta:** como um time de agentes produz e revisa conteúdo com controle humano, o que dá errado (trabalho duplicado, regra ambígua) e como a regra corrige.

## Lacunas

- **Inglês técnico (programas 701 a 704)** e **UX (201 a 204):** não achei evidência de que o autor aplicou ou conduziu esses temas. Proponho que esses programas não usem relato pessoal até o autor dizer o nível.
- **Volta Express:** os números (13 versões, 3 pivotagens, 8 pessoas) vêm do currículo público. Antes de virar conteúdo, precisam da confirmação do autor.
- **ByteClass:** os números (8 cursos, 3 trilhas, 20 atualizados, 6 turmas), a coordenação de equipe, o SQL e SSJS e os painéis no Looker Studio vêm só do currículo público. Precisam da confirmação do autor. Se a ByteClass for o vínculo atual, ela sai do perfil, pela regra da linha de fontes.
- **Níveis:** foram propostos pelo Claude a partir da evidência. O autor confirma ou corrige cada linha.

## Pendente do autor

Confirmar ou corrigir os níveis e as lacunas. A confirmação entra em [`decisoes-do-autor.md`](decisoes-do-autor.md) como decisão, com o motivo.
