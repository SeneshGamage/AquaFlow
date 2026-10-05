package com.aquaflow.order;

import com.aquaflow.common.ApiResponse;
import com.aquaflow.order.dto.OrderRequest;
import com.aquaflow.order.dto.OrderResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Orders")
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;

  @Operation(summary = "Place an order")
  @PreAuthorize("hasRole('BUYER')")
  @PostMapping
  public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(@Valid @RequestBody OrderRequest request) {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    OrderResponse created = orderService.placeOrder(request, email);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.success(created, "Order placed"));
  }

  @Operation(summary = "Get all orders (owner only)")
  @PreAuthorize("hasRole('OWNER')")
  @GetMapping
  public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
    return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders(), "Orders retrieved"));
  }

  @Operation(summary = "Get my orders (buyer or supplier)")
  @PreAuthorize("hasAnyRole('BUYER','SUPPLIER')")
  @GetMapping("/my")
  public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String email = auth.getName();

    boolean isBuyer =
        auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_BUYER"));

    List<OrderResponse> orders =
        isBuyer ? orderService.getOrdersByBuyer(email) : orderService.getOrdersBySupplier(email);

    return ResponseEntity.ok(ApiResponse.success(orders, "Orders retrieved"));
  }

  @Operation(summary = "Get order by id")
  @PreAuthorize("isAuthenticated()")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(id), "Order retrieved"));
  }

  @Operation(summary = "Update order status")
  @PreAuthorize("hasAnyRole('OWNER','SUPPLIER')")
  @PatchMapping("/{id}/status")
  public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
      @PathVariable Long id, @RequestParam OrderStatus status) {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    return ResponseEntity.ok(
        ApiResponse.success(orderService.updateOrderStatus(id, status, email), "Order updated"));
  }
}
