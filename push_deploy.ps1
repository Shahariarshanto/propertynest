# ============================================================
# PropertyNest - Push both branches to GitHub
# Run this from PowerShell in d:\Google\propertynest
# ============================================================

$git = "d:\Google\MinGit\cmd\git.exe"

Write-Host "Pushing gh-pages branch..." -ForegroundColor Cyan
& $git push origin gh-pages --force

Write-Host "Switching back to main..." -ForegroundColor Cyan
& $git checkout main

Write-Host "Pushing main branch..." -ForegroundColor Cyan
& $git push origin main

Write-Host ""
Write-Host "DONE! Now go to:" -ForegroundColor Green
Write-Host "  https://github.com/Shahariarshanto/propertynest/settings/pages" -ForegroundColor Yellow
Write-Host "  Set Source = 'Deploy from a branch'" -ForegroundColor Yellow
Write-Host "  Branch = 'gh-pages' / folder = '/ (root)'" -ForegroundColor Yellow
Write-Host ""
Write-Host "Site will be live at: https://shahariarshanto.github.io/propertynest/" -ForegroundColor Green
