/*Find the revenue per month*/
SELECT
    DATE_TRUNC('month', o.ordered_at) AS revenue_month,
    ROUND(
        SUM(oi.quantity * oi.unit_price),
        2
    ) AS total_revenue
FROM orders AS o
INNER JOIN order_items AS oi
    ON oi.order_id = o.id
WHERE o.status IN (
    'paid',
    'processing',
    'shipped',
    'completed'
)
GROUP BY DATE_TRUNC('month', o.ordered_at)
ORDER BY revenue_month;

/*Find money each customer spend*/
SELECT
    c.id AS customer_id,
    c.full_name,
    c.email,
    ROUND(
        SUM(oi.quantity * oi.unit_price),
        2
    ) AS total_spend
FROM customers AS c
INNER JOIN orders AS o
    ON o.customer_id = c.id
INNER JOIN order_items AS oi
    ON oi.order_id = o.id
WHERE o.status IN (
    'paid',
    'processing',
    'shipped',
    'completed'
)
GROUP BY
    c.id,
    c.full_name,
    c.email
ORDER BY total_spend DESC
LIMIT 5;
/*Find the product not ordered - means not available in order_item*/
SELECT
    p.id AS product_id,
    p.name,
    p.sku,
    p.price,
    p.stock_quantity
FROM products AS p
LEFT JOIN order_items AS oi
    ON oi.product_id = p.id
WHERE oi.product_id IS NULL
ORDER BY p.id;

/*average order value by customer*/
WITH order_totals AS (
    SELECT
        o.id AS order_id,
        o.customer_id,
        SUM(oi.quantity * oi.unit_price) AS order_total
    FROM orders AS o
    INNER JOIN order_items AS oi
        ON oi.order_id = o.id
    WHERE o.status IN (
        'paid',
        'processing',
        'shipped',
        'completed'
    )
    GROUP BY
        o.id,
        o.customer_id
)
SELECT
    c.id AS customer_id,
    c.full_name,
    COUNT(ot.order_id) AS total_orders,
    ROUND(
        AVG(ot.order_total),
        2
    ) AS average_order_value
FROM customers AS c
INNER JOIN order_totals AS ot
    ON ot.customer_id = c.id
GROUP BY
    c.id,
    c.full_name
ORDER BY average_order_value DESC;
/*my own: customer order means need left join to have all customer (even not have any order)*/
SELECT
    c.id AS customer_id,
    c.full_name,
    c.email,
    COUNT(DISTINCT o.id) AS total_orders,
    COALESCE(
        SUM(oi.quantity * oi.unit_price),
        0
    ) AS lifetime_spend,
    MAX(o.ordered_at) AS latest_order_at
FROM customers AS c
LEFT JOIN orders AS o
    ON o.customer_id = c.id
LEFT JOIN order_items AS oi
    ON oi.order_id = o.id
GROUP BY
    c.id,
    c.full_name,
    c.email
ORDER BY
    lifetime_spend DESC,
    c.id;