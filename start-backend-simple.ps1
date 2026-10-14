#!/usr/bin/env pwsh

# Script simple para iniciar el backend sin Maven
# Usa Java directamente desde VS Code

Write-Host "=== Configurando Variables de Entorno ===" -ForegroundColor Green

# Cargar variables desde .env
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#].*?)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"').Trim("'")
            
            [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "✓ $name configurado" -ForegroundColor Cyan
        }
    }
}

# Mostrar variables FHIR críticas
Write-Host "`nVariables FHIR:" -ForegroundColor Yellow
Write-Host "  FHIR_SERVER_URL: $($env:FHIR_SERVER_URL)" -ForegroundColor Gray
Write-Host "  FHIR_USERNAME: $($env:FHIR_USERNAME)" -ForegroundColor Gray
Write-Host "  FHIR_PASSWORD: $(if ($env:FHIR_PASSWORD) { '***SET***' } else { 'NOT SET' })" -ForegroundColor Gray

Write-Host "`n=== Backend debe reiniciarse desde VS Code ===" -ForegroundColor Yellow
Write-Host "1. En VS Code, abrir Command Palette (Ctrl+Shift+P)" -ForegroundColor White
Write-Host "2. Ejecutar: 'Java: Restart Projects'" -ForegroundColor White
Write-Host "3. O usar el botón 'Run Java' en el archivo Application.java" -ForegroundColor White
Write-Host ""
Write-Host "Las variables de entorno están configuradas en esta sesión." -ForegroundColor Green
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
Read-Host