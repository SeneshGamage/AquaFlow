package com.aquaflow.order;

import com.aquaflow.inventory.Fish;
import com.aquaflow.inventory.FishRepository;
import com.aquaflow.order.dto.OrderRequest;
import com.aquaflow.order.dto.OrderResponse;
import com.aquaflow.user.User;
import com.aquaflow.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

  private final OrderRepository orderRepository;
  private final FishRepository fishRepository;
  private final UserRepository userRepository;

  public OrderResponse placeOrder(OrderRequest request, String buyerEmail) {
    User buyer =
        userRepository
            .findByEmail(buyerEmail)
            .orElseThrow(() -> new EntityNotFoundException("Buyer not found: " + buyerEmail));

    Fish fish =
        fishRepository
            .findByIdAndActiveTrue(request.getFishId())
            .orElseThrow(() -> new EntityNotFoundException("Fish not found: " + request.getFishId()));

    if (fish.getQuantityInStock() == null || fish.getQuantityInStock() < request.getQuantity()) {
      throw new RuntimeException("Insufficient stock for fish: " + fish.getCommonName());
    }

    BigDecimal totalPrice =
        fish.getPricePerUnit().multiply(BigDecimal.valueOf(request.getQuantity()));

    Order order =
        Order.builder()
            .buyer(buyer)
            .fish(fish)
            .quantity(request.getQuantity())
            .totalPrice(totalPrice)
            .status(OrderStatus.PENDING)
            .notes(request.getNotes())
            .build();

    Order saved = orderRepository.save(order);
    log.info("Order placed: {} by {}", saved.getId(), buyerEmail);
    return mapToResponse(saved);
  }

  public List<OrderResponse> getAllOrders() {
    return orderRepository.findAll().stream().map(this::mapToResponse).toList();
  }

  public List<OrderResponse> getOrdersByBuyer(String buyerEmail) {
    User buyer =
        userRepository
            .findByEmail(buyerEmail)
            .orElseThrow(() -> new EntityNotFoundException("Buyer not found: " + buyerEmail));
    return orderRepository.findAllByBuyerId(buyer.getId()).stream().map(this::mapToResponse).toList();
  }

  public List<OrderResponse> getOrdersBySupplier(String supplierEmail) {
    User supplier =
        userRepository
            .findByEmail(supplierEmail)
            .orElseThrow(() -> new EntityNotFoundException("Supplier not found: " + supplierEmail));
    return orderRepository.findAllBySupplierId(supplier.getId()).stream()
        .map(this::mapToResponse)
        .toList();
  }

  public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus, String userEmail) {
    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));

    OrderStatus current = order.getStatus();
    if (current == null || !current.canTransitionTo(newStatus)) {
      throw new RuntimeException(
          "Invalid status transition: " + current + " -> " + newStatus);
    }

    // On confirmation, assign supplier (calling user) and reduce stock.
    if (newStatus == OrderStatus.CONFIRMED) {
      User supplier =
          userRepository
              .findByEmail(userEmail)
              .orElseThrow(() -> new EntityNotFoundException("Supplier not found: " + userEmail));
      order.setSupplier(supplier);

      Fish fish = order.getFish();
      int remaining = fish.getQuantityInStock() - order.getQuantity();
      if (remaining < 0) {
        throw new RuntimeException("Insufficient stock to confirm order: " + orderId);
      }
      fish.setQuantityInStock(remaining);
      fishRepository.save(fish);
    }

    // On cancel, restore stock if it was already confirmed.
    if (newStatus == OrderStatus.CANCELLED && current == OrderStatus.CONFIRMED) {
      Fish fish = order.getFish();
      fish.setQuantityInStock(fish.getQuantityInStock() + order.getQuantity());
      fishRepository.save(fish);
    }

    order.setStatus(newStatus);
    Order saved = orderRepository.save(order);
    log.info("Order {} status updated: {} -> {}", orderId, current, newStatus);
    return mapToResponse(saved);
  }

  public OrderResponse getOrderById(Long id) {
    Order order =
        orderRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Order not found: " + id));
    return mapToResponse(order);
  }

  private OrderResponse mapToResponse(Order order) {
    User buyer = order.getBuyer();
    User supplier = order.getSupplier();
    Fish fish = order.getFish();

    return OrderResponse.builder()
        .id(order.getId())
        .buyerId(buyer == null ? null : buyer.getId())
        .buyerName(buyer == null ? null : buyer.getName())
        .supplierId(supplier == null ? null : supplier.getId())
        .supplierName(supplier == null ? null : supplier.getName())
        .fishId(fish == null ? null : fish.getId())
        .fishName(fish == null ? null : fish.getCommonName())
        .quantity(order.getQuantity())
        .totalPrice(order.getTotalPrice())
        .status(order.getStatus() == null ? null : order.getStatus().name())
        .notes(order.getNotes())
        .rejectionReason(order.getRejectionReason())
        .createdAt(order.getCreatedAt())
        .updatedAt(order.getUpdatedAt())
        .build();
  }
}
