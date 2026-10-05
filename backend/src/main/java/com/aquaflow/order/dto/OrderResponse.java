package com.aquaflow.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
  private Long id;
  private Long buyerId;
  private String buyerName;
  private Long supplierId;
  private String supplierName;
  private Long fishId;
  private String fishName;
  private Integer quantity;
  private BigDecimal totalPrice;
  private String status;
  private String notes;
  private String rejectionReason;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
