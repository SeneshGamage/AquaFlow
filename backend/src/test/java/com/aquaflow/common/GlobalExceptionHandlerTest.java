package com.aquaflow.common;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;

class GlobalExceptionHandlerTest {

  private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

  @Test
  void badCredentials_returns401() {
    var res = handler.handleBadCredentials(new BadCredentialsException("bad"));

    assertEquals(HttpStatus.UNAUTHORIZED, res.getStatusCode());
    assertEquals("Invalid email or password", res.getBody().getMessage());
  }
}