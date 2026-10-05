package com.aquaflow.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
  @NotNull private Long fishId;

  @NotNull
  @Min(1)
  private Integer quantity;

  private String notes;
}
