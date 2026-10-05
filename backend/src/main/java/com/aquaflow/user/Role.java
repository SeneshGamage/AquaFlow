package com.aquaflow.user;

public enum Role {
  OWNER("Has full access to everything"),
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
