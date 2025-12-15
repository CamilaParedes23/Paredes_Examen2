package ec.edu.espe.paredes_leccion2.controllers;

import ec.edu.espe.paredes_leccion2.models.entities.PurchaseOrder;
import ec.edu.espe.paredes_leccion2.services.PurchaseOrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para la gestión de órdenes de compra
 */
@RestController
@RequestMapping("/api/v1/purchase-orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService service;

    /**
     * Endpoint: POST /api/v1/purchase-orders
     * Crea una nueva orden de compra
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPurchaseOrder(
            @Valid @RequestBody PurchaseOrder purchaseOrder) {

        PurchaseOrder saved = service.save(purchaseOrder);

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.CREATED.value());
        response.put("message", "Orden de compra creada exitosamente");
        response.put("data", saved);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Endpoint: GET /api/v1/purchase-orders
     * Obtiene todas las órdenes con filtros opcionales
     *
     * Filtros soportados:
     * - q: búsqueda de texto en orderNumber y supplierName (case-insensitive)
     * - status: filtro por estado (DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED)
     * - currency: filtro por moneda (USD, EUR)
     * - minTotal: monto mínimo (debe ser >= 0)
     * - maxTotal: monto máximo (debe ser >= 0)
     * - from: fecha y hora desde (formato: yyyy-MM-ddTHH:mm:ss)
     * - to: fecha y hora hasta (formato: yyyy-MM-ddTHH:mm:ss)
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPurchaseOrders(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) BigDecimal minTotal,
            @RequestParam(required = false) BigDecimal maxTotal,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {

        List<PurchaseOrder> orders = service.findAllWithFilters(
                q, status, currency, minTotal, maxTotal, from, to);

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.OK.value());
        response.put("message", "Órdenes recuperadas exitosamente");
        response.put("count", orders.size());
        response.put("data", orders);

        // Agregar información de filtros aplicados
        Map<String, Object> appliedFilters = new HashMap<>();
        if (q != null && !q.trim().isEmpty()) appliedFilters.put("q", q);
        if (status != null) appliedFilters.put("status", status);
        if (currency != null) appliedFilters.put("currency", currency);
        if (minTotal != null) appliedFilters.put("minTotal", minTotal);
        if (maxTotal != null) appliedFilters.put("maxTotal", maxTotal);
        if (from != null) appliedFilters.put("from", from);
        if (to != null) appliedFilters.put("to", to);

        if (!appliedFilters.isEmpty()) {
            response.put("appliedFilters", appliedFilters);
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint: GET /api/v1/purchase-orders/{id}
     * Obtiene una orden específica por su ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPurchaseOrderById(@PathVariable Long id) {

        PurchaseOrder order = service.findById(id);

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.OK.value());
        response.put("message", "Orden encontrada exitosamente");
        response.put("data", order);

        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint: PUT /api/v1/purchase-orders/{id}
     * Actualiza una orden existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePurchaseOrder(
            @PathVariable Long id,
            @Valid @RequestBody PurchaseOrder purchaseOrder) {

        PurchaseOrder updated = service.update(id, purchaseOrder);

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.OK.value());
        response.put("message", "Orden actualizada exitosamente");
        response.put("data", updated);

        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint: DELETE /api/v1/purchase-orders/{id}
     * Elimina una orden específica
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePurchaseOrder(@PathVariable Long id) {

        service.deleteById(id);

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.OK.value());
        response.put("message", "Orden eliminada exitosamente");

        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint: GET /api/v1/purchase-orders/generate-order-number
     * Genera un nuevo número de orden
     */
    @GetMapping("/generate-order-number")
    public ResponseEntity<Map<String, Object>> generateOrderNumber() {

        String orderNumber = service.generateOrderNumber();

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.OK.value());
        response.put("message", "Número de orden generado exitosamente");
        response.put("orderNumber", orderNumber);

        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint: GET /api/v1/purchase-orders/health
     * Endpoint de salud para verificar que el servicio está funcionando
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", "UP");
        response.put("service", "PurchaseOrder API");
        response.put("version", "1.0.0");

        return ResponseEntity.ok(response);
    }
}
