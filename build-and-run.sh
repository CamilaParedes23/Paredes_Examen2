#!/bin/bash

echo "=== Purchase Order Management System - Build Script ==="

echo "1. Limpiando contenedores existentes..."
docker-compose down -v

echo "2. Construyendo backend (Spring Boot)..."
./mvnw clean package -DskipTests

echo "3. Construyendo imágenes Docker..."
docker-compose build

echo "4. Iniciando todos los servicios..."
docker-compose up -d

echo "5. Esperando que los servicios estén listos..."
echo "   - MySQL iniciando..."
sleep 20

echo "   - API iniciando..."
sleep 30

echo "   - Frontend iniciando..."
sleep 15

echo "6. Verificando estado de los servicios..."
docker-compose ps

echo ""
echo "=== Servicios Disponibles ==="
echo "Frontend React: http://localhost:3000"
echo "API REST:       http://localhost:8080"
echo "MySQL DB:       localhost:3306"
echo ""
echo "Para ver logs: docker-compose logs -f"
echo "Para detener:  docker-compose down"
