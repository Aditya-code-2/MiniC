package com.achiles.e_com.service.wishlist;

import com.achiles.e_com.dto.product.ProductResponse;
import java.util.List;

public interface WishlistService {
    void addProductToWishlist(Long userId, Long productId);
    void removeProductFromWishlist(Long userId, Long productId);
    int getWishlistCount(Long userId);
    List<ProductResponse> getWishlistItems(Long userId);
}
