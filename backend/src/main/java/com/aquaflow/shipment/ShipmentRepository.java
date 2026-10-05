package com.aquaflow.shipment;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
  Optional<Shipment> findByOrderId(Long orderId);

  List<Shipment> findAllByStatus(String status);

  List<Shipment> findAllByOrderBuyerId(Long buyerId);

  List<Shipment> findByEstimatedArrivalBefore(LocalDate date);
}
