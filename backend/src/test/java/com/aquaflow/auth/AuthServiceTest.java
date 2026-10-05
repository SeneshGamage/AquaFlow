package com.aquaflow.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import com.aquaflow.auth.dto.AuthResponse;
import com.aquaflow.auth.dto.LoginRequest;
import com.aquaflow.auth.dto.RegisterRequest;
import com.aquaflow.user.Role;
import com.aquaflow.user.User;
import com.aquaflow.user.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

  @Mock private UserRepository userRepository;
  @Mock private PasswordEncoder passwordEncoder;
  @Mock private JwtUtil jwtUtil;
  @Mock private AuthenticationManager authenticationManager;

  @InjectMocks private AuthService authService;

  @Test
  void register_success() {
    RegisterRequest req = new RegisterRequest("Test User", "test@example.com", "password", Role.BUYER);

    when(userRepository.existsByEmail(req.getEmail())).thenReturn(false);
    when(passwordEncoder.encode(req.getPassword())).thenReturn("encoded");

    User saved =
        User.builder()
            .id(1L)
            .name(req.getName())
            .email(req.getEmail())
            .password("encoded")
            .role(req.getRole())
            .enabled(true)
            .build();

    when(userRepository.save(any(User.class))).thenReturn(saved);
    when(jwtUtil.generateToken(any(User.class))).thenReturn("test-token");

    AuthResponse res = authService.register(req);

    assertEquals("test-token", res.getToken());
    assertEquals("Registration successful", res.getMessage());
    assertEquals(req.getEmail(), res.getEmail());
    assertEquals(req.getName(), res.getName());
    assertEquals("BUYER", res.getRole());
  }

  @Test
  void register_duplicateEmail() {
    RegisterRequest req = new RegisterRequest("Test User", "dup@example.com", "password", Role.BUYER);
    when(userRepository.existsByEmail(req.getEmail())).thenReturn(true);

    RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.register(req));
    assertTrue(ex.getMessage().contains("Duplicate"));
  }

  @Test
  void login_success() {
    LoginRequest req = new LoginRequest("test@example.com", "password");

    Authentication auth = mock(Authentication.class);
    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
        .thenReturn(auth);

    User user =
        User.builder()
            .id(1L)
            .name("Test User")
            .email(req.getEmail())
            .password("encoded")
            .role(Role.BUYER)
            .enabled(true)
            .build();

    when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(user));
    when(jwtUtil.generateToken(any(User.class))).thenReturn("test-token");

    AuthResponse res = authService.login(req);
    assertEquals("test-token", res.getToken());
    assertEquals("Login successful", res.getMessage());
  }

  @Test
  void loadUserByUsername_notFound() {
    when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

    assertThrows(
        UsernameNotFoundException.class, () -> authService.loadUserByUsername("missing@example.com"));
  }
}
