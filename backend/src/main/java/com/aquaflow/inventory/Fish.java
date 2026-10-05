package com.aquaflow.inventory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
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
@Table(name = "fish")
@EntityListeners(AuditingEntityListener.class)
public class Fish {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "common_name", nullable = false)
  private String commonName;

  @Column(name = "scientific_name")
  private String scientificName;

  @Column(name = "origin_country", nullable = false)
  private String originCountry;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Builder.Default
  @Column(name = "quantity_in_stock", nullable = false)
  private Integer quantityInStock = 0;

  @Column(name = "price_per_unit", nullable = false, precision = 10, scale = 2)
  private BigDecimal pricePerUnit;

  @Column(name = "image_url")
  private String imageUrl;

  @Builder.Default
  private boolean active = true;

  @CreatedDate
  @Column(updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  private LocalDateTime updatedAt;
}
