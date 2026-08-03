package com.achiles.e_com.dto.finance;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private String paymentMethod; // e.g., "RAZORPAY", "PAYPAL", "COD"
}