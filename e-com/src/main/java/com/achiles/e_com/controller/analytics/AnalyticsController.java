package com.achiles.e_com.controller.analytics;

import com.achiles.e_com.dto.analytics.DashboardSummaryResponse;
import com.achiles.e_com.service.analytics.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    // Admin Dashboard Overall Summary
    @GetMapping("/admin/summary")
    public ResponseEntity<DashboardSummaryResponse> getAdminSummary() {
        return ResponseEntity.ok(analyticsService.getAdminDashboardSummary());
    }

    // Seller Specific Dashboard Summary
    @GetMapping("/seller/{sellerId}/summary")
    public ResponseEntity<DashboardSummaryResponse> getSellerSummary(@PathVariable Long sellerId) {
        return ResponseEntity.ok(analyticsService.getSellerDashboardSummary(sellerId));
    }
}