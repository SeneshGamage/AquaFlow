package com.aquaflow.auth;

import com.aquaflow.auth.dto.AuthResponse;
import com.aquaflow.auth.dto.LoginRequest;
import com.aquaflow.auth.dto.RegisterRequest;
import com.aquaflow.common.ApiResponse;
import com.aquaflow.user.User; // Added import for User
import com.aquaflow.auth.dto.MeResponse; // Added import for MeResponse
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // Added import for AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping; // Added import for GetMapping
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Tag(name = "Authentication")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @Operation(summary = "Register a new user")
  @PostMapping("/register")
  public ResponseEntity<ApiResponse<AuthResponse>> register(
      @Valid @RequestBody RegisterRequest request) {
    AuthResponse response = authService.register(request);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.success(response, "Registration successful"));
  }

  @Operation(summary = "Login with email and password")
  @PostMapping("/login")
  public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
    AuthResponse response = authService.login(request);
    return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
  }

  @Operation(summary = "Current user (also validates the token)")
  @GetMapping("/me")
  public ResponseEntity<ApiResponse<MeResponse>> me(@AuthenticationPrincipal User user) {
  MeResponse body = new MeResponse(user.getEmail(), user.getName(), user.getRole().name());
  return ResponseEntity.ok(ApiResponse.success(body, "OK"));
}

}
