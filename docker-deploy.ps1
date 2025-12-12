# Script para construir y subir la imagen Docker a Docker Hub
# Ejecutar: .\docker-deploy.ps1

param(
    [string]$DockerHubUsername = "",
    [string]$ImageTag = "latest"
)

Write-Host "=== Script de Despliegue Docker para PurchaseOrder API ===" -ForegroundColor Green

if (-not $DockerHubUsername) {
    $DockerHubUsername = Read-Host "Ingresa tu usuario de Docker Hub"
}

$ImageName = "$DockerHubUsername/purchaseorder-api"
$FullImageName = "${ImageName}:${ImageTag}"

Write-Host "`n1. Construyendo la imagen Docker..." -ForegroundColor Cyan
docker build -t $FullImageName .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al construir la imagen Docker" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Imagen construida exitosamente: $FullImageName" -ForegroundColor Green

Write-Host "`n2. Verificando que la imagen se creó correctamente..." -ForegroundColor Cyan
docker images $ImageName

Write-Host "`n3. (Opcional) Probar la imagen localmente..." -ForegroundColor Cyan
$testLocal = Read-Host "¿Deseas probar la imagen localmente antes de subirla? (y/n)"

if ($testLocal -eq "y" -or $testLocal -eq "Y") {
    Write-Host "Iniciando contenedor de prueba..." -ForegroundColor Yellow
    Write-Host "La API estará disponible en: http://localhost:8080" -ForegroundColor White
    Write-Host "Presiona Ctrl+C para detener el contenedor de prueba" -ForegroundColor Yellow

    docker run --rm -p 8080:8080 --name purchaseorder-test $FullImageName

    Write-Host "`nContenedor de prueba detenido." -ForegroundColor Yellow
}

Write-Host "`n4. Subiendo imagen a Docker Hub..." -ForegroundColor Cyan
Write-Host "Nota: Asegúrate de haber hecho 'docker login' previamente" -ForegroundColor Yellow

$upload = Read-Host "¿Proceder con la subida a Docker Hub? (y/n)"

if ($upload -eq "y" -or $upload -eq "Y") {
    docker push $FullImageName

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Imagen subida exitosamente a Docker Hub!" -ForegroundColor Green
        Write-Host "`nPuedes usar la imagen con:" -ForegroundColor White
        Write-Host "docker run -p 8080:8080 $FullImageName" -ForegroundColor Cyan
        Write-Host "`nO usar docker-compose:" -ForegroundColor White
        Write-Host "Edita docker-compose.yml y reemplaza 'tuusuario' con '$DockerHubUsername'" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Error al subir la imagen a Docker Hub" -ForegroundColor Red
    }
} else {
    Write-Host "Subida cancelada por el usuario" -ForegroundColor Yellow
}

Write-Host "`n=== Proceso completado ===" -ForegroundColor Green
