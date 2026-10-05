package com.aquaflow.inventory;

import com.aquaflow.common.ApiResponse;
import com.aquaflow.inventory.dto.FishRequest;
import com.aquaflow.inventory.dto.FishResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Inventory")
@RestController
@RequestMapping("/api/fish")
@RequiredArgsConstructor
public class FishController {

  private final FishService fishService;

  @Operation(summary = "Get all active fish")
  @GetMapping
  public ResponseEntity<ApiResponse<List<FishResponse>>> getAllFish() {
    return ResponseEntity.ok(ApiResponse.success(fishService.getAllFish(), "Fish retrieved"));
  }

  @Operation(summary = "Get fish by id")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<FishResponse>> getFishById(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponse.success(fishService.getFishById(id), "Fish retrieved"));
  }

  @Operation(summary = "Create a fish")
  @PreAuthorize("hasRole('OWNER')")
  @PostMapping
  public ResponseEntity<ApiResponse<FishResponse>> createFish(@Valid @RequestBody FishRequest request) {
    FishResponse created = fishService.createFish(request);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.success(created, "Fish created"));
  }

  @Operation(summary = "Update a fish")
  @PreAuthorize("hasRole('OWNER')")
  @PutMapping("/{id}")
  public ResponseEntity<ApiResponse<FishResponse>> updateFish(
      @PathVariable Long id, @Valid @RequestBody FishRequest request) {
    return ResponseEntity.ok(ApiResponse.success(fishService.updateFish(id, request), "Fish updated"));
  }

  @Operation(summary = "Delete a fish (soft delete)")
  @PreAuthorize("hasRole('OWNER')")
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Void>> deleteFish(@PathVariable Long id) {
    fishService.deleteFish(id);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success(null, "Fish deleted"));
  }

  @Operation(summary = "Search fish by common name")
  @GetMapping("/search")
  public ResponseEntity<ApiResponse<List<FishResponse>>> searchFish(@RequestParam String name) {
    return ResponseEntity.ok(ApiResponse.success(fishService.searchFish(name), "Fish retrieved"));
  }

  @Operation(summary = "Update fish stock quantity")
  @PreAuthorize("hasAnyRole('OWNER','SUPPLIER')")
  @PatchMapping("/{id}/stock")
  public ResponseEntity<ApiResponse<FishResponse>> updateStock(
      @PathVariable Long id, @RequestParam Integer quantity) {
    return ResponseEntity.ok(ApiResponse.success(fishService.updateStock(id, quantity), "Stock updated"));
  }
}
