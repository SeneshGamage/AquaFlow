package com.aquaflow.inventory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FishRequest {
  @NotBlank private String commonName;
  private String scientificName;
  @NotBlank private String originCountry;
  private String description;

  @NotNull
  @Min(0)
  private Integer quantityInStock;

  @NotNull
  @DecimalMin("0.01")
  private BigDecimal pricePerUnit;

  @Pattern(regexp = "^$|^(/img/|https://).+", message = "must start with /img/ or https://")
  private String imageUrl;
}
