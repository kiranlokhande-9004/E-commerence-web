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

    public ProductController(ProductService productService) {
        this.productService = productService;
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
