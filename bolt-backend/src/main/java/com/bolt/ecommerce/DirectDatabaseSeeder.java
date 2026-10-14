package com.bolt.ecommerce;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;

public class DirectDatabaseSeeder {

    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/bolt_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        String user = "root";
        String pass = "Kiran@80977159";

        System.out.println("Connecting to MySQL: " + url);
        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            System.out.println("Connected successfully!");

            // 1. Alter table to ensure all columns exist
            String[] alters = {
                "ALTER TABLE products MODIFY COLUMN id VARCHAR(100) NOT NULL",
                "ALTER TABLE products ADD COLUMN brand VARCHAR(100) NOT NULL DEFAULT 'BOLT'",
                "ALTER TABLE products ADD COLUMN category_id VARCHAR(50) NOT NULL DEFAULT 'accessories'",
                "ALTER TABLE products ADD COLUMN category VARCHAR(100) DEFAULT NULL",
                "ALTER TABLE products ADD COLUMN price DECIMAL(10, 2) NOT NULL DEFAULT 0.00",
                "ALTER TABLE products ADD COLUMN original_price DECIMAL(10, 2) DEFAULT NULL",
                "ALTER TABLE products ADD COLUMN discount_percent INT DEFAULT 0",
                "ALTER TABLE products ADD COLUMN rating DECIMAL(3, 1) DEFAULT 5.0",
                "ALTER TABLE products ADD COLUMN reviews_count INT DEFAULT 0",
                "ALTER TABLE products ADD COLUMN description TEXT DEFAULT NULL",
                "ALTER TABLE products ADD COLUMN badge VARCHAR(50) DEFAULT NULL",
                "ALTER TABLE products ADD COLUMN in_stock BOOLEAN DEFAULT TRUE",
                "ALTER TABLE products ADD COLUMN stock_count INT DEFAULT 0",
                "ALTER TABLE products ADD COLUMN images JSON DEFAULT NULL",
                "ALTER TABLE products ADD COLUMN image VARCHAR(255) DEFAULT NULL",
                "ALTER TABLE products ADD COLUMN model_url VARCHAR(255) DEFAULT NULL",
                "ALTER TABLE products ADD COLUMN sku VARCHAR(100) DEFAULT NULL",
                "ALTER TABLE products ADD COLUMN features JSON DEFAULT NULL",
                "ALTER TABLE products ADD COLUMN sizes JSON DEFAULT NULL",
                "ALTER TABLE products ADD COLUMN colors JSON DEFAULT NULL"
            };

            for (String alter : alters) {
                try (Statement stmt = conn.createStatement()) {
                    stmt.execute(alter);
                } catch (Exception ignored) {}
            }

            // 2. Categories
            String catSql = """
                INSERT INTO categories (id, name, item_count_text, icon_name, image) VALUES
                ('backpacks', 'Backpacks', '6 Items', 'backpack', '/images/products/travel-backpack.webp'),
                ('headphones', 'Headphones', '6 Items', 'headphones', '/images/products/wireless-headphones.webp'),
                ('watches', 'Watches', '6 Items', 'watch', '/images/products/smartwatch-black.webp'),
                ('wallets', 'Wallets', '5 Items', 'wallet', '/images/products/leather-wallet.webp'),
                ('gaming', 'Gaming', '6 Items', 'gamepad-2', '/images/products/gaming-mouse.webp'),
                ('sunglasses', 'Sunglasses', '5 Items', 'glasses', '/images/products/aviator-sunglasses.webp'),
                ('travel', 'Travel', '6 Items', 'luggage', '/images/products/travel-duffel.webp'),
                ('accessories', 'Accessories', '7 Items', 'layout-grid', '/images/products/737-powerbank.webp')
                ON DUPLICATE KEY UPDATE
                    name = VALUES(name),
                    item_count_text = VALUES(item_count_text),
                    icon_name = VALUES(icon_name),
                    image = VALUES(image)
            """;
            try (Statement stmt = conn.createStatement()) {
                stmt.execute(catSql);
                System.out.println("Categories seeded.");
            }

            // 3. Upsert Catalog Products
            String upsertProduct = """
                INSERT INTO products (
                    id, name, brand, category_id, category, price, original_price, discount_percent,
                    rating, reviews_count, description, badge, in_stock, stock_count,
                    images, image, model_url, sku, features, sizes, colors
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                    colors = VALUES(colors)
            """;

            try (PreparedStatement ps = conn.prepareStatement(upsertProduct)) {
                // List of 47 products
                Object[][] products = getProducts();
                for (Object[] p : products) {
                    ps.setString(1, (String) p[0]);
                    ps.setString(2, (String) p[1]);
                    ps.setString(3, (String) p[2]);
                    ps.setString(4, (String) p[3]);
                    ps.setString(5, (String) p[3]); // category
                    ps.setBigDecimal(6, new BigDecimal(String.valueOf(p[4])));
                    ps.setBigDecimal(7, p[5] != null ? new BigDecimal(String.valueOf(p[5])) : null);
                    ps.setInt(8, (Integer) p[6]);
                    ps.setDouble(9, (Double) p[7]);
                    ps.setInt(10, (Integer) p[8]);
                    ps.setString(11, (String) p[9]);
                    ps.setString(12, (String) p[10]);
                    ps.setBoolean(13, (Boolean) p[11]);
                    ps.setInt(14, (Integer) p[12]);
                    ps.setString(15, (String) p[13]); // images JSON
                    ps.setString(16, (String) p[14]); // image
                    ps.setString(17, (String) p[15]); // model_url
                    ps.setString(18, (String) p[16]); // sku
                    ps.setString(19, (String) p[17]); // features JSON
                    ps.setString(20, (String) p[18]); // sizes JSON
                    ps.setString(21, (String) p[19]); // colors JSON
                    ps.executeUpdate();
                }
                System.out.println("Successfully seeded/updated " + products.length + " products!");
            }

            // 4. Update dynamic category counts
            String updateCatCounts = """
                UPDATE categories c
                SET item_count_text = CONCAT(
                    (SELECT COUNT(*) FROM products p WHERE LOWER(p.category_id) = LOWER(c.id) OR LOWER(p.category) = LOWER(c.id)),
                    ' Items'
                )
            """;
            try (Statement stmt = conn.createStatement()) {
                stmt.execute(updateCatCounts);
                System.out.println("Category counts updated.");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static Object[][] getProducts() {
        return new Object[][] {
            // ID 1 (Existing product preserved and updated with rich data)
            {"1", "Sony WH-1000XM5 Noise-Canceling Headphones", "Sony", "headphones", 299.00, 399.00, 25, 4.9, 1420,
             "Industry-leading active noise cancellation with 8 microphones, 30-hour battery life, and pristine high-resolution acoustics.",
             "-25%", true, 24, "[\"/images/products/wireless-headphones.webp\"]", "/images/products/wireless-headphones.webp", null, "BOM-SNY-001",
             "[\"Integrated Processor V1 & HD Noise Cancelling Processor QN1\", \"30-hour battery life with 3-minute quick charge for 3 hours\", \"4 beamforming microphones with AI wind noise reduction\", \"Ultra-comfortable lightweight fit in soft-touch leather\"]",
             null, "[{\"name\": \"Midnight Black\", \"hex\": \"#18181B\"}, {\"name\": \"Silver Gray\", \"hex\": \"#E2E8F0\"}]"},

            // ID 2 (Existing product preserved and updated)
            {"2", "Apple Watch Series 9 GPS 45mm", "Apple", "watches", 349.00, 429.00, 19, 4.9, 1850,
             "Powerful S9 chip with Double Tap magic gesture control, Always-On Retina display, and precision health sensors.",
             "-19%", true, 28, "[\"/images/products/smartwatch-black.webp\"]", "/images/products/smartwatch-black.webp", null, "BOM-APL-002",
             "[\"S9 SiP chip enabling Double Tap gesture without touching screen\", \"Always-On 2000-nit Retina display with sapphire crystal glass\", \"Advanced ECG, SpO2 blood oxygen, and temperature tracking\", \"Crash and Fall Detection with automatic emergency SOS\"]",
             "[\"41mm\", \"45mm\"]", "[{\"name\": \"Midnight\", \"hex\": \"#1E293B\"}, {\"name\": \"Starlight\", \"hex\": \"#F8FAFC\"}]"},

            // ID 3 (Existing product preserved and updated)
            {"3", "BOLT City Commuter Minimalist Backpack", "BOLT", "backpacks", 79.00, 99.00, 20, 4.7, 380,
             "Streamlined weather-resistant urban commuter pack with dedicated 15.6-inch padded laptop compartment and anti-theft pocket.",
             "-20%", true, 30, "[\"/images/products/casual-backpack.webp\"]", "/images/products/casual-backpack.webp", null, "BOM-BLT-003",
             "[\"Reinforced splash-proof coated canvas construction\", \"Suspended fleece-lined laptop sleeve fitting up to 16-inch laptops\", \"Hidden anti-theft lumbar passport security pocket\", \"Luggage trolley pass-through strap for easy airport travel\"]",
             "[\"Standard 20L\", \"Compact 15L\"]", "[{\"name\": \"Stealth Black\", \"hex\": \"#111827\"}, {\"name\": \"Storm Gray\", \"hex\": \"#4B5563\"}]"},

            // --- HEADPHONES & EARBUDS ---
            {"airpods-pro-2", "Apple AirPods Pro 2 (USB-C)", "Apple", "headphones", 189.00, 249.00, 24, 4.9, 2150,
             "Next-generation active noise cancellation with adaptive transparency and personalized spatial audio.",
             "-24%", true, 45, "[\"/images/products/airpods-pro-2.webp\"]", "/images/products/airpods-pro-2.webp", null, "BOM-AP2-004",
             "[\"Up to 2x more Active Noise Cancellation than predecessor\", \"Adaptive Audio dynamically blends Transparency & ANC\", \"Up to 6 hours listening time with ANC enabled\", \"MagSafe Charging Case (USB-C) with Precision Finding speaker\"]",
             null, null},

            {"bose-qc-ultra", "Bose QuietComfort Ultra Headphones", "Bose", "headphones", 379.00, 429.00, 12, 4.8, 890,
             "World-class spatial audio with Bose Immersive Audio, custom acoustic calibration, and luxurious comfort.",
             "-12%", true, 18, "[\"/images/products/bose-qc-ultra.webp\"]", "/images/products/bose-qc-ultra.webp", null, "BOM-BSE-005",
             "[\"Breakthrough Bose Immersive Audio spatializes acoustic soundstage\", \"CustomTune technology personalizes sound to ear canal geometry\", \"24-hour battery life with USB-C quick charge (15 min for 2.5 hrs)\", \"Ultra-plush protein leather earcups with cast aluminium arms\"]",
             null, "[{\"name\": \"Black\", \"hex\": \"#111827\"}, {\"name\": \"White Smoke\", \"hex\": \"#F1F5F9\"}]"},

            {"sennheiser-momentum-4", "Sennheiser Momentum 4 Wireless", "Sennheiser", "headphones", 279.00, 349.00, 20, 4.8, 760,
             "Audiophile-inspired 42mm transducer system delivering unrivaled acoustic clarity with industry-topping 60-hour battery.",
             "-20%", true, 15, "[\"/images/products/sennheiser-momentum-4.webp\"]", "/images/products/sennheiser-momentum-4.webp", null, "BOM-SNH-006",
             "[\"Signature Sennheiser sound with custom 42mm dynamic drivers\", \"Incredible 60-hour class-leading battery life with fast charge\", \"Adaptive Hybrid ANC automatically adapts to ambient noise levels\", \"Smart Pause automatically halts audio when removed from head\"]",
             null, "[{\"name\": \"Matte Black\", \"hex\": \"#18181B\"}, {\"name\": \"White / Slate\", \"hex\": \"#E2E8F0\"}]"},

            {"sony-wf1000xm5", "Sony WF-1000XM5 True Wireless Earbuds", "Sony", "headphones", 229.00, 299.00, 23, 4.7, 940,
             "Flagship noise-canceling in-ear earbuds with high-resolution wireless audio and bone-conduction voice clarity.",
             "-23%", true, 32, "[\"/images/products/sony-wf1000xm5.webp\"]", "/images/products/sony-wf1000xm5.webp", null, "BOM-SNY-007",
             "[\"Dual feedback microphones with Integrated Processor V2\", \"Dynamic Driver X reproducing deep low-end and sparkling trebles\", \"Bone conduction voice sensors ensure clear calls in noisy streets\", \"IPX4 splash and sweat resistance for high-intensity workouts\"]",
             null, "[{\"name\": \"Black\", \"hex\": \"#111827\"}, {\"name\": \"Silver\", \"hex\": \"#E2E8F0\"}]"},

            {"marshall-major-iv", "Marshall Major IV Bluetooth Headphones", "Marshall", "headphones", 129.00, 149.00, 13, 4.7, 1120,
             "Iconic Marshall vintage roadie styling with custom 40mm tuned drivers and over 80 hours of cord-free listening.",
             "Hot", true, 20, "[\"/images/products/marshall-major-iv.webp\"]", "/images/products/marshall-major-iv.webp", null, "BOM-MSH-008",
             "[\"Classic Marshall explosive sound signature with punchy bass\", \"Over 80 solid hours of wireless playtime on a single full charge\", \"Multi-directional control brass knob for tracks and calls\", \"Convenient wireless inductive charging on any standard Qi pad\"]",
             null, "[{\"name\": \"Vintage Black\", \"hex\": \"#18181B\"}, {\"name\": \"Brown\", \"hex\": \"#78350F\"}]"},

            // --- WATCHES ---
            {"galaxy-watch-6-classic", "Samsung Galaxy Watch 6 Classic", "Samsung", "watches", 299.00, 349.00, 15, 4.8, 892,
             "Timeless rotating bezel, advanced sleep coaching, ECG monitoring, and sapphire crystal glass.",
             "-15%", true, 18, "[\"/images/products/galaxy-watch-6.webp\"]", "/images/products/galaxy-watch-6.webp", "/models/galaxy-watch-6.glb", "BOM-GW6-009",
             "[\"Physical rotating bezel for tactile precision navigation\", \"BioActive Sensor: HR, ECG, BIA body composition analysis\", \"Durable sapphire crystal glass with stainless steel casing\", \"Fast wireless charging and IP68 water resistance\"]",
             "[\"43mm\", \"47mm\"]", "[{\"name\": \"Black\", \"hex\": \"#1E293B\"}, {\"name\": \"Silver\", \"hex\": \"#CBD5E1\"}]"},

            {"gen-6-smartwatch", "Fossil Gen 6 Smoke Stainless Smartwatch", "Fossil", "watches", 199.00, 299.00, 33, 4.6, 785,
             "Classic chronograph aesthetic meeting Snapdragon Wear 4100+ performance and SpO2 sensor.",
             "New", true, 19, "[\"/images/products/gen-6-smartwatch.webp\"]", "/images/products/gen-6-smartwatch.webp", null, "BOM-FSL-010",
             "[\"Qualcomm Snapdragon Wear 4100+ platform for 30% faster speed\", \"SpO2 blood oxygen estimation and continuous heart rate tracking\", \"Rapid charging: 80% battery in slightly over 30 minutes\", \"Swimproof design up to 3 ATM with customizable watch faces\"]",
             "[\"42mm\", \"44mm\"]", "[{\"name\": \"Smoke Stainless\", \"hex\": \"#64748B\"}, {\"name\": \"Brown Leather\", \"hex\": \"#78350F\"}]"},

            {"garmin-fenix-7", "Garmin Fenix 7 Solar Multisport GPS", "Garmin", "watches", 599.00, 699.00, 14, 4.9, 620,
             "Rugged multisport GPS watch with solar charging lens, built-in topographic maps, and titanium durability.",
             "Hot", true, 12, "[\"/images/products/garmin-fenix-7.webp\"]", "/images/products/garmin-fenix-7.webp", null, "BOM-GRM-011",
             "[\"Power Glass solar charging lens yields up to 22 days battery\", \"Built-in TopoActive maps and multi-GNSS satellite navigation\", \"Real-time stamina tracking and grade-adjusted running pace\", \"Rugged titanium bezel tested to U.S. military standards (MIL-STD-810)\"]",
             "[\"47mm\"]", "[{\"name\": \"Slate Gray\", \"hex\": \"#334155\"}]"},

            {"seiko-prospex", "Seiko Prospex Automatic Diver 200M", "Seiko", "watches", 425.00, 475.00, 10, 4.8, 430,
             "Legendary Japanese automatic dive watch engineered with 200m ISO water resistance and LumiBrite visibility.",
             "New", true, 14, "[\"/images/products/seiko-prospex.webp\"]", "/images/products/seiko-prospex.webp", null, "BOM-SKO-012",
             "[\"Japanese automatic Calibre 4R35 with 41-hour power reserve\", \"Unidirectional ceramic rotating countdown timer bezel\", \"200-meter ISO water resistance rating for certified scuba diving\", \"LumiBrite high-luminescence hands and geometric indices\"]",
             "[\"44mm\"]", "[{\"name\": \"Deep Blue\", \"hex\": \"#1E3A8A\"}, {\"name\": \"Onyx Black\", \"hex\": \"#0F172A\"}]"},

            {"tissot-prx", "Tissot PRX Powermatic 80 Steel", "Tissot", "watches", 650.00, null, 0, 4.9, 510,
             "Integrated stainless steel retro sport-luxury watch boasting 80 hours of autonomous mechanical reserve.",
             "New", true, 10, "[\"/images/products/tissot-prx.webp\"]", "/images/products/tissot-prx.webp", null, "BOM-TST-013",
             "[\"Swiss-made Powermatic 80 automatic movement with 80hr reserve\", \"Nivachron antimagnetic titanium alloy balance spring\", \"Integrated 316L stainless steel bracelet with butterfly clasp\", \"Scratch-resistant sapphire crystal with anti-reflective coating\"]",
             "[\"40mm\", \"35mm\"]", "[{\"name\": \"Ice Blue\", \"hex\": \"#93C5FD\"}, {\"name\": \"Sunburst Blue\", \"hex\": \"#1E40AF\"}]"},

            // --- BACKPACKS ---
            {"travel-backpack", "Aer Travel Pack 3 35L Ballistic Black", "Aer", "backpacks", 249.00, 289.00, 14, 4.9, 1150,
             "Carry-on compliant travel backpack crafted from 1680D Cordura ballistic nylon with lay-flat clamshell opening.",
             "Hot", true, 22, "[\"/images/products/travel-backpack.webp\"]", "/images/products/travel-backpack.webp", null, "BOM-AER-014",
             "[\"1680D Cordura ballistic nylon exterior with YKK water-guard zips\", \"Lay-flat clamshell opening for organized suitcase-style packing\", \"Suspended 16-inch laptop pocket with magnetic Fidlock closure\", \"Load-lifter padded shoulder harness and breathable mesh back panel\"]",
             "[\"35L Full\", \"28L Small\"]", "[{\"name\": \"Ballistic Black\", \"hex\": \"#111827\"}, {\"name\": \"Heather Gray\", \"hex\": \"#4B5563\"}]"},

            {"classic-backpack", "Herschel Classic EcoPack 24L", "Herschel", "backpacks", 89.00, null, 0, 4.7, 664,
             "Durable weather-resistant everyday backpack with padded laptop sleeve and ergonomic contoured shoulder straps.",
             "New", true, 35, "[\"/images/products/classic-backpack.webp\"]", "/images/products/classic-backpack.webp", null, "BOM-HBP-015",
             "[\"Padded and fleece-lined 15-inch laptop protection sleeve\", \"EcoSystem 600D fabric woven from 100% recycled bottles\", \"Front zippered organizer pocket with internal key clip\", \"Dual stretchy water bottle side pockets\"]",
             "[\"Standard 24L\", \"Compact 16L\"]", "[{\"name\": \"Matte Black\", \"hex\": \"#111827\"}, {\"name\": \"Navy Blue\", \"hex\": \"#1E3A8A\"}, {\"name\": \"Olive Green\", \"hex\": \"#365314\"}]"},

            {"bellroy-transit", "Bellroy Transit Workpack 20L", "Bellroy", "backpacks", 199.00, 229.00, 13, 4.8, 520,
             "Refined minimalist work backpack featuring separate quick-draw laptop compartment and soft contour harness.",
             "New", true, 17, "[\"/images/products/bellroy-transit.webp\"]", "/images/products/bellroy-transit.webp", null, "BOM-BLR-016",
             "[\"Separate external work section for 16-inch laptop and chargers\", \"Invisible external water bottle pocket with water-sealed zipper\", \"Ergonomic contoured harness with magnetic sternum clip\", \"Water-resistant recycled woven fabric with leather accents\"]",
             "[\"20L\"]", "[{\"name\": \"Midnight Black\", \"hex\": \"#0F172A\"}, {\"name\": \"Ranger Green\", \"hex\": \"#14532D\"}]"},

            {"peak-design-backpack", "Peak Design Everyday Backpack 20L V2", "Peak Design", "backpacks", 279.00, null, 0, 4.9, 840,
             "Award-winning modular everyday pack with patented MagLatch hardware and origami FlexFold dividers.",
             "New", true, 15, "[\"/images/products/peak-design-backpack.webp\"]", "/images/products/peak-design-backpack.webp", null, "BOM-PKD-017",
             "[\"Patented MagLatch one-handed top access hardware\", \"Dual weatherproof side zippers for instant side access\", \"3 configurable FlexFold origami dividers protect lenses & tech\", \"100% recycled 400D weatherproof nylon canvas shell\"]",
             "[\"20L\", \"30L\"]", "[{\"name\": \"Charcoal\", \"hex\": \"#334155\"}, {\"name\": \"Ash\", \"hex\": \"#CBD5E1\"}]"},

            {"nomatic-pack", "Nomatic Travel Pack 20L-30L Expandable", "Nomatic", "backpacks", 219.00, 269.00, 18, 4.7, 460,
             "All-in-one expandable commuter and weekender bag with TSA-approved lay-flat tech sleeve.",
             "-18%", true, 19, "[\"/images/products/nomatic-pack.webp\"]", "/images/products/nomatic-pack.webp", null, "BOM-NOM-018",
             "[\"Expands from 20L slim commuter to 30L spacious weekender pack\", \"TSA-ready lay-flat 16-inch laptop and tablet compartment\", \"Magnetic snap water bottle pockets that stay flush when empty\", \"Water-resistant tarpaulin construction and lockable YKK zips\"]",
             "[\"20L Expandable\"]", "[{\"name\": \"Black\", \"hex\": \"#111827\"}]"},

            // --- WALLETS ---
            {"bellroy-slim-sleeve", "Bellroy Slim Sleeve Leather Wallet", "Bellroy", "wallets", 79.00, null, 0, 4.9, 940,
             "Ultra-slim bi-fold wallet engineered from certified eco-tanned leather with quick-draw pull tab.",
             "New", true, 40, "[\"/images/products/leather-wallet.webp\"]", "/images/products/leather-wallet.webp", null, "BOM-BLR-019",
             "[\"Accommodates 4-11 cards and folded bills with zero bulk\", \"Quick-pull tab mechanism for infrequently used cards\", \"Environmentally certified premium full-grain leather\", \"Ultra-slim 10mm profile disappears inside front pockets\"]",
             null, "[{\"name\": \"Caramel Leather\", \"hex\": \"#B45309\"}, {\"name\": \"Charcoal\", \"hex\": \"#1E293B\"}]"},

            {"ridge-forged-carbon", "The Ridge Forged Carbon RFID Wallet", "Ridge", "wallets", 125.00, 145.00, 14, 4.8, 1620,
             "Aerospace-grade forged carbon fiber minimalist wallet featuring integrated money clip and RFID defense.",
             "Hot", true, 25, "[\"/images/products/carbon-wallet.webp\"]", "/images/products/carbon-wallet.webp", null, "BOM-RDG-020",
             "[\"Aerospace-grade forged carbon fiber matte outer plates\", \"RFID blocking technology prevents wireless skim theft\", \"Integrated cash strap with silicone grip pattern\", \"Holds 1-12 cards securely without stretched elastic\"]",
             null, "[{\"name\": \"Forged Carbon\", \"hex\": \"#18181B\"}]"},

            {"ekster-parliament", "Ekster Parliament Smart Card Wallet", "Ekster", "wallets", 89.00, 99.00, 10, 4.8, 1210,
             "Smart trigger-action cardholder crafted from premium Dutch leather with instant card fan-out.",
             "New", true, 34, "[\"/images/products/ekster-wallet.webp\"]", "/images/products/ekster-wallet.webp", null, "BOM-EKS-021",
             "[\"Patented trigger button fans out cards in graduated stack\", \"RFID/NFC blocking aluminum inner casing prevents scanning\", \"Slots for up to 12 cards plus cash storage strap\", \"Compatible with Ekster solar-powered tracker card\"]",
             null, "[{\"name\": \"Classic Brown\", \"hex\": \"#78350F\"}, {\"name\": \"Matte Black\", \"hex\": \"#0F172A\"}]"},

            {"fossil-derrick-bifold", "Fossil Derrick RFID Leather Bifold", "Fossil", "wallets", 55.00, 65.00, 15, 4.6, 680,
             "Classic American vintage leather bifold with flip-out ID pass window and full bill fold section.",
             "-15%", true, 28, "[\"/images/products/fossil-bifold.webp\"]", "/images/products/fossil-bifold.webp", null, "BOM-FSL-022",
             "[\"100% genuine vintage leather with contrast edge stitching\", \"Special lining to protect credit card RFID chips from scans\", \"8 card slots, 2 slip pockets, and full-length banknote pocket\", \"Flip-out ID window for rapid security and boarding checks\"]",
             null, "[{\"name\": \"Dark Brown\", \"hex\": \"#451A03\"}]"},

            {"secrid-miniwallet", "Secrid Miniwallet Matte Card Protector", "Secrid", "wallets", 75.00, null, 0, 4.8, 810,
             "Award-winning Dutch pocket-sized wallet with patented aluminum card-protector mechanism.",
             "New", true, 20, "[\"/images/products/secrid-miniwallet.webp\"]", "/images/products/secrid-miniwallet.webp", null, "BOM-SCR-023",
             "[\"Red-dot award winning Dutch patented card lever mechanism\", \"Solid aluminum Cardprotector stops bending and breaking\", \"Holds 6 flat cards or 4 embossed cards inside armor case\", \"Leather wrap holds 4 extra cards, paper notes, and receipts\"]",
             null, "[{\"name\": \"Matte Black\", \"hex\": \"#111827\"}, {\"name\": \"Cognac\", \"hex\": \"#9A3412\"}]"},

            // --- GAMING GEAR ---
            {"gaming-mouse", "Razer Viper V2 Pro Ultra-Lightweight Mouse", "Razer", "gaming", 119.00, 149.00, 20, 4.9, 1450,
             "58g championship-grade esports mouse equipped with Focus Pro 30K optical sensor and Gen-3 switches.",
             "-20%", true, 36, "[\"/images/products/gaming-mouse.webp\"]", "/images/products/gaming-mouse.webp", null, "BOM-RZR-024",
             "[\"58g featherlight symmetrical competitive esports body\", \"Focus Pro 30K Optical Sensor with 99.8% resolution accuracy\", \"Gen-3 optical mouse switches rated for 90 million clicks\", \"Up to 80 hours battery life with USB-C Speedflex charging\"]",
             null, "[{\"name\": \"Matte Black\", \"hex\": \"#111827\"}, {\"name\": \"Mercury White\", \"hex\": \"#F8FAFC\"}]"},

            {"k2-keyboard", "Keychron K2 Wireless Mechanical Keyboard", "Keychron", "gaming", 89.00, 99.00, 10, 4.9, 892,
             "75% compact wireless mechanical keyboard with Mac & Windows support, hot-swappable switches, and RGB backlighting.",
             "Hot", true, 14, "[\"/images/products/k2-keyboard.webp\"]", "/images/products/k2-keyboard.webp", null, "BOM-K2K-025",
             "[\"75% compact layout with 84 keys for Mac & Windows\", \"Gateron G Pro mechanical switches with hot-swap sockets\", \"Bluetooth 5.1 multi-device pairing with up to 3 devices\", \"4000mAh high-capacity battery lasting up to 240 hours\"]",
             null, null},

            {"steelseries-arctis-nova-pro", "SteelSeries Arctis Nova Pro Wireless", "SteelSeries", "gaming", 329.00, 349.00, 6, 4.8, 670,
             "Flagship multi-system wireless gaming headset with Active Noise Cancellation and dual swappable batteries.",
             "Hot", true, 16, "[\"/images/products/gaming-headset.webp\"]", "/images/products/gaming-headset.webp", null, "BOM-STS-026",
             "[\"Nova Pro Acoustic System with Premium High-Res drivers\", \"Active Noise Cancellation with 4-mic hybrid transparency\", \"Infinity Power System: dual swappable hot-battery setup\", \"Multi-system OLED Base Station switchable with PC & Console\"]",
             null, null},

            {"xbox-elite-controller-2", "Xbox Elite Wireless Controller Series 2", "Microsoft", "gaming", 159.00, 179.00, 11, 4.8, 1890,
             "Pro-level gaming controller with adjustable-tension thumbsticks, wrap-around rubber grip, and shorter hair trigger locks.",
             "New", true, 25, "[\"/images/products/gaming-controller.webp\"]", "/images/products/gaming-controller.webp", null, "BOM-MSF-027",
             "[\"Adjustable-tension thumbsticks with 3 custom profile slots\", \"Shorter hair trigger locks for rapid competitive firing\", \"Wrap-around rubberized grip and interchangeable paddles\", \"Up to 40 hours of rechargeable battery life per charge\"]",
             null, null},

            {"logitech-g-pro-superlight", "Logitech G Pro X Superlight 2 Wireless", "Logitech G", "gaming", 149.00, null, 0, 4.9, 1120,
             "The world's leading esports wireless mouse featuring LIGHTFORCE hybrid switches and HERO 2 sensor.",
             "New", true, 22, "[\"/images/products/logitech-mouse.webp\"]", "/images/products/logitech-mouse.webp", null, "BOM-LOG-028",
             "[\"60g lightweight design engineered with championship esports pros\", \"LIGHTFORCE hybrid optical-mechanical switches\", \"HERO 2 sensor delivering sub-micron tracking up to 32,000 DPI\", \"Zero-additive PTFE mouse feet for smooth, frictionless glide\"]",
             null, "[{\"name\": \"Ghost White\", \"hex\": \"#F8FAFC\"}, {\"name\": \"Black\", \"hex\": \"#111827\"}]"},

            {"corsair-k70-rgb-pro", "Corsair K70 RGB Pro Mechanical Keyboard", "Corsair", "gaming", 169.00, 199.00, 15, 4.7, 820,
             "Anodized aluminum frame mechanical keyboard powered by 8000Hz AXON hyper-processing and Cherry MX switches.",
             "-15%", true, 18, "[\"/images/products/corsair-keyboard.webp\"]", "/images/products/corsair-keyboard.webp", null, "BOM-CSR-029",
             "[\"CHERRY MX mechanical key switches with smooth linear response\", \"AXON hyper-processing technology with 8000Hz polling rate\", \"Durable precision-molded PBT double-shot keycaps\", \"Dedicated tournament switch with static red backlighting\"]",
             null, null},

            // --- SUNGLASSES ---
            {"rayban-aviator-classic", "Ray-Ban Aviator Classic Polarized G-15", "Ray-Ban", "sunglasses", 185.00, 225.00, 18, 4.9, 2410,
             "The iconic pilot sunglass designed with high-grade optical crystal lenses and durable gold metal frame.",
             "-18%", true, 26, "[\"/images/products/aviator-sunglasses.webp\"]", "/images/products/aviator-sunglasses.webp", null, "BOM-RBN-030",
             "[\"Timeless teardrop pilot shape created in 1937\", \"Crystal green G-15 polarized lenses with 100% UV protection\", \"Lightweight gold metal frame with adjustable clear nose pads\", \"Delivered in signature protective leather snap case\"]",
             "[\"Standard 58mm\", \"Large 62mm\"]", "[{\"name\": \"Gold / G-15 Green\", \"hex\": \"#CA8A04\"}, {\"name\": \"Gunmetal / Polarized\", \"hex\": \"#334155\"}]"},

            {"rayban-wayfarer-classic", "Ray-Ban Original Wayfarer Classic Black", "Ray-Ban", "sunglasses", 165.00, 185.00, 11, 4.8, 1780,
             "Recognized across cinema history, the classic black acetate wayfarer offers unmatched optical clarity.",
             "Hot", true, 30, "[\"/images/products/wayfarer-sunglasses.webp\"]", "/images/products/wayfarer-sunglasses.webp", null, "BOM-RBN-031",
             "[\"Iconic polished black acetate square frame silhouette\", \"Scratch-resistant G-15 mineral glass lenses\", \"100% UVA/UVB absorbing optical clarity\", \"Crafted in Italy with metal accent rivets on temples\"]",
             "[\"50mm\", \"54mm\"]", "[{\"name\": \"Gloss Black\", \"hex\": \"#111827\"}, {\"name\": \"Tortoise\", \"hex\": \"#78350F\"}]"},

            {"oakley-holbrook-prizm", "Oakley Holbrook Prizm Matte Black", "Oakley", "sunglasses", 152.00, 172.00, 12, 4.7, 920,
             "Sport performance meets classic American frame styling with Oakley Prizm color-enhancing lenses.",
             "New", true, 21, "[\"/images/products/oakley-holbrook.webp\"]", "/images/products/oakley-holbrook.webp", null, "BOM-OKL-032",
             "[\"Lightweight O Matter frame material with Square O metal icons\", \"Prizm lens technology enhances color, contrast and detail\", \"6 base lens geometry with HDO High Definition Optics\", \"Plutonite lens filters 100% of all harmful UV and blue light\"]",
             "[\"Standard 55mm\"]", "[{\"name\": \"Matte Black / Prizm Black\", \"hex\": \"#18181B\"}]"},

            {"persol-714-folding", "Persol 714 Steve McQueen Folding Shades", "Persol", "sunglasses", 340.00, 390.00, 13, 4.9, 380,
             "Crafted by Italian artisans with a patented 10-step folding hinge and Meflecto flexible stem comfort.",
             "Hot", true, 12, "[\"/images/products/persol-folding.webp\"]", "/images/products/persol-folding.webp", null, "BOM-PRL-033",
             "[\"First-ever folding sunglasses with patented 10-step hinge\", \"Meflecto flexible stem system eliminates temple pressure\", \"Havana tortoiseshell hand-polished acetate frame\", \"Supreme Silver Arrow metal decoration on temples\"]",
             "[\"54mm\"]", "[{\"name\": \"Havana Tortoise\", \"hex\": \"#92400E\"}]"},

            {"maui-jim-red-sands", "Maui Jim Red Sands Polarized Sunglasses", "Maui Jim", "sunglasses", 230.00, null, 0, 4.8, 470,
             "Featherlight rectangular frame featuring MauiPure lens technology for saturated tropical color contrast.",
             "New", true, 15, "[\"/images/products/maui-jim-shades.webp\"]", "/images/products/maui-jim-shades.webp", null, "BOM-MJ-034",
             "[\"PolarizedPlus2 lens technology eliminates 99.9% of glare\", \"MauiPure lens offers optics almost as crisp as SuperThin Glass\", \"Ultralight refined rectangle frame in matte black\", \"Clearshell scratch-resistant front and back coating\"]",
             "[\"59mm\"]", "[{\"name\": \"Matte Black / Neutral Grey\", \"hex\": \"#1E293B\"}]"},

            // --- TRAVEL ACCESSORIES ---
            {"peak-design-tech-pouch", "Peak Design Tech Pouch Organizer 2L", "Peak Design", "travel", 59.00, 69.00, 14, 4.9, 1410,
             "Origami-style internal tech storage keeping charging bricks, cables, and SSDs upright and accessible.",
             "Hot", true, 38, "[\"/images/products/tech-organizer.webp\"]", "/images/products/tech-organizer.webp", null, "BOM-PKD-035",
             "[\"Origami-style internal pockets for chargers, pens, and drives\", \"External cable pass-through port for on-the-go phone charging\", \"100% recycled 200D nylon canvas weatherproof shell\", \"Stands upright on desk or tray table without tipping over\"]",
             null, "[{\"name\": \"Midnight Black\", \"hex\": \"#111827\"}, {\"name\": \"Sage Green\", \"hex\": \"#2E5A44\"}]"},

            {"aer-cable-kit-2", "Aer Cable Kit 2 Tech Accessory Organizer", "Aer", "travel", 50.00, null, 0, 4.8, 690,
             "Durable 1680D Cordura ballistic nylon travel pouch for clean cable management and portable chargers.",
             "New", true, 33, "[\"/images/products/cable-organizer.webp\"]", "/images/products/cable-organizer.webp", null, "BOM-AER-036",
             "[\"1680D Cordura ballistic nylon exterior\", \"Dual zippered clamshell compartments for cables and power bricks\", \"Soft-woven interior lining protects delicate gadgets\", \"Exterior grab handle and quick-access front stash pocket\"]",
             null, null},

            {"patagonia-black-hole-duffel", "Patagonia Black Hole Duffel Bag 55L", "Patagonia", "travel", 159.00, 179.00, 11, 4.9, 1820,
             "Indestructible water-resistant travel duffel with backpack conversion straps and spacious U-shaped opening.",
             "New", true, 19, "[\"/images/products/travel-duffel.webp\"]", "/images/products/travel-duffel.webp", null, "BOM-PAT-037",
             "[\"Extremely durable 100% recycled ripstop with TPU-film laminate\", \"Removable ergonomic padded shoulder straps for backpack carry\", \"Large U-shaped zippered lid opening for rapid loading\", \"Stuffs into its own interior pocket for compact storage\"]",
             "[\"55L\", \"40L\"]", "[{\"name\": \"Black\", \"hex\": \"#111827\"}, {\"name\": \"Phosphorus Green\", \"hex\": \"#15803D\"}]"},

            {"bellroy-travel-folio", "Bellroy Leather Travel Passport Folio", "Bellroy", "travel", 139.00, null, 0, 4.8, 510,
             "All-in-one zip passport wallet with micro travel pen, ticket sleeves, and RFID frequency shielding.",
             "New", true, 24, "[\"/images/products/travel-folio.webp\"]", "/images/products/travel-folio.webp", null, "BOM-BLR-038",
             "[\"Fits 2 passports, up to 8 cards, boarding passes, and currency\", \"Includes micro travel pen with refill for customs documents\", \"RFID lining protects against digital card skimming\", \"Premium environmentally certified leather with YKK zipper\"]",
             null, "[{\"name\": \"Black Leather\", \"hex\": \"#0F172A\"}, {\"name\": \"Caramel\", \"hex\": \"#B45309\"}]"},

            {"away-the-packing-cubes", "Away Compression Luggage Packing Cubes (Set of 4)", "Away", "travel", 45.00, 55.00, 18, 4.7, 1180,
             "Water-resistant nylon compression packing cubes designed to maximize every inch of carry-on space.",
             "-18%", true, 45, "[\"/images/products/packing-cubes.webp\"]", "/images/products/packing-cubes.webp", null, "BOM-AWY-039",
             "[\"Set of 4 waterproof nylon packing cubes in assorted sizes\", \"Dual-zipper compression technology frees up 30% suitcase space\", \"Mesh top panel for breathability and quick outfit viewing\", \"Reinforced webbing handles for easy grab-and-unpack\"]",
             "[\"Set of 4\"]", "[{\"name\": \"Coast Blue\", \"hex\": \"#1E3A8A\"}, {\"name\": \"Jet Black\", \"hex\": \"#111827\"}]"},

            {"monos-metro-toiletry-kit", "Monos Metro Water-Resistant Toiletry Kit", "Monos", "travel", 65.00, 75.00, 13, 4.7, 430,
             "Water-resistant vegan leather dopp kit with hanging hook and detachable transparent TSA liquid pouch.",
             "New", true, 27, "[\"/images/products/toiletry-bag.webp\"]", "/images/products/toiletry-bag.webp", null, "BOM-MNS-040",
             "[\"Ultra-matte water-resistant vegan leather exterior\", \"Wipe-clean antimicrobial waterproof interior lining\", \"Detachable TPU transparent liquids pouch for TSA security\", \"Dual elastic loops for electric toothbrushes and razors\"]",
             null, "[{\"name\": \"Carbon Black\", \"hex\": \"#18181B\"}]"},

            // --- ACCESSORIES & EVERYDAY TECH ---
            {"737-power-bank", "Anker 737 Power Bank (PowerCore 24K 140W)", "Anker", "accessories", 99.00, 149.00, 34, 4.8, 654,
             "Ultra-powerful two-way fast charging with smart digital display and 24,000mAh high capacity.",
             "-34%", true, 29, "[\"/images/products/737-powerbank.webp\"]", "/images/products/737-powerbank.webp", null, "BOM-ANK-041",
             "[\"140W max high-speed output with Power Delivery 3.1\", \"Smart digital display shows real-time output power and recharge time\", \"24,000mAh capacity juices an iPhone 13 nearly 5 times\", \"ActiveShield 2.0 real-time temperature monitoring\"]",
             null, null},

            {"go-3-speaker", "JBL Go 3 Ultra-Portable Waterproof Speaker", "JBL", "accessories", 49.00, null, 0, 4.8, 2365,
             "Ultra-portable waterproof Bluetooth speaker featuring punchy bass and edgy street-style fabric wrap.",
             "New", true, 50, "[\"/images/products/go-3-speaker.webp\"]", "/images/products/go-3-speaker.webp", null, "BOM-JBL-042",
             "[\"JBL Pro Sound delivers surprisingly big audio and punchy bass\", \"IP67 waterproof and dustproof design\", \"Up to 5 hours of playtime on a single charge\", \"Integrated grab-and-go loop for portable carry\"]",
             null, "[{\"name\": \"Squad Camo\", \"hex\": \"#4B5563\"}, {\"name\": \"Teal Blue\", \"hex\": \"#0D9488\"}, {\"name\": \"Black\", \"hex\": \"#111827\"}]"},

            {"anker-prime-67w-gan", "Anker Prime 67W 3-Port GaN Wall Charger", "Anker", "accessories", 49.00, 59.00, 17, 4.8, 880,
             "Compact GaN wall charger with dual USB-C ports and USB-A port capable of fast-charging MacBook Air and iPhone.",
             "-17%", true, 42, "[\"/images/products/gan-charger.webp\"]", "/images/products/gan-charger.webp", null, "BOM-ANK-043",
             "[\"Gallium Nitride (GaN) technology in a 51% smaller footprint\", \"3 ports: 2 USB-C and 1 USB-A for charging phone, tablet, and laptop\", \"MultiProtect safety system with active temperature regulation\", \"Foldable prongs for travel convenience\"]",
             null, "[{\"name\": \"Space Gray\", \"hex\": \"#475569\"}]"},

            {"apple-magsafe-charger", "Apple MagSafe Wireless Fast Charger 15W", "Apple", "accessories", 39.00, null, 0, 4.7, 1650,
             "Snap-on magnetic inductive wireless charger delivering optimized 15W wireless charging.",
             "New", true, 60, "[\"/images/products/magsafe-charger.webp\"]", "/images/products/magsafe-charger.webp", null, "BOM-APL-044",
             "[\"Perfect magnetic alignment on iPhone 12 and newer\", \"Up to 15W high-speed wireless charging\", \"Compatible with Qi wireless charging for AirPods\", \"Integrated 1m USB-C woven cable\"]",
             null, null},

            {"logitech-mx-master-3s", "Logitech MX Master 3S Ergonomic Mouse", "Logitech", "accessories", 99.00, null, 0, 4.9, 2210,
             "Ergonomic productivity mouse featuring electromagnetic MagSpeed scroll wheel and whisper-quiet clicks.",
             "Hot", true, 35, "[\"/images/products/mx-master-3s.webp\"]", "/images/products/mx-master-3s.webp", null, "BOM-LOG-045",
             "[\"MagSpeed electromagnetic scrolling scrolls 1,000 lines per second\", \"8K DPI any-surface track-on-glass optical sensor\", \"Quiet Click technology reduces click noise by 90%\", \"Ergonomic silhouette supports palm and wrist throughout the workday\"]",
             null, "[{\"name\": \"Graphite\", \"hex\": \"#1E293B\"}, {\"name\": \"Pale Grey\", \"hex\": \"#E2E8F0\"}]"},

            {"orbitkey-desk-mat", "Orbitkey Slim Vegan Leather Desk Mat", "Orbitkey", "accessories", 68.00, 78.00, 13, 4.8, 490,
             "Dual-layer desk pad with magnetic cable toolbar and hidden paper hideaway for clutter-free work.",
             "New", true, 22, "[\"/images/products/desk-mat.webp\"]", "/images/products/desk-mat.webp", null, "BOM-OBK-046",
             "[\"Organizes workspace with integrated cable management toolbar\", \"Underneath magnetic document hideaway organizes loose papers\", \"Water-resistant premium polyurethane vegan leather\", \"Smooth felt base prevents desk scratches and slipping\"]",
             "[\"Medium (68x37cm)\", \"Large (89x42cm)\"]", "[{\"name\": \"Midnight Black\", \"hex\": \"#0F172A\"}]"},

            {"caldigit-ts4-dock", "CalDigit TS4 18-Port Thunderbolt 4 Dock", "CalDigit", "accessories", 399.00, null, 0, 4.9, 340,
             "The ultimate 18-port workstation hub providing 98W host laptop charging, 2.5GbE LAN, and 8K display support.",
             "New", true, 11, "[\"/images/products/thunderbolt-dock.webp\"]", "/images/products/thunderbolt-dock.webp", null, "BOM-CDT-047",
             "[\"18 connectivity ports including 3 Thunderbolt 4 & 5 USB-A\", \"Up to 98W host laptop fast charging\", \"Supports single 8K or dual 6K displays at 60Hz\", \"2.5 Gigabit Ethernet port and front UHS-II SD card slot\"]",
             null, null}
        };
    }
}
