# Dockerfile simple para PurchaseOrder API
FROM amazoncorretto:17-alpine

# Instalar wget para healthcheck
RUN apk add --no-cache wget

# Crear directorio de trabajo
WORKDIR /app

# Copiar Maven wrapper y pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Dar permisos y descargar dependencias
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copiar código fuente y compilar
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Exponer puerto
EXPOSE 8080

# Variables de entorno
ENV SPRING_PROFILES_ACTIVE=docker
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Ejecutar aplicación
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar target/paredes_leccion2-0.0.1-SNAPSHOT.jar"]
