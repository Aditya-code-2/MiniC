package com.achiles.e_com.controller.finance;

import com.achiles.e_com.dto.finance.*;
import com.achiles.e_com.service.finance.FinanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    
    // PAYMENT ENDPOINTS
   

    @PostMapping("/payments/process")
    public ResponseEntity<PaymentResponse> processPayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(financeService.processPayment(request));
    }

    @GetMapping("/payments/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(financeService.getPaymentByOrderId(orderId));
    }

    @PostMapping("/payments/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(
            @RequestParam String transactionId,
            @RequestParam boolean isSuccess) {
        return ResponseEntity.ok(financeService.verifyPayment(transactionId, isSuccess));
    }

    @PostMapping("/payments/refund/{orderId}")
    public ResponseEntity<PaymentResponse> processRefund(@PathVariable Long orderId) {
        return ResponseEntity.ok(financeService.processRefund(orderId));
    }

    
    // SELLER PAYOUT ENDPOINTS  (Admin)
   

    /** GET /api/v1/payouts/pending — List all pending payouts */
    @GetMapping("/payouts/pending")
    public ResponseEntity<List<SellerPayoutResponse>> getPendingPayouts() {
        return ResponseEntity.ok(financeService.getPendingPayouts());
    }

    /** POST /api/v1/payouts/process — Mark a payout as processed (UTR entry) */
    @PostMapping("/payouts/process")
    public ResponseEntity<SellerPayoutResponse> processPayout(@Valid @RequestBody ProcessPayoutRequest request) {
        return ResponseEntity.ok(financeService.processPayout(request));
    }

    /** GET /api/v1/payouts/seller/{sellerId} — All payouts for a given seller */
    @GetMapping("/payouts/seller/{sellerId}")
    public ResponseEntity<List<SellerPayoutResponse>> getPayoutsBySeller(@PathVariable Long sellerId) {
        return ResponseEntity.ok(financeService.getPayoutsBySeller(sellerId));
    }

    
    // PLATFORM REVENUE / FINANCE DASHBOARD  (Admin)


    /** GET /api/v1/finance/dashboard — Admin finance overview */
    @GetMapping("/finance/dashboard")
    public ResponseEntity<FinanceDashboardResponse> getFinanceDashboard() {
        return ResponseEntity.ok(financeService.getFinanceDashboard());
    }

    /** GET /api/v1/finance/revenue-logs — Full platform revenue ledger */
    @GetMapping("/finance/revenue-logs")
    public ResponseEntity<List<PlatformRevenueResponse>> getPlatformRevenueLogs() {
        return ResponseEntity.ok(financeService.getPlatformRevenueLogs());
    }
}