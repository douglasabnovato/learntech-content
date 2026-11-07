# Contrato: tools

**Papel do site:** catálogo de ferramentas e hospedagens que o autor usa de verdade, com o que cada uma faz, quanto custa e como começar. Produção em `https://douglasabnovato.github.io/tools/`.

Regras comuns, hierarquia das fontes e verificação geral: [`README.md`](README.md).

## O que vira conteúdo aqui

| Material do hd | Recurso | Destino |
|---|---|---|
| Ferramenta citada em curso, projeto ou código do autor | ferramenta | `tools/ferramentas/<slug>` |
| Serviço onde o autor publicou um projeto | hospedagem | `tools/hospedagens/<slug>` |
| Código do autor | só a ferramenta usada (o código vai para um programa do learn-tech) | `tools/ferramentas/<slug>` |

O critério de entrada é uso real, não popularidade. A ferramenta já existe? Então aprofunde o `detalhe` dela em vez de criar outra.

## Ferramenta e hospedagem: itens de `content/tools/{ferramentas,hospedagens}.json`
- **Schema:** `ferramentaSchema` em `src/schemas/career-tools.ts`.
- **Exemplos de referência:** ferramenta `figma`; hospedagem `vercel`.
- **Card:** `title`, `description` (o que faz, numa frase), `category` (uma das categorias existentes; categoria nova só com o autor), `pricing` (`Gratuito`, `Freemium`, `Pago` ou `Descontinuado`), `thumb`, `site_url`, `slug`; `thumbFit` quando o logo precisar de `contain`.
- **Página de detalhe** (`detalhe`): `resumo` (2 a 3 frases) e de 4 a 5 `paragrafos`:
  1. como funciona;
  2. onde aparece no mercado;
  3. como começar;
  4. boas práticas e cuidados;
  5. onde aparece no ecossistema.

  Mais `links` oficiais (site e documentação), `fontes` de 2 domínios, de 1 a 5 `relacionados` e `atualizadoEm`.
- **Preço:** com fonte e data ("em novembro de 2026"). Plano que mudou: atualizar e citar.
- **Nome que mudou:** nome atual com o antigo entre parênteses, como em "draw.io (diagrams.net)".
- **Uso em ex-empregador:** descrito de forma genérica ("numa rede de varejo"), sem ligar ao nome real nem a contratos de fornecedor.
- **Thumb:** WebP leve em `media/tools/` (ver issue #55 do tools).

## Checklist do produtor
- [ ] `npm run validar` verde.
- [ ] `pricing` com fonte e data no `detalhe`.
- [ ] Categoria existente.
- [ ] Relacionados com o programa do learn-tech que ensina a ferramenta e os eventos do bootcamps onde ela apareceu.
- [ ] `site_url` e links com https.

## Verificação na tela
- **API:** `/v1/tools/ferramentas.json` e `/v1/tools/hospedagens.json`.
- **Cópias no site:** `data/tools.js` e `data/host.js`.
- **Página:** `detalhe.html?id=<slug>`, com título, `canonical` com a mesma URL e miniatura carregada.
- **Catálogo:** o card aparece na busca pelo nome e no filtro da categoria.
- **Sitemap:** `tools/sitemap.xml`.
