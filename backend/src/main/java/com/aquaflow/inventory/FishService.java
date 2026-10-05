package com.aquaflow.inventory;

import com.aquaflow.inventory.dto.FishRequest;
import com.aquaflow.inventory.dto.FishResponse;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FishService {

  private final FishRepository fishRepository;

  public List<FishResponse> getAllFish() {
    return fishRepository.findAllByActiveTrue().stream().map(this::mapToResponse).toList();
  }

  public FishResponse getFishById(Long id) {
    Fish fish =
        fishRepository
            .findByIdAndActiveTrue(id)
            .orElseThrow(() -> new EntityNotFoundException("Fish not found: " + id));
    return mapToResponse(fish);
  }

  public FishResponse createFish(FishRequest request) {
    Fish fish = mapToEntity(request);
    Fish saved = fishRepository.save(fish);
    log.info("Created fish: {}", saved.getCommonName());
    return mapToResponse(saved);
  }

  public FishResponse updateFish(Long id, FishRequest request) {
    Fish fish =
        fishRepository
            .findByIdAndActiveTrue(id)
            .orElseThrow(() -> new EntityNotFoundException("Fish not found: " + id));

    fish.setCommonName(request.getCommonName());
    fish.setScientificName(request.getScientificName());
    fish.setOriginCountry(request.getOriginCountry());
    fish.setDescription(request.getDescription());
    fish.setQuantityInStock(request.getQuantityInStock());
    fish.setPricePerUnit(request.getPricePerUnit());
    fish.setImageUrl(request.getImageUrl());

    Fish saved = fishRepository.save(fish);
    log.info("Updated fish: {}", saved.getId());
    return mapToResponse(saved);
  }

  public void deleteFish(Long id) {
    Fish fish =
        fishRepository
            .findByIdAndActiveTrue(id)
            .orElseThrow(() -> new EntityNotFoundException("Fish not found: " + id));

    fish.setActive(false);
    fishRepository.save(fish);
    log.info("Soft-deleted fish: {}", id);
  }

  public List<FishResponse> searchFish(String name) {
    return fishRepository.findByCommonNameContainingIgnoreCaseAndActiveTrue(name).stream()
        .map(this::mapToResponse)
        .toList();
  }

  public FishResponse updateStock(Long id, Integer quantity) {
    Fish fish =
        fishRepository
            .findByIdAndActiveTrue(id)
            .orElseThrow(() -> new EntityNotFoundException("Fish not found: " + id));

    fish.setQuantityInStock(quantity);
    Fish saved = fishRepository.save(fish);
    log.info("Updated stock for fish {} to {}", id, quantity);
    return mapToResponse(saved);
  }

  private FishResponse mapToResponse(Fish fish) {
    return FishResponse.builder()
        .id(fish.getId())
        .commonName(fish.getCommonName())
        .scientificName(fish.getScientificName())
        .originCountry(fish.getOriginCountry())
        .description(fish.getDescription())
        .quantityInStock(fish.getQuantityInStock())
        .pricePerUnit(fish.getPricePerUnit())
        .imageUrl(fish.getImageUrl())
        .active(fish.isActive())
        .createdAt(fish.getCreatedAt())
        .updatedAt(fish.getUpdatedAt())
        .build();
  }

  private Fish mapToEntity(FishRequest request) {
    return Fish.builder()
        .commonName(request.getCommonName())
        .scientificName(request.getScientificName())
        .originCountry(request.getOriginCountry())
        .description(request.getDescription())
        .quantityInStock(request.getQuantityInStock())
        .pricePerUnit(request.getPricePerUnit())
        .imageUrl(request.getImageUrl())
        .active(true)
        .build();
  }
}
