# ================================================================
# diagnostico.ps1 - Test automatizado completo del sistema RENAP
# Ejecutar: .\diagnostico.ps1
# ================================================================

$resultados = [System.Collections.Generic.List[PSCustomObject]]::new()

function Test-Ok($nombre, $ok, $detalle) {
    $obj = [PSCustomObject]@{ Test=$nombre; Estado=if($ok){"OK"}else{"FAIL"}; Detalle=$detalle }
    $resultados.Add($obj)
    $color = if($ok){"Green"}else{"Red"}
    $prefix = if($ok){"[OK]  "}else{"[FAIL]"}
    Write-Host "$prefix $nombre" -ForegroundColor $color
    if($detalle){ Write-Host "       $detalle" -ForegroundColor Gray }
}

function Test-Advertencia($nombre, $detalle) {
    $obj = [PSCustomObject]@{ Test=$nombre; Estado="WARN"; Detalle=$detalle }
    $resultados.Add($obj)
    Write-Host "[WARN] $nombre" -ForegroundColor Yellow
    if($detalle){ Write-Host "       $detalle" -ForegroundColor Gray }
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  DIAGNOSTICO AUTOMATIZADO - RENAP" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# ── CAPA 1: Contenedores Docker ──────────────────────────────────
Write-Host "[ CAPA 1 ] Contenedores Docker" -ForegroundColor Cyan

$dockerPs = docker ps 2>&1 | Out-String
$backendOk  = $dockerPs -match "renap-backend.*healthy"
$frontendOk = $dockerPs -match "renap-frontend.*Up"
$mysqlOk    = $dockerPs -match "renap-mysql.*healthy"

Test-Ok "MySQL corriendo y healthy"   $mysqlOk    $(docker ps --filter "name=renap-mysql"   --format "table {{.Names}} {{.Status}}" 2>&1 | Select-Object -Last 1)
Test-Ok "Backend corriendo y healthy" $backendOk  $(docker ps --filter "name=renap-backend" --format "table {{.Names}} {{.Status}}" 2>&1 | Select-Object -Last 1)
Test-Ok "Frontend corriendo"          $frontendOk $(docker ps --filter "name=renap-frontend" --format "table {{.Names}} {{.Status}}" 2>&1 | Select-Object -Last 1)

Write-Host ""

# ── CAPA 2: Backend HTTP directo desde host (puerto 9090) ────────
Write-Host "[ CAPA 2 ] Backend HTTP directo localhost:9090" -ForegroundColor Cyan

try {
    $h = Invoke-RestMethod -Uri "http://localhost:9090/api/actuator/health" -TimeoutSec 5
    Test-Ok "GET /actuator/health" ($h.status -eq "UP") "status=$($h.status)"
} catch {
    Test-Ok "GET /actuator/health" $false $_.Exception.Message
}

$eps = @(
    "http://localhost:9090/api/estadisticas/resumen",
    "http://localhost:9090/api/estadisticas/por-mes",
    "http://localhost:9090/api/estadisticas/ultima-semana",
    "http://localhost:9090/api/nacimientos?search=`&page=0`&size=10",
    "http://localhost:9090/api/defunciones?search=`&page=0`&size=10"
)

foreach ($url in $eps) {
    $short = $url -replace "http://localhost:9090",""
    try {
        $r = Invoke-WebRequest -Uri $url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Test-Ok "GET $short" $true "HTTP $($r.StatusCode)"
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
        # 401 = correcto (llega al backend pero rechaza por falta de token)
        $ok   = ($code -eq 401)
        $msg  = if($code){"HTTP $code$(if($ok){' (401 esperado - sin token)'}else{' ERROR INESPERADO'})"}else{$_.Exception.Message}
        Test-Ok "GET $short" $ok $msg
    }
}

Write-Host ""

# ── CAPA 3: Variables de entorno ─────────────────────────────────
Write-Host "[ CAPA 3 ] Variables de entorno" -ForegroundColor Cyan

if ($frontendOk) {
    $envFrontend  = docker exec renap-frontend env 2>&1 | Out-String
    $viteApiLine  = ($envFrontend -split "`n" | Select-String "VITE_API_URL") -join ""
    $apiTargetLine = ($envFrontend -split "`n" | Select-String "API_TARGET") -join ""
    $viteKcLine   = ($envFrontend -split "`n" | Select-String "VITE_KEYCLOAK_URL") -join ""

    $urlOk = $viteApiLine -match "9090"
    Test-Ok "VITE_API_URL apunta a :9090" $urlOk $viteApiLine.Trim()
    Write-Host "       $($apiTargetLine.Trim())" -ForegroundColor Gray
    Write-Host "       $($viteKcLine.Trim())" -ForegroundColor Gray
} else {
    Test-Advertencia "Variables entorno frontend" "Contenedor no corre"
}

# .env.local del host
$envLocal = Get-Content "c:\Users\edvin\RH-Informes-NacDef\frontend\.env.local" -ErrorAction SilentlyContinue | Out-String
$envLocalOk = $envLocal -match "VITE_API_URL=http://localhost:9090"
Test-Ok ".env.local tiene VITE_API_URL=localhost:9090" $envLocalOk ($envLocal -split "`n" | Select-String "VITE_API_URL" | Select-Object -First 1)

Write-Host ""

# ── CAPA 4: Proxy de Vite (localhost:4200) ───────────────────────
Write-Host "[ CAPA 4 ] Proxy Vite localhost:4200" -ForegroundColor Cyan

if ($frontendOk) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:4200/api/actuator/health" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Test-Ok "Proxy GET /api/actuator/health via :4200" $true "HTTP $($r.StatusCode)"
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
        $msg  = if($code){"HTTP $code"}else{$_.Exception.Message}
        Test-Ok "Proxy GET /api/actuator/health via :4200" $false "$msg - PROXY ROTO"
    }

    $frontendLogs = docker logs renap-frontend --tail 30 2>&1 | Out-String
    $tieneECONN   = $frontendLogs -match "ECONNREFUSED"
    $tiene502     = $frontendLogs -match "502"
    if ($tieneECONN -or $tiene502) {
        Test-Advertencia "Proxy Vite logs" "Hay errores ECONNREFUSED o 502 recientes en frontend"
        ($frontendLogs -split "`n" | Select-String "error|ECONN|502" -CaseSensitive:$false | Select-Object -First 5) | ForEach-Object { Write-Host "       $_" -ForegroundColor Gray }
    } else {
        Test-Ok "Proxy Vite sin errores recientes" $true ""
    }
}

Write-Host ""

# ── CAPA 5: Conectividad interna Docker ──────────────────────────
Write-Host "[ CAPA 5 ] Red interna Docker (frontend -> backend)" -ForegroundColor Cyan

if ($frontendOk -and $backendOk) {
    $internalResp = docker exec renap-frontend wget -qO- "http://backend:8080/api/actuator/health" 2>&1 | Out-String
    $internalOk   = $internalResp -match "UP"
    Test-Ok "frontend -> backend:8080 (red Docker)" $internalOk $internalResp.Trim()

    $backendIp  = docker inspect renap-backend  --format "{{`range` .NetworkSettings.Networks}}{{.IPAddress}}{{`end`}}" 2>&1
    $frontendIp = docker inspect renap-frontend --format "{{`range` .NetworkSettings.Networks}}{{.IPAddress}}{{`end`}}" 2>&1
    Write-Host "       Backend IP:  $backendIp" -ForegroundColor Gray
    Write-Host "       Frontend IP: $frontendIp" -ForegroundColor Gray
}

Write-Host ""

# ── CAPA 6: Codigo de logout ─────────────────────────────────────
Write-Host "[ CAPA 6 ] Codigo logout (KeycloakContext + axios)" -ForegroundColor Cyan

$logoutTs  = Get-Content "c:\Users\edvin\RH-Informes-NacDef\frontend\src\shared\auth\logout.ts" -ErrorAction SilentlyContinue | Out-String
$axiosTs   = Get-Content "c:\Users\edvin\RH-Informes-NacDef\frontend\src\shared\api\axios.ts"   -ErrorAction SilentlyContinue | Out-String
$ctxTs     = Get-Content "c:\Users\edvin\RH-Informes-NacDef\frontend\src\shared\context\KeycloakContext.tsx" -ErrorAction SilentlyContinue | Out-String

Test-Ok "logout.ts existe y tiene doLogout"    ($logoutTs -match "doLogout")         ""
Test-Ok "logout.ts incluye id_token_hint"      ($logoutTs -match "id_token_hint")    ""
Test-Ok "logout.ts quita trailing slash"       ($logoutTs -match "replace")          ""
Test-Ok "axios.ts importa doLogout"            ($axiosTs  -match "import.*doLogout") ""
Test-Ok "axios.ts NO usa keycloak.logout directo" ($axiosTs -notmatch "keycloak\.logout\(\)") ""
Test-Ok "KeycloakContext usa doLogout"         ($ctxTs    -match "doLogout")         ""

Write-Host ""

# ── CAPA 7: Base de datos ────────────────────────────────────────
Write-Host "[ CAPA 7 ] Base de datos y tablas" -ForegroundColor Cyan

if ($mysqlOk) {
    $tablas = docker exec renap-mysql mysql -u renap_user -prenap_pass renap_db -e "SHOW TABLES;" 2>&1 | Out-String
    Test-Ok "Tabla informe_nacimiento" ($tablas -match "informe_nacimiento") ""
    Test-Ok "Tabla informe_defuncion"  ($tablas -match "informe_defuncion")  ""

    $liquibase = docker logs renap-backend 2>&1 | Out-String
    Test-Ok "Liquibase ejecuto OK" ($liquibase -match "Update.*successful|successful.*Update") ""
}

Write-Host ""

# ── RESUMEN ──────────────────────────────────────────────────────
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  RESUMEN FINAL" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$fails = $resultados | Where-Object { $_.Estado -eq "FAIL" }
$warns = $resultados | Where-Object { $_.Estado -eq "WARN" }
$oks   = $resultados | Where-Object { $_.Estado -eq "OK"   }

Write-Host "Pasaron : $($oks.Count)"   -ForegroundColor Green
Write-Host "Warnings: $($warns.Count)" -ForegroundColor Yellow
Write-Host "Fallaron: $($fails.Count)" -ForegroundColor Red
Write-Host ""

if ($fails.Count -gt 0) {
    Write-Host "PROBLEMAS CRITICOS:" -ForegroundColor Red
    foreach ($f in $fails) {
        Write-Host "  [X] $($f.Test)" -ForegroundColor Red
        if ($f.Detalle) { Write-Host "      $($f.Detalle)" -ForegroundColor Gray }
    }
    Write-Host ""
}

if ($warns.Count -gt 0) {
    Write-Host "ADVERTENCIAS:" -ForegroundColor Yellow
    foreach ($w in $warns) {
        Write-Host "  [!] $($w.Test)" -ForegroundColor Yellow
        if ($w.Detalle) { Write-Host "      $($w.Detalle)" -ForegroundColor Gray }
    }
    Write-Host ""
}

if ($fails.Count -eq 0 -and $warns.Count -eq 0) {
    Write-Host "Todo OK - el sistema deberia funcionar correctamente." -ForegroundColor Green
}

Write-Host "================================================================" -ForegroundColor Cyan
