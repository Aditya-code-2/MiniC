package com.achiles.e_com.service.wishlist;

public interface WishlistService {
    void addProductToWishlist(Long userId, Long productId);
    void removeProductFromWishlist(Long userId, Long productId);
    int getWishlistCount(Long userId);
}
