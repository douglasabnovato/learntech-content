# Método: do bruto ao publicado

Estado: **proposta para validação**.

Princípio: preservar o **conteúdo**, não as fontes e as marcas. Todo item do `hd` passa pelo mesmo funil, e cada formato tem uma receita própria.

## 1. Funil

| Estado | O que acontece | Quem | Saída |
|---|---|---|---|
| bruto | O arquivo chega ao `hd` | Douglas | Arquivo no computador |
| triado | Classificação de direitos e de dados pessoais | Claude propõe, Douglas valida | Linha nos inventários (`01-*.md`) |
| catalogado | Ligação a competências e destinos | Claude | Linha na matriz (`04-matriz-conteudo.md`), depois em `fontes.json` |
| roteirizado | Objetivo, estrutura e rascunho | Claude | Rascunho em branch `feature/conteudo-AAAA-MM-DD` |
| revisado | Leitura humana, nomes fictícios, escolha de fotos | Douglas | Aprovação no PR |
| publicado | Build valida e o deploy publica | Douglas roda os comandos | JSON em `content/` e mídia em `media/` |

Regra de previsibilidade: **um item só avança um estado por vez**, e a dúvida volta para `07-validar.md` em vez de ser decidida por suposição.

## 2. Armazenamento

| O quê | Onde fica o original | Onde fica o publicado | O que a API guarda |
|---|---|---|---|
| Fotos de evento | `hd/eventos/` (computador do Douglas, com cópia de segurança dele) | `media/bootcamps/eventos/<slug>/`, em WebP de até 1600 px, sem EXIF, cerca de 200 KB cada | Caminho `/media/...` |
| Vídeos | `hd/` | YouTube do Douglas, público ou não listado | URL do YouTube (o schema aceita URL absoluta em `video` e `videoUrl`) |
| Apresentações, PDFs e planilhas próprios | `hd/` | Drive do Douglas, com o compartilhamento "qualquer pessoa com o link: leitor" | URL em `links` ou `sources`; PDF pequeno pode ir para `media/arquivos/` (já existe precedente com o certificado do Minas Summit) |
| Livros, apostilas e cursos de terceiros | `hd/` | **Nada**, só o artigo | Referência (autor, obra, ano, link oficial quando houver) |
| Documentos sensíveis | `hd/` | **Nada**, só a lição anonimizada | Nenhuma ligação pública com o original |

Limites da Cloudflare Static Assets: 20 mil arquivos e 25 MiB por arquivo. Uma seleção de 20 a 40 fotos por evento cabe com folga. O Cloudflare R2 só entra se o acervo publicado passar de algumas centenas de MB.

Riscos do Drive:
- Um link pode deixar de funcionar se o arquivo for movido ou a permissão mudar. Por isso o catálogo guarda o link junto com a fonte, e o build pode rodar uma checagem de links (proposta, não implementada).
- Arquivo no Drive é público para quem tiver o link. Só vai para lá o que for `proprio` e não tiver dados de terceiros.

## 3. Receitas por formato

### 3.1 Cobertura de evento (bootcamps)

1. **Pesquisa:** o que é o evento, organizador, edição, data, local e tema, citando fontes públicas.
2. **Pré-seleção das fotos**, feita por script e só em leitura:
   - agrupar por horário EXIF em momentos (abertura, palestras, intervalos, encerramento);
   - descartar fotos desfocadas;
   - descartar quase duplicadas.
3. **Escolha final das fotos: Douglas.** Atenção a rostos de terceiros. Em foto de plateia ou de grupo, de evento público, o risco é baixo; foto que destaca uma pessoa específica pede o consentimento dela ou um recorte.
4. **Tratamento**, com o script que já está no `CONTEUDO.md`: `exif_transpose`, até 1600 px, WebP com qualidade 78, sem EXIF. Cada foto ganha um texto alternativo (`alt`) descritivo.
5. **Página**, dentro do `BootcampEvent` atual, sem mudar o schema:
   - `longDescription`: contexto do evento e o que aconteceu;
   - `curriculum`: as hard skills praticadas;
   - `gallery`: as fotos;
   - `videoUrl`: o vídeo do YouTube;
   - `links`: Drive e site oficial;
   - `editions`: edições anteriores ou seguintes.
6. **No catálogo:** as relações `pratica` (evento → competências) e `origina` (fonte EV-nnn → evento).

### 3.2 Artigo de referência (livros, vídeos, textos de terceiros)

Estrutura:

1. Por que ler, com o contexto e para quem é.
2. Ideias principais em **palavras próprias**.
3. Até 3 a 5 **citações curtas**, entre aspas, com autor, obra, ano e página.
4. **Resumo breve**, em um parágrafo.
5. Como aplicar na carreira tech: exercício ou reflexão.
6. Referência completa (ABNT) e link oficial ou da editora, quando houver.

Regras:
- Nunca anexar o arquivo nem linkar cópias não oficiais.
- Citação é o apoio do texto, não o corpo dele. A lei brasileira (Lei 9.610/98, art. 46, III) permite citar trechos para estudo, crítica ou análise, indicando autor e obra, na medida necessária ao fim. Não somos advogados: na dúvida, cita-se menos.
- Marca de terceiro só aparece como referência textual, nunca como logo.

### 3.3 Treinamento (learn-tech)

**Planejamento reverso** (*backward design*):

1. **Objetivo:** "ao final, a pessoa consegue…", com um verbo da taxonomia de Bloom.
2. **Evidência:** um quiz por módulo (o padrão atual é de 3 questões, com explicação e uma única correta) e um projeto final com código.
3. **Conteúdo:** módulos (`moduleContents`) com seções e passos (`subsections`), `code`, `tips`, destaques e texto de encerramento.

Mídia e fontes:
- vídeo público do YouTube em `video` (próprio ou de terceiro, só incorporado e nunca baixado);
- código num repositório GitHub público;
- `sources` com as referências citadas.

O formato e as regras que o build confere já estão em `docs/CONTEUDO.md`: lições por módulo, numeração dos passos, ícones aceitos, quiz apontando para módulo existente.

Hoje **4 de 34 programas estão completos** (1, 101, 801, 901). Os outros 30 são capas exibidas em cinza como novidade (a regra de `ProgramsCard.jsx`). Cada novo treinamento substitui uma capa existente antes de criar um programa novo.

### 3.4 Guia anonimizado (career)

Para documentos com dados de pessoas, processos ou empresas reais:

- trocar os nomes de pessoas por papéis ("a recrutadora", "o candidato A");
- remover CPF, telefone, e-mail, endereço e salário individual;
- usar números em proporção ou faixa;
- manter só a **estrutura** do processo e a **lição**.

Casos definidos pelo Douglas:

| Fonte | Lição |
|---|---|
| Processo seletivo de um banco | Etapas de um processo seletivo, o que avaliam em cada uma, como se preparar |
| Vaga de uma agência de CRM | Como ler uma vaga, como reconhecer uma empresa boa, como se preparar para aquela vaga |
| Planilha de rotina de performance | Rotina, mindset e técnicas de produtividade |

O nome real de empresa só aparece se a informação for pública e útil; na dúvida, usa-se uma descrição ("um banco digital", "uma agência de CRM").

### 3.5 Estudo de caso de cliente (learn-tech ou career)

Para projetos de cliente, como o do Instituto Salus:

- **nome fictício** do cliente e do produto;
- **Requisitos:** problema, personas, histórias de usuário com critérios de aceitação, requisitos não funcionais;
- **MVP:** o recorte mínimo, a matriz de prioridade (MoSCoW) e as hipóteses a validar;
- **Mockup:** wireframe e protótipo no Figma do Douglas, publicado como imagem em `media/` e com o link do Figma em modo de visualização;
- **Exercício:** a pessoa refaz o levantamento para um caso parecido.

Pode virar módulo dos programas 501 ("Produtos Digitais"), 503 ("MVP na Prática") e 201/202 (UX/UI e Figma), hoje vazios.

### 3.6 Material de aula e provas (Excel, gabaritos, apostilas próprias)

- **Material próprio:** pode virar exercício prático com solução comentada.
- **Prova ou gabarito de instituição:** serve de base para criar questões **novas** no mesmo nível, sem copiar o enunciado.

## 4. Definição de pronto de um item publicado

- Passa no build da API: schema, integridade e mídia existente.
- Imagens em WebP, até 1600 px, sem EXIF, com `alt`.
- Vídeo com link público ou não listado que funciona sem login.
- Link do Drive abre sem login, só para leitura.
- Sem dado pessoal de terceiro. Fonte sensível marcada como anonimizada.
- Citações com autor, obra e ano.
- Relações registradas no catálogo.
- Douglas aprovou no PR.

## 5. Fluxo de trabalho

- A branch de conteúdo sai de `main`, no padrão `feature/conteudo-AAAA-MM-DD`, e o PR vai para `developer` e depois `main`.
- Claude escreve os arquivos. O Douglas roda o build, verifica, faz o commit e o push.
- Lote pequeno: um evento, um treinamento ou até 3 artigos por PR.

## 6. Design e UX

- **Página de cobertura e artigo:** um modelo único no Figma antes do código (proposta), reaproveitando os componentes que o bootcamps e o learn-tech já têm.
- **Galeria:** foto de capa e 6 a 12 fotos visíveis, o resto sob demanda, com `loading="lazy"` e dimensões declaradas para não deslocar o layout.
- **Navegação cruzada (fase 2 do modelo):** bloco "Relacionado" com programa, ferramenta, papel e evento da mesma competência.
