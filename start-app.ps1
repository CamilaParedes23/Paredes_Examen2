# Script de PowerShell para iniciar la aplicación PurchaseOrder API
# Ejecutar: .\start-app.ps1

Write-Host "Iniciando API de Órdenes de Compra..." -ForegroundColor Green

# Verificar si Maven está instalado
try {
    $mvnVersion = mvn -version
    Write-Host "Maven encontrado:" -ForegroundColor Green
    Write-Host $mvnVersion[0] -ForegroundColor Yellow
} catch {
    Write-Host "Error: Maven no está instalado o no está en PATH" -ForegroundColor Red
    exit 1
}

# Verificar si Java está instalado
try {
    $javaVersion = java -version 2>&1
    Write-Host "Java encontrado:" -ForegroundColor Green
    Write-Host $javaVersion[0] -ForegroundColor Yellow
} catch {
    Write-Host "Error: Java no está instalado o no está en PATH" -ForegroundColor Red
    exit 1
}

Write-Host "`nCompilando proyecto..." -ForegroundColor Cyan
mvn clean compile

if ($LASTEXITCODE -eq 0) {
    Write-Host "Compilación exitosa!" -ForegroundColor Green

    Write-Host "`nIniciando aplicación Spring Boot..." -ForegroundColor Cyan
    Write-Host "La aplicación estará disponible en:" -ForegroundColor Yellow
    Write-Host "  - API: http://localhost:8080" -ForegroundColor White
    Write-Host "  - H2 Console: http://localhost:8080/h2-console" -ForegroundColor White
    Write-Host "  - Health Check: http://localhost:8080/api/v1/purchase-orders/health" -ForegroundColor White
    Write-Host "`nPresiona Ctrl+C para detener la aplicación" -ForegroundColor Yellow
    Write-Host "==========================================" -ForegroundColor Green

    mvn spring-boot:run
} else {
    Write-Host "Error en la compilación. Revisa los errores anteriores." -ForegroundColor Red
    exit 1
}
