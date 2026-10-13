package com.aquaflow.order;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.aquaflow.inventory.Fish;
import com.aquaflow.inventory.FishRepository;
import com.aquaflow.order.dto.OrderRequest;
import com.aquaflow.order.dto.OrderResponse;
import com.aquaflow.user.Role;
import com.aquaflow.user.User;
import com.aquaflow.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

  @Mock private OrderRepository orderRepository;
  @Mock private FishRepository fishRepository;
  @Mock private UserRepository userRepository;

  @InjectMocks private OrderService orderService;

  private final User buyer =
      User.builder().id(1L).name("Shop").email("shop@x.com").role(Role.BUYER).enabled(true).build();

  private Fish fish(int stock) {
    return Fish.builder()
        .id(5L)
        .commonName("Betta")
        .originCountry("Thailand")
        .pricePerUnit(new BigDecimal("10.00"))
        .quantityInStock(stock)
        .build();
  }

  private Order pendingOrder(int qty) {
    return Order.builder().id(7L).buyer(buyer).fish(fish(20)).quantity(qty)
        .totalPrice(new BigDecimal("30.00")).status(OrderStatus.PENDING).build();
  }
  
  @Test
  void confirm_insufficientStock_throwsAndDoesNotSave() {
    User supplier = User.builder().id(2L).name("Sup").email("sup@x.com").role(Role.SUPPLIER).enabled(true).build();
    when(orderRepository.findById(7L)).thenReturn(Optional.of(pendingOrder(3)));
    when(userRepository.findByEmail("sup@x.com")).thenReturn(Optional.of(supplier));
    when(fishRepository.decrementStock(5L, 3)).thenReturn(0);
  
    assertThrows(IllegalArgumentException.class,
        () -> orderService.updateOrderStatus(7L, OrderStatus.CONFIRMED, "sup@x.com"));
    verify(orderRepository, never()).save(any());
  }
  
  @Test
  void confirm_success_marksConfirmedAndAssignsSupplier() {
    User supplier = User.builder().id(2L).name("Sup").email("sup@x.com").role(Role.SUPPLIER).enabled(true).build();
    when(orderRepository.findById(7L)).thenReturn(Optional.of(pendingOrder(3)));
    when(userRepository.findByEmail("sup@x.com")).thenReturn(Optional.of(supplier));
    when(fishRepository.decrementStock(5L, 3)).thenReturn(1);
    when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
  
    OrderResponse res = orderService.updateOrderStatus(7L, OrderStatus.CONFIRMED, "sup@x.com");
  
    assertEquals("CONFIRMED", res.getStatus());
    assertEquals(2L, res.getSupplierId());
  }

  @Test
  void placeOrder_success_calculatesTotalAndIsPending() {
    when(userRepository.findByEmail("shop@x.com")).thenReturn(Optional.of(buyer));
    when(fishRepository.findByIdAndActiveTrue(5L)).thenReturn(Optional.of(fish(20)));
    when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

    OrderResponse res = orderService.placeOrder(new OrderRequest(5L, 3, "gift"), "shop@x.com");

    assertEquals(new BigDecimal("30.00"), res.getTotalPrice());
    assertEquals("PENDING", res.getStatus());
    assertEquals(3, res.getQuantity());
  }

  @Test
  void placeOrder_insufficientStock_throwsIllegalArgument() {
    when(userRepository.findByEmail("shop@x.com")).thenReturn(Optional.of(buyer));
    when(fishRepository.findByIdAndActiveTrue(5L)).thenReturn(Optional.of(fish(2)));

    IllegalArgumentException ex =
        assertThrows(
            IllegalArgumentException.class,
            () -> orderService.placeOrder(new OrderRequest(5L, 3, null), "shop@x.com"));

    assertTrue(ex.getMessage().startsWith("Insufficient stock"));
    verify(orderRepository, never()).save(any());
  }

  @Test
  void placeOrder_unknownFish_throwsNotFound() {
    when(userRepository.findByEmail("shop@x.com")).thenReturn(Optional.of(buyer));
    when(fishRepository.findByIdAndActiveTrue(99L)).thenReturn(Optional.empty());

    assertThrows(
        EntityNotFoundException.class,
        () -> orderService.placeOrder(new OrderRequest(99L, 1, null), "shop@x.com"));
  }
}