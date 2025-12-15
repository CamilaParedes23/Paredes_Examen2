Write-Host "=== Purchase Order Management System - Build Script ===" -ForegroundColor Green

Write-Host "1. Limpiando contenedores existentes..." -ForegroundColor Yellow
docker-compose down -v

Write-Host "2. Construyendo backend (Spring Boot)..." -ForegroundColor Yellow
./mvnw.cmd clean package -DskipTests

Write-Host "3. Construyendo imágenes Docker..." -ForegroundColor Yellow
docker-compose build

Write-Host "4. Iniciando todos los servicios..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "5. Esperando que los servicios estén listos..." -ForegroundColor Yellow
Write-Host "   - MySQL iniciando..." -ForegroundColor Cyan
Start-Sleep -Seconds 20

Write-Host "   - API iniciando..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

Write-Host "   - Frontend iniciando..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

Write-Host "6. Verificando estado de los servicios..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "=== Servicios Disponibles ===" -ForegroundColor Green
Write-Host "Frontend React: http://localhost:3000" -ForegroundColor White
Write-Host "API REST:       http://localhost:8080" -ForegroundColor White
Write-Host "MySQL DB:       localhost:3306" -ForegroundColor White
Write-Host ""
Write-Host "Para ver logs: docker-compose logs -f" -ForegroundColor Cyan
Write-Host "Para detener:  docker-compose down" -ForegroundColor Cyan
