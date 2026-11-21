# Estado do ecossistema: comece por aqui

Ponto de entrada de toda conversa nova com o Claude. Atualizado ao fim de cada conversa. **Última atualização: 20/11/2026.**

## O que é
O learnTECH treina pessoas para o ecossistema de tecnologia com o que o autor fez e com o que ele quer fazer. Uma API de conteúdo alimenta quatro sites:

| Projeto | Papel | Publicação |
|---|---|---|
| `learntech-content` | API e fonte única do conteúdo, processos e documentação | Cloudflare Workers (`learntech-content.douglasabnovato.workers.dev`) |
| `learn-tech` | Programas, artigos e áreas | Vercel (`learn-tech-pied.vercel.app`) |
| `bootcamps` | Eventos, formações e metas de estudo | Vercel (`bootcamps-dun.vercel.app`) |
| `career` | Empresas, vagas, perfis e modelos de currículo | GitHub Pages (`douglasabnovato.github.io/career`) |
| `tools` | Ferramentas e hospedagens | GitHub Pages (`douglasabnovato.github.io/tools`) |

Pastas locais:
- **Máquina do autor:** `C:\douglasabnovato-github\mundo-learn-tech\`, com o acervo bruto em `hd/`.
- **Segunda máquina, desde 18/11/2026:** `C:\douglasabnovato-learntech\`, só com os 5 clones e **sem o `hd/`**. Nela, o trabalho é de engenharia e de qualidade sobre o que já está nos repositórios.

## Onde está cada coisa
- **Colaboração:** `docs/processo/como-trabalhamos.md`.
- **Processo de conteúdo** (10 etapas, fechamento de leva, cobertura): `docs/processo/README.md`. Regras: `regras-editoriais.md`, `seguranca-privacidade.md`.
- **Engenharia:** `docs/engenharia/`, com arquitetura, diagnóstico, design system, backlog, guia das etapas manuais e relatórios.
- **Estratégia de conteúdo** (proposta de 20/11/2026): `docs/estrategia/`, com visão, pedagogia, storytelling, marketing e curadoria.
- **Pendências do autor:** `PROXIMOS-PASSOS.md`.
- **Histórico por lote:** `docs/processo/lotes/`. Histórico por conversa: `docs/processo/conversas/`.
- **Medição:** `npm run progresso` (placar), `npm run cobertura`, `npm run leva:status`.

## Situação em 20/11/2026
- **Delegação do autor (20/11):** as perguntas ao autor vão primeiro ao LIDER (sessão "Líder de TODOS"), que responde "Decisão LIDER Dnn". Ficam só com o autor: ação irreversível, merge na `main`, segredos, contas, custo, deploy, publicação em nome dele, regra editorial e A1, A2 e A3.
- **Estratégia de conteúdo** em `docs/estrategia/`, como proposta (Decisão LIDER D16). Cada documento termina com o checklist do revisor, reunido em `docs/processo/checklists.md`. Vale como regra depois do ok do autor.
- **Entrega 3, parte de código (Decisão LIDER D18):** a hipótese de cada site em `docs/estrategia/hipoteses.md` e a recomendação da ferramenta de medição em `docs/estrategia/medicao.md` (Cloudflare Web Analytics), as duas para o autor decidir. Spec novo `e2e/estados.spec.mjs` (API lenta, API fora e busca vazia nos quatro sites). Na produção, o CLS de learn-tech, bootcamps e tools ficou abaixo de 0,1, e o axe deu 0 violações nas 9 páginas. Os `docs/MVP.md` dos sites passaram para 8 de 12 (career 9).
- **Fila do autor:** as 3 tarefas que mais destravam são fechar as 28 issues com "Conteúdo produzido", o Dependabot com o nível N3 (content#26 e #27) e fechar a leva 1 com os fatos dos itens 6 e 9.

## Situação em 19/11/2026
- **As cinco `developer` foram para a `main`,** com o ok do autor no chat: content#31 primeiro, depois career#40, learn-tech#145, bootcamps#80 e tools#65. O autor fez o `npm run deploy` da API (versão 07818600). Na produção, as páginas principais dão 200 e as rotas inexistentes dão 404 nos quatro sites.
- **content#11:** Lighthouse 13, e o `npm audit` foi de 36 vulnerabilidades para 0 (`docs/engenharia/relatorios/audit-2026-11-19.md`).
- **Lighthouse depois da main** (`docs/engenharia/relatorios/lighthouse-2026-11-19-pos-main.md`): career 98 e 99, tools home 97, learn-tech de 85 a 93 (o CLS de 0,4 sumiu), bootcamps 91 e 85. Fica abaixo da meta a página de ferramenta do tools (73, LCP 4,9 s).
- **Nesta máquina,** o PowerShell bloqueia o `npm.ps1`. Use `npm.cmd` e `npx.cmd`. O Chromium do Playwright não abre pelo `chrome-launcher`; use `CHROME_PATH` com o Chrome instalado.

## Situação em 18/11/2026
- **Linha de base nos 5 repositórios:** a `developer` passa em testes, lint e build, e a CI está verde. A `developer` está à frente da `main`: são 32 commits aqui, 6 no learn-tech, 4 no tools, 5 na career e 1 no bootcamps. Cerca de 15 issues fecham quando o autor levar as `developer` para a `main`, com a API primeiro (a career depende do bb4ff0a).
- **Triagem das issues abertas (129):** as issues de acervo #12, #13, #14, #16 e #18 já estão na `main` e podem fechar. Só a #15 (vídeos) precisa do `hd/`. As cerca de 90 issues antigas dos sites foram agrupadas em três destinos: fechar com evidência, perguntar ao autor ou mover (ver #29).
- **Entregue na `developer` (branch `feature/tasks-18-11-2026`):**
  - **bootcamps#73:** JS inicial de 130 para 95,6 KB gzip, com `LazyMotion`, sem Helmet, fonte servida pelo próprio site, LCP priorizado e fachada do YouTube. Orçamento de 100 KB na CI. Lighthouse móvel entre 82 e 89, com acessibilidade 100. O que falta para chegar a 90 é a #71 (pré-renderização).
  - **learn-tech#131:** 404 real na Vercel. As reescritas cobrem só as rotas conhecidas e o build gera o `404.html` com `noindex`, conferido por teste.
  - **#7:** `npm run links`, workflow semanal `links.yml` e primeiro relatório (1.522 URLs, 35 quebradas, em `docs/engenharia/relatorios/links-2026-11-18.md`).
  - **bootcamps#71:** uma página pré-renderizada por evento (27), com título, Open Graph, canonical e JSON-LD (`Event` por edição, `Course` por formação). O `vercel.json` só reescreve `/event/:slug`, e o resto responde 404.
  - **Itens 8 e 9 de `orientacoes-ia.md`** (aprovados pelo autor): a CI do bootcamps escuta a `developer`. O learn-tech tem lockfile, `npm ci`, `format:check` e orçamento (#127). A API ganhou `format:check`, e as reformatações ficaram em commits só de estilo. **Renomear as branches de integração continua com o autor.**
- **Conferir na produção depois da `main`:**
  - `/nao-existe` responde 404 no learn-tech e no bootcamps;
  - `/event/<slug>` traz o título do evento;
  - o `links.yml` roda na segunda.
- **LCP do modal no tools e na career** (tools#58 e career#30):
  - o CSS de fontes e ícones passou a carregar sem bloquear (`js/estilos-assincronos.js`, compatível com a CSP);
  - o SDK de identificação está direto no HTML, com `defer`;
  - o logo da career virou WebP (211 → 18 KB).
  - Resultado na home, em celular: tools de 84–91 para 100 (LCP de 1,6 s); career de 75–83 para 96–98 (LCP mediano de 2,5 s).
  - **No learn-tech e no bootcamps, o SDK no HTML não ajudou.** Medi antes e depois, com `VITE_API_URL`, e desfiz: nesses dois sites, o LCP é uma imagem e não o modal.
    - learn-tech: o que deu resultado foi trocar o Google Fonts pela Inter servida pelo próprio site (`a2393cb`). A performance foi de 71–76 para 78–79 e o FCP de 3,1 para 2,5 s. O LCP (4,9 s) é a imagem do topo, que espera o React renderizar.
    - bootcamps: o preload da capa do primeiro card também não ajudou e foi desfeito. A capa só aparece depois do JS e dos dados.
    - Nos dois, o próximo ganho exige que a imagem do LCP já venha no HTML, sem esperar o React.
- **Próximo:** content#11 (Lighthouse 13 e `npm audit`), content#8 (orçamento de mídia: as capas da API pesam no LCP do bootcamps) e o LCP do detalhe do tools, que depende do `fetch`.

## Situação em 09/11/2026
- **Uso por arquivo** (branch `feature/tasks-09-11-2026`): campo `uso` em cada arquivo do acervo (`exibido`, `fonte`, `similar`, `referencia`, `tecnico`, `descartado`, `pendente`), comandos `hd:imagens` e `hd:uso`, e `leva:status` exigindo zero pendentes. Primeira aplicação automática: 66 fotos `exibido` e 9 arquivos `tecnico`. Relatórios em `docs/processo/relatorios/` (06/11 e 09/11).
- **Issues do uso do hd** (label `acervo`): #12 material do ex-empregador marcado como `referencia` (1.734 arquivos, aprovado pelo autor em 09/11; pendentes caíram de 2.608 para 874), #13 fotos de evento, #14 documentos de fonte, #15 vídeos (decisão do autor), #16 fase 1 do fluxo de agentes. #17 entregue: `hd:uso --vivo`, testes e cache do `hd:imagens` (12 s).
- **Trabalho contínuo:** ciclo de cada sessão, prioridade e modelo do relatório de andamento em `como-trabalhamos.md`. Próxima issue sem dependência do autor: #16 (fase 1) e #13 (fotos de evento, com a seleção levada ao autor).
- **Fim do dia (na `developer`, o autor leva para a `main`):**
  - **hd 93,0% usado.** Os 37 pendentes são vídeos (#15, que ficam com o autor).
  - **#14:** 502 documentos receberam uso; 8 temas novos foram aprovados no A1 e produzidos (6 fichas no tools, artigo de cashback e LTV, passos nos programas 1101, 106, 1102 e 1004); o áudio do HD-0006 foi transcrito.
  - **#13:** cada foto teve decisão com critério. 41 fotos novas nas galerias, mais 3 no learn-tech. Verificação na tela registrada no lote `2026-11-09-documentos-do-hd.md`.
  - **#18:** destino em formato único, conferido no build.
  - **learn-tech#136:** galeria no programa e no artigo (ADR 12).
  - **#16:** `hd:extrair`, triador, `a1` e gabarito prontos. Em três rodadas (42 itens), o acerto foi de 76% em direitos e 67% em destinos. Decisão do autor: o triador é proponente e o A1 corrige. A fase 1 está entregue, e a próxima é a fase 2 (produtores).
  - **Do autor:**
    - levar as `developer` para a `main` e fazer o deploy da API. Sem o deploy, as fichas, fotos e capas novas não aparecem na produção;
    - decidir a ficha da Rock Content;
    - subir os vídeos.

## Situação em 06/11/2026
- **Fluxo de agentes, fase 0** (branch `feature/tasks-06-11-2026-b`): estados novos no acervo (`extraido`, `triado`, `produzido`, `exibido`), campos `triagem` e `etapas`, `docs/processo/agentes.md`, contratos dos quatro sites em `docs/contratos/` e `CLAUDE.md` nos cinco repositórios. Próxima: fase 1, triador e `hd:extrair`, com avaliação por gabarito.
- **Documentação do estado:** `docs/ESTADO-DO-PROJETO.md` em cada um dos cinco repositórios (o que fizemos, como está, o que queremos fazer) e seção "Estado do projeto" no README de cada um. As seções antigas de pendências dos READMEs passaram a apontar para as issues.
- **Issues novas** (`proximos-passos`, com critérios de entrega): learntech-content #10 e #11, learn-tech #133 e #134, bootcamps #75, career #33 e tools #60. As novas de acessibilidade usam o relatório do e2e de 05/11.

## Situação em 05/11/2026
- **Rodada de MVP dos cinco projetos** (03 a 05/11): diagnóstico, plano, execução, conteúdo do lote 4, processo (`fluxo-git.md`, `mvp-por-repositorio.md`) e issues `proximos-passos` em todos os repositórios. Registro: `conversas/2026-11-03-mvp-cinco-projetos.md`.
- **Publicação:** branch `feature/tasks-03-11-2026-b` → developer → main nos cinco, e deploy da API em 05/11.
- **Estabilidade (05/11):** e2e contra produção com 19 de 19 testes (fluxos e acessibilidade sem violação crítica); Deploy automático só com `DEPLOY_AUTOMATICO = sim`, sem ficar vermelho a cada push; `docs/COMO-EVOLUIR.md` em cada um dos cinco repositórios.
- **Próximo passo:** executar as issues `proximos-passos` por prioridade e decidir as `decisao-do-autor`.

## Situação em 03/11/2026
- **Publicado:** a branch `feature/tasks-01-11-2026-c` subiu nos cinco repositórios e a API foi publicada (versão `950f63cb`). Placar: 76/100, com Publicação em 100%.
- **Protegido:** ruleset `main protegida` ativo nos cinco (check `verificar` obrigatório, sem force push, sem apagar a `main`). O merge passa a ser `--ff-only` depois da CI verde na branch (`docs/processo/README.md`).
- **Branch do dia:** `feature/tasks-03-11-2026` nos cinco, sem commit. Contém:
  - ações da CI em `@v5` nos cinco;
  - lint do learn-tech zerado (70 → 0) e obrigatório na CI;
  - `verificar.ps1` da career com `/`, sem `continue-on-error`;
  - lint na CI da API;
  - backlog, guia, processo e próximos passos atualizados.
- **Falta para o critério "estável e público":**
  - conferir os quatro sites no ar;
  - rodar e2e e Lighthouse;
  - o primeiro Run workflow do monitor de disponibilidade.

  Plano: `docs/historico/engenharia/plano-estabilidade-2026-11-03.md`.
- **Alerta novo:** `hd/7-abc-projetos/` tem cerca de 3.150 arquivos fora do inventário (material do ex-empregador). Será uma remessa própria, com a seção 7 das regras editoriais.

## Situação em 01/11/2026 (histórico)
- **Placar:** 64/100 (conteúdo 84%, engenharia 66%, pendências do autor 6 concluídas e 8 em aberto, publicação 0% enquanto a branch do dia não sobe). Previsão: cerca de 74 depois do merge.
- **Branch em aberto:** `feature/tasks-01-11-2026-c` nos cinco repositórios, sem commit. Contém a leva 1 (fase 1), os documentos de engenharia, os testes, a CI, os scripts de e2e e UX, SEO, os cabeçalhos de segurança, o monitoramento e os documentos de colaboração. Para subir: `docs/engenharia/guia-etapas-manuais.md`.
- **Lotes:**
  - 2026-10-27 (leva 1): 51 de 67 itens fechados; os demais dependem de arquivos ou informações do autor.
  - 2026-10-30 (levas 2 a 4): 52 de 55; faltam os vídeos no YouTube, a transcrição do áudio e a aprovação.
- **Bloqueio principal:** o Claude não consegue rodar testes nem ler a CI. A solução é o autor vincular o GitHub ao Claude.

## Feito no bloco da noite de 01/11
- **API:** cabeçalhos de segurança e `no-store` nas rotas dinâmicas, log de erro estruturado, `cache-e-versionamento.md`, script `npm run auditar`. O diagnóstico foi corrigido: a API já tinha log de erro e Workers Logs ligado.
- **learn-tech:** catálogo de programas gerado pela API (`programasCatalogo.js`), para os cards dos programas novos aparecerem sem API.
- **Conteúdo:**
  - os 27 eventos com `relacionados`;
  - imagens repetidas trocadas por capas próprias (5 artigos e 16 programas);
  - fontes novas em 8 artigos e 5 eventos;
  - correções da revisão independente (página da ABC sem estrutura interna e sem fornecedores, fontes dos artigos do hackathon e do pitch, React Foundation, Scrum Guide);
  - seção 7 das regras editoriais (material de ex-empregadores).
- **Ainda em alerta** (`.claude-tmp/leva6/alertas.txt`): descrição da Le Wagon possivelmente desatualizada (escolher-formacao-dev); números sem fonte em processo-seletivo, finanças e bolsas; 4 itens ainda com fonte de um domínio só.

## Frentes abertas (uma conversa para cada)
1. **Engenharia:** executar o guia manual, ler os relatórios de e2e e Lighthouse, corrigir, auditar dependências, logs de erro da API e política de cache.
2. **Conteúdo, lote 2026-10-30:** fechar com os vídeos, a transcrição e a aprovação.
3. **Conteúdo, leva 1:** 16 itens dependem do autor.
4. **Remessa nova do hd:** quando o autor trouxer arquivos, seguir `docs/processo/README.md` desde a recepção.
5. **Conteúdo a partir das issues (lote 2026-11-03):** fichas, artigos e fontes produzidos e aguardando A2. Perguntas ao autor postadas em 30 issues. Relatório e log de escolhas: `docs/processo/lotes/2026-11-03-issues.md`.

## Como abrir uma conversa nova
Cole no início:
```
Contexto: ecossistema learnTECH. Leia learntech-content/docs/processo/ESTADO.md,
PROXIMOS-PASSOS.md e o último registro em docs/processo/conversas/ da frente <frente>.
Objetivo: ...
Pronto quando: ...
Prioridade: ...
```
