package com.bolt.ecommerce.service;

import com.bolt.ecommerce.exception.ResourceNotFoundException;
import com.bolt.ecommerce.model.Product;
import com.bolt.ecommerce.repository.ProductDao;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductDao productDao;

    public ProductService(ProductDao productDao) {
        this.productDao = productDao;
    }

    public List<Product> getAllProducts(String category, String search, String sortBy) {
        return productDao.findAll(category, search, sortBy);
    }

    public Product getProductById(String id) {
        return productDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Product createProduct(Product product) {
        productDao.save(product);
        return getProductById(product.getId());
    }

    public Product updateProduct(String id, Product product) {
        getProductById(id); // Ensure exists
        product.setId(id);
        productDao.update(product);
        return getProductById(id);
    }

    public void deleteProduct(String id) {
        getProductById(id); // Ensure exists
        productDao.deleteById(id);
    }
}
