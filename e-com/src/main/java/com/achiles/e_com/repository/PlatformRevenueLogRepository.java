package com.achiles.e_com.repository;
import com.achiles.e_com.entity.PlatformRevenueLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
@Repository
public interface PlatformRevenueLogRepository extends JpaRepository<PlatformRevenueLog, Long> {

    @Query("SELECT SUM(p.commissionAmount) FROM PlatformRevenueLog p")
    BigDecimal calculateTotalCommissionEarned();

    @Query("SELECT SUM(p.netCompanyProfit) FROM PlatformRevenueLog p")
    BigDecimal calculateTotalNetProfit();
}
