# Contrato: learn-tech

**Papel do site:** ensinar. Programas com módulos, passos e quiz; artigos de carreira e tecnologia; áreas de atuação. Produção em `https://learn-tech-pied.vercel.app`.

Regras comuns, hierarquia das fontes e verificação geral: [`README.md`](README.md).

## O que vira conteúdo aqui

| Material do hd | Recurso | Destino |
|---|---|---|
| Apostila, curso, roteiro de aula, exercícios (pdf, docx, txt) | programa | `learn-tech/programas/<id>` |
| Anotações, reflexões, palestra assistida, texto de carreira | artigo | `learn-tech/blog/<id>` |
| Material que descreve uma profissão ou área | área | `learn-tech/areas/<id>` |
| Código do autor (exemplos, exercícios resolvidos) | passos dentro de um programa (`code`) | `learn-tech/programas/<id>` |

## Programa: `content/learn-tech/programas/<id>.json`
- **Schema:** `programaSchema` em `src/schemas/learn-tech.ts`.
- **Exemplo de referência:** `101.json` (React: Componentes, Estado e a Primeira Aplicação). Ele tem 2 `sources`; programas novos seguem o mínimo de 3.
- **Obrigatórios para o card:** `id`, `category`, `categoryFilter` (só `a-z`, `0-9` e `-`), `title`, `description`, `image`.
- **Página completa:** `modules` (4, ids 0 a 3), `moduleContents` (mesmos títulos), `quiz` com 12 questões (3 por módulo, uma correta cada) e de 3 a 6 `sources` abertas.
- **Passos:** de 12 a 22 no total; cada um com `title`, `code`, `guidance` e `tips`. `lessons: "N passos"`.
- **Seções:** `whatYouBuild`, `whyNow` (números com fonte), `appliedIn`, `forWho`, `marketUsage`, `enrollDetails`.
- **Projeto do programa:** fictício do começo ao fim, sem repetir o de outro programa da trilha. O texto cita o programa anterior e o seguinte.
- **Escola e marca:** o programa reproduz o treinamento (matérias, metodologia, sequência), mas o nome e o logo da escola só aparecem em `sources`. Exercícios usam dados fictícios.
- **id:** o próximo número livre da faixa da categoria (conferir em `content/learn-tech/programas/`).

## Artigo: item em `content/learn-tech/paginas/blog.json`
- **Exemplo de referência:** o primeiro item de `blog.json` (`videoteca-e-leituras-para-autoconhecimento-e-carreira`).
- **Campos:** `id` (slug), `blogURL` (`/blog/<id>`), `img` (de preferência em `/media/learn-tech/blog/`), `title`, `tag`, `author`, `publishedAt`, `lead`, `highlights` (3), `body`, `quote`, `bodyContinued`, `sources`.
- **`readingTime`:** o build calcula (200 palavras por minuto).
- **Tom:** ferramentas, empresas e plataformas podem ser citadas pelo nome. Material de ex-empregador vira conhecimento com a empresa fictícia "Rede Construir+".

## Área: item em `content/learn-tech/areas.json`
- **Schema:** `areaSchema`. **Exemplo:** `front`.
- **Campos:** `paragraphs`, `diaADia`, `competencias`, `ferramentas`, como começar, cards ligados a categorias existentes e pelo menos 1 fonte.

## Checklist do produtor
- [ ] `npm run validar`: `lessonsCount` igual aos passos, numeração, títulos iguais entre `modules` e `moduleContents`, quiz consistente.
- [ ] Nenhum nome de escola, cliente ou pessoa dentro das aulas.
- [ ] `whyNow` sem número sem fonte.
- [ ] Relacionados com eventos do bootcamps, ferramentas do tools ou empresas da career, quando a ligação for real.
- [ ] Imagem com `alt` e servida por `/media`.

## Verificação na tela
- **API:** `/v1/learn-tech/programas/<id>.json`; o artigo em `/v1/learn-tech/paginas/blog.json`.
- **Cópias no site:** `src/constants/programasCatalogo.js` (card de programa) e `src/constants/blogData.js` (artigo).
- **Páginas:** `/program/<categoryFilter>/<id>` (título do programa, sem "Conteúdo indisponível" com a API no ar) e `/blog/<id>` (`document.title` igual ao título do artigo).
- **Sitemap:** `learn-tech/public/sitemap.xml`.
