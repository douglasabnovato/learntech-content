# 04 · Testes automatizados — learntech-content

## Como rodar

Na raiz do repositório, no PowerShell do Windows:

```powershell
powershell -ExecutionPolicy Bypass -File docs\claudeia\verificar.ps1
# só as verificações de arquivo, sem npm:
powershell -ExecutionPolicy Bypass -File docs\claudeia\verificar.ps1 -SemNpm
# incluindo a versão publicada (só GET):
powershell -ExecutionPolicy Bypass -File docs\claudeia\verificar.ps1 -Api https://learntech-content.SEU-SUB.workers.dev
```

Saída: uma linha por verificação (`OK`, `AVISO`, `FALHA`, `PULADO`) e uma tabela final. Código de saída 1 se houver alguma `FALHA`. O script foi escrito nesta revisão **sem ter sido executado** (o ambiente da revisão não tem PowerShell nem permissão para npm); a primeira execução pelo dono é a validação dele.

## O que o script faz

| # | Verificação | Comando ou técnica | Já existia? |
|---|---|---|---|
| 1 | Instala dependências se `node_modules` não existir | `npm ci` | Sim (package-lock.json) |
| 2 | Tipagem estrita | `npm run typecheck` (`tsc --noEmit`) | Sim |
| 3 | 30 testes Vitest: schema e integridade do conteúdo real, erros plantados, rotas de acesso, CORS, dedupe, CSV, LGPD, retenção | `npm test` | Sim |
| 4 | Validação + geração de `dist/` | `npm run build` | Sim |
| 5 | Sintaxe do SDK | `node --check public/sdk/identificacao.js` | Novo (sem dependência) |
| 6 | Todo `content/**/*.json` é JSON válido | `ConvertFrom-Json` | Novo |
| 7 | Toda referência `/media/...` existe | `Test-Path` | Duplica a regra do build, de propósito, para rodar sem npm |
| 8 | Arquivos de `media/` sem referência (órfãos) | `Test-Path` inverso | Novo (AVISO, não falha) |
| 9 | Toda referência `./assets/...` existe no site irmão (`..\career`, `..\tools`) | `Test-Path` | Novo; PULADO se a pasta irmã não existir |
| 10 | Workflows não vazios | tamanho do arquivo | Novo (hoje dá AVISO para `deploy.yml`) |
| 11 | `dist/` tem `openapi.json`, catálogo, eventos, cobertura, SDK, `_headers` e um JSON por programa | `Test-Path` | Novo |
| 12 | Versão publicada responde (`/v1/saude`, `/v1/index.json`, catálogo, SDK) | `Invoke-WebRequest` | Novo; só com `-Api` |

O CI (`.github/workflows/ci.yml`) já roda os itens 2, 3 e 4 em push na `main` e em PR.

## O que **não** é coberto

| Lacuna | Por quê | Como cobrir (proposta) |
|---|---|---|
| Comportamento do SDK no navegador (formulário, foco, storage bloqueado, 1 registro por sessão) | Exige DOM; não há jsdom/happy-dom instalado | L2.3 no plano; até lá, roteiro manual T1 |
| Links externos (208 URLs) | Exige rede e pode dar falso negativo (sites que bloqueiam robôs) | L2.6: verificação semanal que só gera relatório |
| Worker real com D1 (migração, cron, binding) | Testes usam repositório em memória | `npm run db:migrar:local` + `npm run dev` e roteiro manual T3 |
| Sincronia com `learn-tech/src/constants/programsData.js` | Está em outro repositório | L2.8 |
| Correção editorial (texto, atualidade, se a vaga/ferramenta ainda existe) | Não é verificável por máquina | Revisão humana periódica (L3.5) |
| Aparência nos 4 sites consumidores | Fora deste repositório | Roteiro manual T1 em cada site |
| Limite de taxa / abuso de `POST /v1/acessos` | Não há limite implementado | L2.9 |
