package com.achiles.e_com.repository;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.achiles.e_com.entity.Payout;

@Repository
public interface PayoutRepository extends JpaRepository<Payout, Long> {

    List<Payout> findByStatus(Payout.PayoutStatus status);

    List<Payout> findBySellerId(Long sellerId);

    @Query("SELECT SUM(p.netPayableAmount) FROM Payout p WHERE p.status = com.achiles.e_com.entity.Payout.PayoutStatus.PENDING")
    BigDecimal calculatePendingSellerPayouts();
}
