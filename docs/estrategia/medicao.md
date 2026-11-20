# Medição de uso: qual ferramenta (learntech-content#24)

**Estado: recomendação do Claude (20/11/2026), a decidir pelo autor.** Escolher a ferramenta e criar ou configurar a conta é do autor (R12). Depois disso, o Claude liga a coleta nos quatro sites e registra o painel nos `docs/MVP.md`. Pedido pela Decisão LIDER D18.

## O que a ferramenta precisa atender

| Critério | Peso | Por quê |
|---|---|---|
| Custo zero | eliminatório | P-04: o ambiente fica gratuito |
| Sem cookie e sem dado pessoal | 30% | a identificação já existe (D-06); a medição de visitas não deve coletar mais nada da pessoa |
| Pouca configuração do autor | 25% | é o gargalo do projeto: a fila do autor |
| Painel pronto | 25% | o critério 5 do MVP pede o painel com visitas |
| Esforço de código | 20% | um script por site, compatível com a CSP do tools e da career |

## As opções

| Opção | Custo | Sem cookie | Configuração do autor | Painel | Código | Nota |
|---|---|---|---|---|---|---|
| **Cloudflare Web Analytics** | gratuito; até 10 sites fora do proxy da Cloudflare (os 4 sites estão na Vercel e no GitHub Pages) | sim | baixa: usa a conta da Cloudflare que já hospeda a API; criar 4 sites e copiar os 4 tokens | sim, com Core Web Vitals | 1 script por site; liberar `static.cloudflareinsights.com` e `cloudflareinsights.com` na CSP | **4,6** |
| **GoatCounter** | gratuito para uso razoável e não comercial, sem limite numérico publicado | sim | média: conta nova | sim | 1 script por site; liberar o domínio na CSP | 4,3 |
| **Contagem própria no D1** | gratuito no plano atual do Workers e do D1 | sim | baixa, mas cada mudança exige o deploy da API pelo autor | não: o painel teria de ser construído | alto: endpoint, tabela, SDK e painel | 2,7 |
| **Plausible Community Edition (self-host)** | precisa de um servidor próprio com Docker e pelo menos 2 GB de RAM | sim | alta | sim | 1 script por site | **eliminada** (custo) |

Notas de 0 a 5 em cada critério, ponderadas pelo peso.

## Recomendação

**Cloudflare Web Analytics.** Não cria conta nova, não usa cookie, tem painel pronto e ainda mede o desempenho real no celular (Core Web Vitals), o que ajuda o critério 7 do MVP. O limite de 10 sites fora do proxy cobre os 4 sites com folga.

**Ressalva:** a Cloudflare Web Analytics não guarda identificador da pessoa, então "visita de retorno" não é medida diretamente. A hipótese do tools ([`hipoteses.md`](hipoteses.md)) tem uma métrica alternativa para esse caso.

## Passo a passo do autor (10 minutos)

1. No painel da Cloudflare, abra **Web Analytics → Add a site**.
2. Cadastre os 4 endereços:
   - `learn-tech-pied.vercel.app`;
   - `bootcamps-dun.vercel.app`;
   - `douglasabnovato.github.io/tools`;
   - `douglasabnovato.github.io/career`.
3. Em cada um, escolha a instalação manual (o site não passa pelo proxy) e copie o **token** do snippet.
4. Mande os 4 tokens no chat. O token do snippet é público, porque aparece no HTML de qualquer site que o usa, então não é segredo.

## Fontes (consultadas em 20/11/2026)

- Cloudflare, limites do Web Analytics: <https://developers.cloudflare.com/web-analytics/limits/>
- Cloudflare, primeiros passos: <https://developers.cloudflare.com/web-analytics/get-started/>
- GoatCounter, site oficial: <https://goatcounter.com/>
- Plausible Community Edition, requisitos: <https://github.com/plausible/community-edition>
