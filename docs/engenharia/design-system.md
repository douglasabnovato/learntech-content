# Design system mínimo do ecossistema learnTECH

Documenta o que os quatro sites já usam, para que componentes novos sigam o mesmo padrão. Cada site tem uma cor de destaque própria sobre uma base comum. Fonte de verdade de cada site: as variáveis CSS ou o `@theme` do Tailwind, citados abaixo. Mudou um token? Mude lá e aqui.

## Princípios
1. **Base comum, destaque por site.** Neutros da escala zinc, tipografia Inter, cards com borda sutil e raio de 8 a 16 px. A cor de destaque identifica o site.
2. **Conteúdo primeiro.** O dado vem da API; o visual não depende dele para ficar de pé (estados de carregando e de vazio e a cópia de reserva).
3. **Acessível por padrão.** Contraste AA, foco visível, texto alternativo em toda imagem de conteúdo e um título por página.
4. **Mobile primeiro.** Layouts testados em 360, 768, 1024 e 1440 px, sem rolagem horizontal (`npm run e2e`, projeto `capturas`).

## Tokens por site
| Site | Tema | Destaque | Fundo / superfície | Texto | Tipografia | Fonte de verdade |
|---|---|---|---|---|---|---|
| learn-tech | claro | `sky-800` `#075985`; gradientes `sky-500` → `indigo-700` → `purple-700` nas áreas e categorias | branco / `neutral-50` | `neutral-800` | Inter | classes Tailwind; gradientes em `CategoriesAll.jsx` e `categorias.json` |
| bootcamps | escuro | `brand-primary` `#00c853` | `zinc-950` / `zinc-900/40` | `zinc-100` a `zinc-500` | sistema (Tailwind) | `src/app/styles/main.css` (`@theme`) |
| career | escuro e claro | `--brand-primary` `#f97316` (escuro) / `#ea580c` (claro) | `--bg-body` `#0a0a0c` / `#fafafa` | `--text-primary`, `--text-muted` | sistema | `css/style.css` |
| tools | escuro e claro | `--accent` `#ffb224` (escuro) / `#b45309` (claro) | `--bg` `#0c0d10` / `#faf9f7` | `--text`, `--text-muted` | Space Grotesk (títulos), Inter (texto) | `css/layout.css` |

**Medidas comuns:**
- raios de 8, 12 e 16 px (`--r-sm`, `--r`, `--r-lg` no tools);
- largura máxima do conteúdo entre 1180 e 1200 px;
- respiro lateral `clamp(1rem, 4vw, 2.5rem)`.

## Componentes compartilhados (mesmo papel nos quatro sites)
| Componente | Onde existe | Regra |
|---|---|---|
| Card de catálogo | todos | Imagem ou ícone, título, uma linha de descrição e uma tag (categoria, preço ou status). O card inteiro é o link. |
| Tag de status ou preço | tools (preço, "Descontinuado"), bootcamps ("Realizada", "Anunciada", "Eu estive lá") | Texto curto em caixa alta pequena, fundo com 10% da cor e borda com 20%. Nunca só cor: sempre texto. |
| Página de detalhe | todos | Ordem: título e resumo, conteúdo, mídia, links oficiais, **Veja também no ecossistema** e **Fontes** por último. |
| Veja também no ecossistema | career, tools, bootcamps | Lista de `relacionados` resolvidos pela API, com o rótulo do projeto acima do título. |
| Fontes | todas as páginas de detalhe e artigos | Lista simples de links externos (`target="_blank" rel="noopener noreferrer"`). |
| Linha do tempo de edições | bootcamps | Data ou ano, número e formato, tema, local, programação e link. |
| Aviso "Página em revisão" | career, tools | Último parágrafo do detalhe; o card continua no catálogo. |

## Estados e interação
- **Foco:** anel de 2 px na cor de destaque com deslocamento (`ring-2 ring-brand-primary ring-offset-4` no bootcamps). Nunca remova o `outline` sem colocar outro.
- **Hover:** só realça (fundo ou borda); não esconde informação.
- **Carregando:** mostrar a cópia de reserva enquanto a API responde, sem tela vazia.
- **Vazio:** mensagem explicando o filtro ou a busca sem resultado.

## Checklist para componente novo
- [ ] Usa os tokens do site, sem cor solta no código.
- [ ] Funciona com teclado: ordem do Tab, Enter ou Espaço e foco visível.
- [ ] Contraste AA (4,5:1 para texto normal, 3:1 para texto grande e ícones).
- [ ] Imagem de conteúdo com `alt` descritivo; imagem decorativa com `alt=""`.
- [ ] Testado em 360 px sem rolagem horizontal.
- [ ] Texto vindo da API com fallback quando o campo é opcional.
