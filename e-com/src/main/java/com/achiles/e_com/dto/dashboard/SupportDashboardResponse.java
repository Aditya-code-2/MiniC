package com.achiles.e_com.dto.dashboard;
import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportDashboardResponse {

    private Long openTickets;
    private Long resolvedTicketsToday;
    private Long pendingRefundRequests;
}