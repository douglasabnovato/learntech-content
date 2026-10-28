# Decisões para o Douglas validar

Nada desta lista foi executado. Cada item aponta o documento com o detalhe. As decisões mais urgentes estão no topo.

## 1. Segurança (agir já)

| # | Item | Onde | Ação sugerida |
|---|---|---|---|
| S1 | Um e-mail e uma senha em texto puro | `hd/eventos/startup-way-challenge/informações.docx` | Trocar a senha e guardá-la num gerenciador de senhas |
| S2 | Login e senha de **outra pessoa** numa plataforma de curso | `hd/blogs-pdf-docs/plataforma-spe/seu-proximo-emprego.docx` (DOC-058) | Tirar o arquivo do acervo e avisar a pessoa |
| S3 | Nome, CPF e RG de terceiros | `hd/eventos/event-minassummit/Viagem Minas Summit.xlsx` | Proteger ou apagar; nunca enviar ao Drive |
| S4 | Nomes e matrículas de funcionários; nomes e e-mails de mentores | `excel-bcc/C*******.xls` (DOC-050), Prova9, lista de mentores do Startup Way | Usar só a estrutura, nunca o arquivo |
| S5 | Senhas das contas de demonstração versionadas (pendência anterior) | `facil-admin-plataforma/docs/DEMONSTRACAO.md` | Trocar as 4 senhas |
| S6 | Pasta temporária com 25 miniaturas de fotos e capturas | `docs/ecossistema/.tmp-amostra/` | **Apagar antes do commit**. Coloquei um `.gitignore` na pasta para ela não ser commitada por engano |

## 2. Antes do commit

| # | Item | Onde |
|---|---|---|
| C1 | **Fim de linha.** As cópias de trabalho estão em CRLF e os repositórios em LF; commitar sem ajustar reescreve arquivos inteiros. Use `git config core.autocrlf true` ou um `.gitattributes` antes do `git add` | `06-conferencia.md`, seção 1 |
| C2 | Commitar as mudanças do lote 1: bootcamps (6), career (7), tools (4), learntech-content (4) | `06-conferencia.md`, seção 3 |
| C3 | Abrir o PR do learn-tech de `feature/claudeia-2026-10-27` para `main` | `06-conferencia.md`, seção 3 |

## 3. Direitos e anonimização

| # | Pergunta | Onde |
|---|---|---|
| D1 | O caso Salus pode ser publicado com nome fictício ("Instituto Aurora de Educação em Saúde")? Os valores somem ou ficam em proporção? | `01-inventario-documentos.md`, dúvida 1 |
| D2 | Agibank, Cadastra, ABC, ByteClass, Volta Express, MedTrem e facilAdmin aparecem pelo nome ou como descrição genérica? | dúvidas 3, 4 e 6 |
| D3 | O catálogo de livros infantis é de um cliente ou um exercício seu? | dúvida 2 |
| D4 | O e-book "Só Vai HealthStyle" e os resumos de atendimento, monitoria e SGQ são de sua autoria? | dúvidas 7 e 8 |
| D5 | Quais livros da `digital_library` entram nos artigos? Ficção e autoajuda sem relação com tecnologia ficam fora? | dúvida 14 |
| D6 | As provas de Excel podem virar exercícios próprios reescritos? E qual é a relação das provas do IF com você? | dúvidas 11 e 16 |
| D7 | O Deep Tech Radar era de acesso público? | dúvida 17 |

## 4. Eventos e formações

| # | Pergunta | Onde |
|---|---|---|
| E1 | **Resolvido em 27/10:** foto real de evento entra no bootcamps e em artigos do learn-tech, de preferência com muita gente. Pergunta original: há autorização para usar os rostos de terceiros nas fotos do CodeXperience? Prefere priorizar palco, plateia e ambiente? | `01-inventario-eventos.md`, dúvida 1 |
| E2 | Quem fez as fotos da Canon, para o crédito? | dúvida 2 |
| E3 | **Resolvido em 27/10:** Claude escolheu 10 fotos (`08-piloto-codexperience.md`); o Douglas ajusta se quiser. Pergunta original: escolher cerca de 14 fotos novas entre as 178 candidatas (apêndice) e confirmar as 6 já publicadas | dúvida 3 |
| E4 | Seu papel no CodeXperience 2023 (staff ou participante) e em 2025 (organização?) | dúvidas 6 e 10 |
| E5 | Minas Summit: 2024, 2025 ou os dois? O JSON aponta para o certificado de 2025 | dúvida 7 |
| E6 | Startup Way 2023: ideia da equipe, fase alcançada e material para publicar | dúvida 9 |
| E7 | Formações confirmadas: Pitang, Netuno, Le Wagon, Digital House, Experience Summit, UFJF/NuRC, BNI, Santander/Ada | `01-inventario-documentos.md`, dúvida 9; eventos, dúvida 11 |
| E8 | **Resolvido em 27/10:** vídeo público provisório até subir o MVI_5108.MP4 (`08-piloto-codexperience.md`, seção 3). Pergunta original: o vídeo da Pitang e o do CodeXperience podem ir para o seu YouTube? Público ou não listado? | documentos, dúvida 10 |

## 5. Arquitetura e produto

| # | Decisão | Onde |
|---|---|---|
| A1 | Aprovar o modelo canônico (camada de catálogo ao lado dos contratos atuais) | `03-modelo-canonico.md` |
| A2 | Aprovar o vocabulário inicial de competências | `03-modelo-canonico.md` |
| A3 | Onde ficam os artigos: blog do learn-tech, seção nova do career ou os dois | `03-modelo-canonico.md`, entidade Artigo |
| A4 | Publicar `status` nos programas da API antes de ligá-la no learn-tech | `02-contratos.md`, D1 |
| A5 | Ligar a API no career e no tools (muda o catálogo e ativa o formulário de identificação) | `06-conferencia.md`, seção 4 |
| A6 | Migrar as 94 imagens `./assets/` para `/media/` | `02-contratos.md`, D5 |
| A7 | Ordem das ondas, com o CodeXperience como piloto | `04-matriz-conteudo.md`, seção 2 |
| A8 | Substituir o `cobertura.json` pelo `fontes.json` apontando para o `hd` | `03-modelo-canonico.md` |
