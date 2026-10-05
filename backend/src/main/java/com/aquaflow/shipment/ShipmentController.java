package com.aquaflow.shipment;

import com.aquaflow.common.ApiResponse;
import com.aquaflow.shipment.dto.ShipmentRequest;
import com.aquaflow.shipment.dto.ShipmentResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Shipments")
@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {

  private final ShipmentService shipmentService;

  @Operation(summary = "Create a shipment")
  @PreAuthorize("hasAnyRole('OWNER','SUPPLIER')")
  @PostMapping
  public ResponseEntity<ApiResponse<ShipmentResponse>> createShipment(
      @Valid @RequestBody ShipmentRequest request) {
    ShipmentResponse created = shipmentService.createShipment(request);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.success(created, "Shipment created"));
  }

  @Operation(summary = "Get all shipments (owner only)")
  @PreAuthorize("hasRole('OWNER')")
  @GetMapping
  public ResponseEntity<ApiResponse<List<ShipmentResponse>>> getAllShipments() {
    return ResponseEntity.ok(
        ApiResponse.success(shipmentService.getAllShipments(), "Shipments retrieved"));
  }

  @Operation(summary = "Get shipment by id")
  @PreAuthorize("isAuthenticated()")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<ShipmentResponse>> getShipmentById(@PathVariable Long id) {
    return ResponseEntity.ok(
        ApiResponse.success(shipmentService.getShipmentById(id), "Shipment retrieved"));
  }

  @Operation(summary = "Get shipment by order id")
  @PreAuthorize("isAuthenticated()")
  @GetMapping("/order/{orderId}")
  public ResponseEntity<ApiResponse<ShipmentResponse>> getShipmentByOrderId(@PathVariable Long orderId) {
    return ResponseEntity.ok(
        ApiResponse.success(shipmentService.getShipmentByOrderId(orderId), "Shipment retrieved"));
  }

  @Operation(summary = "Update shipment status")
  @PreAuthorize("hasAnyRole('OWNER','SUPPLIER')")
  @PatchMapping("/{id}/status")
  public ResponseEntity<ApiResponse<ShipmentResponse>> updateShipmentStatus(
      @PathVariable Long id, @RequestParam String status) {
    return ResponseEntity.ok(
        ApiResponse.success(shipmentService.updateShipmentStatus(id, status), "Shipment updated"));
  }

  @Operation(summary = "Get my shipments (buyer only)")
  @PreAuthorize("hasRole('BUYER')")
  @GetMapping("/my")
  public ResponseEntity<ApiResponse<List<ShipmentResponse>>> getMyShipments() {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    return ResponseEntity.ok(
        ApiResponse.success(shipmentService.getShipmentsByBuyer(email), "Shipments retrieved"));
  }
}
