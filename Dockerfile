# Dockerfile para PurchaseOrder API
# Usa Amazon Corretto OpenJDK 17 como imagen base
FROM amazoncorretto:17-alpine

# Información del mantenedor
LABEL maintainer="paredes@espe.edu.ec"
LABEL description="PurchaseOrder API - Sistema de Gestión de Órdenes de Compra"
LABEL version="1.0.0"

# Instalar herramientas necesarias
RUN apk add --no-cache wget

# Crear directorio de trabajo
WORKDIR /app

# Copiar el archivo pom.xml y descargar dependencias (para aprovechar cache de Docker)
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# Dar permisos de ejecución al mvnw
RUN chmod +x mvnw

# Descargar dependencias
RUN ./mvnw dependency:go-offline -B

# Copiar el código fuente
COPY src ./src

# Construir la aplicación
RUN ./mvnw clean package -DskipTests

# Exponer el puerto 8080
EXPOSE 8080

# Variables de entorno
ENV SPRING_PROFILES_ACTIVE=docker
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Comando para ejecutar la aplicación
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar target/paredes_leccion2-0.0.1-SNAPSHOT.jar"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/v1/purchase-orders/health || exit 1
