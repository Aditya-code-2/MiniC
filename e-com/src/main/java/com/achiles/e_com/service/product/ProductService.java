package com.achiles.e_com.service.product;

import com.achiles.e_com.dto.product.ProductRequest;
import com.achiles.e_com.dto.product.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request);

    ProductResponse getProductById(Long id);

    ProductResponse getProductBySlug(String slug);

    List<ProductResponse> getAllProducts();

    List<ProductResponse> getProductsByCategory(Long categoryId);

    List<ProductResponse> getProductsBySeller(Long sellerId);

    // Live search method
    List<ProductResponse> searchProducts(String query);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);
}