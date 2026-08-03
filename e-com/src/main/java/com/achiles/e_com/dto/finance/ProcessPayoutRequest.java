package com.achiles.e_com.dto.finance;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProcessPayoutRequest {
    @NotNull(message = "Payout ID cannot be null")
   private Long payoutId; 

   @NotBlank(message = "Transaction Reference / UTR Number is required")    
   private String transactionRefNumber;
}
