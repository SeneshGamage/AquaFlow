package com.aquaflow.shipment.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentResponse {
  private Long id;
  private Long orderId;
  private String buyerName;
  private String fishName;
  private String carrierName;
  private String trackingNumber;
  private String originCountry;
  private String destinationCountry;
  private String status;
  private String complianceDocumentUrl;
  private String healthCertificateUrl;
  private LocalDate estimatedArrival;
  private LocalDateTime actualArrival;
  private String notes;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
