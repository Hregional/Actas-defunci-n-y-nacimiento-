#!/usr/bin/env pwsh

Write-Host "=== Reiniciando Backend con Nueva Contraseña FHIR ===" -ForegroundColor Green

# Configurar todas las variables de entorno necesarias
$envVars = @{
    "KEYCLOAK_URL" = "https://sso.hro.gob.gt"
    "KEYCLOAK_REALM" = "Hospital-O"
    "KEYCLOAK_CLIENT_ID" = "sistema-actas"
    "KEYCLOAK_CLIENT_SECRET" = $env:KEYCLOAK_CLIENT_SECRET  # definir en .env / entorno
    "KEYCLOAK_FRONTEND_CLIENT_UUID" = "d670e581-567a-4bba-afdc-43a6b0f94590"
    "RH_API_URL" = "https://asistencia.hro.gob.gt"
    "RH_API_USE_MOCK" = "true"
    "SPRING_DATASOURCE_URL" = "jdbc:mysql://localhost:3308/renap_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Guatemala"
    "DB_USERNAME" = "renap_user"
    "DB_PASSWORD" = "renap_pass"
    "FHIR_SERVER_URL" = "https://openhim-qa-router.hro.gob.gt/fhir"
    "FHIR_USERNAME" = "postman"
    "FHIR_PASSWORD" = $env:FHIR_PASSWORD  # definir en .env / entorno
}

Write-Host "Configurando variables de entorno..." -ForegroundColor Yellow
foreach ($var in $envVars.GetEnumerator()) {
    [System.Environment]::SetEnvironmentVariable($var.Key, $var.Value, "Process")
    if ($var.Key -eq "FHIR_PASSWORD") {
        Write-Host "✓ $($var.Key) = ***NUEVA_CONTRASEÑA***" -ForegroundColor Green
    } else {
        Write-Host "✓ $($var.Key) = $($var.Value)" -ForegroundColor Cyan
    }
}

Write-Host "`n=== Variables FHIR Configuradas ===" -ForegroundColor Yellow
Write-Host "Server: $($env:FHIR_SERVER_URL)" -ForegroundColor White
Write-Host "Usuario: $($env:FHIR_USERNAME)" -ForegroundColor White
Write-Host "Contraseña: ***" -ForegroundColor Green

Write-Host "`n=== Iniciando Backend ===" -ForegroundColor Yellow
Write-Host "Buscando Java y classpath..." -ForegroundColor Gray

# Intentar ejecutar con Java directamente
cd backend
$javaHome = $env:JAVA_HOME
if (-not $javaHome) {
    $javaHome = (Get-Command java -ErrorAction SilentlyContinue).Source | Split-Path | Split-Path
}

if ($javaHome) {
    Write-Host "Java encontrado en: $javaHome" -ForegroundColor Cyan
    $classPath = "target/classes"
    
    # Buscar todas las dependencias JAR en .m2 repository (común para VS Code Java)
    $m2Repo = "$env:USERPROFILE/.m2/repository"
    if (Test-Path $m2Repo) {
        Write-Host "Repositorio Maven encontrado: $m2Repo" -ForegroundColor Cyan
        $jarFiles = Get-ChildItem -Path $m2Repo -Recurse -Name "*.jar" | ForEach-Object { "$m2Repo/$_" }
        $classPath += ";" + ($jarFiles -join ";")
    }
    
    Write-Host "Ejecutando aplicación Spring Boot..." -ForegroundColor Green
    Write-Host "java -cp `"$classPath`" com.renap.RenapApplication" -ForegroundColor Gray
    
    & java -cp $classPath com.renap.RenapApplication
} else {
    Write-Host "ERROR: Java no encontrado. Usa VS Code para ejecutar el backend:" -ForegroundColor Red
    Write-Host "1. Abre Command Palette (Ctrl+Shift+P)" -ForegroundColor White
    Write-Host "2. Ejecuta 'Java: Restart Projects'" -ForegroundColor White
    Write-Host "3. Ejecuta la clase RenapApplication.java" -ForegroundColor White
}