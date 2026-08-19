package com.achiles.e_com.repository;

import com.achiles.e_com.entity.Product;
import com.achiles.e_com.entity.Wishlist;
import com.achiles.e_com.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    Optional<WishlistItem> findByWishlistAndProduct(Wishlist wishlist, Product product);
}
