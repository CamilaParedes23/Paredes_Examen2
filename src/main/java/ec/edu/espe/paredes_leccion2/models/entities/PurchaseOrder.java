package ec.edu.espe.paredes_leccion2.models.entities;

import ec.edu.espe.paredes_leccion2.models.enums.Currency;
import ec.edu.espe.paredes_leccion2.models.enums.OrderStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad que representa una Orden de Compra
 */
@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    @NotBlank(message = "El número de orden es requerido")
    @Pattern(regexp = "^PO-\\d{4}-\\d{6}$", message = "El formato del número de orden debe ser PO-YYYY-XXXXXX")
    private String orderNumber;

    @Column(nullable = false, length = 255)
    @NotBlank(message = "El nombre del proveedor es requerido")
    @Size(max = 255, message = "El nombre del proveedor no puede exceder 255 caracteres")
    private String supplierName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "El estado es requerido")
    private OrderStatus status;

    @Column(nullable = false, precision = 19, scale = 2)
    @NotNull(message = "El monto total es requerido")
    @DecimalMin(value = "0.0", inclusive = false, message = "El monto total debe ser mayor a 0")
    @Digits(integer = 17, fraction = 2, message = "El formato del monto no es válido")
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "La moneda es requerida")
    private Currency currency;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @NotNull(message = "La fecha de entrega esperada es requerida")
    @Future(message = "La fecha de entrega debe ser futura")
    private LocalDate expectedDeliveryDate;

    // Constructor por defecto
    public PurchaseOrder() {
        this.createdAt = LocalDateTime.now();
        this.status = OrderStatus.DRAFT;
    }

    // Constructor con parámetros
    public PurchaseOrder(String orderNumber, String supplierName, BigDecimal totalAmount,
                        Currency currency, LocalDate expectedDeliveryDate) {
        this();
        this.orderNumber = orderNumber;
        this.supplierName = supplierName;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.expectedDeliveryDate = expectedDeliveryDate;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = OrderStatus.DRAFT;
        }
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Currency getCurrency() {
        return currency;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getExpectedDeliveryDate() {
        return expectedDeliveryDate;
    }

    public void setExpectedDeliveryDate(LocalDate expectedDeliveryDate) {
        this.expectedDeliveryDate = expectedDeliveryDate;
    }

    @Override
    public String toString() {
        return "PurchaseOrder{" +
                "id=" + id +
                ", orderNumber='" + orderNumber + '\'' +
                ", supplierName='" + supplierName + '\'' +
                ", status=" + status +
                ", totalAmount=" + totalAmount +
                ", currency=" + currency +
                ", createdAt=" + createdAt +
                ", expectedDeliveryDate=" + expectedDeliveryDate +
                '}';
    }
}
