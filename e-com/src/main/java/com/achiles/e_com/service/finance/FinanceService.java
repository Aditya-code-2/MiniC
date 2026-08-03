package com.achiles.e_com.service.finance;

import com.achiles.e_com.dto.finance.*;

import java.util.List;

public interface FinanceService {

    // --- Payment Methods ---
    PaymentResponse processPayment(PaymentRequest request);

    PaymentResponse getPaymentByOrderId(Long orderId);

    PaymentResponse verifyPayment(String transactionId, boolean isSuccess);

    PaymentResponse processRefund(Long orderId);

    // --- Seller Payout Methods ---

    /** Get all pending seller payouts (Admin view) */
    List<SellerPayoutResponse> getPendingPayouts();

    /** Process (mark as completed) a specific payout with UTR/transaction ref */
    SellerPayoutResponse processPayout(ProcessPayoutRequest request);

    /** Get all payouts for a specific seller */
    List<SellerPayoutResponse> getPayoutsBySeller(Long sellerId);

    // --- Platform Revenue Methods ---

    /** Admin finance dashboard: total revenue, commission, pending payouts */
    FinanceDashboardResponse getFinanceDashboard();

    /** Get all platform revenue log entries */
    List<PlatformRevenueResponse> getPlatformRevenueLogs();
}