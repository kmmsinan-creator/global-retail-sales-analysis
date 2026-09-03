-- ============================================
-- GLOBAL RETAIL SALES & PROFITABILITY ANALYSIS
-- DATABASE SCHEMA
-- ============================================

-- Create main retail transactions table

CREATE TABLE global_retail (
    category VARCHAR(50),
    city VARCHAR(100),
    country VARCHAR(100),
    customer_id VARCHAR(30),
    customer_name VARCHAR(150),
    discount NUMERIC(5,3),
    market VARCHAR(20),
    order_date DATE,
    order_id VARCHAR(30),
    order_priority VARCHAR(20),
    product_id VARCHAR(50),
    product_name TEXT,
    profit NUMERIC(15,4),
    quantity INTEGER,
    region VARCHAR(100),
    row_id INTEGER PRIMARY KEY,
    sales NUMERIC(15,2),
    segment VARCHAR(50),
    ship_date DATE,
    ship_mode VARCHAR(50),
    shipping_cost NUMERIC(15,3),
    state VARCHAR(100),
    sub_category VARCHAR(50),
    year INTEGER,
    market_group VARCHAR(50),
    week_number INTEGER,
    shipping_days INTEGER
);

-- Verify table structure
SELECT
    ordinal_position,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'global_retail'
ORDER BY ordinal_position;
