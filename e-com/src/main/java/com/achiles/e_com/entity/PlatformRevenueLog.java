package com.achiles.e_com.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import  lombok.*;
import jakarta.persistence.*;
@Entity
@Table(name = "platform_revenue_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformRevenueLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "gross_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal grossAmount;

    @Column(name = "commission_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal commissionAmount; // Net Platform Revenue/Profit

    @Column(name = "gateway_fee", precision = 10, scale = 2)
    private BigDecimal gatewayFee;

    @Column(name = "net_company_profit", nullable = false, precision = 10, scale = 2)
    private BigDecimal netCompanyProfit;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
}
