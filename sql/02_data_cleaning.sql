-- ============================================
-- GLOBAL RETAIL SALES & PROFITABILITY ANALYSIS
-- DATA CLEANING AND QUALITY VALIDATION
-- ============================================


-- 1. Check Total Number of Records
SELECT COUNT(*) AS total_records
FROM global_retail;


-- 2. Check Missing Values in Key Columns
SELECT
    COUNT(*) FILTER (WHERE category IS NULL) AS category_nulls,
    COUNT(*) FILTER (WHERE city IS NULL) AS city_nulls,
    COUNT(*) FILTER (WHERE country IS NULL) AS country_nulls,
    COUNT(*) FILTER (WHERE customer_id IS NULL) AS customer_id_nulls,
    COUNT(*) FILTER (WHERE order_date IS NULL) AS order_date_nulls,
    COUNT(*) FILTER (WHERE product_id IS NULL) AS product_id_nulls,
    COUNT(*) FILTER (WHERE sales IS NULL) AS sales_nulls,
    COUNT(*) FILTER (WHERE profit IS NULL) AS profit_nulls
FROM global_retail;


-- 3. Check for Duplicate Row IDs
SELECT
    COUNT(*) AS duplicate_rows
FROM (
    SELECT row_id
    FROM global_retail
    GROUP BY row_id
    HAVING COUNT(*) > 1
) duplicates;


-- 4. Validate Shipping Dates
-- Shipping date should not be earlier than order date
SELECT COUNT(*) AS invalid_shipping_records
FROM global_retail
WHERE ship_date < order_date;


-- 5. Check Negative and Zero Sales
SELECT
    COUNT(*) FILTER (WHERE sales < 0) AS negative_sales,
    COUNT(*) FILTER (WHERE sales = 0) AS zero_sales
FROM global_retail;


-- 6. Validate Quantity Values
SELECT
    COUNT(*) FILTER (WHERE quantity <= 0) AS invalid_quantity_records,
    MIN(quantity) AS minimum_quantity,
    MAX(quantity) AS maximum_quantity
FROM global_retail;


-- 7. Analyze Profit Distribution
-- Negative profit represents legitimate loss-making transactions
SELECT
    COUNT(*) FILTER (WHERE profit < 0) AS loss_making_transactions,
    COUNT(*) FILTER (WHERE profit = 0) AS zero_profit_transactions,
    COUNT(*) FILTER (WHERE profit > 0) AS profitable_transactions
FROM global_retail;


-- 8. Validate Shipping Duration
SELECT COUNT(*) AS shipping_days_mismatch
FROM global_retail
WHERE shipping_days <> (ship_date - order_date);


-- ============================================
-- DATA QUALITY SUMMARY
-- ============================================

-- Key Findings:
-- 1. Dataset was checked for missing values in critical columns.
-- 2. Duplicate Row IDs were checked.
-- 3. Shipping dates were validated against order dates.
-- 4. Sales values were checked for invalid negative or zero values.
-- 5. Quantity values were validated.
-- 6. Loss-making transactions were retained as legitimate business records.
-- 7. Shipping duration was validated using order and ship dates.
