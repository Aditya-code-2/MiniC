package com.achiles.e_com.dto.dashboard;
import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatalogDashboardResponse {

    private Long totalProducts;
    private Long pendingProductApprovals;
    private Long outOfStockProducts;
}
