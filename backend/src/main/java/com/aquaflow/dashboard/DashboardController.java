package com.aquaflow.dashboard;

import com.aquaflow.common.ApiResponse;
import com.aquaflow.inventory.Fish;
import com.aquaflow.inventory.FishRepository;
import com.aquaflow.order.OrderRepository;
import com.aquaflow.order.OrderStatus;
import com.aquaflow.shipment.ShipmentRepository;
import com.aquaflow.user.Role;
import com.aquaflow.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Dashboard")
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('OWNER')")
public class DashboardController {

  private final OrderRepository orderRepository;
  private final FishRepository fishRepository;
  private final UserRepository userRepository;
  private final ShipmentRepository shipmentRepository;

  @Operation(summary = "Get owner dashboard summary")
  @GetMapping("/summary")
  public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary() {
    Map<String, Object> summary = new HashMap<>();

    summary.put("totalOrders", orderRepository.count());
    summary.put("pendingOrders", orderRepository.countByStatus(OrderStatus.PENDING));
    summary.put("activeShipments", shipmentRepository.findAllByStatus("IN_TRANSIT").size());
    summary.put("totalFishSpecies", fishRepository.findAllByActiveTrue().size());
    summary.put("totalSuppliers", userRepository.findAllByRole(Role.SUPPLIER).size());
    summary.put("totalBuyers", userRepository.findAllByRole(Role.BUYER).size());

    List<Map<String, Object>> lowStockFish =
        fishRepository.findAllByActiveTrue().stream()
            .filter(f -> f.getQuantityInStock() != null && f.getQuantityInStock() < 10)
            .map(this::toLowStockMap)
            .toList();

    summary.put("lowStockFish", lowStockFish);

    return ResponseEntity.ok(ApiResponse.success(summary, "Dashboard summary retrieved"));
  }

  private Map<String, Object> toLowStockMap(Fish fish) {
    Map<String, Object> m = new HashMap<>();
    m.put("id", fish.getId());
    m.put("commonName", fish.getCommonName());
    m.put("quantityInStock", fish.getQuantityInStock());
    return m;
  }
}

