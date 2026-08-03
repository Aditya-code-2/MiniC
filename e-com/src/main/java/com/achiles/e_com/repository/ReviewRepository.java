package com.achiles.e_com.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.achiles.e_com.entity.Review;
import org.springframework.data.domain.*;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByProductId(Long productId, Pageable pageable);
    boolean existsByUserIdAndProductId(Long userId, Long productId);
}
