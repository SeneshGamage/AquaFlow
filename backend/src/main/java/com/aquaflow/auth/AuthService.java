package com.aquaflow.auth;

import com.aquaflow.auth.dto.AuthResponse;
import com.aquaflow.auth.dto.LoginRequest;
import com.aquaflow.auth.dto.RegisterRequest;
import com.aquaflow.user.User;
import com.aquaflow.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;
  private final AuthenticationManager authenticationManager;

  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("Duplicate email: already registered");
    }

    User user =
        User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole())
            .enabled(true)
            .build();

    User saved = userRepository.save(user);
    String token = jwtUtil.generateToken(saved);

    log.info("User registered: {}", saved.getEmail());

    return AuthResponse.builder()
        .token(token)
        .email(saved.getEmail())
        .name(saved.getName())
        .role(saved.getRole().name())
        .message("Registration successful")
        .build();
  }

  public AuthResponse login(LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

    User user =
        userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + request.getEmail()));

    String token = jwtUtil.generateToken(user);

    log.info("User logged in: {}", user.getEmail());

    return AuthResponse.builder()
        .token(token)
        .email(user.getEmail())
        .name(user.getName())
        .role(user.getRole().name())
        .message("Login successful")
        .build();
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    return userRepository
        .findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
  }
}
