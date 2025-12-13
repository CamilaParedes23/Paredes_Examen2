-- Datos de prueba para la aplicación de órdenes de compra (MySQL)
-- Nota: Con ddl-auto=update, la tabla se crea automáticamente si no existe

INSERT IGNORE INTO purchase_orders (order_number, supplier_name, status, total_amount, currency, created_at, expected_delivery_date) VALUES
('PO-2025-000001', 'ACME Tools Inc.', 'APPROVED', 1250.50, 'USD', '2025-01-01 10:00:00', '2025-02-01'),
('PO-2025-000002', 'Global Supplies Ltd.', 'DRAFT', 850.25, 'EUR', '2025-01-02 14:30:00', '2025-02-15'),
('PO-2025-000003', 'Tech Components SA', 'SUBMITTED', 2150.75, 'USD', '2025-01-03 09:15:00', '2025-01-25'),
('PO-2025-000004', 'Office Depot Corp', 'REJECTED', 450.00, 'EUR', '2025-01-04 16:45:00', '2025-02-10'),
('PO-2025-000005', 'Industrial Materials LLC', 'CANCELLED', 3200.00, 'USD', '2025-01-05 11:20:00', '2025-03-01'),
('PO-2025-000006', 'European Distributors', 'APPROVED', 1850.30, 'EUR', '2025-01-06 13:10:00', '2025-02-20'),
('PO-2025-000007', 'ACME Electronics', 'DRAFT', 675.40, 'USD', '2025-01-07 08:00:00', '2025-02-05'),
('PO-2025-000008', 'Supply Chain Masters', 'APPROVED', 4250.60, 'USD', '2025-01-08 15:30:00', '2025-02-28');

