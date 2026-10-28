# verificar.ps1 - verificacao do learntech-content (revisao claudeia 27/10/2026).
# Uso, na raiz do repositorio:
#   powershell -ExecutionPolicy Bypass -File docs\claudeia\verificar.ps1
#   powershell -ExecutionPolicy Bypass -File docs\claudeia\verificar.ps1 -SemNpm
#   powershell -ExecutionPolicy Bypass -File docs\claudeia\verificar.ps1 -Api https://learntech-content.SEU-SUB.workers.dev
# So le arquivos e roda scripts que ja existem no package.json. Nao publica, nao grava no D1, nao apaga nada
# (o "npm run build" recria a pasta dist/, como sempre fez).

param(
  [switch]$SemNpm,
  [string]$Api = ""
)

$ErrorActionPreference = "Continue"
$Raiz = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Set-Location $Raiz
$Resultados = New-Object System.Collections.Generic.List[object]

function Registrar([string]$Nome, [string]$Situacao, [string]$Detalhe = "") {
  $Resultados.Add([pscustomobject]@{ Verificacao = $Nome; Situacao = $Situacao; Detalhe = $Detalhe })
  $cor = switch ($Situacao) { "OK" { "Green" } "AVISO" { "Yellow" } "PULADO" { "DarkGray" } default { "Red" } }
  Write-Host ("[{0}] {1} {2}" -f $Situacao, $Nome, $Detalhe) -ForegroundColor $cor
}

function Rodar([string]$Nome, [string]$Comando) {
  Write-Host ""
  Write-Host "==> $Comando" -ForegroundColor Cyan
  cmd /c $Comando
  if ($LASTEXITCODE -eq 0) { Registrar $Nome "OK" } else { Registrar $Nome "FALHA" "codigo $LASTEXITCODE" }
}

# Junta todas as strings de um objeto vindo de ConvertFrom-Json.
function Get-Textos($Valor) {
  if ($null -eq $Valor) { return }
  if ($Valor -is [string]) { $Valor; return }
  if ($Valor -is [System.Management.Automation.PSCustomObject]) {
    foreach ($p in $Valor.PSObject.Properties) { Get-Textos $p.Value }
    return
  }
  if ($Valor -is [System.Collections.IEnumerable]) { foreach ($i in $Valor) { Get-Textos $i } }
}

Write-Host "learntech-content - verificacao em $Raiz" -ForegroundColor Cyan

# 1. Scripts do package.json
if ($SemNpm) {
  Registrar "npm (typecheck, test, build)" "PULADO" "-SemNpm"
} elseif (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Registrar "npm (typecheck, test, build)" "FALHA" "npm nao encontrado; instale Node 20+"
} else {
  if (-not (Test-Path (Join-Path $Raiz "node_modules"))) { Rodar "npm ci" "npm ci" }
  Rodar "npm run typecheck" "npm run typecheck"
  Rodar "npm test" "npm test"
  Rodar "npm run build" "npm run build"
}

# 2. Sintaxe do SDK
if (Get-Command node -ErrorAction SilentlyContinue) {
  node --check "public/sdk/identificacao.js"
  if ($LASTEXITCODE -eq 0) { Registrar "sintaxe do SDK (node --check)" "OK" } else { Registrar "sintaxe do SDK (node --check)" "FALHA" }
} else {
  Registrar "sintaxe do SDK (node --check)" "PULADO" "node nao encontrado"
}

# 3. JSON de content/ e referencias internas
$arquivos = Get-ChildItem -Path (Join-Path $Raiz "content") -Recurse -Filter *.json
$invalidos = 0
$midia = @{}
$assets = @{}
foreach ($a in $arquivos) {
  try {
    $dados = Get-Content -Raw -Encoding UTF8 -Path $a.FullName | ConvertFrom-Json
  } catch {
    $invalidos++
    Registrar "JSON valido" "FALHA" $a.FullName
    continue
  }
  $projeto = ($a.FullName.Substring((Join-Path $Raiz "content").Length + 1) -split '[\\/]')[0]
  foreach ($t in (Get-Textos $dados)) {
    if ($t.StartsWith("/media/")) { $midia[$t] = $true }
    elseif ($t.StartsWith("./assets/")) { $assets["$projeto|$t"] = $true }
  }
}
if ($invalidos -eq 0) { Registrar "JSON valido em content/" "OK" ("{0} arquivos" -f $arquivos.Count) }

$faltando = @($midia.Keys | Where-Object { -not (Test-Path (Join-Path $Raiz ($_.TrimStart('/') -replace '/', '\'))) })
if ($faltando.Count -eq 0) { Registrar "referencias /media existem" "OK" ("{0} referencias" -f $midia.Count) }
else { Registrar "referencias /media existem" "FALHA" ($faltando -join ", ") }

$pastaMidia = Join-Path $Raiz "media"
$orfaos = @(Get-ChildItem -Path $pastaMidia -Recurse -File | ForEach-Object {
  "/" + ($_.FullName.Substring($Raiz.Length + 1) -replace '\\', '/')
} | Where-Object { -not $midia.ContainsKey($_) })
if ($orfaos.Count -eq 0) { Registrar "arquivos de media/ referenciados" "OK" }
else { Registrar "arquivos de media/ referenciados" "AVISO" ("orfaos: " + ($orfaos -join ", ")) }

# ./assets/... e resolvido pelo site consumidor (pastas irmas ..\career e ..\tools).
$semIrmao = @{}
$assetsFaltando = @()
foreach ($chave in $assets.Keys) {
  $proj, $rel = $chave -split '\|', 2
  $irmao = Join-Path (Split-Path $Raiz -Parent) $proj
  if (-not (Test-Path $irmao)) { $semIrmao[$proj] = $true; continue }
  if (-not (Test-Path (Join-Path $irmao ($rel.Substring(2) -replace '/', '\')))) { $assetsFaltando += "$proj/$rel" }
}
if ($semIrmao.Count -gt 0) { Registrar "referencias ./assets nos sites irmaos" "PULADO" ("pasta ausente: " + ($semIrmao.Keys -join ", ")) }
elseif ($assetsFaltando.Count -eq 0) { Registrar "referencias ./assets nos sites irmaos" "OK" ("{0} referencias" -f $assets.Count) }
else { Registrar "referencias ./assets nos sites irmaos" "FALHA" ($assetsFaltando -join ", ") }

# 4. Workflows
foreach ($w in Get-ChildItem -Path (Join-Path $Raiz ".github\workflows") -Filter *.yml) {
  if ($w.Length -eq 0) { Registrar "workflow $($w.Name)" "AVISO" "arquivo vazio (ver plano L2.1)" }
  else { Registrar "workflow $($w.Name)" "OK" }
}

# 5. Saida do build
$dist = Join-Path $Raiz "dist"
if (Test-Path (Join-Path $dist "v1\index.json")) {
  $ids = Get-ChildItem (Join-Path $Raiz "content\learn-tech\programas") -Filter *.json | ForEach-Object { $_.BaseName }
  $semRecurso = @($ids | Where-Object { -not (Test-Path (Join-Path $dist "v1\learn-tech\programas\$_.json")) })
  $basicos = @("v1\openapi.json", "v1\learn-tech\programas.json", "v1\bootcamps\eventos.json", "v1\cobertura.json", "sdk\identificacao.js", "_headers")
  $basicosFaltando = @($basicos | Where-Object { -not (Test-Path (Join-Path $dist $_)) })
  if ($semRecurso.Count -eq 0 -and $basicosFaltando.Count -eq 0) { Registrar "dist/ completo" "OK" ("{0} programas" -f $ids.Count) }
  else { Registrar "dist/ completo" "FALHA" (($semRecurso + $basicosFaltando) -join ", ") }
} else {
  Registrar "dist/ completo" "PULADO" "rode sem -SemNpm para gerar dist/"
}

# 6. Versao publicada (opcional, so GET)
if ($Api) {
  $Api = $Api.TrimEnd('/')
  foreach ($c in @("/v1/saude", "/v1/index.json", "/v1/learn-tech/programas.json", "/sdk/identificacao.js")) {
    try {
      $r = Invoke-WebRequest -Uri "$Api$c" -UseBasicParsing -TimeoutSec 15
      Registrar "GET $c" "OK" ("HTTP {0}" -f $r.StatusCode)
    } catch {
      Registrar "GET $c" "FALHA" $_.Exception.Message
    }
  }
} else {
  Registrar "versao publicada" "PULADO" "informe -Api <url>"
}

Write-Host ""
$Resultados | Format-Table -AutoSize -Wrap
$falhas = @($Resultados | Where-Object { $_.Situacao -eq "FALHA" }).Count
if ($falhas -gt 0) { Write-Host "$falhas falha(s)." -ForegroundColor Red; exit 1 }
Write-Host "Sem falhas." -ForegroundColor Green
exit 0
