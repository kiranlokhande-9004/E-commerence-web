package com.bolt.ecommerce.controller;

import com.bolt.ecommerce.model.Product;
import com.bolt.ecommerce.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final com.bolt.ecommerce.config.CatalogDataInitializer catalogDataInitializer;

    public ProductController(ProductService productService, com.bolt.ecommerce.config.CatalogDataInitializer catalogDataInitializer) {
        this.productService = productService;
        this.catalogDataInitializer = catalogDataInitializer;
    }

    /**
     * POST /api/products/seed or GET /api/products/seed
     * Idempotently seeds or refreshes the entire product catalog and categories.
     */
    @RequestMapping(value = "/seed", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<java.util.Map<String, Object>> seedCatalog() {
        catalogDataInitializer.runManualSeed();
        List<Product> all = productService.getAllProducts(null, null, "featured");
        return ResponseEntity.ok(java.util.Map.of(
            "status", "success",
            "message", "Catalog seeded successfully",
            "productCount", all.size()
        ));
    }

    /**
     * GET /api/products
     * Retrieves products filtered by category, search query, and sort order.
     */
    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "featured") String sortBy
    ) {
        List<Product> products = productService.getAllProducts(category, search, sortBy);
        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/products/{id}
     * Retrieves a single product by its unique string identifier.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
}
