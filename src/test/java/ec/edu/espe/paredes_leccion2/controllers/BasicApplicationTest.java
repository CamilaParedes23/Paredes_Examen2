package ec.edu.espe.paredes_leccion2.controllers;

import ec.edu.espe.paredes_leccion2.models.entities.PurchaseOrder;
import ec.edu.espe.paredes_leccion2.models.enums.Currency;
import ec.edu.espe.paredes_leccion2.models.enums.OrderStatus;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas básicas para la aplicación
 */
@SpringBootTest
public class BasicApplicationTest {

    @Test
    public void testPurchaseOrderCreation() {
        // Test básico de creación de entidad
        PurchaseOrder order = new PurchaseOrder();
        order.setSupplierName("ACME Tools");
        order.setTotalAmount(new BigDecimal("1250.50"));
        order.setCurrency(Currency.USD);
        order.setExpectedDeliveryDate(LocalDate.now().plusDays(30));

        assertNotNull(order);
        assertEquals("ACME Tools", order.getSupplierName());
        assertEquals(Currency.USD, order.getCurrency());
        assertEquals(OrderStatus.DRAFT, order.getStatus());
    }

    @Test
    public void testOrderStatusEnum() {
        assertEquals(5, OrderStatus.values().length);
        assertNotNull(OrderStatus.valueOf("DRAFT"));
        assertNotNull(OrderStatus.valueOf("APPROVED"));
    }

    @Test
    public void testCurrencyEnum() {
        assertEquals(2, Currency.values().length);
        assertNotNull(Currency.valueOf("USD"));
        assertNotNull(Currency.valueOf("EUR"));
    }
}
