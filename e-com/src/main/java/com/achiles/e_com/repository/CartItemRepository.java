package com.achiles.e_com.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import com.achiles.e_com.entity.CartItem;
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);
    void deleteByCartId(Long cartId);

    
}