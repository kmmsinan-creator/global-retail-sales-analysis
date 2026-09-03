-- ============================================
-- GLOBAL RETAIL SALES & PROFITABILITY ANALYSIS
-- BUSINESS ANALYSIS
-- ============================================


-- ============================================
-- 1. OVERALL BUSINESS PERFORMANCE
-- ============================================

SELECT
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    COUNT(DISTINCT order_id) AS total_orders,
    COUNT(DISTINCT customer_id) AS total_customers,
    SUM(quantity) AS total_quantity_sold,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS overall_profit_margin
FROM global_retail;


-- ============================================
-- 2. YEARLY PERFORMANCE ANALYSIS
-- ============================================

SELECT
    year,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY year
ORDER BY year;


-- ============================================
-- 3. YEAR-OVER-YEAR GROWTH ANALYSIS
-- Demonstrates CTE and LAG() window function
-- ============================================

WITH yearly_performance AS (
    SELECT
        year,
        SUM(sales) AS total_sales,
        SUM(profit) AS total_profit
    FROM global_retail
    GROUP BY year
)

SELECT
    year,
    ROUND(total_sales, 2) AS total_sales,
    ROUND(total_profit, 2) AS total_profit,

    ROUND(
        (
            (total_sales - LAG(total_sales) OVER (ORDER BY year))
            / NULLIF(LAG(total_sales) OVER (ORDER BY year), 0)
        ) * 100,
        2
    ) AS sales_growth_percentage,

    ROUND(
        (
            (total_profit - LAG(total_profit) OVER (ORDER BY year))
            / NULLIF(LAG(total_profit) OVER (ORDER BY year), 0)
        ) * 100,
        2
    ) AS profit_growth_percentage

FROM yearly_performance
ORDER BY year;


-- ============================================
-- 4. MONTHLY PERFORMANCE ANALYSIS
-- ============================================

SELECT
    EXTRACT(MONTH FROM order_date) AS month_number,
    TO_CHAR(order_date, 'FMMonth') AS month_name,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY
    EXTRACT(MONTH FROM order_date),
    TO_CHAR(order_date, 'FMMonth')
ORDER BY month_number;


-- ============================================
-- 5. MONTHLY PERFORMANCE RANKING
-- Demonstrates RANK() window function
-- ============================================

WITH monthly_performance AS (
    SELECT
        EXTRACT(MONTH FROM order_date) AS month_number,
        TO_CHAR(order_date, 'FMMonth') AS month_name,
        SUM(sales) AS total_sales,
        SUM(profit) AS total_profit
    FROM global_retail
    GROUP BY
        EXTRACT(MONTH FROM order_date),
        TO_CHAR(order_date, 'FMMonth')
)

SELECT
    month_number,
    month_name,
    ROUND(total_sales, 2) AS total_sales,
    ROUND(total_profit, 2) AS total_profit,
    RANK() OVER (ORDER BY total_sales DESC) AS sales_rank,
    RANK() OVER (ORDER BY total_profit DESC) AS profit_rank
FROM monthly_performance
ORDER BY sales_rank;


-- ============================================
-- 6. QUARTERLY PERFORMANCE ANALYSIS
-- ============================================

SELECT
    EXTRACT(QUARTER FROM order_date) AS quarter,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY EXTRACT(QUARTER FROM order_date)
ORDER BY quarter;


-- ============================================
-- 7. MARKET PERFORMANCE ANALYSIS
-- ============================================

SELECT
    market_group,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    COUNT(DISTINCT order_id) AS total_orders,
    COUNT(DISTINCT customer_id) AS total_customers,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY market_group
ORDER BY total_sales DESC;


-- ============================================
-- 8. MARKET PERFORMANCE RANKING
-- ============================================

WITH market_performance AS (
    SELECT
        market_group,
        SUM(sales) AS total_sales,
        SUM(profit) AS total_profit,
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100 AS profit_margin
    FROM global_retail
    GROUP BY market_group
)

SELECT
    market_group,
    ROUND(total_sales, 2) AS total_sales,
    ROUND(total_profit, 2) AS total_profit,
    ROUND(profit_margin, 2) AS profit_margin,
    RANK() OVER (ORDER BY total_sales DESC) AS sales_rank,
    RANK() OVER (ORDER BY total_profit DESC) AS profit_rank,
    RANK() OVER (ORDER BY profit_margin DESC) AS margin_rank
FROM market_performance
ORDER BY sales_rank;


-- ============================================
-- 9. REGIONAL PERFORMANCE ANALYSIS
-- ============================================

SELECT
    region,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY region
ORDER BY total_sales DESC;


-- ============================================
-- 10. COUNTRY PERFORMANCE ANALYSIS
-- Top 15 countries by sales
-- ============================================

SELECT
    country,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY country
ORDER BY total_sales DESC
LIMIT 15;


-- ============================================
-- 11. CATEGORY PERFORMANCE ANALYSIS
-- ============================================

SELECT
    category,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    SUM(quantity) AS total_quantity,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY category
ORDER BY total_sales DESC;


-- ============================================
-- 12. SUB-CATEGORY PERFORMANCE ANALYSIS
-- ============================================

SELECT
    sub_category,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    SUM(quantity) AS total_quantity,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY sub_category
ORDER BY total_sales DESC;


-- ============================================
-- 13. LOSS-MAKING SUB-CATEGORIES
-- ============================================

SELECT
    sub_category,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY sub_category
HAVING SUM(profit) < 0
ORDER BY total_profit;


-- ============================================
-- 14. TOP 10 PRODUCTS BY SALES
-- ============================================

SELECT
    product_name,
    category,
    sub_category,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    SUM(quantity) AS total_quantity_sold
FROM global_retail
GROUP BY
    product_name,
    category,
    sub_category
ORDER BY total_sales DESC
LIMIT 10;


-- ============================================
-- 15. TOP 10 MOST PROFITABLE PRODUCTS
-- ============================================

SELECT
    product_name,
    category,
    sub_category,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY
    product_name,
    category,
    sub_category
ORDER BY total_profit DESC
LIMIT 10;


-- ============================================
-- 16. TOP 10 LOSS-MAKING PRODUCTS
-- ============================================

SELECT
    product_name,
    category,
    sub_category,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit
FROM global_retail
GROUP BY
    product_name,
    category,
    sub_category
ORDER BY total_profit ASC
LIMIT 10;


-- ============================================
-- 17. CUSTOMER SEGMENT PERFORMANCE
-- ============================================

SELECT
    segment,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    COUNT(DISTINCT customer_id) AS total_customers,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY segment
ORDER BY total_sales DESC;


-- ============================================
-- 18. TOP 10 CUSTOMERS BY SALES
-- ============================================

SELECT
    customer_id,
    customer_name,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    COUNT(DISTINCT order_id) AS total_orders
FROM global_retail
GROUP BY
    customer_id,
    customer_name
ORDER BY total_sales DESC
LIMIT 10;


-- ============================================
-- 19. TOP 10 CUSTOMERS BY PROFIT
-- ============================================

SELECT
    customer_id,
    customer_name,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    COUNT(DISTINCT order_id) AS total_orders
FROM global_retail
GROUP BY
    customer_id,
    customer_name
ORDER BY total_profit DESC
LIMIT 10;


-- ============================================
-- 20. DISCOUNT IMPACT ON PROFITABILITY
-- ============================================

SELECT
    ROUND(discount * 100, 2) AS discount_percentage,
    COUNT(*) AS transactions,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    ROUND(AVG(profit), 2) AS average_profit,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY discount
ORDER BY discount;


-- ============================================
-- 21. DISCOUNT GROUP PROFITABILITY
-- Demonstrates CASE WHEN
-- ============================================

SELECT
    CASE
        WHEN discount = 0 THEN '0%'
        WHEN discount <= 0.10 THEN '1-10%'
        WHEN discount <= 0.20 THEN '11-20%'
        WHEN discount <= 0.30 THEN '21-30%'
        WHEN discount <= 0.40 THEN '31-40%'
        WHEN discount <= 0.50 THEN '41-50%'
        ELSE '50%+'
    END AS discount_group,

    COUNT(*) AS transactions,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    ROUND(AVG(profit), 2) AS avg_profit,

    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin

FROM global_retail

GROUP BY
    CASE
        WHEN discount = 0 THEN '0%'
        WHEN discount <= 0.10 THEN '1-10%'
        WHEN discount <= 0.20 THEN '11-20%'
        WHEN discount <= 0.30 THEN '21-30%'
        WHEN discount <= 0.40 THEN '31-40%'
        WHEN discount <= 0.50 THEN '41-50%'
        ELSE '50%+'
    END

ORDER BY MIN(discount);


-- ============================================
-- 22. SHIPPING MODE PERFORMANCE
-- ============================================

SELECT
    ship_mode,
    COUNT(*) AS transactions,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    ROUND(AVG(shipping_days), 2) AS avg_shipping_days,
    ROUND(AVG(shipping_cost), 2) AS avg_shipping_cost,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY ship_mode
ORDER BY total_sales DESC;


-- ============================================
-- 23. ORDER PRIORITY ANALYSIS
-- ============================================

SELECT
    order_priority,
    COUNT(*) AS transactions,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY order_priority
ORDER BY total_sales DESC;


-- ============================================
-- 24. PROFITABILITY BY MARKET AND CATEGORY
-- ============================================

SELECT
    market_group,
    category,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    ROUND(
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100,
        2
    ) AS profit_margin
FROM global_retail
GROUP BY
    market_group,
    category
ORDER BY
    market_group,
    total_sales DESC;


-- ============================================
-- 25. TOP 3 PRODUCTS BY SALES IN EACH CATEGORY
-- Demonstrates PARTITION BY and DENSE_RANK()
-- ============================================

WITH product_sales AS (
    SELECT
        category,
        product_name,
        SUM(sales) AS total_sales,
        SUM(profit) AS total_profit
    FROM global_retail
    GROUP BY
        category,
        product_name
),

ranked_products AS (
    SELECT
        category,
        product_name,
        total_sales,
        total_profit,
        DENSE_RANK() OVER (
            PARTITION BY category
            ORDER BY total_sales DESC
        ) AS sales_rank
    FROM product_sales
)

SELECT
    category,
    product_name,
    ROUND(total_sales, 2) AS total_sales,
    ROUND(total_profit, 2) AS total_profit,
    sales_rank
FROM ranked_products
WHERE sales_rank <= 3
ORDER BY
    category,
    sales_rank;


-- ============================================
-- 26. CUMULATIVE MONTHLY SALES
-- Demonstrates SUM() OVER()
-- ============================================

WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', order_date)::DATE AS month,
        SUM(sales) AS monthly_sales
    FROM global_retail
    GROUP BY DATE_TRUNC('month', order_date)::DATE
)

SELECT
    month,
    ROUND(monthly_sales, 2) AS monthly_sales,
    ROUND(
        SUM(monthly_sales) OVER (
            ORDER BY month
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ),
        2
    ) AS cumulative_sales
FROM monthly_sales
ORDER BY month;


-- ============================================
-- 27. CUSTOMER LIFETIME VALUE ANALYSIS
-- ============================================

SELECT
    customer_id,
    customer_name,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(SUM(sales), 2) AS customer_lifetime_sales,
    ROUND(SUM(profit), 2) AS customer_lifetime_profit,
    ROUND(AVG(sales), 2) AS average_transaction_value
FROM global_retail
GROUP BY
    customer_id,
    customer_name
ORDER BY customer_lifetime_sales DESC
LIMIT 20;


-- ============================================
-- 28. HIGH SALES BUT LOW PROFITABILITY
-- Identify potentially inefficient markets
-- ============================================

WITH market_metrics AS (
    SELECT
        market_group,
        SUM(sales) AS total_sales,
        SUM(profit) AS total_profit,
        (SUM(profit) / NULLIF(SUM(sales), 0)) * 100 AS profit_margin
    FROM global_retail
    GROUP BY market_group
),

company_average AS (
    SELECT AVG(profit_margin) AS avg_profit_margin
    FROM market_metrics
)

SELECT
    m.market_group,
    ROUND(m.total_sales, 2) AS total_sales,
    ROUND(m.total_profit, 2) AS total_profit,
    ROUND(m.profit_margin, 2) AS profit_margin,
    ROUND(c.avg_profit_margin, 2) AS company_avg_margin
FROM market_metrics m
CROSS JOIN company_average c
WHERE m.profit_margin < c.avg_profit_margin
ORDER BY m.total_sales DESC;


-- ============================================
-- END OF BUSINESS ANALYSIS
-- ============================================
