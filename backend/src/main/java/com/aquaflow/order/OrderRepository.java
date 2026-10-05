package com.aquaflow.order;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findAllByBuyerId(Long buyerId);

  List<Order> findAllBySupplierId(Long supplierId);

  List<Order> findAllByStatus(OrderStatus status);

  List<Order> findAllByBuyerIdAndStatus(Long buyerId, OrderStatus status);

  long countByStatus(OrderStatus status);
}
