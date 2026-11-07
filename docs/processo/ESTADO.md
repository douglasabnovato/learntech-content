# Estado do ecossistema: comece por aqui

Ponto de entrada de toda conversa nova com o Claude. Atualizado ao fim de cada conversa. **Última atualização: 06/11/2026.**

## O que é
O learnTECH treina pessoas para o ecossistema de tecnologia com o que o autor fez e com o que ele quer fazer. Uma API de conteúdo alimenta quatro sites:

| Projeto | Papel | Publicação |
|---|---|---|
| `learntech-content` | API e fonte única do conteúdo, processos e documentação | Cloudflare Workers (`learntech-content.douglasabnovato.workers.dev`) |
| `learn-tech` | Programas, artigos e áreas | Vercel (`learn-tech-pied.vercel.app`) |
| `bootcamps` | Eventos, formações e metas de estudo | Vercel (`bootcamps-dun.vercel.app`) |
| `career` | Empresas, vagas, perfis e modelos de currículo | GitHub Pages (`douglasabnovato.github.io/career`) |
| `tools` | Ferramentas e hospedagens | GitHub Pages (`douglasabnovato.github.io/tools`) |

Pasta local: `C:\douglasabnovato-github\mundo-learn-tech\`. O acervo bruto fica em `hd/`.

## Onde está cada coisa
- **Colaboração:** `docs/processo/como-trabalhamos.md`.
- **Processo de conteúdo** (10 etapas, fechamento de leva, cobertura): `docs/processo/README.md`. Regras: `regras-editoriais.md`, `seguranca-privacidade.md`.
- **Engenharia:** `docs/engenharia/`, com arquitetura, diagnóstico, design system, backlog, guia das etapas manuais e relatórios.
- **Pendências do autor:** `PROXIMOS-PASSOS.md`.
- **Histórico por lote:** `docs/processo/lotes/`. Histórico por conversa: `docs/processo/conversas/`.
- **Medição:** `npm run progresso` (placar), `npm run cobertura`, `npm run leva:status`.

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

  Plano: `docs/engenharia/plano-estabilidade-2026-11-03.md`.
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
