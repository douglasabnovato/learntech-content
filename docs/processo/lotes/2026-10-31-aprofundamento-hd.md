# 31/10/2026: aprofundamento do conteúdo do hd (lote 2026-10-30)

Pedido do autor: dar mais profundidade ao material do hd, que é precioso, e transformá-lo em conteúdo para os quatro projetos. Plano aprovado em 31/10.

## Diagnóstico
- 2.683 arquivos únicos, cerca de 1,7 milhão de palavras extraíveis, cerca de 1.900 imagens, 70 vídeos e 1 áudio.
- A produção do autor no ex-empregador (rotina de CRM, jornadas, migração de landing pages, QA, report de growth) estava condensada em poucos programas: 16 itens só no 1101.
- A career quase não usava o hd, e as galerias de eventos usavam de 6 a 17 fotos de um total de 345.

## Entregas
**learn-tech**
- Cinco programas novos:
  - 1104 Operação diária de CRM;
  - 1105 Jornadas transacionais de pedido;
  - 1106 WhatsApp Business para empresas;
  - 1107 QA de comunicações;
  - 106 Migração de landing pages entre plataformas (Frontend).

  Todos com capa própria gerada por `gerar-capa.py`.
- Quatro artigos:
  - OKRs e report executivo de growth;
  - programa de relacionamento com especificadores;
  - personas e estudo de mercado;
  - encarte digital e tabloide por praça.
- Uma área nova, "Marketing Tech e CRM", com o retrato da profissão do ponto de vista de quem contrata e de quem trabalha. O gradiente foi incluído em `CategoriesAll.jsx`.

**career**
- ABC da Construção: a página foi ampliada com "como é trabalhar", na visão do profissional e do headhunter.
- Modelo de currículo fictício "Analista de CRM e Marketing Tech (pleno)", com o peso real da trajetória.

**tools**
- Cinco fichas novas: Pritunl, Microsoft Forms, Meta Business Suite, Salesforce LWC e Taak (esta como "Página em revisão", porque falta o site oficial).
- Três fichas aprofundadas com o uso real: Salesforce Marketing Cloud, Zenvia e Sults.

**bootcamps**
- Galerias sem fotos repetidas (dHash): Hackathon passou de 14 para 27 fotos e Fator S de 17 para 29.
- Os 37 vídeos foram analisados por quadros e viraram duas compilações em `C:\douglasabnovato-github\videos-para-youtube\`:
  - Hackathon: 3min37s, a partir de 19 clipes;
  - Fator S: 1min17s, a partir de 5 clipes.

  Ficaram de fora os clipes com telas de videochamada, stories de outras contas e trechos sem relação com o evento.

## Privacidade
- Fontes extraídas sem senhas, e-mails, telefones nem números longos. Os textos foram varridos atrás de marcas, clientes e nomes de pessoas, e não houve ocorrência fora da career.
- Os arquivos de apoio ficaram em `C:\douglasabnovato-github\.claude-tmp\`. Pode apagar quando quiser: o ambiente do Claude não tem permissão para remover arquivos.

## Validação
- Validação: 0 erros. Totais: 49 programas, 24 eventos, 80 ferramentas, 27 empresas, 6 áreas e 4 modelos de currículo.
- Cópias de reserva em dia; tsc sem erros.
- Revisão independente por amostra: ver a seção "Revisão".

## Pendências (o `leva:status` continua mostrando LEVA ABERTA)
- HD-0010 e HD-0011: subir as duas compilações no YouTube e trocar o `videoUrl` dos eventos.
- HD-0006: transcrever o áudio.
- Hackathon: as fotos e os vídeos sugerem que o autor também atuou na organização (megafone na abertura, kits, compras, aprovação de arte). A página não afirma isso; falta a confirmação do autor.
- Taak: falta o site oficial.
- Grupo MYSA: falta uma fonte pública.

## Revisão independente (amostra: 4 artigos, programa 1106, 3 fichas e a página da ABC)
Corrigido:
- Fichas e página da ABC: tirei as frases que ligavam a "Rede Construir+" dos programas à empresa real, que tornavam a anonimização inútil.
- Taak: tirei as cláusulas e a relação de uma proposta comercial real (o texto agora traz cláusulas comuns) e troquei a frase sobre o processo de pesquisa pelo aviso padrão de "Página em revisão".
- 1106:
  - estrutura de contas da Meta atualizada (conta do WhatsApp com um número e conta de mensagens com templates e cobrança);
  - contestação de categoria em até 60 dias pelo Business Support Home;
  - LGPD: prova do consentimento quando ele é a base legal;
  - mensagem "real" virou exemplo fictício; nomes internos ("consultor de bolso", nome de arquivo, prefixo) trocados por genéricos;
  - especificação do bot e pesquisa com franqueados generalizadas.
- 1105: tirado o slogan que lembrava a marca real.
- ABC: data do investimento da Dexco corrigida (anunciado em julho de 2021, aprovado pelo Cade em dezembro de 2021); tirado um detalhe interno de jurídico e Meta.
- Artigos: a menção ao Google em 1999 passou a ser atribuída ao livro de Doerr; a inferência sobre ticket virou hipótese.

Conferido e correto: números do CAU/Datafolha, ABF 2025, Lei 13.966/2019, Decreto 5.903/2006, Lei 13.543/2017, preços e categorias da Meta (2025 e 2026), limites de envio, opt-in, números da Taak e da ABC, RD Station 2026, LWC/Jest. Não há cópia de trechos das fontes.

Fica para o autor decidir: a página da ABC descreve rituais e stack a partir da experiência do autor, sem fonte pública (é o "como é trabalhar" que o autor pediu). "Grupo MYSA" e "Experience Summit" seguem sem fonte pública.
