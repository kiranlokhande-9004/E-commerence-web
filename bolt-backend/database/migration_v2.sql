-- ====================================================================
-- BOLT 2.0 SAFE DATABASE MIGRATION SCRIPT FOR MYSQL WORKBENCH
-- Database: bolt_db
-- Target: Local MySQL Server (localhost:3306)
-- Compatibility: MySQL 8.0+
-- Safety: 100% Non-destructive (Adds missing columns, preserves existing data)
-- ====================================================================

-- 1. SELECT OR CREATE DATABASE
CREATE DATABASE IF NOT EXISTS bolt_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bolt_db;

-- ====================================================================
-- 2. CREATE MISSING BASE TABLES IF THEY DO NOT EXIST YET
-- ====================================================================

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    item_count_text VARCHAR(50) DEFAULT '0 Items',
    icon_name VARCHAR(50) DEFAULT 'tag',
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100) NOT NULL DEFAULT 'BOLT',
    category_id VARCHAR(50) NOT NULL DEFAULT 'accessories',
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    original_price DECIMAL(10, 2),
    discount_percent INT DEFAULT 0,
    rating DECIMAL(3, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    description TEXT,
    badge VARCHAR(50),
    in_stock BOOLEAN DEFAULT TRUE,
    stock_count INT DEFAULT 0,
    images JSON,
    image VARCHAR(255),
    model_url VARCHAR(255),
    sku VARCHAR(100),
    features JSON,
    sizes JSON,
    colors JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL DEFAULT '',
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL DEFAULT '',
    role VARCHAR(50) DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    selected_size VARCHAR(50),
    selected_color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Wishlist Items Table
CREATE TABLE IF NOT EXISTS wishlist_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_product (user_id, product_id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    shipping DECIMAL(10, 2) DEFAULT 0.00,
    tax DECIMAL(10, 2) DEFAULT 0.00,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Processing',
    shipping_full_name VARCHAR(150) NOT NULL DEFAULT '',
    shipping_email VARCHAR(191) NOT NULL DEFAULT '',
    shipping_phone VARCHAR(50) NOT NULL DEFAULT '',
    shipping_address_line1 VARCHAR(255) NOT NULL DEFAULT '',
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100) NOT NULL DEFAULT '',
    shipping_state VARCHAR(100) NOT NULL DEFAULT '',
    shipping_postal_code VARCHAR(50) NOT NULL DEFAULT '',
    shipping_country VARCHAR(100) NOT NULL DEFAULT '',
    tracking_number VARCHAR(100),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Credit Card',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(100) NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(200) NOT NULL DEFAULT '',
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantity INT NOT NULL DEFAULT 1,
    selected_size VARCHAR(50),
    selected_color VARCHAR(50)
);

-- ====================================================================
-- 3. SAFE STORED PROCEDURE TO ADD MISSING COLUMNS WITHOUT DATA LOSS
-- ====================================================================

DELIMITER $$

DROP PROCEDURE IF EXISTS AddColumnIfNotExists $$
CREATE PROCEDURE AddColumnIfNotExists(
    IN p_table_name VARCHAR(64),
    IN p_column_name VARCHAR(64),
    IN p_column_def VARCHAR(255)
)
BEGIN
    DECLARE col_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO col_count
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = p_table_name
      AND COLUMN_NAME = p_column_name;

    IF col_count = 0 THEN
        SET @alter_stmt = CONCAT('ALTER TABLE `', p_table_name, '` ADD COLUMN `', p_column_name, '` ', p_column_def);
        PREPARE stmt FROM @alter_stmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$

DELIMITER ;

-- ====================================================================
-- 4. MIGRATE 'products' TABLE (Add all missing backend & API columns)
-- ====================================================================
CALL AddColumnIfNotExists('products', 'brand', 'VARCHAR(100) NOT NULL DEFAULT "BOLT"');
CALL AddColumnIfNotExists('products', 'category_id', 'VARCHAR(50) NOT NULL DEFAULT "accessories"');
CALL AddColumnIfNotExists('products', 'category', 'VARCHAR(100) DEFAULT NULL');
CALL AddColumnIfNotExists('products', 'price', 'DECIMAL(10, 2) NOT NULL DEFAULT 0.00');
CALL AddColumnIfNotExists('products', 'original_price', 'DECIMAL(10, 2) DEFAULT NULL');
CALL AddColumnIfNotExists('products', 'discount_percent', 'INT DEFAULT 0');
CALL AddColumnIfNotExists('products', 'rating', 'DECIMAL(3, 1) DEFAULT 5.0');
CALL AddColumnIfNotExists('products', 'reviews_count', 'INT DEFAULT 0');
CALL AddColumnIfNotExists('products', 'description', 'TEXT DEFAULT NULL');
CALL AddColumnIfNotExists('products', 'badge', 'VARCHAR(50) DEFAULT NULL');
CALL AddColumnIfNotExists('products', 'in_stock', 'BOOLEAN DEFAULT TRUE');
CALL AddColumnIfNotExists('products', 'stock_count', 'INT DEFAULT 0');
CALL AddColumnIfNotExists('products', 'image', 'VARCHAR(255) DEFAULT NULL');
CALL AddColumnIfNotExists('products', 'images', 'JSON DEFAULT NULL');
CALL AddColumnIfNotExists('products', 'model_url', 'VARCHAR(255) DEFAULT NULL');
CALL AddColumnIfNotExists('products', 'sku', 'VARCHAR(100) DEFAULT NULL');
CALL AddColumnIfNotExists('products', 'features', 'JSON DEFAULT NULL');
CALL AddColumnIfNotExists('products', 'sizes', 'JSON DEFAULT NULL');
CALL AddColumnIfNotExists('products', 'colors', 'JSON DEFAULT NULL');
CALL AddColumnIfNotExists('products', 'created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
CALL AddColumnIfNotExists('products', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');

-- ====================================================================
-- 5. MIGRATE RELATED TABLES (Categories, Users, Orders, Cart)
-- ====================================================================

-- Categories columns
CALL AddColumnIfNotExists('categories', 'item_count_text', 'VARCHAR(50) DEFAULT "0 Items"');
CALL AddColumnIfNotExists('categories', 'icon_name', 'VARCHAR(50) DEFAULT "tag"');
CALL AddColumnIfNotExists('categories', 'image', 'VARCHAR(255) DEFAULT NULL');
CALL AddColumnIfNotExists('categories', 'created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');

-- Users columns
CALL AddColumnIfNotExists('users', 'role', 'VARCHAR(50) DEFAULT "CUSTOMER"');
CALL AddColumnIfNotExists('users', 'created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
CALL AddColumnIfNotExists('users', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');

-- Cart Items columns
CALL AddColumnIfNotExists('cart_items', 'selected_size', 'VARCHAR(50) DEFAULT NULL');
CALL AddColumnIfNotExists('cart_items', 'selected_color', 'VARCHAR(50) DEFAULT NULL');
CALL AddColumnIfNotExists('cart_items', 'created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
CALL AddColumnIfNotExists('cart_items', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');

-- Wishlist Items columns
CALL AddColumnIfNotExists('wishlist_items', 'created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');

-- Orders columns
CALL AddColumnIfNotExists('orders', 'subtotal', 'DECIMAL(10, 2) NOT NULL DEFAULT 0.00');
CALL AddColumnIfNotExists('orders', 'shipping', 'DECIMAL(10, 2) DEFAULT 0.00');
CALL AddColumnIfNotExists('orders', 'tax', 'DECIMAL(10, 2) DEFAULT 0.00');
CALL AddColumnIfNotExists('orders', 'discount', 'DECIMAL(10, 2) DEFAULT 0.00');
CALL AddColumnIfNotExists('orders', 'total', 'DECIMAL(10, 2) NOT NULL DEFAULT 0.00');
CALL AddColumnIfNotExists('orders', 'status', 'VARCHAR(50) DEFAULT "Processing"');
CALL AddColumnIfNotExists('orders', 'shipping_full_name', 'VARCHAR(150) NOT NULL DEFAULT ""');
CALL AddColumnIfNotExists('orders', 'shipping_email', 'VARCHAR(191) NOT NULL DEFAULT ""');
CALL AddColumnIfNotExists('orders', 'shipping_phone', 'VARCHAR(50) NOT NULL DEFAULT ""');
CALL AddColumnIfNotExists('orders', 'shipping_address_line1', 'VARCHAR(255) NOT NULL DEFAULT ""');
CALL AddColumnIfNotExists('orders', 'shipping_address_line2', 'VARCHAR(255) DEFAULT NULL');
CALL AddColumnIfNotExists('orders', 'shipping_city', 'VARCHAR(100) NOT NULL DEFAULT ""');
CALL AddColumnIfNotExists('orders', 'shipping_state', 'VARCHAR(100) NOT NULL DEFAULT ""');
CALL AddColumnIfNotExists('orders', 'shipping_postal_code', 'VARCHAR(50) NOT NULL DEFAULT ""');
CALL AddColumnIfNotExists('orders', 'shipping_country', 'VARCHAR(100) NOT NULL DEFAULT ""');
CALL AddColumnIfNotExists('orders', 'tracking_number', 'VARCHAR(100) DEFAULT NULL');
CALL AddColumnIfNotExists('orders', 'payment_method', 'VARCHAR(50) NOT NULL DEFAULT "Credit Card"');
CALL AddColumnIfNotExists('orders', 'created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');

-- Order Items columns
CALL AddColumnIfNotExists('order_items', 'product_name', 'VARCHAR(200) NOT NULL DEFAULT ""');
CALL AddColumnIfNotExists('order_items', 'unit_price', 'DECIMAL(10, 2) NOT NULL DEFAULT 0.00');
CALL AddColumnIfNotExists('order_items', 'quantity', 'INT NOT NULL DEFAULT 1');
CALL AddColumnIfNotExists('order_items', 'selected_size', 'VARCHAR(50) DEFAULT NULL');
CALL AddColumnIfNotExists('order_items', 'selected_color', 'VARCHAR(50) DEFAULT NULL');

-- Clean up helper procedure
DROP PROCEDURE IF EXISTS AddColumnIfNotExists;

-- ====================================================================
-- 6. SYNCHRONIZE & HEAL EXISTING PRODUCT DATA (Preserve existing rows)
-- ====================================================================

-- Synchronize category_id and category if either was previously stored
UPDATE products
SET category_id = category
WHERE (category_id IS NULL OR category_id = '' OR category_id = 'accessories')
  AND category IS NOT NULL AND category <> '';

UPDATE products
SET category = category_id
WHERE (category IS NULL OR category = '')
  AND category_id IS NOT NULL AND category_id <> '';

-- Ensure default brand for existing products without brand
UPDATE products
SET brand = 'BOLT'
WHERE brand IS NULL OR brand = '';

-- Ensure rating default
UPDATE products
SET rating = 5.0
WHERE rating IS NULL;

-- Ensure stock status
UPDATE products
SET in_stock = TRUE
WHERE in_stock IS NULL;

-- Synchronize stock_count from older column names (stock, quantity, stock_quantity) if present
DELIMITER $$
DROP PROCEDURE IF EXISTS SyncStockColumns $$
CREATE PROCEDURE SyncStockColumns()
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'stock'
    ) THEN
        UPDATE products SET stock_count = stock WHERE (stock_count IS NULL OR stock_count = 0) AND stock IS NOT NULL AND stock > 0;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'quantity'
    ) THEN
        UPDATE products SET stock_count = quantity WHERE (stock_count IS NULL OR stock_count = 0) AND quantity IS NOT NULL AND quantity > 0;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'stock_quantity'
    ) THEN
        UPDATE products SET stock_count = stock_quantity WHERE (stock_count IS NULL OR stock_count = 0) AND stock_quantity IS NOT NULL AND stock_quantity > 0;
    END IF;

    UPDATE products SET in_stock = (stock_count > 0);
END $$
DELIMITER ;

CALL SyncStockColumns();
DROP PROCEDURE IF EXISTS SyncStockColumns;

-- Sync image from images JSON if single image is null
UPDATE products
SET image = JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]'))
WHERE (image IS NULL OR image = '') AND images IS NOT NULL AND JSON_LENGTH(images) > 0;

-- Sync images JSON from single image if images JSON is null
UPDATE products
SET images = JSON_ARRAY(image)
WHERE (images IS NULL OR JSON_LENGTH(images) = 0) AND image IS NOT NULL AND image <> '';

-- ====================================================================
-- 7. SEED / UPSERT CATEGORIES (Guarantees foreign keys and UI categories)
-- ====================================================================
INSERT INTO categories (id, name, item_count_text, icon_name, image) VALUES
('backpacks', 'Backpacks', '1 Item', 'backpack', '/products/classic-backpack.webp'),
('headphones', 'Headphones', '2 Items', 'headphones', '/products/wh-1000xm5.webp'),
('watches', 'Watches', '2 Items', 'watch', '/products/galaxy-watch-6.webp'),
('wallets', 'Wallets', '0 Items', 'wallet', '/products/classic-backpack.webp'),
('gaming', 'Gaming', '1 Item', 'gamepad-2', '/products/k2-keyboard.webp'),
('sunglasses', 'Sunglasses', '0 Items', 'glasses', '/hero/showcase-hero.webp'),
('travel', 'Travel', '0 Items', 'luggage', '/collections/travel-collection.webp'),
('accessories', 'Accessories', '2 Items', 'layout-grid', '/products/737-powerbank.webp')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name), 
    item_count_text = VALUES(item_count_text), 
    icon_name = VALUES(icon_name), 
    image = VALUES(image);

-- ====================================================================
-- 8. SEED / UPSERT BOLT 2.0 PRODUCTS CATALOG
-- (Does NOT delete existing custom products like 1, 2, etc.)
-- ====================================================================
INSERT INTO products (
    id, name, brand, category_id, category, price, original_price, discount_percent, 
    rating, reviews_count, description, badge, in_stock, stock_count, 
    images, image, model_url, sku, features, sizes, colors
) VALUES
('airpods-pro-2', 'AirPods Pro 2', 'Apple', 'headphones', 'headphones', 189.00, 239.00, 20, 4.9, 1248, 
 'Next-generation active noise cancellation with adaptive transparency and personalized spatial audio.', 
 '-20%', TRUE, 42, 
 '["/products/airpods-pro-2.webp"]', '/products/airpods-pro-2.webp', NULL, 'BOM-AP2-001', 
 '["Up to 2x more Active Noise Cancellation", "Adaptive Audio dynamically blends Transparency & ANC", "Up to 6 hours listening time with ANC enabled", "MagSafe Charging Case (USB-C) with Precision Finding"]',
 NULL, NULL),

('galaxy-watch-6-classic', 'Galaxy Watch 6 Classic', 'Samsung', 'watches', 'watches', 299.00, 349.00, 15, 4.8, 892, 
 'Refined rotating bezel smartwatch with comprehensive body composition analysis and advanced sleep tracking.', 
 '-15%', TRUE, 18, 
 '["/products/galaxy-watch-6.webp"]', '/products/galaxy-watch-6.webp', '/models/galaxy-watch-6.glb', 'BOM-GW6-002', 
 '["Physical Rotating Bezel for tactile navigation", "BIA Sensor for body composition metrics", "Sapphire Crystal Glass display", "Personalized Heart Rate Zones & Sleep Coaching"]',
 '["43mm", "47mm"]', '[{"name": "Black", "hex": "#1E293B"}, {"name": "Silver", "hex": "#CBD5E1"}]'),

('wh-1000xm5-headphones', 'WH-1000XM5 Headphones', 'Sony', 'headphones', 'headphones', 299.00, 369.00, 20, 4.9, 1365, 
 'Industry-leading noise cancellation powered by two processors and eight microphones with pristine sound quality.', 
 '-20%', TRUE, 22, 
 '["/products/wh-1000xm5.webp"]', '/products/wh-1000xm5.webp', '/models/headphone.glb', 'BOM-SNY-004', 
 '["Integrated Processor V1 and HD Noise Cancelling Processor QN1", "Ultra-comfortable lightweight design in soft fit leather", "Up to 30-hour battery life with quick charge (3 min for 3 hours)", "Crystal-clear hands-free calling with 4 beamforming microphones"]',
 NULL, '[{"name": "Midnight Black", "hex": "#18181B"}, {"name": "Silver Gray", "hex": "#E2E8F0"}, {"name": "Midnight Blue", "hex": "#1E3A5F"}]'),

('classic-backpack', 'Classic Backpack', 'Herschel', 'backpacks', 'backpacks', 89.00, NULL, 0, 4.7, 664, 
 'Durable weather-resistant everyday backpack with padded laptop sleeve and ergonomic contoured shoulder straps.', 
 'New', TRUE, 35, 
 '["/products/classic-backpack.webp"]', '/products/classic-backpack.webp', NULL, 'BOM-HBP-003', 
 '["Padded and fleece-lined 15-inch laptop sleeve", "EcoSystem 600D fabric made from 100% recycled bottles", "Front pocket with key clip and organizer", "Dual water bottle side pockets"]',
 '["Standard 24L", "Compact 16L"]', '[{"name": "Matte Black", "hex": "#111827"}, {"name": "Navy Blue", "hex": "#1E3A8A"}, {"name": "Olive Green", "hex": "#365314"}]'),

('go-3-speaker', 'Go 3 Speaker', 'JBL', 'accessories', 'accessories', 49.00, NULL, 0, 4.8, 2365, 
 'Ultra-portable waterproof Bluetooth speaker featuring punchy bass and edgy street-style fabric wrap.', 
 'New', TRUE, 50, 
 '["/products/go-3-speaker.webp"]', '/products/go-3-speaker.webp', NULL, 'BOM-JBL-005', 
 '["JBL Pro Sound delivers surprisingly big audio and punchy bass", "IP67 waterproof and dustproof design", "Up to 5 hours of playtime on a single charge", "Integrated grab-and-go loop for portable carry"]',
 NULL, NULL),

('k2-keyboard', 'K2 Mechanical Keyboard', 'Keychron', 'gaming', 'gaming', 89.00, 99.00, 10, 4.9, 892, 
 '75% compact wireless mechanical keyboard with Mac & Windows support, hot-swappable switches, and RGB backlighting.', 
 'Hot', TRUE, 14, 
 '["/products/k2-keyboard.webp"]', '/products/k2-keyboard.webp', NULL, 'BOM-K2K-006', 
 '["Connects with up to 3 devices via Bluetooth 5.1 or USB Type-C wired", "Gateron G Pro mechanical switches with hot-swappable sockets", "4000 mAh rechargeable battery lasting up to 240 hours", "Dedicated multimedia and function keys for macOS & Windows"]',
 NULL, NULL),

('737-power-bank', '737 Power Bank (PowerCore 24K)', 'Anker', 'accessories', 'accessories', 99.00, 149.00, 34, 4.8, 654, 
 'Ultra-powerful two-way fast charging with smart digital display and 24,000mAh high capacity.', 
 'New', TRUE, 29, 
 '["/products/737-powerbank.webp"]', '/products/737-powerbank.webp', NULL, 'BOM-ANK-007', 
 '["140W max high-speed output with Power Delivery 3.1", "Smart digital display shows real-time output power and recharge time", "24,000mAh capacity juices an iPhone 13 nearly 5 times", "ActiveShield 2.0 real-time temperature monitoring"]',
 NULL, NULL),

('gen-6-smartwatch', 'Gen 6 Smartwatch', 'Fossil', 'watches', 'watches', 199.00, 299.00, 33, 4.6, 785, 
 'Classic chronograph aesthetic meeting Snapdragon Wear 4100+ performance and SpO2 sensor.', 
 'New', TRUE, 19, 
 '["/products/gen-6-smartwatch.webp"]', '/products/gen-6-smartwatch.webp', NULL, 'BOM-FSL-008', 
 '["Qualcomm Snapdragon Wear 4100+ platform for 30% faster performance", "SpO2 blood oxygen estimation and continuous heart rate tracking", "Rapid charging: 80% battery in slightly over 30 minutes", "Swimproof design up to 3 ATM"]',
 '["42mm", "44mm"]', '[{"name": "Smoke Stainless", "hex": "#64748B"}, {"name": "Brown Leather", "hex": "#78350F"}]')

ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    brand = VALUES(brand),
    category_id = VALUES(category_id),
    category = VALUES(category),
    price = VALUES(price),
    original_price = VALUES(original_price),
    discount_percent = VALUES(discount_percent),
    rating = VALUES(rating),
    reviews_count = VALUES(reviews_count),
    description = VALUES(description),
    badge = VALUES(badge),
    in_stock = VALUES(in_stock),
    stock_count = VALUES(stock_count),
    images = VALUES(images),
    image = VALUES(image),
    model_url = VALUES(model_url),
    sku = VALUES(sku),
    features = VALUES(features),
    sizes = VALUES(sizes),
    colors = VALUES(colors);

-- ====================================================================
-- 9. VERIFY RESULTING TABLE STRUCTURE AND DATA
-- ====================================================================
SELECT 
    id, name, brand, category_id, price, rating, in_stock, sku, created_at 
FROM products 
ORDER BY created_at ASC;
