# Test de la nueva configuracion FHIR

Write-Host "=== Test de Conectividad FHIR con Nueva Contraseña ===" -ForegroundColor Green

# Esperar a que el backend este activo
$maxWait = 60
$waitCount = 0

Write-Host "Esperando que el backend este activo..." -ForegroundColor Yellow

do {
    Start-Sleep -Seconds 2
    $waitCount += 2
    
    try {
        $health = Invoke-WebRequest -Uri "http://localhost:9090/api/actuator/health" -UseBasicParsing -TimeoutSec 3
        if ($health.StatusCode -eq 200) {
            Write-Host "✓ Backend activo!" -ForegroundColor Green
            break
        }
    } catch {
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
    
} while ($waitCount -lt $maxWait)

if ($waitCount -ge $maxWait) {
    Write-Host "`nERROR: Backend no respondio en $maxWait segundos" -ForegroundColor Red
    exit 1
}

# Ahora probar el endpoint FHIR
Write-Host "`nProbando endpoint FHIR..." -ForegroundColor Yellow

try {
    $token = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." # Token de prueba
    
    $headers = @{
        "Authorization" = $token
        "Content-Type" = "application/json"
    }
    
    $fhirTest = Invoke-WebRequest -Uri "http://localhost:9090/api/fhir/pacientes/buscar-por-id/837871" -Headers $headers -UseBasicParsing -TimeoutSec 10
    
    Write-Host "✓ Respuesta FHIR: $($fhirTest.StatusCode)" -ForegroundColor Green
    Write-Host "Content: $($fhirTest.Content)" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error en test FHIR: $($_.Exception.Message)" -ForegroundColor Red
    
    # Mostrar si es error de autenticacion o conectividad
    if ($_.Exception.Message -match "401") {
        Write-Host "NOTA: Error 401 - necesitas token valido" -ForegroundColor Yellow
    } elseif ($_.Exception.Message -match "404") {
        Write-Host "NOTA: Error 404 - endpoint funcionando pero paciente no encontrado o credenciales FHIR incorrectas" -ForegroundColor Yellow
    }
}