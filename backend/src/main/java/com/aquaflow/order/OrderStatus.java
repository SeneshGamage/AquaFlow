package com.aquaflow.order;

public enum OrderStatus {
  PENDING("Awaiting supplier confirmation"),
  CONFIRMED("Order confirmed by supplier"),
  PACKED("Order packed and ready to ship"),
  SHIPPED("Order shipped"),
  DELIVERED("Order delivered"),
  CANCELLED("Order cancelled");

  private final String description;

  OrderStatus(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }

  public boolean canTransitionTo(OrderStatus next) {
    if (next == null) {
      return false;
    }

    return switch (this) {
      case PENDING -> next == CONFIRMED || next == CANCELLED;
      case CONFIRMED -> next == PACKED || next == CANCELLED;
      case PACKED -> next == SHIPPED;
      case SHIPPED -> next == DELIVERED;
      case DELIVERED, CANCELLED -> false;
    };
  }
}
