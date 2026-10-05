package com.aquaflow.shipment;

import com.aquaflow.order.Order;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "shipments")
@EntityListeners(AuditingEntityListener.class)
public class Shipment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "order_id", unique = true)
  private Order order;

  @Column(name = "carrier_name")
  private String carrierName;

  @Column(name = "tracking_number")
  private String trackingNumber;

  @Column(name = "origin_country")
  private String originCountry;

  @Column(name = "destination_country")
  private String destinationCountry;

  @Builder.Default
  private String status = "PREPARING";

  @Column(name = "compliance_document_url")
  private String complianceDocumentUrl;

  @Column(name = "health_certificate_url")
  private String healthCertificateUrl;

  @Column(name = "estimated_arrival")
  private LocalDate estimatedArrival;

  @Column(name = "actual_arrival")
  private LocalDateTime actualArrival;

  private String notes;

  @CreatedDate
  @Column(updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  private LocalDateTime updatedAt;
}
