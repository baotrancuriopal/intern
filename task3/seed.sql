BEGIN;

-- Xóa dữ liệu cũ (nếu có)
TRUNCATE TABLE order_items, orders, products, customers
RESTART IDENTITY CASCADE;

-------------------------------------------------------
-- Customers
-------------------------------------------------------
INSERT INTO customers (full_name, email, phone)
VALUES
    ('Alice Nguyen', 'alice@example.com', '0901234567'),
    ('Bob Tran', 'bob@example.com', '0912345678'),
    ('Charlie Le', 'charlie@example.com', '0987654321'),
    ('David Pham', 'david@example.com', '0978123456'),
    ('Emma Hoang', 'emma@example.com', NULL);

-------------------------------------------------------
-- Products
-------------------------------------------------------
INSERT INTO products (
    name,
    description,
    sku,
    price,
    stock_quantity
)
VALUES
    (
        'Mechanical Keyboard',
        'RGB mechanical keyboard with blue switches',
        'KEYBOARD-001',
        89.99,
        25
    ),
    (
        'Wireless Mouse',
        'Ergonomic wireless mouse',
        'MOUSE-001',
        39.50,
        50
    ),
    (
        'USB-C Hub',
        '7-port USB-C hub',
        'HUB-001',
        59.00,
        30
    ),
    (
        'Laptop Stand',
        'Adjustable aluminum laptop stand',
        'STAND-001',
        45.00,
        15
    ),
    (
        '27-inch Monitor',
        '4K IPS monitor',
        'MONITOR-001',
        299.99,
        12
    );

-------------------------------------------------------
-- Orders
-------------------------------------------------------
INSERT INTO orders (
    customer_id,
    status,
    shipping_address,
    ordered_at
)
VALUES
    (
        1,
        'paid',
        '12 Nguyen Hue Street, Ho Chi Minh City',
        '2026-07-18 09:30:00+07'
    ),
    (
        2,
        'shipped',
        '25 Le Loi Street, Ho Chi Minh City',
        '2026-07-19 14:15:00+07'
    ),
    (
        1,
        'pending',
        '12 Nguyen Hue Street, Ho Chi Minh City',
        '2026-07-20 10:00:00+07'
    ),
    (
        3,
        'completed',
        '8 Hai Ba Trung Street, Da Nang',
        '2026-07-21 16:20:00+07'
    );

-------------------------------------------------------
-- Order Items
-------------------------------------------------------
INSERT INTO order_items (
    order_id,
    product_id,
    quantity,
    unit_price
)
VALUES
    -- Order #1
    (1, 1, 1, 89.99),
    (1, 2, 2, 39.50),

    -- Order #2
    (2, 3, 1, 59.00),
    (2, 5, 1, 299.99),

    -- Order #3
    (3, 2, 1, 39.50),
    (3, 4, 1, 45.00),

    -- Order #4
    (4, 1, 1, 89.99),
    (4, 3, 2, 59.00),
    (4, 5, 1, 299.99);

COMMIT;