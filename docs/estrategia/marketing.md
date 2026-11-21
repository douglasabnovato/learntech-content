# Marketing: como o conteúdo chega e como sabemos

**Estado: proposta do Claude (20/11/2026), a aprovar pelo autor.** Ver [`visao.md`](visao.md).

Restrição de projeto: **custo zero** (P-04). Toda tática aqui cabe num plano gratuito. A publicação fora do ecossistema (LinkedIn, comunidades) é do autor: o Claude prepara o texto, e o autor publica.

## 1. O funil

```
descoberta ──▶ leitura ──▶ identificação ──▶ retorno ──▶ conversa
(busca,        (página      (modal do SDK,    (segunda     (contato com
 LinkedIn,      aberta)      D-06)             visita)      o autor)
 comunidade)
```

| Etapa | Canal ou recurso | O que o conteúdo precisa ter |
|---|---|---|
| Descoberta | busca orgânica | título fiel, descrição, sitemap e dados estruturados (JSON-LD) |
| Descoberta | LinkedIn do autor | um post por conteúdo novo, com a história em 3 linhas ([`storytelling.md`](storytelling.md)) e o link |
| Descoberta | comunidades e eventos | os eventos do bootcamps ligam para os programas do mesmo tema |
| Leitura | os quatro sites | página rápida (meta de LCP de até 2,5 s no celular, usada nos relatórios do Lighthouse) e acessível |
| Identificação | SDK de identificação | já existe e é obrigatória (D-06); não se propõe retirar (P-05) |
| Retorno | ligações entre sites | "Veja também no ecossistema", trilhas e próximo passo no fim de cada página |
| Conversa | career e páginas do autor | as vagas e as empresas "para conversar", com o canal de contato que o autor escolher |

## 2. SEO

- **Título e descrição** de cada página vêm do conteúdo, sem promessa ([`regras-editoriais.md`](../processo/regras-editoriais.md), seção 5).
- **Sitemaps** são gerados por `npm run sitemaps`, nunca à mão.
- **JSON-LD:** o learn-tech já tem para artigos e programas (learn-tech#131), e o bootcamps para eventos (bootcamps#71). A validação no Rich Results Test e o envio ao Search Console são do autor, porque usam a conta dele.
- **Palavra-chave:** a do público, e não a do autor. Exemplo: "como montar um portfólio para a primeira vaga", e não "Hack Dev".

## 3. Calendário editorial

Proposta, a ajustar com o ritmo das levas do hd:

| Frequência | O quê |
|---|---|
| A cada leva publicada (A3) | um post do autor por site que recebeu conteúdo, com o link |
| Semanal | um artigo do learn-tech ligado a um arco da trajetória |
| Mensal | o resumo do mês: o que entrou e o evento que vem (bootcamps, "quero ir") |
| Por evento | antes, "vou e por quê"; depois, o relato e a galeria |

O calendário só começa depois que houver medição (seção 4). Sem medir, não se sabe se o ritmo funciona.

## 4. Métricas

| Métrica | O que mostra | Fonte hoje |
|---|---|---|
| Visitas por página | descoberta e leitura | **nenhuma**: a ferramenta gratuita de medição é escolha do autor (learntech-content#24) |
| Identificações | quantas pessoas usam e quem são (ADR 6) | API, tabela no D1 |
| Retorno | se a pessoa volta | depende da ferramenta da #24 |
| Conversas iniciadas | se o ecossistema conecta | contagem manual do autor, até haver um formulário |
| Conteúdo visível | o que foi produzido e está no ar (P-01) | `npm run leva:status` e o verificador |

A hipótese do MVP (learntech-content#23) deve dizer qual destas métricas valida a aposta. Sugestão para o autor decidir: "se o conteúdo do autor for publicado toda semana, X pessoas se identificam por mês e Y conversas começam".

## Checklist do revisor

- [ ] Título e descrição fiéis e sem promessa, com a palavra do público.
- [ ] A página tem um próximo passo para outro site do ecossistema.
- [ ] Conteúdo novo com tipo coberto por JSON-LD passa no build do site.
- [ ] O plano do lote traz o rascunho do post do autor (3 linhas e o link). Quem publica é o autor.
