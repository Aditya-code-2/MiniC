package com.achiles.e_com.dto.finance;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformRevenueResponse {
    private Long logId;
    private Long orderId;
    private BigDecimal grossAmount;         
    private BigDecimal commissionAmount;    // Platform  commission share
    private BigDecimal gatewayFee;          // Razorpay/Payment gateway charge
    private BigDecimal netCompanyProfit;    // Final Net Profit
    private LocalDateTime createdAt;
}
