# Little Groom Season 1-6 → little-groom.json 병합
$editsDir = "$PSScriptRoot\..\public\docs\edits"
$seasons   = @("lg-s1","lg-s2","lg-s3","lg-s4","lg-s5","lg-s6")
$all       = @()

foreach ($s in $seasons) {
  $file = Join-Path $editsDir "$s.json"
  if (Test-Path $file) {
    $data  = Get-Content $file -Raw | ConvertFrom-Json
    $all  += $data.chapters
    Write-Host "  $s : $($data.chapters.Count)화 추가"
  } else {
    Write-Warning "  $s.json 없음 — 건너뜀"
  }
}

$out = @{ chapters = $all } | ConvertTo-Json -Depth 10 -Compress
Set-Content -Path (Join-Path $editsDir "little-groom.json") -Value $out -Encoding utf8
Write-Host "little-groom.json 저장 완료 (총 $($all.Count)화)"
