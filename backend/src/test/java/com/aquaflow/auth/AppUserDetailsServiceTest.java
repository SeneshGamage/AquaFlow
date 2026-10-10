package com.aquaflow.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.aquaflow.user.User;
import com.aquaflow.user.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@ExtendWith(MockitoExtension.class)
class AppUserDetailsServiceTest {

  @Mock private UserRepository userRepository;
  @InjectMocks private AppUserDetailsService service;

  @Test
  void loadUserByUsername_found() {
    User user = User.builder().email("a@b.com").build();
    when(userRepository.findByEmail("a@b.com")).thenReturn(Optional.of(user));

    UserDetails result = service.loadUserByUsername("a@b.com");

    assertEquals("a@b.com", result.getUsername());
  }

  @Test
  void loadUserByUsername_notFound() {
    when(userRepository.findByEmail("x@y.com")).thenReturn(Optional.empty());

    assertThrows(UsernameNotFoundException.class, () -> service.loadUserByUsername("x@y.com"));
  }
}