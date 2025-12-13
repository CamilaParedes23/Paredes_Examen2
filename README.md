# Purchase Order API

API REST para la gestión de órdenes de compra desarrollada con **Spring Boot 3** y **Java 17**, implementando filtros avanzados y cumpliendo con los principios REST y buenas prácticas de desarrollo.

## Características Implementadas

- **CRUD completo** para órdenes de compra
- **6 filtros avanzados** obligatorios implementados (búsqueda, estado, moneda, montos, fechas)
- **Validaciones robustas** con Bean Validation y validaciones de negocio
- **Manejo global de errores** con respuestas JSON estructuradas y códigos HTTP apropiados
- **Arquitectura en capas** (Controller, Service, Repository)
- **Base de datos MySQL** con datos de prueba precargados
- **Dockerización** completa con Dockerfile
- **Generación automática** de números de orden (PO-YYYY-XXXXXX)

## Stack Tecnológico

- **Java 17** - Lenguaje de programación
- **Spring Boot 3.2.1** - Framework principal
- **Spring Data JPA** - Persistencia de datos
- **MySQL 8.0** - Base de datos
- **Docker** - Contenerización
- **Maven** - Gestión de dependencias
- **Bean Validation** - Validaciones

## Inicio Rápido

### Opción 1: Con Docker

```bash
# Construir imagen Docker
docker build -t purchaseorder-api .

# Ejecutar contenedor (requiere MySQL externo)
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=docker purchaseorder-api
```

### Opción 2: Ejecución Local

```bash
# 1. Configurar MySQL local
# Puerto: 3308, Usuario: AppRoot, Contraseña: abcd, BD: orden

# 2. Compilar y ejecutar aplicación
./mvnw clean compile
./mvnw spring-boot:run
```

La aplicación estará disponible en: **http://localhost:8080**

## Endpoints Implementados

### Base URL
```
http://localhost:8080/api/v1/purchase-orders
```

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/` | Crear nueva orden de compra |
| `GET` | `/` | Listar órdenes con filtros opcionales |
| `GET` | `/{id}` | Obtener orden específica por ID |
| `PUT` | `/{id}` | Actualizar orden existente |
| `DELETE` | `/{id}` | Eliminar orden |
| `GET` | `/generate-order-number` | Generar nuevo número de orden |
| `GET` | `/health` | Health check del servicio |

## Filtros Obligatorios Implementados

Todos los filtros son **opcionales** y se combinan con **lógica AND**:

| Parámetro | Tipo | Validación | Descripción | Ejemplo |
|-----------|------|------------|-------------|---------|
| `q` | String | Case-insensitive | Búsqueda en orderNumber y supplierName | `?q=acme` |
| `status` | Enum | Valores válidos únicamente | DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED | `?status=APPROVED` |
| `currency` | Enum | USD, EUR únicamente | Filtro por moneda exacta | `?currency=USD` |
| `minTotal` | BigDecimal | >= 0 | Monto mínimo (totalAmount >= minTotal) | `?minTotal=1000` |
| `maxTotal` | BigDecimal | >= 0 | Monto máximo (totalAmount <= maxTotal) | `?maxTotal=5000` |
| `from` | DateTime | ISO-8601, from <= to | Fecha desde (createdAt >= from) | `?from=2025-01-01T00:00:00` |
| `to` | DateTime | ISO-8601, from <= to | Fecha hasta (createdAt <= to) | `?to=2025-12-31T23:59:59` |

### Reglas de Validación de Filtros

- **Estados inválidos** → `400 Bad Request`
- **Monedas inválidas** → `400 Bad Request` 
- **Montos negativos** → `400 Bad Request`
- **from > to** → `400 Bad Request`
- **Formato de fecha inválido** → `400 Bad Request`

## Ejemplos de Uso

### Crear orden de compra
```http
POST /api/v1/purchase-orders
Content-Type: application/json

{
    "orderNumber": "PO-2025-000123",
    "supplierName": "ACME Tools Inc.",
    "status": "DRAFT",
    "totalAmount": 1250.50,
    "currency": "USD",
    "expectedDeliveryDate": "2025-02-15"
}
```

### Ejemplos de filtros

```http
# Búsqueda por texto
GET /api/v1/purchase-orders?q=acme

# Filtro por estado
GET /api/v1/purchase-orders?status=APPROVED

# Filtros por monto
GET /api/v1/purchase-orders?minTotal=1000&maxTotal=5000

# Filtro por rango de fechas
GET /api/v1/purchase-orders?from=2025-01-01T00:00:00&to=2025-01-31T23:59:59

# Filtros combinados
GET /api/v1/purchase-orders?q=acme&status=APPROVED&currency=USD&minTotal=1000
```

## Estructura del Proyecto

```
src/main/java/ec/edu/espe/paredes_leccion2/
├── ParedesLeccion2Application.java    # Clase principal
├── config/
│   └── WebConfig.java                 # Configuración web
├── controllers/
│   └── PurchaseOrderController.java   # Controlador REST
├── services/
│   └── PurchaseOrderService.java      # Lógica de negocio
├── repositories/
│   └── PurchaseOrderRepository.java   # Queries personalizadas
├── models/
│   ├── entities/
│   │   └── PurchaseOrder.java         # Entidad JPA
│   └── enums/
│       ├── OrderStatus.java           # Estados de orden
│       └── Currency.java              # Monedas soportadas
└── exceptions/
    ├── GlobalExceptionHandler.java    # Manejo global de errores
    ├── EntityNotFoundException.java   # Excepción personalizada
    └── ValidationException.java       # Excepción de validación
```

## Modelo de Datos

### Entidad PurchaseOrder

| Campo | Tipo | Validaciones | Descripción |
|-------|------|--------------|-------------|
| `id` | Long | PK, Auto-increment | Identificador único |
| `orderNumber` | String | Unique, Pattern: PO-YYYY-XXXXXX | Número de orden |
| `supplierName` | String | NotBlank, Max 255 chars | Nombre del proveedor |
| `status` | OrderStatus | NotNull, Enum | Estado de la orden |
| `totalAmount` | BigDecimal | NotNull, > 0, Precision 19,2 | Monto total |
| `currency` | Currency | NotNull, Enum | Moneda |
| `createdAt` | LocalDateTime | Auto-generated | Fecha de creación |
| `expectedDeliveryDate` | LocalDate | NotNull, Future | Fecha estimada de entrega |

## Configuración

### Base de datos MySQL (Local)
```properties
spring.datasource.url=jdbc:mysql://localhost:3308/orden
spring.datasource.username=AppRoot
spring.datasource.password=abcd
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### Base de datos MySQL (Docker)
```properties
spring.datasource.url=jdbc:mysql://mysql:3306/orden
spring.datasource.username=AppRoot
spring.datasource.password=abcd
```

## Datos de Prueba

La aplicación incluye 8 órdenes de prueba precargadas con:
- Diferentes estados (DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED)
- Múltiples proveedores (ACME Tools, Global Supplies, etc.)
- Variedad en montos y monedas (USD, EUR)
- Fechas distribuidas en enero 2025

## Manejo de Errores

### Estructura de Respuesta de Error
```json
{
  "timestamp": "2025-01-10T15:30:00",
  "status": 400,
  "error": "Validation Error",
  "message": "Estado no válido: INVALID_STATUS. Valores permitidos: DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED"
}
```

### Códigos HTTP Implementados
- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado
- `400 Bad Request` - Datos inválidos o filtros incorrectos
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error interno

## Docker

### Dockerfile incluido
```bash
# Construir imagen
docker build -t purchaseorder-api .

# Ejecutar con perfil Docker
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=docker purchaseorder-api
```

## Testing

### Endpoints de prueba rápida
```bash
# Health check
curl http://localhost:8080/api/v1/purchase-orders/health

# Listar todas las órdenes
curl http://localhost:8080/api/v1/purchase-orders

# Probar filtros
curl "http://localhost:8080/api/v1/purchase-orders?q=acme&status=APPROVED"
```

## Autor

**Paredes** - Lección 2 - Sistemas Distribuidos - ESPE

---

**Nota:** Este proyecto implementa completamente todos los requerimientos de filtros obligatorios especificados, con validaciones robustas y manejo de errores apropiado.


