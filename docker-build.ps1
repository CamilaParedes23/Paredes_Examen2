# Script simple para construir la imagen Docker localmente
# Ejecutar: .\docker-build.ps1

Write-Host "Construyendo imagen Docker para PurchaseOrder API..." -ForegroundColor Green

# Nombre de la imagen
$ImageName = "purchaseorder-api"
$ImageTag = "latest"
$FullImageName = "${ImageName}:${ImageTag}"

Write-Host "Ejecutando: docker build -t $FullImageName ." -ForegroundColor Cyan
docker build -t $FullImageName .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Imagen construida exitosamente!" -ForegroundColor Green
    Write-Host "Nombre de la imagen: $FullImageName" -ForegroundColor White
    Write-Host "`nPara ejecutar la imagen:" -ForegroundColor Yellow
    Write-Host "docker run -p 8080:8080 --name purchaseorder-container $FullImageName" -ForegroundColor Cyan
    Write-Host "`nPara usar docker-compose:" -ForegroundColor Yellow
    Write-Host "docker-compose up" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error al construir la imagen" -ForegroundColor Red
    Write-Host "Revisa los errores anteriores" -ForegroundColor Yellow
}
