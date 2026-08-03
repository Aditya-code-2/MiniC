package com.achiles.e_com.dto.dashboard;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogisticsDashboardResponse {
     private Long pendingDeliveries;
     private Long inTransitOrders;
    private Long deliveredToday;
    private Long totalReturnedOrders;
    
}
