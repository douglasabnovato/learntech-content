# Desempenho do bundle: o que funcionou (learn-tech, 21 a 25/11/2026)

Quem mede é o painel do orquestrador (`bundle.mjs`), que olha o site no ar. Ele mede o JS inicial: o que o HTML carrega, com o `script` e os `modulepreload`. Nos dois dias medidos, o JS inicial é só o `index-*.js`.
- **Medida no ar** (painel, em KiB de 1.024 bytes): a `main` do learn-tech foi ao ar em 25/11 (learn-tech#182). O JS inicial caiu de **89,3 para 83,8 KiB gzip**, −5,5 KiB (−6,2%). Sem gzip, caiu de 279,7 para 263,6 KiB.
- **Medida do build** (Vite, em kB de 1.000 bytes): a entrada foi de 286,4 para 269,9 kB, abaixo da meta de 270 kB (learn-tech#152).
  - **É o mesmo arquivo que o painel mede no ar, só que em outra unidade:** 286,4 kB = 279,7 KiB, e 269,9 kB = 263,6 KiB.
  - Não são duas quedas diferentes.

## O que funcionou, na ordem dos PRs
| PR | Mudança | Mexe no JS inicial? | Efeito medido (Vite) |
|---|---|---|---|
| learn-tech#153 (D121) | A reserva dos programas (`programsData.js`) virou um pedaço próprio, baixado por `import()` só quando a API falha num programa com aulas locais. Os cards usam o catálogo gerado mais a mídia local (`programsMidia.js`) | **não**: a entrada ficou em 286,4 kB | O pedaço `conteudo`, pré-carregado na home e no programa, foi de 42,4 para 11,1 kB gzip. O ganho é maior que os 5,5, mas aparece fora do JS inicial |
| learn-tech#154 | Um alias para `react-router/dist/production`, porque o `exports` do pacote só aponta para o build de desenvolvimento; e o `Footer` com `lazy()` | sim | A entrada foi de 286,4 para 281,7 kB (−4,7), e saíram 33 avisos de desenvolvimento da produção |
| *outros PRs entre um e outro* | | sim | +1,1 kB, de 281,7 para 282,8 |
| learn-tech#155 | O orçamento na CI (`npm run orcamento`): falha acima de 285 kB e avisa acima de 270 kB | **não**: é a trava | O teto antigo, de 320 kB, deixava crescer 40 kB sem alerta |
| learn-tech#158 | Os ícones da entrada viraram SVG próprio (`IconesDaEntrada.jsx`); saíram o `prop-types` e o polyfill de `modulepreload` | sim | A entrada foi de 282,8 para 278,5 kB (−4,3) |
| *outros PRs entre um e outro* | | sim | +1,1 kB, de 278,5 para 279,6 |
| learn-tech#170 | O ajudante `pagina()` nos 19 `lazy()`, o `ScrollToTop` sob demanda, o logo SVG fora do JS, o terser no lugar do esbuild e `modulePreload: false`, porque o pré-carregamento por rota já cobre `/`, `/program` e `/blog` | sim | A entrada foi de 279,6 para 269,9 kB (−9,7). O terser deu sozinho −5,4 kB. O LCP no celular simulado ficou igual, dentro do ruído |

**A conta:** os 5,5 KiB no ar vêm do #154, do #158 e do #170.
- Juntos, os cortes deles dão −18,7 kB no Vite.
- Os outros PRs que entraram entre um e outro somaram +2,2 kB.
- O líquido é −16,5 kB, de 286,4 para 269,9 kB.

## As lições
1. **Medir cada corte separado, e também o que entra entre um e outro.** A tabela do #170 mostra o peso de cada passo, e assim dá para tirar o que não compensa. Os +2,2 kB de outros PRs só aparecem quando cada medida tem data.
2. **Conferir se a dependência vem em build de produção.** O `react-router` vinha com o build de desenvolvimento por causa do `exports` do pacote, e só o detalhe por módulo mostrou isso.
3. **Tirar dado do JS, ou deixá-lo sob demanda.** Uma reserva que só serve quando a API falha não pode estar no caminho de toda visita.
4. **Pôr a trava na CI logo depois do ganho.** O teto de 285 kB impede a volta.
5. **Provar pela produção, e na mesma unidade.** O ganho só conta quando o painel mede o site no ar. O build local mostra a direção, não o resultado. O Vite conta kB de 1.000 bytes, e o painel conta KiB de 1.024: compare cada número com a sua fonte.
6. **Medir sem publicar o relatório.** O `npm run analyze` gera o detalhe por módulo sem ir ao ar (learn-tech#181 e #183). Rode o analyze logo antes do `bundle.mjs`, na mesma sessão.

## O que vem depois
- O painel aponta o `react-icons` inteiro (`fa6`, com 11,9 KiB, e `fa`, com 10,8 KiB gzip). Ele está nas páginas, não na entrada: o ganho é por página, não no JS inicial.
- O `programsData` (30,8 KiB gzip) já é sob demanda desde o #153. Desde 25/11, a regra do painel só aponta dados que estão no pedaço da entrada.
