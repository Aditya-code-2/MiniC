package com.achiles.e_com.dto.finance;
import lombok.*;
import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinanceDashboardResponse {

    private BigDecimal totalGrossRevenue;      
    private BigDecimal totalCommissionEarned;  
    private BigDecimal pendingSellerPayouts;  
    private Long totalCompletedTransactions;
}
