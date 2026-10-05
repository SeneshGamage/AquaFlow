package com.aquaflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * AquaFlow Import/Export Fish Business Management API.
 */
@SpringBootApplication
@EnableJpaAuditing
public class AquaflowApplication {

  public static void main(String[] args) {
    SpringApplication.run(AquaflowApplication.class, args);
  }
}
