# API de Órdenes de Compra - Documentación

## Descripción
API REST para la gestión de órdenes de compra con filtros avanzados y validaciones completas.

## Estructura de la Entidad PurchaseOrder

```json
{
  "id": 1,
  "orderNumber": "PO-2025-000123",
  "supplierName": "ACME Tools",
  "status": "APPROVED",
  "totalAmount": 1250.50,
  "currency": "USD",
  "createdAt": "2025-01-15T10:30:00",
  "expectedDeliveryDate": "2025-02-15"
}
```

## Endpoints Disponibles

### 1. POST /api/v1/purchase-orders
Crea una nueva orden de compra.

**Ejemplo de Request:**
```json
{
  "supplierName": "ACME Tools",
  "totalAmount": 1250.50,
  "currency": "USD",
  "expectedDeliveryDate": "2025-02-15"
}
```

**Validaciones:**
- supplierName: requerido, máximo 255 caracteres
- totalAmount: requerido, debe ser mayor a 0
- currency: requerido (USD o EUR)
- expectedDeliveryDate: requerido, debe ser fecha futura

### 2. GET /api/v1/purchase-orders
Obtiene todas las órdenes con filtros opcionales.

**Filtros Disponibles:**

#### q (búsqueda de texto)
- **Descripción:** Búsqueda case-insensitive en orderNumber y supplierName
- **Tipo:** String
- **Ejemplo:** `/api/v1/purchase-orders?q=acme`
- **Comportamiento:** Si está vacío o en blanco, no filtra

#### status (estado)
- **Descripción:** Filtra por estado de la orden
- **Tipo:** String/Enum
- **Valores:** DRAFT | SUBMITTED | APPROVED | REJECTED | CANCELLED
- **Ejemplo:** `/api/v1/purchase-orders?status=APPROVED`
- **Error:** 400 Bad Request si el valor no está en el catálogo

#### currency (moneda)
- **Descripción:** Filtra por moneda
- **Tipo:** String/Enum
- **Valores:** USD | EUR
- **Ejemplo:** `/api/v1/purchase-orders?currency=USD`
- **Error:** 400 Bad Request si el valor no es válido

#### minTotal (monto mínimo)
- **Descripción:** Filtra órdenes con totalAmount >= minTotal
- **Tipo:** BigDecimal
- **Validación:** minTotal >= 0
- **Ejemplo:** `/api/v1/purchase-orders?minTotal=100`

#### maxTotal (monto máximo)
- **Descripción:** Filtra órdenes con totalAmount <= maxTotal
- **Tipo:** BigDecimal
- **Validación:** maxTotal >= 0
- **Ejemplo:** `/api/v1/purchase-orders?maxTotal=500`

#### from y to (rango de fechas)
- **Descripción:** Filtra por rango de fechas de creación
- **Tipo:** LocalDateTime
- **Formato:** yyyy-MM-ddTHH:mm:ss
- **Ejemplo:** `/api/v1/purchase-orders?from=2025-01-01T00:00:00&to=2025-06-30T23:59:59`
- **Validación:** Si ambos están presentes, from <= to
- **Error:** 400 Bad Request si from > to

### 3. GET /api/v1/purchase-orders/{id}
Obtiene una orden específica por ID.

### 4. PUT /api/v1/purchase-orders/{id}
Actualiza una orden existente.

### 5. DELETE /api/v1/purchase-orders/{id}
Elimina una orden específica.

### 6. GET /api/v1/purchase-orders/generate-order-number
Genera un nuevo número de orden automático.

### 7. GET /api/v1/purchase-orders/health
Endpoint de salud del servicio.

## Ejemplos de Uso

### Crear una orden
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

### Búsqueda con múltiples filtros
```bash
curl "http://localhost:8080/api/v1/purchase-orders?q=acme&status=APPROVED&currency=USD&minTotal=100&maxTotal=2000"
```

### Filtro por rango de fechas
```bash
curl "http://localhost:8080/api/v1/purchase-orders?from=2025-01-01T00:00:00&to=2025-12-31T23:59:59"
```

## Respuestas de Error

### 400 Bad Request - Validación
```json
{
  "timestamp": "2025-01-15T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Los datos proporcionados no son válidos",
  "details": {
    "supplierName": "El nombre del proveedor es requerido",
    "totalAmount": "El monto total debe ser mayor a 0"
  }
}
```

### 404 Not Found
```json
{
  "timestamp": "2025-01-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "No se encontró la orden con ID: 999"
}
```

## Configuración de Base de Datos

La aplicación utiliza H2 Database (en memoria) para desarrollo.

**Acceso a H2 Console:**
- URL: http://localhost:8080/h2-console
- JDBC URL: jdbc:h2:mem:testdb
- Username: sa
- Password: password

## Datos de Prueba

La aplicación se inicia con datos de ejemplo para facilitar las pruebas.

## Estados de Orden

- **DRAFT:** Borrador inicial
- **SUBMITTED:** Enviada para aprobación
- **APPROVED:** Aprobada
- **REJECTED:** Rechazada
- **CANCELLED:** Cancelada

## Monedas Soportadas

- **USD:** Dólar estadounidense
- **EUR:** Euro

## Formato de Números de Orden

El sistema genera números de orden automáticamente con el formato:
`PO-YYYY-XXXXXX` donde YYYY es el año actual y XXXXXX es un número secuencial de 6 dígitos.

Ejemplo: `PO-2025-000123`
