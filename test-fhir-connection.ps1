#!/usr/bin/env pwsh

# Script para probar la conectividad del servicio FHIR

Write-Host "=== Prueba de Conectividad FHIR ===" -ForegroundColor Green

# 1. Verificar que el backend está funcionando
Write-Host "`n1. Verificando backend..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:9090/api/actuator/health" -UseBasicParsing
    $health = $healthResponse.Content | ConvertFrom-Json
    Write-Host "   Backend Status: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: Backend no está funcionando" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Probar endpoint de health del servicio FHIR (sin autenticación)
Write-Host "`n2. Probando endpoint FHIR health..." -ForegroundColor Yellow
try {
    # Este endpoint debería estar público
    $fhirHealth = Invoke-WebRequest -Uri "http://localhost:9090/api/fhir/pacientes/health" -UseBasicParsing
    Write-Host "   FHIR Health Response: $($fhirHealth.StatusCode)" -ForegroundColor Green
    Write-Host "   Content: $($fhirHealth.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Message -contains "401") {
        Write-Host "   NOTA: Error 401 significa que el endpoint existe pero requiere autenticación" -ForegroundColor Yellow
    }
}

# 3. Verificar configuración FHIR en variables de entorno
Write-Host "`n3. Verificando configuración FHIR..." -ForegroundColor Yellow
$fhirUrl = $env:FHIR_SERVER_URL
$fhirUser = $env:FHIR_USERNAME
$fhirPass = if ($env:FHIR_PASSWORD) { "***CONFIGURADO***" } else { "NO CONFIGURADO" }

Write-Host "   FHIR_SERVER_URL: $fhirUrl" -ForegroundColor Cyan
Write-Host "   FHIR_USERNAME: $fhirUser" -ForegroundColor Cyan
Write-Host "   FHIR_PASSWORD: $fhirPass" -ForegroundColor Cyan

# 4. Probar conectividad con el servidor FHIR externo (si es accesible)
Write-Host "`n4. Probando conectividad directa con servidor FHIR..." -ForegroundColor Yellow
if ($fhirUrl) {
    try {
        # Probar conectividad básica (puede fallar por CORS, pero nos dice si el servidor responde)
        $externalTest = Invoke-WebRequest -Uri "$fhirUrl/metadata" -UseBasicParsing -TimeoutSec 10
        Write-Host "   Conectividad externa: OK ($($externalTest.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "   Conectividad externa: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   NOTA: Esto puede ser normal si el servidor requiere autenticación específica" -ForegroundColor Yellow
    }
}

Write-Host "`n=== Diagnóstico completado ===" -ForegroundColor Green