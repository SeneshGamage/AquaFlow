package com.aquaflow.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

import com.aquaflow.user.Role;
import com.aquaflow.user.User;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class AuthControllerTest {

  @Test
  void me_returnsCurrentUser() {
    AuthController controller = new AuthController(mock(AuthService.class));
    User user = User.builder().email("a@b.com").name("A").role(Role.BUYER).build();

    var res = controller.me(user);

    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertEquals("BUYER", res.getBody().getData().role());
  }
}