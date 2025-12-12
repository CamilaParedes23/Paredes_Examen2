-- Datos iniciales para la tabla purchase_orders
INSERT INTO purchase_orders (order_number, supplier_name, status, total_amount, currency, created_at, expected_delivery_date) VALUES
('PO-2025-000001', 'ACME Tools', 'DRAFT', 1250.50, 'USD', '2025-12-10T10:30:00', '2026-01-15'),
('PO-2025-000002', 'Tech Supplies Inc', 'SUBMITTED', 2300.75, 'EUR', '2025-12-10T14:20:00', '2026-01-28'),
('PO-2025-000003', 'Global Materials', 'APPROVED', 5500.00, 'USD', '2025-12-11T09:15:00', '2026-02-01'),
('PO-2025-000004', 'ACME Tools', 'REJECTED', 750.25, 'EUR', '2025-12-11T16:45:00', '2026-01-20'),
('PO-2025-000005', 'Industrial Parts Co', 'CANCELLED', 3200.00, 'USD', '2025-12-12T11:10:00', '2026-01-25'),
('PO-2025-000006', 'Office Solutions', 'APPROVED', 890.50, 'EUR', '2025-12-12T08:30:00', '2026-01-10'),
('PO-2025-000007', 'Tech Supplies Inc', 'DRAFT', 1800.75, 'USD', '2025-12-12T13:00:00', '2026-02-05');

