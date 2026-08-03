package com.achiles.e_com.service.finance.impl;

import com.achiles.e_com.dto.finance.*;
import com.achiles.e_com.entity.Order;
import com.achiles.e_com.entity.Payment;
import com.achiles.e_com.entity.Payout;
import com.achiles.e_com.entity.PlatformRevenueLog;
import com.achiles.e_com.entity.SellerProfile;
import com.achiles.e_com.exception.ResourceNotFoundException;
import com.achiles.e_com.repository.*;
import com.achiles.e_com.service.finance.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinanceServiceImpl implements FinanceService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PayoutRepository payoutRepository;
    private final PlatformRevenueLogRepository platformRevenueLogRepository;
    private final SellerProfileRepository sellerProfileRepository;

    // =============================================
    // PAYMENT METHODS
    // =============================================

    @Override
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + request.getOrderId()));

        // Mock Transaction ID Generation
        String transactionId = "TXN_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = Payment.builder()
                .order(order)
                .transactionId(transactionId)
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(Payment.PaymentStatus.SUCCESS) // Direct success for testing/COD
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // Update Order Payment Status
        order.setPaymentStatus("PAID");
        orderRepository.save(order);

        return mapToPaymentResponse(savedPayment);
    }

    @Override
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for order id: " + orderId));
        return mapToPaymentResponse(payment);
    }

    @Override
    @Transactional
    public PaymentResponse verifyPayment(String transactionId, boolean isSuccess) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + transactionId));

        if (isSuccess) {
            payment.setPaymentStatus(Payment.PaymentStatus.SUCCESS);
            payment.getOrder().setPaymentStatus("PAID");
        } else {
            payment.setPaymentStatus(Payment.PaymentStatus.FAILED);
            payment.getOrder().setPaymentStatus("FAILED");
        }

        orderRepository.save(payment.getOrder());
        Payment updatedPayment = paymentRepository.save(payment);
        return mapToPaymentResponse(updatedPayment);
    }

    @Override
    @Transactional
    public PaymentResponse processRefund(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for order id: " + orderId));

        payment.setPaymentStatus(Payment.PaymentStatus.REFUNDED);
        payment.getOrder().setPaymentStatus("REFUNDED");

        orderRepository.save(payment.getOrder());
        Payment updatedPayment = paymentRepository.save(payment);
        return mapToPaymentResponse(updatedPayment);
    }

    // =============================================
    // SELLER PAYOUT METHODS
    // =============================================

    @Override
    public List<SellerPayoutResponse> getPendingPayouts() {
        return payoutRepository.findByStatus(Payout.PayoutStatus.PENDING)
                .stream()
                .map(this::mapToPayoutResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SellerPayoutResponse processPayout(ProcessPayoutRequest request) {
        Payout payout = payoutRepository.findById(request.getPayoutId())
                .orElseThrow(() -> new ResourceNotFoundException("Payout not found with id: " + request.getPayoutId()));

        if (payout.getStatus() != Payout.PayoutStatus.PENDING) {
            throw new RuntimeException("Payout ID " + request.getPayoutId() + " is already " + payout.getStatus().name() + ". Cannot process again.");
        }

        payout.setStatus(Payout.PayoutStatus.PROCESSED);
        payout.setTransactionRefNumber(request.getTransactionRefNumber());
        payout.setProcessedAt(LocalDateTime.now());

        Payout savedPayout = payoutRepository.save(payout);
        return mapToPayoutResponse(savedPayout);
    }

    @Override
    public List<SellerPayoutResponse> getPayoutsBySeller(Long sellerId) {
        return payoutRepository.findBySellerId(sellerId)
                .stream()
                .map(this::mapToPayoutResponse)
                .collect(Collectors.toList());
    }

    // =============================================
    // PLATFORM REVENUE / FINANCE DASHBOARD
    // =============================================

    @Override
    public FinanceDashboardResponse getFinanceDashboard() {
        BigDecimal totalGrossRevenue = platformRevenueLogRepository.calculateTotalNetProfit();
        BigDecimal totalCommissionEarned = platformRevenueLogRepository.calculateTotalCommissionEarned();
        BigDecimal pendingSellerPayouts = payoutRepository.calculatePendingSellerPayouts();
        long totalCompletedTransactions = paymentRepository.count();

        return FinanceDashboardResponse.builder()
                .totalGrossRevenue(totalGrossRevenue != null ? totalGrossRevenue : BigDecimal.ZERO)
                .totalCommissionEarned(totalCommissionEarned != null ? totalCommissionEarned : BigDecimal.ZERO)
                .pendingSellerPayouts(pendingSellerPayouts != null ? pendingSellerPayouts : BigDecimal.ZERO)
                .totalCompletedTransactions(totalCompletedTransactions)
                .build();
    }

    @Override
    public List<PlatformRevenueResponse> getPlatformRevenueLogs() {
        return platformRevenueLogRepository.findAll()
                .stream()
                .map(this::mapToRevenueResponse)
                .collect(Collectors.toList());
    }

    // =============================================
    // PRIVATE MAPPERS
    // =============================================

    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus().name())
                .paymentDate(payment.getCreatedAt())
                .build();
    }

    private SellerPayoutResponse mapToPayoutResponse(Payout payout) {
        SellerProfile sellerProfile = sellerProfileRepository
                .findByUserId(payout.getSeller().getId())
                .orElse(null);

        return SellerPayoutResponse.builder()
                .payoutId(payout.getId())
                .sellerId(payout.getSeller().getId())
                .storeName(sellerProfile != null ? sellerProfile.getStoreName() : "N/A")
                .accountNumber(sellerProfile != null ? sellerProfile.getAccountNumber() : "N/A")
                .ifscCode(sellerProfile != null ? sellerProfile.getIfscCode() : "N/A")
                .bankName(sellerProfile != null ? sellerProfile.getBankName() : "N/A")
                .netPayableAmount(payout.getNetPayableAmount())
                .status(payout.getStatus().name())
                .createdAt(payout.getCreatedAt())
                .build();
    }

    private PlatformRevenueResponse mapToRevenueResponse(PlatformRevenueLog log) {
        return PlatformRevenueResponse.builder()
                .logId(log.getId())
                .orderId(log.getOrderId())
                .grossAmount(log.getGrossAmount())
                .commissionAmount(log.getCommissionAmount())
                .gatewayFee(log.getGatewayFee())
                .netCompanyProfit(log.getNetCompanyProfit())
                .createdAt(log.getCreatedAt())
                .build();
    }
}