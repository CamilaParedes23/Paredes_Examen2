package ec.edu.espe.paredes_leccion2.services;

import ec.edu.espe.paredes_leccion2.exceptions.EntityNotFoundException;
import ec.edu.espe.paredes_leccion2.exceptions.ValidationException;
import ec.edu.espe.paredes_leccion2.models.entities.PurchaseOrder;
import ec.edu.espe.paredes_leccion2.models.enums.Currency;
import ec.edu.espe.paredes_leccion2.models.enums.OrderStatus;
import ec.edu.espe.paredes_leccion2.repositories.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

/**
 * Servicio para la gestión de órdenes de compra
 */
@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository repository;

    /**
     * Genera un nuevo número de orden automáticamente
     */
    public String generateOrderNumber() {
        int year = LocalDateTime.now().getYear();
        long count = repository.count() + 1;
        return String.format("PO-%d-%06d", year, count);
    }

    /**
     * Guarda una nueva orden de compra
     */
    public PurchaseOrder save(PurchaseOrder purchaseOrder) {
        validatePurchaseOrder(purchaseOrder);

        // Si no tiene número de orden, generar uno automáticamente
        if (!StringUtils.hasText(purchaseOrder.getOrderNumber())) {
            purchaseOrder.setOrderNumber(generateOrderNumber());
        }

        // Verificar que el número de orden sea único
        if (repository.existsByOrderNumber(purchaseOrder.getOrderNumber())) {
            throw new ValidationException("Ya existe una orden con el número: " + purchaseOrder.getOrderNumber());
        }

        return repository.save(purchaseOrder);
    }

    /**
     * Obtiene todas las órdenes aplicando filtros
     */
    public List<PurchaseOrder> findAllWithFilters(String q, String status, String currency,
                                                 BigDecimal minTotal, BigDecimal maxTotal,
                                                 String from, String to) {

        // Validar y convertir parámetros
        OrderStatus orderStatus = validateAndParseStatus(status);
        Currency curr = validateAndParseCurrency(currency);

        // Validar montos
        validateAmounts(minTotal, maxTotal);

        // Validar y convertir fechas
        LocalDateTime fromDateTime = parseDateTime(from, "from");
        LocalDateTime toDateTime = parseDateTime(to, "to");

        // Validar que from <= to si ambos están presentes
        validateDateRange(fromDateTime, toDateTime);

        // Limpiar string de búsqueda
        String searchQuery = StringUtils.hasText(q) ? q.trim() : null;
        if (searchQuery != null && searchQuery.isEmpty()) {
            searchQuery = null;
        }

        return repository.findWithFilters(searchQuery, orderStatus, curr,
                                        minTotal, maxTotal, fromDateTime, toDateTime);
    }

    /**
     * Busca una orden por ID
     */
    public PurchaseOrder findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró la orden con ID: " + id));
    }

    /**
     * Obtiene todas las órdenes
     */
    public List<PurchaseOrder> findAll() {
        return repository.findAll();
    }

    /**
     * Elimina una orden por ID
     */
    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("No se encontró la orden con ID: " + id);
        }
        repository.deleteById(id);
    }

    /**
     * Actualiza una orden existente
     */
    public PurchaseOrder update(Long id, PurchaseOrder purchaseOrder) {
        PurchaseOrder existing = findById(id);

        // Verificar que el número de orden no esté siendo usado por otra orden
        if (!existing.getOrderNumber().equals(purchaseOrder.getOrderNumber()) &&
            repository.existsByOrderNumber(purchaseOrder.getOrderNumber())) {
            throw new ValidationException("Ya existe una orden con el número: " + purchaseOrder.getOrderNumber());
        }

        validatePurchaseOrder(purchaseOrder);

        purchaseOrder.setId(id);
        purchaseOrder.setCreatedAt(existing.getCreatedAt()); // Mantener fecha de creación original

        return repository.save(purchaseOrder);
    }

    // Métodos de validación privados

    private void validatePurchaseOrder(PurchaseOrder purchaseOrder) {
        if (purchaseOrder == null) {
            throw new ValidationException("La orden de compra no puede ser null");
        }

        if (purchaseOrder.getTotalAmount() != null &&
            purchaseOrder.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("El monto total debe ser mayor a 0");
        }

        if (purchaseOrder.getExpectedDeliveryDate() != null &&
            purchaseOrder.getExpectedDeliveryDate().isBefore(java.time.LocalDate.now())) {
            throw new ValidationException("La fecha de entrega debe ser futura");
        }
    }

    private OrderStatus validateAndParseStatus(String status) {
        if (!StringUtils.hasText(status)) {
            return null;
        }

        try {
            return OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Estado no válido: " + status +
                    ". Valores permitidos: DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED");
        }
    }

    private Currency validateAndParseCurrency(String currency) {
        if (!StringUtils.hasText(currency)) {
            return null;
        }

        try {
            return Currency.valueOf(currency.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Moneda no válida: " + currency +
                    ". Valores permitidos: USD, EUR");
        }
    }

    private void validateAmounts(BigDecimal minTotal, BigDecimal maxTotal) {
        if (minTotal != null && minTotal.compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidationException("El monto mínimo debe ser mayor o igual a 0");
        }

        if (maxTotal != null && maxTotal.compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidationException("El monto máximo debe ser mayor o igual a 0");
        }

        if (minTotal != null && maxTotal != null && minTotal.compareTo(maxTotal) > 0) {
            throw new ValidationException("El monto mínimo no puede ser mayor al monto máximo");
        }
    }

    private LocalDateTime parseDateTime(String dateTimeStr, String paramName) {
        if (!StringUtils.hasText(dateTimeStr)) {
            return null;
        }

        try {
            return LocalDateTime.parse(dateTimeStr);
        } catch (DateTimeParseException e) {
            throw new ValidationException("Formato de fecha inválido para parámetro '" + paramName +
                    "': " + dateTimeStr + ". Formato esperado: yyyy-MM-ddTHH:mm:ss");
        }
    }

    private void validateDateRange(LocalDateTime from, LocalDateTime to) {
        if (from != null && to != null && from.isAfter(to)) {
            throw new ValidationException("La fecha 'from' no puede ser posterior a la fecha 'to'");
        }
    }
}
