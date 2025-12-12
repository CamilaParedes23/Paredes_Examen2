package ec.edu.espe.paredes_leccion2.repositories;

import ec.edu.espe.paredes_leccion2.models.entities.PurchaseOrder;
import ec.edu.espe.paredes_leccion2.models.enums.Currency;
import ec.edu.espe.paredes_leccion2.models.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio para la entidad PurchaseOrder
 */
@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    /**
     * Busca órdenes por número de orden o nombre de proveedor (case-insensitive)
     */
    @Query("SELECT po FROM PurchaseOrder po WHERE " +
           "(:q IS NULL OR :q = '' OR " +
           "LOWER(po.orderNumber) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(po.supplierName) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<PurchaseOrder> findBySearchQuery(@Param("q") String q);

    /**
     * Busca órdenes aplicando todos los filtros posibles
     */
    @Query("SELECT po FROM PurchaseOrder po WHERE " +
           "(:q IS NULL OR :q = '' OR " +
           "LOWER(po.orderNumber) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(po.supplierName) LIKE LOWER(CONCAT('%', :q, '%'))) AND " +
           "(:status IS NULL OR po.status = :status) AND " +
           "(:currency IS NULL OR po.currency = :currency) AND " +
           "(:minTotal IS NULL OR po.totalAmount >= :minTotal) AND " +
           "(:maxTotal IS NULL OR po.totalAmount <= :maxTotal) AND " +
           "(:from IS NULL OR po.createdAt >= :from) AND " +
           "(:to IS NULL OR po.createdAt <= :to)")
    List<PurchaseOrder> findWithFilters(@Param("q") String q,
                                       @Param("status") OrderStatus status,
                                       @Param("currency") Currency currency,
                                       @Param("minTotal") BigDecimal minTotal,
                                       @Param("maxTotal") BigDecimal maxTotal,
                                       @Param("from") LocalDateTime from,
                                       @Param("to") LocalDateTime to);

    /**
     * Verifica si existe una orden con el número dado (para validar unicidad)
     */
    boolean existsByOrderNumber(String orderNumber);

    /**
     * Busca por estado
     */
    List<PurchaseOrder> findByStatus(OrderStatus status);

    /**
     * Busca por moneda
     */
    List<PurchaseOrder> findByCurrency(Currency currency);

    /**
     * Busca órdenes en un rango de montos
     */
    List<PurchaseOrder> findByTotalAmountBetween(BigDecimal minAmount, BigDecimal maxAmount);

    /**
     * Busca órdenes creadas en un rango de fechas
     */
    List<PurchaseOrder> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
}
