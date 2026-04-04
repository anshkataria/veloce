package com.veloce.api.controller;

import com.veloce.api.dto.CarRequest;
import com.veloce.api.entity.Car;
import com.veloce.api.service.CarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    // GET /api/v1/cars?category=supercars&search=lambo&page=0&size=12&sort=newest
    @GetMapping
    public ResponseEntity<Page<Car>> getCars(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0")   int page,
            @RequestParam(defaultValue = "12")  int size,
            @RequestParam(defaultValue = "newest") String sort) {
        return ResponseEntity.ok(carService.getCars(category, search, page, size, sort));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> getCar(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarById(id));
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<List<Car>> getRelated(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getRelatedCars(id));
    }

    // ADMIN only — protected by SecurityConfig
    @PostMapping
    public ResponseEntity<Car> createCar(@Valid @RequestBody CarRequest request) {
        return ResponseEntity.ok(carService.createCar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Long id,
                                         @Valid @RequestBody CarRequest request) {
        return ResponseEntity.ok(carService.updateCar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }
}