package com.achiles.e_com.dto.finance;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerPayoutResponse {

    private Long payoutId;
    private Long sellerId;
    private String storeName;
    private String accountNumber;
    private String ifscCode;
    private String bankName;
    private BigDecimal netPayableAmount; 
    private String status;             
    private LocalDateTime createdAt;
}
 