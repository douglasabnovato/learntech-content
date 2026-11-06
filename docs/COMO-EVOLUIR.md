# Como evoluir o learntech-content

Guia curto para a próxima remessa de arquivos e para qualquer mudança na API. O processo completo de levas está em `processo/README.md`; aqui fica o caminho mais curto, com os comandos.

## 1. O que este repositório é
- **Fonte única do conteúdo** dos quatro sites: `content/` (JSON) e `media/` (WebP e PDF).
- **API** na Cloudflare: `/v1/...`, só leitura, mais as escritas de acesso e mensagens no D1.
- **Gerador das cópias de reserva** dos sites (`npm run copias`) e dos sitemaps (`npm run sitemaps`).

Os sites nunca recebem conteúdo editado à mão. Todo conteúdo novo nasce aqui.

## 2. Quando chegar uma remessa nova de arquivos
| Passo | Comando ou ação | Detalhe em |
|---|---|---|
| 1. Branch do dia | `git checkout main && git pull --ff-only && git checkout -b feature/tasks-DD-MM-AAAA` | `processo/fluxo-git.md` |
| 2. Colocar os arquivos | na pasta `mundo-learn-tech/hd/`, nunca dentro do repositório | `processo/README.md` (Recepção) |
| 3. Inventário | `npm run hd:inventariar`, depois `npm run hd:inventariar -- --registrar` | `processo/README.md` (Inventário) |
| 4. Triagem | ficha de cada item no `content/acervo.json`: direitos, estado e destino | `processo/regras-editoriais.md` |
| 5. Plano do lote (A1) | `processo/lotes/AAAA-MM-DD-*.md`, aprovado pelo autor | `processo/checklists.md` |
| 6. Produção | um JSON por item no destino (tabela da seção 3) | `processo/modelos.md`, `processo/pesquisa.md` |
| 7. Validação | `npm run validar` e `npm run verificar`, mais a revisão independente por amostra | `processo/README.md` (Validação) |
| 8. Integração | `npm run copias` e `npm run sitemaps`, depois os testes de cada site | seção 5 |
| 9. Publicação | commits por tema → feature → developer → main → `npm run deploy` | `processo/fluxo-git.md`, `DEPLOY.md` |
| 10. Fechamento | `npm run leva:status`, `npm run progresso`, relatório do lote e `PROXIMOS-PASSOS.md` | `processo/README.md` (Fechamento) |

## 3. Para onde vai cada tipo de material
| Material recebido | Destino | Exemplo de referência |
|---|---|---|
| Curso ou treinamento que o autor fez | `content/learn-tech/programas/<id>.json` e `content/bootcamps/eventos/<slug>.json` | `programas/101.json`, `eventos/rocketseat-ignite.json` |
| Evento de que participou ou que organizou | `content/bootcamps/eventos/<slug>.json`, mais um artigo com os bastidores | `eventos/codexperience.json` |
| Texto, relato ou aprendizado | item em `content/learn-tech/paginas/blog.json` | `testes-tecnicos-online` |
| Empresa onde trabalhou ou que recomenda | `content/career/empresas.json` (+ modelo de currículo, se couber) | `pitang` |
| Portal ou canal de vagas | `content/career/vagas.json` | `coodesh` |
| Pessoa de referência (só pública) | `content/career/perfis.json` | `sujeito-programador` |
| Ferramenta ou hospedagem citada | `content/tools/ferramentas.json` ou `hospedagens.json` | `figma`, `vercel` |
| Fotos | `media/bootcamps/eventos/<slug>/N.webp`, tratadas com `scripts/tratar-fotos.py` | `media/bootcamps/eventos/fator-s-challenge/` |
| Capa sem imagem própria | `python scripts/gerar-capa.py <destino.webp> "<título>" "<rótulo>"` | `media/learn-tech/blog/` |

Regra de cobertura: o mesmo material deve aparecer no máximo de projetos que o tema permitir (`processo/README.md`, 7b).

## 4. Mudar a estrutura (campo ou recurso novo)
1. **Schema:** `src/schemas/*.ts` (Zod). Campo novo começa como `optional()`.
2. **Regras e resumo:** `scripts/lib/conteudo.ts` (integridade, `montarRecursos`). Os campos de card do catálogo de programas ficam em `CAMPOS_RESUMO` (`src/schemas/learn-tech.ts`).
3. **Teste:** `tests/conteudo.test.ts`, um caso que planta o erro e outro que confere o recurso gerado.
4. **OpenAPI:** `scripts/lib/openapi.ts`, quando muda rota ou formato.
5. **Decisão:** ADR em `DECISOES.md` quando muda contrato, privacidade ou arquitetura.
6. **Cópias:** `npm run copias`. O gerador usa o mesmo `montarRecursos` do build, então a cópia sai igual à API.
7. **Sites:** o código de cada site que exibe o campo novo, com o teste dele (veja o `docs/COMO-EVOLUIR.md` de cada site).

## 5. Comandos
| Comando | Para quê |
|---|---|
| `npm run validar` | Só confere `content/` (rápido) |
| `npm run verificar` | Typecheck, testes (102 em 05/11/2026) e build |
| `npm run lint` | ESLint (obrigatório na CI) |
| `npm run copias` / `copias:conferir` | Gera ou confere as cópias de reserva nos quatro sites (pastas irmãs) |
| `npm run sitemaps` | Gera os sitemaps dos quatro sites |
| `npm run e2e` | Playwright contra produção: fluxos, acessibilidade e capturas (`npx playwright install chromium` depois de atualizar o Playwright) |
| `npm run progresso` | Placar de 0 a 100 |
| `npm run deploy` | Build e publicação na Cloudflare (wrangler autenticado) |

## 6. Estabilidade: o que conferir antes de dar por pronto
- [ ] `npm run verificar` e `npm run lint` verdes.
- [ ] `npm run copias:conferir` em dia e os testes de cada site verdes.
- [ ] CI verde na branch, e `main` e developer iguais à feature (`processo/fluxo-git.md`).
- [ ] `npm run deploy` feito e `GET /v1/saude` com `status: ok`.
- [ ] `npm run e2e`: fluxos e acessibilidade sem violação crítica (19 de 19 em 05/11/2026).
- [ ] Workflow `disponibilidade` verde no GitHub.

## 7. Onde está cada documento
- **Estado atual:** `processo/ESTADO.md`. **Pendências do autor:** `../PROXIMOS-PASSOS.md`.
- **Arquitetura e decisões:** `ARQUITETURA.md`, `DECISOES.md`. **Conteúdo:** `CONTEUDO.md`. **Deploy:** `DEPLOY.md`. **Privacidade:** `PRIVACIDADE.md`.
- **Processo:** `processo/` (levas, regras, modelos, pesquisa, fluxo Git, MVP por repositório).
- **Engenharia:** `engenharia/` (backlog, diagnósticos, relatórios).
