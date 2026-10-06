package com.aquaflow.user;

public enum Role {
<<<<<<< HEAD
  OWNER("Has full access to everything"),
=======
  ADMIN("Manages users, approvals and platform settings"),
  OWNER("Runs the business: inventory, orders, shipments, dashboard"),
>>>>>>> feat/admin-role
  SUPPLIER("Can submit stock, confirm purchase orders"),
  BUYER("Can place orders, track shipments");

  private final String description;

  Role(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }

  public String getAuthority() {
    return "ROLE_" + name();
  }
}
