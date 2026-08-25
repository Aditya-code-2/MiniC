package com.achiles.e_com.controller;

import com.achiles.e_com.service.wishlist.WishlistService;
import com.achiles.e_com.dto.product.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/add")
    public ResponseEntity<String> addToWishlist(@RequestParam Long userId, @RequestParam Long productId) {
        wishlistService.addProductToWishlist(userId, productId);
        return ResponseEntity.ok("Product added to wishlist");
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromWishlist(@RequestParam Long userId, @RequestParam Long productId) {
        wishlistService.removeProductFromWishlist(userId, productId);
        return ResponseEntity.ok("Product removed from wishlist");
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getWishlistCount(@RequestParam Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlistCount(userId));
    }

    @GetMapping("/items")
    public ResponseEntity<List<ProductResponse>> getWishlistItems(@RequestParam Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlistItems(userId));
    }
}
