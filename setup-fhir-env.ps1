# Script para configurar variables FHIR

Write-Host "Configurando variables FHIR con nueva contraseña..." -ForegroundColor Green

$env:FHIR_SERVER_URL = "https://openhim-qa-router.hro.gob.gt/fhir"
$env:FHIR_USERNAME = "postman" 
$env:FHIR_PASSWORD = "Hospital0."

Write-Host "Variables FHIR configuradas:" -ForegroundColor Cyan
Write-Host "  Server: $env:FHIR_SERVER_URL" -ForegroundColor White
Write-Host "  User: $env:FHIR_USERNAME" -ForegroundColor White  
Write-Host "  Pass: Hospital0. (NUEVA)" -ForegroundColor Green

Write-Host "Reinicia el backend desde VS Code" -ForegroundColor Yellow