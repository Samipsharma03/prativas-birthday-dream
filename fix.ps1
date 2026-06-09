$f = "c:\Users\samip\prativas-birthday-dream\src\routes\index.tsx"
$lines = Get-Content $f
$before = $lines[0..130]
$after = $lines[134..($lines.Count-1)]
$out = $before + $after
$out | Set-Content $f -Encoding utf8
Write-Host "Done. New line count: $((Get-Content $f).Count)"
