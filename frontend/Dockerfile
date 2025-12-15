# Dockerfile para React Frontend
FROM node:18-alpine

# Instalar serve globalmente
RUN npm install -g serve

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Construir aplicación para producción
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Comando para servir la aplicación
CMD ["serve", "-s", "build", "-l", "3000"]
