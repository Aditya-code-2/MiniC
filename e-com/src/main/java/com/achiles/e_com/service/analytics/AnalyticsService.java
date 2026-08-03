package com.achiles.e_com.service.analytics;

import com.achiles.e_com.dto.analytics.DashboardSummaryResponse;

public interface AnalyticsService {

    DashboardSummaryResponse getAdminDashboardSummary();

    DashboardSummaryResponse getSellerDashboardSummary(Long sellerId);
}