# Sistema de Gestión de Órdenes de Compra (PurchaseOrder API)

## Descripción

API REST para la gestión de órdenes de compra con funcionalidades completas de CRUD, filtros avanzados y validaciones robustas desarrollada con Spring Boot.

## Características Principales

- ✅ Entidad PurchaseOrder con todos los campos requeridos
- ✅ Endpoints REST completos (POST, GET, PUT, DELETE)
- ✅ Sistema de filtros avanzados (búsqueda, estado, moneda, montos, fechas)
- ✅ Validaciones de negocio y técnicas
- ✅ Generación automática de números de orden
- ✅ Manejo global de excepciones
- ✅ Base de datos H2 (en memoria) para desarrollo
- ✅ Documentación completa de API
- ✅ Pruebas unitarias

## Tecnologías Utilizadas

- **Java 17**
- **Spring Boot 4.0.0**
- **Spring Data JPA**
- **Spring Web MVC**
- **Bean Validation**
- **H2 Database**
- **Maven**
- **JUnit 5**

## Estructura del Proyecto

```
src/
├── main/
│   ├── java/ec/edu/espe/paredes_leccion2/
│   │   ├── controllers/          # Controladores REST
│   │   ├── services/             # Lógica de negocio
│   │   ├── repositories/         # Acceso a datos
│   │   ├── models/
│   │   │   ├── entities/         # Entidades JPA
│   │   │   └── enums/           # Enumeraciones
│   │   └── exceptions/          # Manejo de excepciones
│   └── resources/
│       ├── application.properties # Configuración
│       └── data.sql              # Datos iniciales
└── test/
    └── java/                     # Pruebas unitarias
```

## Instalación y Ejecución

### Prerrequisitos
- Java 17 o superior
- Maven 3.6+

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd paredes_leccion2
   ```

2. **Compilar el proyecto**
   ```bash
   mvn clean compile
   ```

3. **Ejecutar la aplicación**
   ```bash
   mvn spring-boot:run
   ```

4. **La aplicación estará disponible en:**
   - API: http://localhost:8080
   - H2 Console: http://localhost:8080/h2-console

## Configuración de Base de Datos H2

Para acceder a la consola de H2:

- **URL:** http://localhost:8080/h2-console
- **JDBC URL:** jdbc:h2:mem:testdb
- **Username:** sa
- **Password:** password

## Uso de la API

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/purchase-orders` | Crear nueva orden |
| GET | `/api/v1/purchase-orders` | Listar órdenes con filtros |
| GET | `/api/v1/purchase-orders/{id}` | Obtener orden por ID |
| PUT | `/api/v1/purchase-orders/{id}` | Actualizar orden |
| DELETE | `/api/v1/purchase-orders/{id}` | Eliminar orden |

### Ejemplos de Uso

#### Crear una Orden
```bash
curl -X POST http://localhost:8080/api/v1/purchase-orders \
  -H "Content-Type: application/json" \
  -d '{
    "supplierName": "ACME Tools",
    "totalAmount": 1250.50,
    "currency": "USD",
    "expectedDeliveryDate": "2025-02-15"
  }'
```

#### Buscar Órdenes con Filtros
```bash
# Búsqueda por texto
curl "http://localhost:8080/api/v1/purchase-orders?q=acme"

# Filtrar por estado
curl "http://localhost:8080/api/v1/purchase-orders?status=APPROVED"

# Filtrar por moneda y rango de montos
curl "http://localhost:8080/api/v1/purchase-orders?currency=USD&minTotal=100&maxTotal=2000"

# Filtrar por rango de fechas
curl "http://localhost:8080/api/v1/purchase-orders?from=2025-01-01T00:00:00&to=2025-12-31T23:59:59"

# Combinar múltiples filtros
curl "http://localhost:8080/api/v1/purchase-orders?q=acme&status=APPROVED&currency=USD"
```

### Filtros Disponibles

1. **q** - Búsqueda de texto (orderNumber, supplierName)
2. **status** - Estado (DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED)
3. **currency** - Moneda (USD, EUR)
4. **minTotal** - Monto mínimo
5. **maxTotal** - Monto máximo
6. **from** - Fecha desde (yyyy-MM-ddTHH:mm:ss)
7. **to** - Fecha hasta (yyyy-MM-ddTHH:mm:ss)

## Validaciones Implementadas

### Entidad PurchaseOrder
- ✅ orderNumber: único, formato PO-YYYY-XXXXXX
- ✅ supplierName: requerido, máximo 255 caracteres
- ✅ status: requerido, valores del enum
- ✅ totalAmount: requerido, mayor a 0
- ✅ currency: requerido, USD o EUR
- ✅ expectedDeliveryDate: requerido, fecha futura

### Filtros
- ✅ status: solo valores válidos del enum
- ✅ currency: solo valores válidos del enum
- ✅ minTotal/maxTotal: >= 0, minTotal <= maxTotal
- ✅ from/to: formato correcto, from <= to

## Datos de Prueba

La aplicación se inicia con datos de ejemplo:

- PO-2025-000001 - ACME Tools - DRAFT - $1,250.50
- PO-2025-000002 - Tech Supplies Inc - SUBMITTED - €2,300.75
- PO-2025-000003 - Global Materials - APPROVED - $5,500.00
- PO-2025-000004 - ACME Tools - REJECTED - €750.25
- PO-2025-000005 - Industrial Parts Co - CANCELLED - $3,200.00
- PO-2025-000006 - Office Solutions - APPROVED - €890.50
- PO-2025-000007 - Tech Supplies Inc - DRAFT - $1,800.75

## Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
mvn test

# Ejecutar pruebas específicas
mvn test -Dtest=PurchaseOrderControllerTest
```

## 🐳 Despliegue con Docker

### Construcción de Imagen Docker

#### Opción 1: Script Automático (Recomendado)
```powershell
# Construir imagen localmente
.\docker-build.ps1

# Construir y subir a Docker Hub
.\docker-deploy.ps1
```

#### Opción 2: Comandos Manuales
```bash
# Construir imagen
docker build -t purchaseorder-api:latest .

# Ejecutar contenedor
docker run -d -p 8080:8080 --name purchaseorder-container purchaseorder-api:latest
```

### Docker Compose
```bash
# Iniciar con docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Acceso en Docker
- **API:** http://localhost:8080
- **H2 Console:** http://localhost:8080/h2-console
- **Health:** http://localhost:8080/api/v1/purchase-orders/health

Ver `DOCKER_GUIDE.md` para documentación completa de Docker.

## Estructura de Respuestas

### Respuesta Exitosa
```json
{
  "timestamp": "2025-01-15T10:30:00",
  "status": 200,
  "message": "Operación exitosa",
  "data": { ... }
}
```

### Respuesta de Error
```json
{
  "timestamp": "2025-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Descripción del error",
  "details": { ... }
}
```

## Estados de Orden

- **DRAFT** - Borrador inicial
- **SUBMITTED** - Enviada para aprobación  
- **APPROVED** - Aprobada
- **REJECTED** - Rechazada
- **CANCELLED** - Cancelada

## Monedas Soportadas

- **USD** - Dólar estadounidense
- **EUR** - Euro

## Logging

Los logs están configurados para mostrar:
- Consultas SQL ejecutadas
- Parámetros de binding
- Operaciones de la API
- Errores y excepciones

## Documentación Adicional

Ver `API_DOCUMENTATION.md` para documentación detallada de la API.

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit los cambios
4. Push a la rama
5. Crear un Pull Request

## Licencia

Este proyecto es para fines educativos.

---

**Autor:** Paredes  
**Curso:** Sistemas Distribuidos - Lección 2  
**Universidad:** ESPE
