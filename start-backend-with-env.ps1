#!/usr/bin/env pwsh

# Script para iniciar el backend con todas las variables de entorno

Write-Host "=== Iniciando Backend con Variables de Entorno ===" -ForegroundColor Green

# Cargar variables de entorno desde .env
if (Test-Path ".env") {
    Write-Host "Cargando variables de entorno desde .env..." -ForegroundColor Yellow
    
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#].*?)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            # Eliminar comillas si las hay
            $value = $value -replace '^["'']|["'']$', ''
            
            [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "   $name = $value" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "ADVERTENCIA: No se encontró archivo .env" -ForegroundColor Red
}

# Verificar variables FHIR críticas
Write-Host "`nVerificando variables FHIR..." -ForegroundColor Yellow
$fhirUrl = [System.Environment]::GetEnvironmentVariable("FHIR_SERVER_URL")
$fhirUser = [System.Environment]::GetEnvironmentVariable("FHIR_USERNAME")
$fhirPass = [System.Environment]::GetEnvironmentVariable("FHIR_PASSWORD")

Write-Host "   FHIR_SERVER_URL: $fhirUrl" -ForegroundColor Cyan
Write-Host "   FHIR_USERNAME: $fhirUser" -ForegroundColor Cyan
Write-Host "   FHIR_PASSWORD: $(if ($fhirPass) { '***SET***' } else { 'NOT SET' })" -ForegroundColor Cyan

# Cambiar al directorio del backend
Set-Location backend

Write-Host "`nIniciando Maven Spring Boot..." -ForegroundColor Yellow
Write-Host "Ejecutando: mvn spring-boot:run" -ForegroundColor Gray
Write-Host "El servidor se iniciará en http://localhost:9090 (o el puerto configurado)" -ForegroundColor Gray
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Gray
Write-Host ""

# Iniciar el backend
try {
    mvn spring-boot:run
} catch {
    Write-Host "Error al iniciar el backend: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}