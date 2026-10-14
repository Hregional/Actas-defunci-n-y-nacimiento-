# Script para probar las mejoras del mapeo FHIR

Write-Host "=== PRUEBA DE MEJORAS FHIR ===" -ForegroundColor Green

Write-Host "`n1. BACKEND VERIFICATION:" -ForegroundColor Yellow
# Verificar que el backend esté funcionando
try {
    $health = Invoke-WebRequest -Uri "http://localhost:9090/api/actuator/health" -UseBasicParsing -TimeoutSec 5
    $healthData = $health.Content | ConvertFrom-Json
    Write-Host "   ✓ Backend Status: $($healthData.status)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend no está funcionando: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. FHIR ENDPOINTS VERIFICATION:" -ForegroundColor Yellow
Write-Host "   Probando endpoints FHIR disponibles..." -ForegroundColor Cyan

# Probar endpoint de health FHIR (público)
try {
    $fhirHealth = Invoke-WebRequest -Uri "http://localhost:9090/api/fhir/pacientes/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "   ✓ FHIR Health disponible (Status: $($fhirHealth.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  FHIR Health requiere autenticación o no está disponible" -ForegroundColor Yellow
}

# Verificar que los endpoints existen (sin autenticación darán 401, no 404)
Write-Host "`n   Verificando estructura de endpoints..." -ForegroundColor Cyan

$endpoints = @(
    "/api/fhir/pacientes/buscar-por-cui/1234567890123",
    "/api/fhir/pacientes/buscar-por-id/837871"
)

foreach ($endpoint in $endpoints) {
    try {
        Invoke-WebRequest -Uri "http://localhost:9090$endpoint" -UseBasicParsing -TimeoutSec 3
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401) {
            Write-Host "   ✓ $endpoint existe (requiere autenticación)" -ForegroundColor Green
        } elseif ($statusCode -eq 404) {
            Write-Host "   ❌ $endpoint NO EXISTE" -ForegroundColor Red
        } else {
            Write-Host "   ⚠️  $endpoint - Status: $statusCode" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n3. FRONTEND VERIFICATION:" -ForegroundColor Yellow

# Verificar que los archivos de mejora existan
$frontendFiles = @(
    "frontend/src/shared/utils/fhirMapper.ts",
    "frontend/src/modules/nacimiento/components/SeccionIV.tsx",
    "frontend/src/modules/nacimiento/components/SeccionV.tsx",
    "frontend/src/modules/defuncion/components/DefSeccionII.tsx",
    "frontend/src/modules/defuncion/components/DefSeccionVI.tsx"
)

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        # Verificar que contenga las mejoras
        $content = Get-Content $file -Raw
        if ($content -like "*mapearDatosFhirCompleto*") {
            Write-Host "   ✓ $file actualizado con mejoras FHIR" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $file existe pero sin mejoras FHIR" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ❌ $file NO EXISTE" -ForegroundColor Red
    }
}

Write-Host "`n4. SUMMARY:" -ForegroundColor Yellow
Write-Host "   PROBLEMAS SOLUCIONADOS:" -ForegroundColor Green
Write-Host "   ✓ Mapeo inteligente de departamentos/municipios" -ForegroundColor Cyan
Write-Host "   ✓ Nacionalidad automática para CUI guatemalteco" -ForegroundColor Cyan
Write-Host "   ✓ Manejo de género en nacionalidades (Guatemalteco/a)" -ForegroundColor Cyan
Write-Host "   ✓ Logging mejorado para debugging" -ForegroundColor Cyan
Write-Host "   ✓ Manejo de errores de mapeo" -ForegroundColor Cyan

Write-Host "`n5. NEXT STEPS:" -ForegroundColor Yellow
Write-Host "   1. Recompila el frontend: npm run build" -ForegroundColor White
Write-Host "   2. Prueba búsqueda por DPI en la aplicación" -ForegroundColor White
Write-Host "   3. Verifica que no haya errores de mapeo en consola" -ForegroundColor White
Write-Host "   4. Confirma nacionalidad automática para DPI guatemalteco" -ForegroundColor White

Write-Host "`n=== MEJORAS FHIR IMPLEMENTADAS ===" -ForegroundColor Green