package com.achiles.e_com.service.wishlist;

import com.achiles.e_com.entity.Product;
import com.achiles.e_com.entity.User;
import com.achiles.e_com.entity.Wishlist;
import com.achiles.e_com.entity.WishlistItem;
import com.achiles.e_com.repository.ProductRepository;
import com.achiles.e_com.repository.UserRepository;
import com.achiles.e_com.repository.WishlistItemRepository;
import com.achiles.e_com.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.achiles.e_com.dto.product.ProductResponse;
import java.util.Optional;
import java.util.List;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public void addProductToWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Wishlist wishlist = wishlistRepository.findByUser(user)
                .orElseGet(() -> wishlistRepository.save(Wishlist.builder().user(user).build()));

        Optional<WishlistItem> existingItem = wishlistItemRepository.findByWishlistAndProduct(wishlist, product);
        if (existingItem.isEmpty()) {
            WishlistItem newItem = WishlistItem.builder()
                    .wishlist(wishlist)
                    .product(product)
                    .build();
            wishlistItemRepository.save(newItem);
        }
    }

    @Override
    @Transactional
    public void removeProductFromWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Wishlist wishlist = wishlistRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));

        WishlistItem item = wishlistItemRepository.findByWishlistAndProduct(wishlist, product)
                .orElseThrow(() -> new RuntimeException("Item not found in wishlist"));

        wishlist.getItems().remove(item);
        wishlistItemRepository.delete(item);
        wishlistRepository.save(wishlist);
    }

    @Override
    public int getWishlistCount(Long userId) {
        return wishlistRepository.findByUserId(userId)
                .map(wishlist -> wishlist.getItems().size())
                .orElse(0);
    }

    @Override
    public List<ProductResponse> getWishlistItems(Long userId) {
        return wishlistRepository.findByUserId(userId)
                .map(wishlist -> wishlist.getItems().stream()
                        .map(item -> {
                            Product p = item.getProduct();
                            return ProductResponse.builder()
                                    .id(p.getId())
                                    .name(p.getName())
                                    .slug(p.getSlug())
                                    .description(p.getDescription())
                                    .price(p.getPrice())
                                    .stockQuantity(p.getStockQuantity())
                                    .isActive(p.getIsActive())
                                    .imageUrl(p.getImageUrl())
                                    .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                                    .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                                    .createdAt(p.getCreatedAt())
                                    .updatedAt(p.getUpdatedAt())
                                    .build();
                        })
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }
}
