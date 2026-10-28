# 03 · Registro de execução — 27/10/2026

Branch: `feature/claudeia-2026-10-27` (já ativa; nenhum comando git foi executado). Nada foi instalado, compilado, testado ou publicado: as verificações automáticas ficam para o dono rodar com `docs/claudeia/verificar.ps1`. Nenhum arquivo foi apagado.

## O que foi executado

| # | Arquivo | Tipo | O que mudou | Fim de linha | Como verificar |
|---|---|---|---|---|---|
| 1 | `public/sdk/identificacao.js` | Edição | Nova função `escaparAtributo(t)` (escapa `& " < >`) e uso dela no `href` da política de privacidade dentro do `innerHTML`. Texto, estilo e comportamento iguais: o navegador decodifica `&amp;` de volta, então o link continua apontando para a mesma URL | CRLF preservado (200/200 linhas) | `node --check public/sdk/identificacao.js`; abrir um site, ver o formulário e conferir o destino do link "Política de privacidade" (05-testes-manuais.md, T1.6) |
| 2 | `docs/DEPLOY.md` | Edição | Trocou a menção ao marcador `COLE_AQUI_O_ID_GERADO_PELO_WRANGLER_D1_CREATE` (que não existe mais em wrangler.jsonc) pelo nome do campo e um aviso de que já está preenchido | CRLF preservado (74/74) | Ler a seção 1 de DEPLOY.md e comparar com `wrangler.jsonc` |
| 3 | `docs/claudeia/01-relatorio.md` | Novo | Relatório de revisão | LF | — |
| 4 | `docs/claudeia/02-plano-e-arquitetura.md` | Novo | Arquitetura, ADRs, plano em lotes | LF | — |
| 5 | `docs/claudeia/03-registro.md` | Novo | Este registro | LF | — |
| 6 | `docs/claudeia/04-testes-automatizados.md` | Novo | O que o script cobre e o que não cobre | LF | — |
| 7 | `docs/claudeia/verificar.ps1` | Novo | Script de verificação para Windows | CRLF, UTF-8 com BOM | `powershell -ExecutionPolicy Bypass -File docs\claudeia\verificar.ps1` |
| 8 | `docs/claudeia/05-testes-manuais.md` | Novo | Roteiro manual | LF | — |

Trecho exato da mudança 1:

```js
function escaparAtributo(t) {
  return String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
// ...
'... href="' + escaparAtributo(privacidade) + '">Política de privacidade</a> ...'
```

## O que foi avaliado e deliberadamente não alterado

| Item | Por quê |
|---|---|
| `.github/workflows/ci.yml` | Já existe e roda só scripts do package.json (typecheck, test, build) |
| `.github/workflows/deploy.yml` (0 bytes) | Recriar publica em produção e depende de secrets; apagar é proibido. Ficou como L2.1 |
| try/catch de localStorage/JSON.parse | O SDK já protege (identificacao.js:27-40 na versão original) |
| `lang`/meta description | Não há HTML neste repositório |
| Formulário obrigatório | Regra de negócio de medição; só propostas de aperfeiçoamento (L3.1) |
| Conteúdo de `content/` | Nenhum texto, dado ou item alterado |
| `.dev.vars.example` | Só o nome da variável (`ADMIN_TOKEN`) foi lido |

## Medições feitas nesta revisão

| Medição | Resultado | Como |
|---|---|---|
| Referências `/media/...` × arquivos em `media/` | 41 × 41, 0 ausentes, 0 órfãos | python3 percorrendo `content/**` |
| Referências `./assets/...` × pastas irmãs `career/` e `tools/` | 94 × 94 existentes | idem, `os.path.exists` |
| Ids de programas | content 34, learn-tech `programsData.js` 33; 901 só na API | regex por `id` + `categoryFilter` (heurístico) |
| URLs externas | 208 distintas, **não verificadas** (sem rede no ambiente) | regex |

## Pendências

| # | Pendência | Responsável |
|---|---|---|
| 1 | Rodar `verificar.ps1` e anotar o resultado aqui | Dono |
| 2 | Confirmar se o Actions mostra erro de workflow inválido para `deploy.yml` e decidir L2.1 | Dono |
| 3 | Informar a URL de produção da API (workers.dev ou domínio próprio) | Dono |
| 4 | Decidir P1–P6 do relatório | Dono |
| 5 | Executar o roteiro 05 na versão publicada | Dono |
