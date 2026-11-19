# Conteúdo estático dos 4 sites: inventário e decisões (28/10/2026)

**Regra do Douglas:**
- **Só conteúdo reutilizável vai para a API:** programas, artigos, ferramentas, empresas, vagas, profissionais, eventos.
- **O texto do site fica no código:** hero, títulos, botões, rodapé e textos institucionais.
- **Estático bom** vai para a API e é completado quando estiver incompleto.
- **Estático ruim** sai do site. Se o tema vale, é reescrito com fontes públicas citadas.
- **O que já está na API não é revisado agora.** Só se acrescenta.

Inventários completos, por site, em `inventario-estatico/`.

## 1. Como cada site recebe o conteúdo hoje

| Site | Lê da API | Cópia local de reserva | Divergência hoje |
|---|---|---|---|
| learn-tech | Programas, blog, 11 páginas | `programsData`, `blogData`, `categoriesData` e as 11 páginas, escritas à mão | Programas: 33 locais, 34 na API (404, 503 e 602 são capa no local). Blog: 5 locais, 18 na API. Categorias: 11 locais, 12 na API |
| bootcamps | Eventos | `events.data.ts`, escrito à mão e com imagens importadas | 17 eventos locais, 22 na API. CodeXperience e GDG desatualizados |
| career | Empresas, vagas, perfis, destaques | `good-companies.js`, `jobs.js`, `perfis-dev.js` | Empresas: 16 locais (a BRQ só no local), 25 na API. Vagas: 16 locais, 17 na API |
| tools | Ferramentas, hospedagens | `data/tools.js`, `data/host.js` | Ferramentas: 45 locais, 60 na API. Hospedagens: 10 locais, 11 na API. Nenhum detalhe no local |

## 2. Decisões tomadas

| # | Item | Decisão | Por quê |
|---|---|---|---|
| D1 | **Cópias locais de reserva** | Deixam de ser escritas à mão. O script `scripts/exportar-copias.mjs` (learntech-content) as gera a partir de `content/` para tools, career, bootcamps e o blog do learn-tech. O campo `detalhe` fica fora da cópia: sem API, o card abre o site oficial | Acaba com a divergência; a API é a única fonte |
| D2 | Cópia de `programsData` e `categoriesData` (learn-tech) | **Não é gerada agora.** Elas importam imagens, vídeo e ícones do próprio site. Com a API ligada, o site já mostra os dados certos, inclusive o status (correção de hoje) | Gerar exige reescrever as telas; fica para um lote próprio |
| D3 | **BRQ** (career) | Vai para a API como empresa, com `slug` e `detalhe`, a partir do texto da janela de detalhe. Números sem fonte saem ou ganham fonte. A janela local e o desvio `id === "brq"` saem do site | Hoje ela some quando a API responde |
| D4 | 3 vagas da BRQ | **Saem** do site e não vão para a API | Anúncios do LinkedIn sem data, que expiram, um deles com erro técnico |
| D5 | **Currículos** (career) | **Reescritos** como "modelos de currículo" fictícios, com orientação e fontes públicas citadas. Tipo novo na API (`career/modelos-curriculo.json`). O build exige contatos falsos (`@example.com`, `(00) 00000-0000`) e datas coerentes. A seção Currículos passa a ler da API | Os atuais têm possível dado real (LGPD) e nenhuma orientação |
| D6 | **Áreas de atuação** (learn-tech `/category`) | Texto bom, sem fontes: vira o tipo novo `learn-tech/areas.json`, completado com fontes, sem promessas como "sucesso garantido". A tela passa a ler da API | É conteúdo de orientação de carreira reaproveitável |
| D7 | Plataformas da página carreira (learn-tech): Vagas.com e We Work Remotely | Entram em `career/vagas.json`. A Gupy, que já está em empresas, não entra de novo | Conteúdo do tipo "vaga/plataforma" que só existia no texto |
| D8 | **Páginas próprias de BQ e ByteClass** (`public/eventos-vivos`) | **Saem do site.** O conteúdo aproveitável vai para os dois eventos na API: proposta, pilares, formato, trilhas e tecnologias. O `officialLink` dos dois fica vazio, e o botão some | São rascunhos publicados com formulário que coleta dados sem enviar, contatos de exemplo e imagens de terceiros. Mudar o `officialLink` é a única alteração em item já existente da API, consequência direta da remoção |
| D9 | `testimonialData` e `ReviewsCard`, `VideoPlayerMP4`, `SignIn`, `SignUp`, `under-construction` (learn-tech) | **Saem** | Nenhuma tela importa esses arquivos; os depoimentos são inventados |
| D10 | Imagens sem uso | **Saem.** No tools: `assets/logos/logo-tools-1.png`, `assets/thumbs/tool-1.jpg`. No bootcamps: `cubo.png`, `logo-icon-1.png`, `profile.jpeg`, `context.txt`. Nos outros sites, só o que for conferido como órfão | Peso morto |
| D11 | `quizData` (learn-tech) | **Fica.** É usado por `programsData` (quiz do programa 1 na cópia local) | Faz parte da reserva local |
| D12 | Vídeo do programa 1 (Curso em Vídeo) | **Não vai para a API** | Vídeo de terceiro sem licença clara; decisão do Douglas |
| D13 | Categorias do tools com descrição; miniaturas do tools em `/media` | **Fica para depois** | Exigem escrever do zero ou mexer em 51 imagens; fora do escopo de hoje |
| D14 | Textos do site com informação falsa (Fala aê "enviado", "sem cadastro", roadmap de membros, "42 ferramentas", "13 experiências") | **Ficam no código e vão para o relatório como recomendação.** É texto do site, fora do escopo de hoje | Regra do Douglas |

## 3. Ordem de execução

1. **Onda 2:** conteúdo novo na API.
   - Novos itens: BRQ (D3), modelos de currículo (D5), áreas (D6), duas plataformas (D7), enriquecimento de BQ e ByteClass (D8).
   - Engenharia: schemas, build e testes dos tipos novos.
2. **Onda 3:** sites lendo da API.
   - Seção Currículos e tela `/category` passam a ler da API.
   - Remoção da janela da BRQ, das páginas próprias de BQ e ByteClass e dos arquivos órfãos.
   - Script de cópias locais (D1).
3. **Onda 4:** verificação.
4. **Onda 5:** relatório.
