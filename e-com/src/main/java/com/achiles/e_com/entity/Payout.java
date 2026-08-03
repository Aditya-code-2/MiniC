package com.achiles.e_com.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "payouts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(name = "total_sales_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalSalesAmount; // Gross Sales

    @Column(name = "platform_commission", nullable = false, precision = 10, scale = 2)
    private BigDecimal platformCommission; // Platform Commission Deduction

    @Column(name = "net_payable_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal netPayableAmount; // Seller's In-hand payout

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private PayoutStatus status = PayoutStatus.PENDING;

    @Column(name = "transaction_ref_number")
    private String transactionRefNumber; // UTR / Bank Ref No.

    @Column(name = "remarks")
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    public enum PayoutStatus {
        PENDING, PROCESSED, REJECTED
    }
    
}
