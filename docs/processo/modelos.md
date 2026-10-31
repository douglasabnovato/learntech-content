# Modelos por tipo de conteúdo

Cada tipo tem um schema em `src/schemas/` (a fonte da verdade dos campos) e um exemplo de referência. Aqui ficam o padrão de qualidade e o que o build não consegue conferir.

## Programa (learn-tech, `content/learn-tech/programas/<id>.json`)
- **Exemplo de referência:** `101.json`.
- **Estrutura:** 4 módulos (ids 0 a 3), de **12 a 22 passos** no total, `lessons: "N passos"`, quiz de **12 questões** (3 por módulo), de 3 a 6 `sources` abertas.
- **Seções da página:** `whatYouBuild`, `whyNow` (números com fonte), `appliedIn`, `forWho`, `marketUsage`, `enrollDetails` (a ementa contém o título do módulo).
- **Cada passo:** `title`, `code` (rótulo curto ou trecho de código), `guidance` (a explicação) e `tips` (lista).
- **Projeto:** um projeto fictício do começo ao fim, que não repete o de outro programa da mesma trilha. O texto cita o programa anterior e o seguinte.
- **Conferido no build:** `lessonsCount` igual aos passos, numeração, títulos iguais entre `modules` e `moduleContents`, ementa, quiz com uma alternativa correta e `moduleId` existente, ícones da lista.

## Artigo (learn-tech, `paginas/blog.json`)
- **Campos:** `lead`, `highlights` (3), `body`, `quote`, `bodyContinued`, `sources`, `img` (de preferência em `/media`).
- **`readingTime`:** o build calcula com 200 palavras por minuto, arredondado para cima.

## Página de detalhe (tools e career, campo `detalhe`)
- **Exemplos de referência:** Figma (ferramenta) e Pitang (empresa).
- **Conteúdo:** `resumo` (2 a 3 frases) e de 4 a 5 `paragrafos`:
  1. como funciona;
  2. onde aparece no mercado;
  3. como começar;
  4. boas práticas e cuidados;
  5. onde aparece no ecossistema.
- **Fontes e ligações:** `links` oficiais, `fontes` (2 domínios), de 1 a 5 `relacionados` e `atualizadoEm`.
- **Perfis de pessoas:** só informação profissional e pública.

## Evento (bootcamps, `content/bootcamps/eventos/<slug>.json`)
- **Abertura:** `description` (card) e `longDescription` (2 a 3 frases).
- **Corpo:** `paragraphs` (3 a 5), `curriculum`, `links`, `sources`, `officialLink`.
- **Relato do autor:** preservado num parágrafo próprio, em terceira pessoa.
- **Fotos:** só na galeria do evento, tratadas (`scripts/tratar-fotos.py`).

## Área (learn-tech, `areas.json`)
Parágrafos, dia a dia, competências, ferramentas, como começar, cards ligados a categorias que existem e fontes (mínimo de 1).
