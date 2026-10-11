package com.aquaflow.inventory;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FishRepository extends JpaRepository<Fish, Long> {

  List<Fish> findAllByActiveTrue();

  List<Fish> findAllByOriginCountryAndActiveTrue(String originCountry);

  List<Fish> findByCommonNameContainingIgnoreCaseAndActiveTrue(String name);

  Optional<Fish> findByIdAndActiveTrue(Long id);

  boolean existsByCommonNameIgnoreCase(String commonName);

  /**
   * Atomically takes stock. Returns 1 if it succeeded, 0 if there was not enough stock.
   * The check and the subtraction happen in a single SQL statement, so two concurrent
   * confirmations cannot both succeed.
   */
  @Modifying
  @Query(
      "update Fish f set f.quantityInStock = f.quantityInStock - :qty "
          + "where f.id = :id and f.quantityInStock >= :qty")
  int decrementStock(@Param("id") Long id, @Param("qty") int qty);

  /** Gives stock back (e.g. when a confirmed order is cancelled). Returns the rows updated. */
  @Modifying
  @Query("update Fish f set f.quantityInStock = f.quantityInStock + :qty where f.id = :id")
  int incrementStock(@Param("id") Long id, @Param("qty") int qty);
}