package com.bolt.ecommerce.repository;

import com.bolt.ecommerce.model.Product;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Repository
public class ProductDao {

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public ProductDao(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    private boolean hasColumn(ResultSet rs, String colName) {
        try {
            rs.findColumn(colName);
            return true;
        } catch (SQLException e) {
            return false;
        }
    }

    private String getStringSafe(ResultSet rs, String colName) {
        try {
            return rs.getString(colName);
        } catch (SQLException e) {
            return null;
        }
    }

    private final RowMapper<Product> productRowMapper = new RowMapper<>() {
        @Override
        public Product mapRow(ResultSet rs, int rowNum) throws SQLException {
            Product p = new Product();
            p.setId(getStringSafe(rs, "id"));
            p.setName(getStringSafe(rs, "name"));

            String brand = getStringSafe(rs, "brand");
            p.setBrand(brand != null && !brand.trim().isEmpty() ? brand : "BOLT");

            String category = getStringSafe(rs, "category_id");
            if (category == null || category.trim().isEmpty()) {
                category = getStringSafe(rs, "category");
            }
            p.setCategory(category != null ? category : "accessories");

            try {
                p.setPrice(rs.getBigDecimal("price"));
            } catch (Exception e) {
                p.setPrice(java.math.BigDecimal.ZERO);
            }

            try {
                p.setOriginalPrice(rs.getBigDecimal("original_price"));
            } catch (Exception e) {
                p.setOriginalPrice(null);
            }

            try {
                p.setDiscountPercent((Integer) rs.getObject("discount_percent"));
            } catch (Exception e) {
                p.setDiscountPercent(0);
            }

            try {
                p.setRating(rs.getObject("rating") != null ? rs.getDouble("rating") : 5.0);
            } catch (Exception e) {
                p.setRating(5.0);
            }

            try {
                p.setReviewsCount(rs.getObject("reviews_count") != null ? rs.getInt("reviews_count") : 0);
            } catch (Exception e) {
                p.setReviewsCount(0);
            }

            p.setDescription(getStringSafe(rs, "description"));
            p.setBadge(getStringSafe(rs, "badge"));

            if (rowNum == 0) {
                try {
                    java.sql.ResultSetMetaData meta = rs.getMetaData();
                    for (int i = 1; i <= meta.getColumnCount(); i++) {
                        System.out.println("[SQL-DEBUG] Column " + i + ": " + meta.getColumnName(i) + " = " + rs.getObject(i));
                    }
                } catch (Exception ignored) {}
            }

            // Check all candidate stock column names (stock, stock_count, quantity, stock_quantity)
            int stock = 0;
            String[] stockCandidateCols = {"stock", "stock_count", "quantity", "stock_quantity", "inventory", "units_in_stock"};
            for (String col : stockCandidateCols) {
                try {
                    Object val = rs.getObject(col);
                    if (val != null) {
                        int count = ((Number) val).intValue();
                        if (count > 0) {
                            stock = count;
                            break;
                        } else if (stock == 0) {
                            stock = count;
                        }
                    }
                } catch (Exception ignored) {}
            }
            p.setStockCount(stock);

            boolean inStock = stock > 0;
            try {
                if (rs.getObject("in_stock") != null) {
                    inStock = rs.getBoolean("in_stock");
                }
            } catch (Exception ignored) {}
            p.setInStock(inStock);

            String defaultImage = getStringSafe(rs, "image");
            if (defaultImage == null || defaultImage.trim().isEmpty()) {
                defaultImage = getStringSafe(rs, "image_url");
            }
            if (defaultImage == null || defaultImage.trim().isEmpty()) {
                defaultImage = getStringSafe(rs, "img");
            }
            p.setImage(defaultImage);

            p.setModelUrl(getStringSafe(rs, "model_url"));
            p.setSku(getStringSafe(rs, "sku"));
            p.setCreatedAt(getStringSafe(rs, "created_at"));

            // Parse JSON images
            String imagesJson = getStringSafe(rs, "images");
            if (imagesJson != null && !imagesJson.trim().isEmpty()) {
                try {
                    List<String> images = objectMapper.readValue(imagesJson, new TypeReference<List<String>>() {});
                    p.setImages(images);
                } catch (Exception e) {
                    p.setImages(p.getImage() != null ? Collections.singletonList(p.getImage()) : Collections.emptyList());
                }
            } else if (p.getImage() != null && !p.getImage().trim().isEmpty()) {
                p.setImages(Collections.singletonList(p.getImage()));
            } else {
                p.setImages(Collections.emptyList());
            }

            // Parse JSON features
            String featuresJson = getStringSafe(rs, "features");
            if (featuresJson != null && !featuresJson.trim().isEmpty()) {
                try {
                    List<String> features = objectMapper.readValue(featuresJson, new TypeReference<List<String>>() {});
                    p.setFeatures(features);
                } catch (Exception e) {
                    p.setFeatures(Collections.emptyList());
                }
            } else {
                p.setFeatures(Collections.emptyList());
            }

            // Parse JSON sizes
            String sizesJson = getStringSafe(rs, "sizes");
            if (sizesJson != null && !sizesJson.trim().isEmpty()) {
                try {
                    List<String> sizes = objectMapper.readValue(sizesJson, new TypeReference<List<String>>() {});
                    p.setSizes(sizes);
                } catch (Exception ignored) {}
            }

            // Parse JSON colors
            String colorsJson = getStringSafe(rs, "colors");
            if (colorsJson != null && !colorsJson.trim().isEmpty()) {
                try {
                    List<Product.ProductColor> colors = objectMapper.readValue(colorsJson, new TypeReference<List<Product.ProductColor>>() {});
                    p.setColors(colors);
                } catch (Exception ignored) {}
            }

            return p;
        }
    };

    /**
     * Parameterized query with category, search and sort filters
     */
    public List<Product> findAll(String category, String search, String sortBy) {
        StringBuilder sql = new StringBuilder("SELECT * FROM products WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (category != null && !category.trim().isEmpty()) {
            sql.append(" AND (LOWER(category_id) = LOWER(?) OR LOWER(category) = LOWER(?))");
            params.add(category.trim());
            params.add(category.trim());
        }

        if (search != null && !search.trim().isEmpty()) {
            sql.append(" AND (LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(description) LIKE ?)");
            String pattern = "%" + search.trim().toLowerCase() + "%";
            params.add(pattern);
            params.add(pattern);
            params.add(pattern);
        }

        if ("price-asc".equalsIgnoreCase(sortBy)) {
            sql.append(" ORDER BY price ASC");
        } else if ("price-desc".equalsIgnoreCase(sortBy)) {
            sql.append(" ORDER BY price DESC");
        } else if ("rating".equalsIgnoreCase(sortBy)) {
            sql.append(" ORDER BY rating DESC");
        } else {
            sql.append(" ORDER BY created_at ASC");
        }

        return jdbcTemplate.query(sql.toString(), productRowMapper, params.toArray());
    }

    public Optional<Product> findById(String id) {
        String sql = "SELECT * FROM products WHERE id = ?";
        try {
            Product product = jdbcTemplate.queryForObject(sql, productRowMapper, id);
            return Optional.ofNullable(product);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public int save(Product p) {
        String sql = """
            INSERT INTO products (
                id, name, brand, category_id, price, original_price, discount_percent,
                rating, reviews_count, description, badge, in_stock, stock_count,
                images, image, model_url, sku, features, sizes, colors
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;

        String imagesJson = serializeJson(p.getImages());
        String featuresJson = serializeJson(p.getFeatures());
        String sizesJson = serializeJson(p.getSizes());
        String colorsJson = serializeJson(p.getColors());
        String defaultImage = p.getImage() != null ? p.getImage() : (p.getImages() != null && !p.getImages().isEmpty() ? p.getImages().get(0) : null);

        return jdbcTemplate.update(
                sql,
                p.getId(),
                p.getName(),
                p.getBrand(),
                p.getCategory(),
                p.getPrice(),
                p.getOriginalPrice(),
                p.getDiscountPercent(),
                p.getRating() != null ? p.getRating() : 5.0,
                p.getReviewsCount() != null ? p.getReviewsCount() : 0,
                p.getDescription(),
                p.getBadge(),
                p.getInStock() != null ? p.getInStock() : true,
                p.getStockCount() != null ? p.getStockCount() : 0,
                imagesJson,
                defaultImage,
                p.getModelUrl(),
                p.getSku(),
                featuresJson,
                sizesJson,
                colorsJson
        );
    }

    public int update(Product p) {
        String sql = """
            UPDATE products SET
                name = ?, brand = ?, category_id = ?, price = ?, original_price = ?,
                discount_percent = ?, rating = ?, reviews_count = ?, description = ?,
                badge = ?, in_stock = ?, stock_count = ?, images = ?, image = ?,
                model_url = ?, sku = ?, features = ?, sizes = ?, colors = ?
            WHERE id = ?
        """;

        String imagesJson = serializeJson(p.getImages());
        String featuresJson = serializeJson(p.getFeatures());
        String sizesJson = serializeJson(p.getSizes());
        String colorsJson = serializeJson(p.getColors());
        String defaultImage = p.getImage() != null ? p.getImage() : (p.getImages() != null && !p.getImages().isEmpty() ? p.getImages().get(0) : null);

        return jdbcTemplate.update(
                sql,
                p.getName(),
                p.getBrand(),
                p.getCategory(),
                p.getPrice(),
                p.getOriginalPrice(),
                p.getDiscountPercent(),
                p.getRating(),
                p.getReviewsCount(),
                p.getDescription(),
                p.getBadge(),
                p.getInStock(),
                p.getStockCount(),
                imagesJson,
                defaultImage,
                p.getModelUrl(),
                p.getSku(),
                featuresJson,
                sizesJson,
                colorsJson,
                p.getId()
        );
    }

    public int deleteById(String id) {
        String sql = "DELETE FROM products WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    private String serializeJson(Object object) {
        if (object == null) return null;
        try {
            return objectMapper.writeValueAsString(object);
        } catch (Exception e) {
            return "[]";
        }
    }
}
