# Desempenho do bundle: o que funcionou (learn-tech, 21 a 25/11/2026)

Quem mede é o painel do orquestrador (`bundle.mjs`), que olha o site no ar. Ele mede o JS inicial: o que o HTML carrega, com o `script` e os `modulepreload`.
- **Medida no ar:** a `main` do learn-tech foi para o ar em 25/11 (learn-tech#182). O JS inicial caiu de **89,3 para 83,8 kB gzip**, −5,5 kB (−6%). Sem gzip, caiu de 279,7 para 263,6 kB.
- **Medida do build:** a entrada (`index-*.js`) foi de 286,4 para 269,9 kB, abaixo da meta de 270 kB (learn-tech#152).

## O que funcionou, na ordem dos PRs
| PR | Mudança | Efeito medido |
|---|---|---|
| learn-tech#153 (D121) | A reserva dos programas (`programsData.js`) virou um pedaço próprio, baixado por `import()` só quando a API falha num programa com aulas locais. Os cards usam o catálogo gerado mais a mídia local (`programsMidia.js`) | O pedaço `conteudo` caiu de 42,4 para 11,1 kB gzip. O `programsData` (106 kB) saiu do pré-carregamento da home e do programa |
| learn-tech#154 | Um alias para `react-router/dist/production`, porque o `exports` do pacote só aponta para o build de desenvolvimento; e o `Footer` com `lazy()` | A entrada foi de 286,4 para 281,7 kB, e saíram 33 avisos de desenvolvimento da produção |
| learn-tech#155 | O orçamento na CI (`npm run orcamento`): falha acima de 285 kB e avisa acima de 270 kB | É uma trava: o teto antigo, de 320 kB, deixava crescer 40 kB sem alerta |
| learn-tech#158 | Os ícones da entrada viraram SVG próprio (`IconesDaEntrada.jsx`); saíram o `prop-types` e o polyfill de `modulepreload` | A entrada foi de 282,8 para 278,5 kB |
| learn-tech#170 | O ajudante `pagina()` nos 19 `lazy()`, o `ScrollToTop` sob demanda, o logo SVG fora do JS, o terser no lugar do esbuild e `modulePreload: false`, porque o pré-carregamento por rota já cobre `/`, `/program` e `/blog` | A entrada foi de 279,6 para 269,9 kB. O terser deu sozinho −5,4 kB. O LCP no celular simulado ficou igual, dentro do ruído |

## As lições
1. **Medir cada corte separado.** A tabela do #170 mostra o peso de cada passo, e assim dá para tirar o que não compensa.
2. **Conferir se a dependência vem em build de produção.** O `react-router` vinha com o build de desenvolvimento por causa do `exports` do pacote, e só o detalhe por módulo mostrou isso.
3. **Tirar dado do JS, ou deixá-lo sob demanda.** Uma reserva que só serve quando a API falha não pode estar no caminho de toda visita.
4. **Pôr a trava na CI logo depois do ganho.** O teto de 285 kB impede a volta.
5. **Provar pela produção.** O ganho só conta quando o painel mede o site no ar. O build local mostra a direção, não o resultado.
6. **Medir sem publicar o relatório.** O `npm run analyze` gera o detalhe por módulo sem ir ao ar (learn-tech#181 e #183). Rode o analyze logo antes do `bundle.mjs`, na mesma sessão.

## O que vem depois
- O painel aponta o `react-icons` inteiro (`fa6`, com 11,9 kB, e `fa`, com 10,8 kB gzip). Ele está nas páginas, não na entrada: o ganho é por página, não no JS inicial.
- O `programsData` (30,8 kB gzip) já é sob demanda desde o #153. A regra do painel não separa o pedaço sob demanda da entrada. Antes de mexer nele, a regra precisa olhar só a entrada.
