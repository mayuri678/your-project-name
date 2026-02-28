$ErrorActionPreference = 'Stop'

Set-StrictMode -Version Latest

$root = (Get-Location).Path
$targets = @(
  'src',
  'your-project-name/src',
  'supabase/functions',
  'your-project-name/supabase/functions'
) | Where-Object { Test-Path $_ }

if (-not $targets -or $targets.Count -eq 0) {
  throw "No target source directories found under $root"
}

$sourceFiles = @(
  foreach ($t in $targets) {
    Get-ChildItem -Path $t -Recurse -File -Include *.ts, *.js |
      Where-Object {
        $_.FullName -notmatch '\\node_modules\\' -and
        $_.FullName -notmatch '\\dist\\'
      }
  }
) | Sort-Object FullName -Unique

function Get-SymbolsFromContent {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Content
  )

  $out = New-Object System.Collections.Generic.List[string]

  # exported/regular functions:  export function foo(  /  async function foo(
  foreach ($m in [regex]::Matches($Content, '(?m)^\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(')) {
    $out.Add(('function:' + $m.Groups[1].Value))
  }

  # arrow const: export const foo = (...) =>
  foreach ($m in [regex]::Matches($Content, '(?m)^\s*(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\([^\)]*\)\s*=>')) {
    $out.Add(('arrowConst:' + $m.Groups[1].Value))
  }

  # function expression assigned to const: const foo = function(
  foreach ($m in [regex]::Matches($Content, '(?m)^\s*(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?function\s*\(')) {
    $out.Add(('funcExprConst:' + $m.Groups[1].Value))
  }

  # class methods (best-effort). Note: this will also match some object-literal methods; still useful for auditing.
  foreach ($m in [regex]::Matches($Content, '(?m)^\s*(?:public\s+|private\s+|protected\s+)?(?:readonly\s+)?(?:static\s+)?(?:async\s+)?([A-Za-z_$][\w$]*)\s*\([^\)]*\)\s*\{')) {
    $name = $m.Groups[1].Value
    if ($name -in @('constructor', 'if', 'for', 'while', 'switch', 'catch', 'function', 'get', 'set')) { continue }
    $out.Add(('method:' + $name))
  }

  $out | Sort-Object -Unique
}

$results = New-Object System.Collections.Generic.List[object]
foreach ($f in $sourceFiles) {
  $full = (Resolve-Path -LiteralPath $f.FullName).Path
  $rel = $full.Substring($root.Length).TrimStart('\', '/')
  $content = Get-Content -LiteralPath $f.FullName -Raw

  $symbols = @(Get-SymbolsFromContent -Content $content)
  if ($symbols.Count -gt 0) {
    $results.Add([pscustomobject]@{
        file    = $rel
        symbols = $symbols
      })
  }
}

$outPath = Join-Path $root 'function-audit.json'
$results | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $outPath -Encoding UTF8

Write-Host "Wrote $outPath"
Write-Host ("Files with symbols: {0}" -f $results.Count)
Write-Host ("Total symbols: {0}" -f (($results | ForEach-Object { $_.symbols } | Measure-Object).Count))

