package com.aquaflow.inventory.dto;

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
public class FishResponse {
  private Long id;
  private String commonName;
  private String scientificName;
  private String originCountry;
  private String description;
  private Integer quantityInStock;
  private BigDecimal pricePerUnit;
  private String imageUrl;
  private boolean active;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
