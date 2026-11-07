# Contrato: bootcamps

**Papel do site:** registrar a trajetória em eventos, bootcamps e formações, os concluídos e as metas. Produção em `https://bootcamps-dun.vercel.app`.

Regras comuns, hierarquia das fontes e verificação geral: [`README.md`](README.md).

## O que vira conteúdo aqui

| Material do hd | Uso no evento |
|---|---|
| Fotos e vídeos de evento | `content.gallery` (fotos tratadas) e `content.videoUrl` |
| Certificado (pdf, imagem) | `content.certificate` e `status: "concluido"` |
| Programação, ementa, edital | `content.curriculum`, `content.editions[].programacao` |
| Anotações e relato do autor | um parágrafo próprio em `content.paragraphs`, em terceira pessoa |
| Material de formação (curso, faculdade, bootcamp) | evento de categoria própria, com link para o programa do learn-tech |

Destino: `bootcamps/eventos/<slug>`.

## Evento: `content/bootcamps/eventos/<slug>.json`
- **Schema:** `eventoSchema` em `src/schemas/bootcamps.ts`.
- **Exemplo de referência:** `codexperience.json` (galeria com 16 fotos, 5 parágrafos, edições e 3 relacionados).
- **Obrigatórios:** `id`, `slug`, `title`, `institution`, `description` (texto do card), `coverImage`, `altText`, `category` (`frontend`, `backend`, `fullstack`, `mobile` ou `outros`), `status` (`concluido` ou `desejado`), `content.longDescription` (2 a 3 frases), `content.curriculum`, `content.officialLink`.
- **Corpo:** `content.paragraphs` (3 a 5), `content.links`, `content.sources`.
- **Edições:** quando o evento se repete, uma entrada por ano em `content.editions` (`year`, `image`, `highlight`, `status: "realizado"` ou `"anunciado"`; `participacao` quando se sabe).
- **Fotos:** só na galeria. Pessoas aparecem só em cobertura de evento. Tratar com `python scripts/tratar-fotos.py <origem> media/bootcamps/eventos/<slug>-<ano> ORIGINAL:destino ...`. Cada item da galeria tem `alt`.
- **Evento já existe:** aprofundar o arquivo existente (edição nova, fotos, parágrafo) em vez de criar outro. Ex.: `gdg-jf.json`.
- **Não vira página:** evento corporativo interno de ex-empregador.

## Checklist do produtor
- [ ] `npm run validar` verde.
- [ ] Nomes reais do evento e da instituição; relato do autor em terceira pessoa.
- [ ] Galeria sem foto repetida (`scripts/imagens-parecidas.py`), sem EXIF, com `alt` em todas.
- [ ] Relacionados com o programa ou artigo do learn-tech e as ferramentas do tools que o evento usou.
- [ ] Datas e números do evento com fonte (página oficial, quando houver).

## Verificação na tela
- **API:** `/v1/bootcamps/eventos/<slug>.json`.
- **Cópia no site:** `src/entities/event/api/events.data.ts`.
- **Página:** `/event/<slug>`: título, capa carregada, galeria abrindo no diálogo e "Veja também" com links válidos.
- **Listagem:** o evento aparece na Home no filtro do status e da categoria certos.
- **Sitemap:** `bootcamps/public/sitemap.xml`.
