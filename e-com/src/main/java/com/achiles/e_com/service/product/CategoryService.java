package com.achiles.e_com.service.product;

import com.achiles.e_com.dto.product.CategoryRequest;
import com.achiles.e_com.dto.product.CategoryResponse;
import java.util.List;

public interface CategoryService {

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse getCategoryById(Long id);

    List<CategoryResponse> getAllCategories();

    CategoryResponse updateCategory(Long id, CategoryRequest request);

    void deleteCategory(Long id);
}