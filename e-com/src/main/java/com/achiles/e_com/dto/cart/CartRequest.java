package com.achiles.e_com.dto.cart;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotEmpty(message = "Cart items list cannot be empty")
    @Valid
    private List<CartItemRequest> items;
}