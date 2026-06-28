$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath
$python = "C:\Users\user\AppData\Local\Programs\Python\Python312\python.exe"
if (-not (Test-Path $python)) {
    Write-Host "Python was not found at the expected path. Install Python 3.12 first." -ForegroundColor Red
    exit 1
}

Write-Host "Starting private local server..." -ForegroundColor Green
Write-Host "Open: http://127.0.0.1:8000/gift-landing/" -ForegroundColor Cyan
Write-Host "Dashboard: http://127.0.0.1:8000/gift-landing/dashboard.html" -ForegroundColor Cyan
& $python -m http.server 8000
