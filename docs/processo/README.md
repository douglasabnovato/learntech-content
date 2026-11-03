# Processo de levas do hd

Atualizado em 2026-10-30. O hd (`mundo-learn-tech/hd`) é a pasta onde o autor deposita material bruto: cursos que fez, eventos, projetos e livros. Cada **leva** vira conteúdo da API (`learntech-content`) e aparece nos quatro sites. Depois disso, os arquivos saem do hd, e o registro permanente fica em `content/acervo.json`.

Este documento é o roteiro de toda leva. Leia-o, junto com `regras-editoriais.md`, no começo de cada uma.

## Papéis

| Quem | Faz |
|---|---|
| **Autor (Douglas)** | Deposita a leva, aprova o plano do lote (A1), testa, faz commit, push, merge e deploy (A2), apaga o hd (A3) |
| **Claude** | Executa as etapas 1 a 8 e a 10, sem commit e sem push. Avisa no início e no fim de cada etapa |

## Fluxo

```
1 Recepção → 2 Inventário → 3 Triagem → 4 Mapa editorial → ◆A1
→ 5 Produção → 6 Validação → 7 Integração → 8 Entrega → ◆A2
→ 9 Fechamento (leva:status + relatório) ◆A3 → baixa do hd → 10 Retrospectiva
```

### 1. Recepção
- Confere se a `main` local de cada repositório é igual à do GitHub (`git ls-remote`) e se há commits fora da `main`, como uma developer à frente.
- **Regra de branches (01/11/2026):** cada dia de trabalho num repositório ganha uma branch nova, `feature/tasks-DD-MM-AAAA`, criada sempre a partir da `main`, que é a branch de produção e a mais atualizada. Antes, `git checkout main && git pull origin main`. As tarefas do dia ficam nessa branch. Se no mesmo dia já houve merge, a nova branch leva sufixo (`-b`, `-c`).
- **Branch com pendência de um dia para o outro:** depende do contexto e do que for possível. Ou ela é terminada (commit, merge na `main`) antes de abrir a do dia novo, ou o dia novo começa numa branch nova a partir da `main` e a pendente é terminada depois, com merge próprio. Nunca se acumula trabalho de dias diferentes numa branch sem registrar no relatório do lote.
- O Claude cria as branches localmente e não faz commit nem push. Quem envia é o autor.
- **Merge com a `main` protegida (03/11/2026):** os cinco repositórios têm o ruleset `main protegida`, que só aceita na `main` um commit que já passou no check `verificar`. Por isso o merge é `--ff-only`, que não cria commit novo: (1) commit na branch; (2) `git push -u origin feature/tasks-DD-MM-AAAA`; (3) esperar a CI verde em Actions; (4) `git checkout main && git pull origin main`; (5) `git merge --ff-only feature/tasks-DD-MM-AAAA`; (6) `git push origin main`. O `--no-ff` não é mais usado: o commit de merge nunca passou na CI e o push seria recusado. Commit direto na `main` também é recusado.

### 2. Inventário
- `npm run hd:inventariar` lista o que é **novo**, o que **já está registrado** e o que **já saiu do hd**.
- `npm run hd:inventariar -- --registrar` cria um item `HD-0000` por pasta de até dois níveis. Cada arquivo entra com SHA-256, tipo e tamanho; cópias idênticas entram uma vez só.
- O mapa local de ID para caminho (`hd/.acervo-local.json`) e o cache de hashes (`hd/.hash-cache.json`) ficam no hd, fora do git.

### 3. Triagem
Uma ficha por item, preenchida no próprio `acervo.json`:
- **descrição curta, sem nomes de pessoas nem de clientes;**
- **direitos:**
  - `proprio`: material do autor;
  - `terceiro-citavel`: obra de terceiro, entra como referência citada;
  - `sensivel-anonimizar`: tem dados de pessoas, clientes ou empresas;
  - `descartar`: sem uso;
- **estado:** `planejado`, `referencia` ou `nao-publicavel`.

Os detalhes da triagem que servem para o lote (dados pessoais, riscos, potencial) vão para `lotes/AAAA-MM-DD.md`.

### 4. Mapa editorial e plano do lote
- **Destinos:** cada item recebe destinos no formato `projeto/recurso/id`, por exemplo `learn-tech/programas/405`, `bootcamps/eventos/codexperience` ou `tools/ferramentas/figma`. Também pode virar só referência.
- **Plano do lote** (`lotes/AAAA-MM-DD.md`) com:
  - itens e destinos;
  - o que é novo e o que aprofunda conteúdo existente;
  - decisões tomadas e dúvidas;
  - estimativa e orçamento de buscas;
  - divisão em sublotes.

◆ **A1:** o autor aprova ou ajusta o plano. Só depois a produção começa.

### 5. Produção
- **Extração local:** o texto é extraído na pasta do autor, com `pdftotext` e LibreOffice. Só sai o trecho necessário.
- **Modelos:** a redação segue o modelo de cada tipo (`modelos.md`) e as regras de cada site (`regras-editoriais.md`).
- **Pesquisa:** segue o método de `pesquisa.md`. São no máximo **200 buscas na web por rodada**, então o lote é dividido para caber, com orçamento por item.
- **Agentes:** a produção pode ser dividida entre agentes paralelos (até 20 de cada vez), cada um com um brief escrito, um orçamento e uma saída em JSON.

### 6. Validação, em três camadas
1. **Automática (bloqueia):** `npm run validar` e `npm run verificar`. Cobre:
   - schema e integridade;
   - relacionados e tempo de leitura;
   - mídia existente;
   - regras de programa (passos, quiz e ementa);
   - frases proibidas;
   - fontes de 2 domínios;
   - acervo sem arquivo repetido.
2. **Checklist** de `checklists.md`.
3. **Revisão independente:** um revisor que não escreveu o texto confere uma amostra do lote contra as fontes. Procura número inventado, fonte que não diz o que o texto afirma e trecho copiado.

### 7. Integração
- `npm run copias` gera as cópias de reserva dos sites.
- Mudança de código entra com teste no mesmo lote: schema, regra, página e teste no navegador.
- As páginas novas são abertas num navegador com os dados gerados.

### 7b. Cobertura entre projetos (regra de 01/11/2026)
O conteúdo de cada item deve aparecer no máximo de projetos que o tema permitir, e não só no primeiro destino óbvio.
- **Mapa de temas por projeto:**
  - formação que o autor fez ou quer fazer → evento no bootcamps (concluído ou desejado) e programa no learn-tech;
  - evento de que o autor participou ou que organizou → evento no bootcamps e artigo com os bastidores no learn-tech;
  - trabalho em empresa → página da empresa e modelo de currículo na career, programa ou artigo no learn-tech, e fichas das ferramentas usadas no tools;
  - ferramenta citada em qualquer material → ficha no tools, ligada por `relacionados` aos programas e artigos.
- **Medição:** `npm run cobertura -- <lote>` mostra quantos itens chegam a 1, 2, 3 ou 4 projetos, lista os que chegam a um só e acusa destino inexistente. Cada item que fica num projeto só precisa de uma justificativa no relatório (por exemplo: dados de terceiros, tema sem lugar em outro site).
- **Exibição:** antes de entregar, confira se o site consome o recurso (API e cópia de reserva). Os eventos do bootcamps ganham `links` para os artigos e programas relacionados; as páginas de detalhe da career e do tools, `relacionados`.
- **Destino só conta se foi usado de verdade:** nunca acrescente destino ao acervo para melhorar a métrica.

### 8. Entrega
- O relatório do lote fica em `lotes/AAAA-MM-DD.md` e mostra:
  - o que entrou e o que mudou em conteúdo antigo;
  - as divergências encontradas;
  - as pendências que dependem do autor.
- O `acervo.json` é atualizado com estado e destinos.
- **Placar de 0 a 100** (`npm run progresso`): ao fim de cada fluxo de trabalho, o relatório no chat traz o estado dos cinco repositórios, as pendências (do autor e do backlog de engenharia em `docs/engenharia/backlog.md`) e o placar. O placar é calculado pelo script, nunca estimado: conteúdo do acervo (peso 45), engenharia do MVP (30), pendências do autor (15) e publicação (10).
- **`PROXIMOS-PASSOS.md`** (raiz da API) é atualizado: tarefas do autor numeradas, em ordem de prioridade, com a data em que foram identificadas e como fazer. As concluídas vão para "Concluídas", com a data. A mesma lista é apresentada no chat ao fim de cada entrega.

◆ **A2:** o autor roda `npm run verificar` e os builds, faz commit, push e merge (feature → developer → main) e o deploy da API. O deploy é automático se os segredos da Cloudflare estiverem no GitHub; senão, é manual com `npm run deploy`.

### 9. Fechamento da leva e baixa do hd
**Regra (31/10/2026):** catalogar não é concluir. Uma leva só está concluída quando todo o conteúdo dela está materializado na API e o autor aprova o fechamento. Antes disso, nenhum arquivo sai do hd e ninguém começa uma leva nova.

1. **Checagem:** `npm run leva:status`. Ela só fecha a leva quando:
   - todo item do lote está como `publicado` ou `referencia`, com pelo menos um destino e sem `pendencias` (vídeo a subir, áudio a transcrever etc.) (`planejado`, `publicado-em-parte`, `novo`, `a-triar` e `nao-publicavel` contam como abertos);
   - nenhum arquivo do hd está fora do inventário.
2. **Relatório de fechamento**, apresentado ao autor com a saída da checagem:
   - o que foi materializado em cada projeto;
   - os itens em `referencia`, explicando por que o arquivo não é publicado e onde o conhecimento foi usado;
   - o que ainda depende do autor (vídeos para subir, confirmações).
3. ◆ **A3:** o autor aprova, e a linha `Aprovado pelo autor em: AAAA-MM-DD` entra no relatório do lote. Só então a checagem dá **LEVA FECHADA**.
4. Depois disso, o autor remove os arquivos do hd e traz a leva nova.

O Claude nunca diz que a leva está concluída sem mostrar a saída de `npm run leva:status`. Enquanto a checagem disser **LEVA ABERTA**, a resposta é "ainda não", com a lista do que falta.

Se um arquivo voltar ao hd, o hash diz o que ele já é.

### 10. Retrospectiva
- Registrar neste documento ou nas regras o que mudou: regra nova, checagem nova ou ajuste de modelo.
- **Todo erro encontrado em revisão vira, se possível, uma regra automática no build.**

## Arquitetura (resumo)

```
hd ──(etapas 1-5)──► content/*.json ──(build: Zod + integridade)──► dist/v1/*.json ──► Worker (Cloudflare)
                         │                                                              │
                         └── npm run copias ──► cópias de reserva dos sites ◄── fetch ──┘
                                                learn-tech, bootcamps (Vercel); career, tools (GitHub Pages)
```

- **Uma única fonte:** a API. Os sites guardam só uma cópia de reserva, gerada e nunca editada à mão.
- **Página de detalhe:** `detalhe.relacionados` liga itens entre os sites. O build confere se o alvo existe e publica o título e a URL prontos.

## Limites do ambiente do Claude
- O shell da pasta do autor não alcança o GitHub (403). O push é sempre do autor.
- As dependências da pasta são de Windows: o Vitest e o build não rodam no shell do Claude. Por isso o CI no GitHub roda o `verificar` em toda branch, e o Claude valida o conteúdo com o build compilado.
- **WebFetch** só abre URLs que vieram em resultados de busca.
- **Rede:** o Pixabay e outros bancos de imagem não são acessíveis daqui. Por isso existe o `npm run midia:externa`, que roda na máquina do autor.

## Comandos

| Comando | Para quê |
|---|---|
| `npm run hd:inventariar [-- --registrar]` | Inventário do hd com hash |
| `npm run leva:status [-- AAAA-MM-DD]` | Diz se a leva pode ser fechada e o hd liberado (◆A3) |
| `npm run cobertura [-- AAAA-MM-DD]` | Quantos projetos cada item do acervo alcança; acusa destino inexistente |
| `npm run progresso` | Placar de 0 a 100 e estado dos cinco repositórios |
| `npm run validar` | Schema, integridade e regras editoriais (rápido) |
| `npm run verificar` | Typecheck, testes e build completo |
| `npm run copias` / `npm run copias:conferir` | Gera ou confere as cópias de reserva dos sites |
| `npm run midia:externa` | Baixa para `media/` as imagens que ainda vêm de sites de terceiros |
| `npm run deploy` | Publica a API, quando o deploy não for pelo CI |

## Documentos
- `regras-editoriais.md`: o que preservar, nomes e marcas por site, troca de nomes, fontes.
- `modelos.md`: campos e padrão de qualidade de programa, artigo, detalhe, evento e área.
- `checklists.md`: pronto para produzir, pronto para publicar e checklist do lote.
- `pesquisa.md`: método de pesquisa, fontes confiáveis, números e orçamento.
- `seguranca-privacidade.md`: LGPD, dados pessoais, imagens, segredos.
- `ESTADO.md`: ponto de entrada de toda conversa nova (estado atual e frentes abertas).
- `como-trabalhamos.md`: papéis, acertos, ajustes com métrica, fluxo de entrega e conversas múltiplas.
- `conversas/`: registro de cada conversa (modelo no README da pasta).
- `lotes/`: plano e relatório de cada leva.
- `../../PROXIMOS-PASSOS.md`: tarefas pendentes do autor, numeradas, em ordem e com data.

## Melhoria contínua (a cada remessa)
Ao fim de cada remessa, o Claude registra na retrospectiva do lote o que falhou ou custou caro e transforma isso, quando possível, em regra automática, script ou passo do processo. Histórico:
- 27/10: regras editoriais escritas a partir das correções do autor.
- 30/10: checagens no build (fontes de 2 domínios, frases proibidas, tempo de leitura, hash único no acervo).
- 31/10: regra de fechamento de leva, `leva:status` e o campo `pendencias` (catalogar não é concluir).
- 31/10: revisão independente por amostra pegou uma anonimização quebrada por frases que ligavam a empresa fictícia à real; a varredura passou a procurar essas ligações.
- 01/11: cobertura entre projetos (`cobertura`) e lista única de próximos passos do autor.
- 01/11: placar de 0 a 100 (`progresso`) e backlog de engenharia com evidências.
