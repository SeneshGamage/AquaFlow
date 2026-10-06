package com.aquaflow.user;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminSeeder implements ApplicationRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Value("${ADMIN_EMAIL:}")    private String email;
  @Value("${ADMIN_PASSWORD:}") private String password;

  @Override
  public void run(ApplicationArguments args) {
    if (email.isBlank() || password.isBlank()) {
      log.info("ADMIN_EMAIL / ADMIN_PASSWORD not set - skipping admin seed");
      return;
    }
    if (!userRepository.findAllByRole(Role.ADMIN).isEmpty() || userRepository.existsByEmail(email)) {
      return;
    }
    userRepository.save(User.builder()
        .name("Platform Admin").email(email)
        .password(passwordEncoder.encode(password))
        .role(Role.ADMIN).enabled(true).build());
    log.info("Seeded initial admin: {}", email);   // never log the password
  }
}
