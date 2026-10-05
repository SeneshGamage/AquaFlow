package com.aquaflow.inventory;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FishRepository extends JpaRepository<Fish, Long> {
  List<Fish> findAllByActiveTrue();

  List<Fish> findAllByOriginCountryAndActiveTrue(String originCountry);

  List<Fish> findByCommonNameContainingIgnoreCaseAndActiveTrue(String name);

  Optional<Fish> findByIdAndActiveTrue(Long id);

  boolean existsByCommonNameIgnoreCase(String commonName);
}
