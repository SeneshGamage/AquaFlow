package com.aquaflow.shipment;

import com.aquaflow.order.Order;
import com.aquaflow.order.OrderRepository;
import com.aquaflow.order.OrderStatus;
import com.aquaflow.shipment.dto.ShipmentRequest;
import com.aquaflow.shipment.dto.ShipmentResponse;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShipmentService {

  private final ShipmentRepository shipmentRepository;
  private final OrderRepository orderRepository;

  public ShipmentResponse createShipment(ShipmentRequest request) {
    Order order =
        orderRepository
            .findById(request.getOrderId())
            .orElseThrow(() -> new EntityNotFoundException("Order not found: " + request.getOrderId()));

    if (order.getStatus() != OrderStatus.PACKED && order.getStatus() != OrderStatus.SHIPPED) {
      throw new RuntimeException("Order is not ready for shipment: " + order.getId());
    }

    Shipment shipment =
        Shipment.builder()
            .order(order)
            .carrierName(request.getCarrierName())
            .trackingNumber(request.getTrackingNumber())
            .originCountry(request.getOriginCountry())
            .destinationCountry(request.getDestinationCountry())
            .estimatedArrival(request.getEstimatedArrival())
            .complianceDocumentUrl(request.getComplianceDocumentUrl())
            .healthCertificateUrl(request.getHealthCertificateUrl())
            .notes(request.getNotes())
            .status("IN_TRANSIT")
            .build();

    Shipment saved = shipmentRepository.save(shipment);
    log.info("Shipment created for order {}", order.getId());
    return mapToResponse(saved);
  }

  public List<ShipmentResponse> getAllShipments() {
    return shipmentRepository.findAll().stream().map(this::mapToResponse).toList();
  }

  public ShipmentResponse getShipmentById(Long id) {
    Shipment s =
        shipmentRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Shipment not found: " + id));
    return mapToResponse(s);
  }

  public ShipmentResponse getShipmentByOrderId(Long orderId) {
    Shipment s =
        shipmentRepository
            .findByOrderId(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Shipment not found for order: " + orderId));
    return mapToResponse(s);
  }

  public ShipmentResponse updateShipmentStatus(Long id, String newStatus) {
    Shipment s =
        shipmentRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Shipment not found: " + id));

    s.setStatus(newStatus);
    if ("DELIVERED".equalsIgnoreCase(newStatus)) {
      s.setActualArrival(LocalDateTime.now());
    }

    Shipment saved = shipmentRepository.save(s);
    log.info("Shipment {} status updated to {}", id, newStatus);
    return mapToResponse(saved);
  }

  public List<ShipmentResponse> getShipmentsByBuyer(String buyerEmail) {
    Long buyerId =
        orderRepository.findAll().stream()
            .filter(o -> o.getBuyer() != null)
            .filter(o -> buyerEmail.equalsIgnoreCase(o.getBuyer().getEmail()))
            .map(o -> o.getBuyer().getId())
            .findFirst()
            .orElse(null);

    if (buyerId == null) {
      return List.of();
    }

    return shipmentRepository.findAllByOrderBuyerId(buyerId).stream()
        .map(this::mapToResponse)
        .toList();
  }

  private ShipmentResponse mapToResponse(Shipment s) {
    Order o = s.getOrder();
    String buyerName = o != null && o.getBuyer() != null ? o.getBuyer().getName() : null;
    String fishName = o != null && o.getFish() != null ? o.getFish().getCommonName() : null;

    return ShipmentResponse.builder()
        .id(s.getId())
        .orderId(o == null ? null : o.getId())
        .buyerName(buyerName)
        .fishName(fishName)
        .carrierName(s.getCarrierName())
        .trackingNumber(s.getTrackingNumber())
        .originCountry(s.getOriginCountry())
        .destinationCountry(s.getDestinationCountry())
        .status(s.getStatus())
        .complianceDocumentUrl(s.getComplianceDocumentUrl())
        .healthCertificateUrl(s.getHealthCertificateUrl())
        .estimatedArrival(s.getEstimatedArrival())
        .actualArrival(s.getActualArrival())
        .notes(s.getNotes())
        .createdAt(s.getCreatedAt())
        .updatedAt(s.getUpdatedAt())
        .build();
  }
}
