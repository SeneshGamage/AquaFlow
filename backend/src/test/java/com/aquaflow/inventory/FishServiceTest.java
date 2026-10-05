package com.aquaflow.inventory;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.aquaflow.inventory.dto.FishRequest;
import com.aquaflow.inventory.dto.FishResponse;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class FishServiceTest {

  @Mock private FishRepository fishRepository;

  @InjectMocks private FishService fishService;

  @Test
  void getAllFish_returnsList() {
    Fish f1 =
        Fish.builder()
            .id(1L)
            .commonName("Tuna")
            .originCountry("LK")
            .quantityInStock(10)
            .pricePerUnit(new BigDecimal("10.00"))
            .active(true)
            .build();
    Fish f2 =
        Fish.builder()
            .id(2L)
            .commonName("Salmon")
            .originCountry("NO")
            .quantityInStock(5)
            .pricePerUnit(new BigDecimal("20.00"))
            .active(true)
            .build();

    when(fishRepository.findAllByActiveTrue()).thenReturn(List.of(f1, f2));

    List<FishResponse> res = fishService.getAllFish();
    assertEquals(2, res.size());
  }

  @Test
  void getFishById_found() {
    Fish f =
        Fish.builder()
            .id(1L)
            .commonName("Tuna")
            .originCountry("LK")
            .quantityInStock(10)
            .pricePerUnit(new BigDecimal("10.00"))
            .active(true)
            .build();

    when(fishRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(f));

    FishResponse res = fishService.getFishById(1L);
    assertEquals(1L, res.getId());
  }

  @Test
  void getFishById_notFound() {
    when(fishRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.empty());
    assertThrows(EntityNotFoundException.class, () -> fishService.getFishById(1L));
  }

  @Test
  void createFish_success() {
    FishRequest req =
        new FishRequest(
            "Tuna",
            "Thunnus",
            "LK",
            "Desc",
            10,
            new BigDecimal("10.00"),
            "http://img");

    Fish saved =
        Fish.builder()
            .id(1L)
            .commonName(req.getCommonName())
            .scientificName(req.getScientificName())
            .originCountry(req.getOriginCountry())
            .description(req.getDescription())
            .quantityInStock(req.getQuantityInStock())
            .pricePerUnit(req.getPricePerUnit())
            .imageUrl(req.getImageUrl())
            .active(true)
            .build();

    when(fishRepository.save(any(Fish.class))).thenReturn(saved);

    FishResponse res = fishService.createFish(req);
    assertNotNull(res);
    assertEquals("Tuna", res.getCommonName());
  }

  @Test
  void deleteFish_softDelete() {
    Fish f =
        Fish.builder()
            .id(1L)
            .commonName("Tuna")
            .originCountry("LK")
            .quantityInStock(10)
            .pricePerUnit(new BigDecimal("10.00"))
            .active(true)
            .build();

    when(fishRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(f));
    when(fishRepository.save(any(Fish.class))).thenAnswer(inv -> inv.getArgument(0));

    fishService.deleteFish(1L);

    verify(fishRepository)
        .save(
            argThat(
                fish -> fish.getId().equals(1L) && fish.isActive() == false));
  }
}
