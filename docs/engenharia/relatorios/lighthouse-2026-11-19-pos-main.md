# Lighthouse (mobile), 19/11/2026, depois da main

Medido na produção depois de as cinco `developer` irem para a `main` e do deploy da API (versão 07818600). Lighthouse 13, perfil móvel, com `CHROME_PATH` apontando para o Chrome instalado. Antes do merge, a medição do mesmo dia está em [lighthouse-2026-11-19.md](lighthouse-2026-11-19.md).

Metas do MVP: performance ≥ 80, acessibilidade ≥ 90, boas práticas ≥ 90, SEO ≥ 90; LCP ≤ 2,5 s, CLS ≤ 0,1, TBT ≤ 200 ms.

| Site | Página | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| learn-tech | home | 85 | 99 | 100 | 100 | 4.2 s | 0 | 20 ms |
| learn-tech | programa-1104 | 91 | 100 | 100 | 100 | 3.5 s | 0 | 40 ms |
| learn-tech | artigo | 93 | 100 | 100 | 100 | 3.2 s | 0 | 0 ms |
| bootcamps | home | 91 | 100 | 100 | 100 | 3.5 s | 0 | 20 ms |
| bootcamps | evento | 85 | 100 | 100 | 100 | 3.9 s | 0 | 180 ms |
| career | home | 98 | 100 | 100 | 100 | 1.9 s | 0.005 | 0 ms |
| career | empresa | 99 | 100 | 100 | 100 | 1.6 s | 0 | 0 ms |
| tools | home | 97 | 100 | 100 | 100 | 2.0 s | 0 | 0 ms |
| tools | ferramenta | 73 | 100 | 96 | 100 | 4.9 s | 0 | 0 ms |

## Antes e depois (performance)

| Página | Antes do merge | Depois |
|---|---|---|
| learn-tech home | 61 (CLS 0,4) | 85 (CLS 0) |
| learn-tech programa | 67 | 91 |
| learn-tech artigo | 66 | 93 |
| bootcamps home | 86 | 91 |
| bootcamps evento | 77 | 85 |
| career home | 77 | 98 (LCP 1,9 s) |
| career empresa | 87 | 99 |
| tools home | 89 | 97 (LCP 2,0 s) |
| tools ferramenta | 61 | 73 (LCP 4,9 s) |

O que ainda fica abaixo da meta de LCP de 2,5 s: a página de ferramenta do tools, o evento do bootcamps e as três páginas do learn-tech, em todas elas porque a imagem principal espera o JavaScript.
