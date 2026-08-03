package com.achiles.e_com.service.cart;

import com.achiles.e_com.dto.cart.CartItemRequest;
import com.achiles.e_com.dto.cart.CartResponse;

public interface CartService {

    CartResponse getCartByUserId(Long userId);

    CartResponse addItemToCart(Long userId, CartItemRequest request);

    CartResponse updateItemQuantity(Long userId, Long cartItemId, Integer quantity);

    CartResponse removeItemFromCart(Long userId, Long cartItemId);

    void clearCart(Long userId);
}