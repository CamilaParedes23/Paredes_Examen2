# Purchase Order Management System

Sistema completo de gestión de órdenes de compra con **API REST** desarrollada en **Spring Boot 3 + Java 17**, **interfaz gráfica React** y **base de datos MySQL**, todo dockerizado con **Docker Compose**.

## Arquitectura del Sistema

Este proyecto implementa una solución distribuida completa que incluye:

- **API REST** - Backend Spring Boot 3 con filtros avanzados y validaciones
- **Frontend React** - Interfaz gráfica moderna y responsiva 
- **Base de datos MySQL** - Persistencia de datos con contenedor Docker
- **Docker Compose** - Orquestación de todos los servicios

## Características Implementadas

### Backend (Spring Boot 3)
- **CRUD completo** para órdenes de compra con endpoints REST
- **6 filtros avanzados** obligatorios (búsqueda, estado, moneda, montos, fechas)
- **Validaciones robustas** con Bean Validation y validaciones de negocio
- **Manejo global de errores** con respuestas JSON estructuradas
- **Arquitectura en capas** (Controller, Service, Repository)
- **Generación automática** de números de orden (PO-YYYY-XXXXXX)
- **Health check** endpoint para monitoreo

### Frontend (React 18)
- **Interfaz moderna** con Bootstrap 5 y componentes responsivos
- **Lista de órdenes** con filtros en tiempo real
- **Formularios dinámicos** para crear y editar órdenes
- **Vista detallada** de cada orden de compra
- **Manejo de errores** y estados de carga
- **Navegación SPA** con React Router

### Base de Datos (MySQL 8)
- **Esquema optimizado** con constraints y validaciones
- **Datos de prueba** precargados automáticamente
- **Contenedor Docker** con persistencia de volúmenes

## Stack Tecnológico

### Backend
- **Java 17** - Lenguaje de programación
- **Spring Boot 3.2.1** - Framework principal
- **Spring Data JPA** - Persistencia de datos
- **Bean Validation** - Validaciones
- **Maven** - Gestión de dependencias

### Frontend  
- **React 18** - Framework de UI
- **React Bootstrap** - Componentes UI
- **Axios** - Cliente HTTP
- **React Router** - Navegación SPA

### Base de Datos y DevOps
- **MySQL 8.0** - Base de datos relacional
- **Docker** - Contenerización
- **Docker Compose** - Orquestación de servicios

## Inicio Rápido

### Opción 1: Docker Compose (Recomendado)

```bash
# Ejecutar toda la solución completa
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Detener todos los servicios
docker-compose down
```

### Opción 2: Servicios Individuales

```bash
# Solo base de datos
docker-compose up mysql -d

# Solo API
docker-compose up api -d

# Solo frontend
docker-compose up frontend -d
```

### Acceso a los Servicios

- **Frontend React**: http://localhost:3000
- **API REST**: http://localhost:8080
- **Base de datos MySQL**: localhost:3306

## Funcionalidades del Frontend

### Páginas Implementadas

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | Redirige a `/orders` | Página principal |
| `/orders` | PurchaseOrderList | Lista de órdenes con filtros |
| `/orders/new` | PurchaseOrderForm | Formulario para nueva orden |
| `/orders/edit/:id` | PurchaseOrderForm | Editar orden existente |
| `/orders/view/:id` | PurchaseOrderDetail | Ver detalles de orden |

### Características del Frontend

- **Lista interactiva** con todos los filtros de la API implementados
- **Formularios validados** con feedback visual en tiempo real
- **Búsqueda en tiempo real** por número de orden y proveedor
- **Filtros combinables** (estado, moneda, montos, fechas)
- **Acciones CRUD** completas (crear, leer, actualizar, eliminar)
- **Responsive design** compatible con móviles y tablets
- **Estados de carga** y manejo de errores elegante
- **Navegación intuitiva** con breadcrumbs y botones de acción

## Endpoints de la API

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

### Backend (Spring Boot)
```
src/main/java/ec/edu/espe/paredes_leccion2/
├── ParedesLeccion2Application.java    # Clase principal
├── config/
│   └── WebConfig.java                 # Configuración web y CORS
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

### Frontend (React)
```
frontend/
├── public/
│   ├── index.html                     # HTML principal
│   └── manifest.json                  # Configuración PWA
├── src/
│   ├── components/                    # Componentes reutilizables
│   │   ├── Navbar.js                  # Barra de navegación
│   │   ├── Footer.js                  # Pie de página
│   │   └── Loading.js                 # Componente de carga
│   ├── pages/                         # Páginas principales
│   │   ├── PurchaseOrderList.js       # Lista de órdenes
│   │   ├── PurchaseOrderForm.js       # Formulario CRUD
│   │   └── PurchaseOrderDetail.js     # Detalles de orden
│   ├── services/
│   │   └── api.js                     # Cliente HTTP con Axios
│   ├── App.js                         # Componente principal
│   ├── App.css                        # Estilos principales
│   └── index.js                       # Punto de entrada
├── package.json                       # Dependencias npm
└── Dockerfile                         # Imagen Docker
```

### Docker
```
├── docker-compose.yml                 # Orquestación completa
├── Dockerfile                         # Imagen del backend
└── frontend/
    └── Dockerfile                     # Imagen del frontend
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

### Base de datos MySQL (Docker Compose)
```properties
spring.datasource.url=jdbc:mysql://mysql:3306/orden
spring.datasource.username=AppRoot
spring.datasource.password=abcd
```

### Variables de entorno Docker
```yaml
# MySQL
MYSQL_ROOT_PASSWORD: root123
MYSQL_DATABASE: orden
MYSQL_USER: AppRoot
MYSQL_PASSWORD: abcd

# API
SPRING_PROFILES_ACTIVE: docker
DB_HOST: mysql
DB_PORT: 3306

# Frontend
REACT_APP_API_URL: http://localhost:8080/api/v1
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

## Datos de Prueba

La aplicación incluye 8 órdenes de prueba precargadas con:
- Diferentes estados (DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED)
- Múltiples proveedores (ACME Tools, Global Supplies, etc.)
- Variedad en montos y monedas (USD, EUR)
- Fechas distribuidas en enero 2025

## Docker

### Dockerfile incluido
```bash
# Construir imagen del backend
docker build -t purchaseorder-api .

# Construir imagen del frontend
docker build -t purchaseorder-frontend ./frontend

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

### Pruebas con el Frontend
1. Acceder a http://localhost:3000
2. Explorar la lista de órdenes con filtros
3. Crear nueva orden desde la interfaz
4. Editar órdenes existentes
5. Ver detalles completos de cada orden

## Autor

**Paredes** - Lección 2 - Sistemas Distribuidos - ESPE

---

**Nota:** Este proyecto implementa completamente todos los requerimientos de filtros obligatorios especificados, con validaciones robustas y manejo de errores apropiado.


