package com.aquaflow.shipment.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentRequest {
  @NotNull private Long orderId;
  @NotBlank private String carrierName;
  @NotBlank private String trackingNumber;
  @NotBlank private String originCountry;
  @NotBlank private String destinationCountry;

  @NotNull
  @Future
  private LocalDate estimatedArrival;

  private String complianceDocumentUrl;
  private String healthCertificateUrl;
  private String notes;
}
