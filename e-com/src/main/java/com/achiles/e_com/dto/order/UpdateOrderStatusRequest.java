package com.achiles.e_com.dto.order;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class UpdateOrderStatusRequest {
    @NotBlank(message = "Order status is required")
    private String orderStatus;
}
