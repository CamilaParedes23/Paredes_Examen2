# Guía de Docker - PurchaseOrder API

## 🐳 Containerización con Docker

Esta guía explica cómo containerizar y desplegar la aplicación PurchaseOrder API usando Docker.

## 📋 Prerrequisitos

- Docker Desktop instalado
- Cuenta en Docker Hub (para subir imágenes)
- Git (opcional)

## 🚀 Construcción de la Imagen Docker

### Opción 1: Script Automático (Recomendado)
```powershell
# Construir imagen localmente
.\docker-build.ps1

# Construir y subir a Docker Hub
.\docker-deploy.ps1
```

### Opción 2: Comandos Manuales
```bash
# Construir la imagen
docker build -t purchaseorder-api:latest .

# Etiquetar para Docker Hub (reemplaza 'tuusuario' con tu usuario)
docker tag purchaseorder-api:latest tuusuario/purchaseorder-api:latest

# Subir a Docker Hub
docker push tuusuario/purchaseorder-api:latest
```

## 🏃‍♂️ Ejecutar la Aplicación

### Con Docker Run
```bash
# Ejecutar desde imagen local
docker run -d \
  --name purchaseorder-container \
  -p 8080:8080 \
  purchaseorder-api:latest

# Ejecutar desde Docker Hub
docker run -d \
  --name purchaseorder-container \
  -p 8080:8080 \
  tuusuario/purchaseorder-api:latest
```

### Con Docker Compose (Recomendado)
```bash
# Usando imagen local
docker-compose up -d

# Para usar imagen de Docker Hub, edita docker-compose.yml primero
# Descomenta la sección de imagen y reemplaza 'tuusuario'
docker-compose up -d
```

## 🌐 Acceso a la Aplicación

Una vez que el contenedor esté ejecutándose:

- **API Base:** http://localhost:8080
- **Health Check:** http://localhost:8080/api/v1/purchase-orders/health
- **H2 Console:** http://localhost:8080/h2-console
- **Swagger UI:** http://localhost:8080/swagger-ui.html (si está configurado)

### Credenciales H2 Database:
- **JDBC URL:** `jdbc:h2:mem:testdb`
- **Username:** `sa`
- **Password:** `password`

## 📊 Monitoreo y Logs

```bash
# Ver logs del contenedor
docker logs purchaseorder-container

# Ver logs en tiempo real
docker logs -f purchaseorder-container

# Estadísticas del contenedor
docker stats purchaseorder-container

# Inspeccionar el contenedor
docker inspect purchaseorder-container
```

## 🛠️ Comandos Útiles de Docker

```bash
# Listar contenedores
docker ps -a

# Parar el contenedor
docker stop purchaseorder-container

# Iniciar el contenedor
docker start purchaseorder-container

# Remover el contenedor
docker rm purchaseorder-container

# Listar imágenes
docker images

# Remover imagen
docker rmi purchaseorder-api:latest

# Limpiar recursos no utilizados
docker system prune

# Ejecutar bash dentro del contenedor
docker exec -it purchaseorder-container /bin/bash
```

## 🔧 Variables de Entorno

La aplicación soporta las siguientes variables de entorno:

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `SPRING_PROFILES_ACTIVE` | Perfil de Spring | `docker` |
| `JAVA_OPTS` | Opciones JVM | `-Xms256m -Xmx512m` |
| `SERVER_PORT` | Puerto del servidor | `8080` |

### Ejemplo con variables personalizadas:
```bash
docker run -d \
  --name purchaseorder-container \
  -p 9090:9090 \
  -e SERVER_PORT=9090 \
  -e JAVA_OPTS="-Xms512m -Xmx1g" \
  purchaseorder-api:latest
```

## 📋 Especificaciones del Dockerfile

- **Imagen base:** `openjdk:17-jdk-slim`
- **Puerto expuesto:** `8080`
- **Health check:** Configurado cada 30 segundos
- **Directorio de trabajo:** `/app`
- **Perfil por defecto:** `docker`

## 🧪 Pruebas de la Imagen Docker

### Health Check Manual
```bash
# Verificar que el contenedor esté saludable
docker ps

# Probar el endpoint de health
curl http://localhost:8080/api/v1/purchase-orders/health
```

### Pruebas de API
```bash
# Obtener todas las órdenes
curl http://localhost:8080/api/v1/purchase-orders

# Crear una nueva orden
curl -X POST http://localhost:8080/api/v1/purchase-orders \
  -H "Content-Type: application/json" \
  -d '{
    "supplierName": "Docker Test Supplier",
    "totalAmount": 999.99,
    "currency": "USD",
    "expectedDeliveryDate": "2026-01-15"
  }'
```

## 🚀 Despliegue en Docker Hub

### Pasos para subir a Docker Hub:

1. **Crear cuenta en Docker Hub:** https://hub.docker.com
2. **Hacer login:**
   ```bash
   docker login
   ```
3. **Construir y etiquetar imagen:**
   ```bash
   docker build -t tuusuario/purchaseorder-api:latest .
   ```
4. **Subir imagen:**
   ```bash
   docker push tuusuario/purchaseorder-api:latest
   ```

### Usar imagen desde Docker Hub:
```bash
docker pull tuusuario/purchaseorder-api:latest
docker run -p 8080:8080 tuusuario/purchaseorder-api:latest
```

## 🎯 Mejores Prácticas

### Seguridad:
- No incluir credenciales sensibles en la imagen
- Usar variables de entorno para configuración
- Mantener imágenes actualizadas

### Performance:
- Usar `.dockerignore` para excluir archivos innecesarios
- Aprovechar el cache de Docker layers
- Configurar límites de memoria apropiados

### Monitoreo:
- Implementar health checks
- Configurar logging apropiado
- Usar labels en las imágenes

## 🐛 Solución de Problemas

### El contenedor no inicia:
```bash
# Ver logs detallados
docker logs purchaseorder-container

# Verificar que el puerto no esté ocupado
netstat -an | findstr :8080
```

### Problemas de memoria:
```bash
# Aumentar memoria JVM
docker run -e JAVA_OPTS="-Xms512m -Xmx1g" purchaseorder-api:latest
```

### Problemas de conexión:
```bash
# Verificar que el puerto esté mapeado correctamente
docker port purchaseorder-container
```

## 📚 Recursos Adicionales

- [Documentación oficial de Docker](https://docs.docker.com)
- [Docker Hub](https://hub.docker.com)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)

---

**Autor:** Paredes  
**Proyecto:** PurchaseOrder API  
**Versión Docker:** 1.0.0
