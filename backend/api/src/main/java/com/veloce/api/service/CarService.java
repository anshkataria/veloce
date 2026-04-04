package com.veloce.api.service;

import com.veloce.api.dto.CarRequest;
import com.veloce.api.entity.Car;
import com.veloce.api.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;

    public Page<Car> getCars(String category, String search,
                             int page, int size, String sortBy) {
        Sort sort = switch (sortBy) {
            case "price_asc"  -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            default           -> Sort.by("createdAt").descending();
        };

        Pageable pageable = PageRequest.of(page, size, sort);
        Car.Category cat = null;

        if (category != null && !category.isBlank()) {
            try { cat = Car.Category.valueOf(category.toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }

        return carRepository.findWithFilters(cat, search, pageable);
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
    }

    public List<Car> getRelatedCars(Long id) {
        Car car = getCarById(id);
        return carRepository.findTop4ByCategoryAndIdNot(car.getCategory(), id);
    }

    public Car createCar(CarRequest request) {
        Car car = Car.builder()
                .name(request.getName())
                .brand(request.getBrand())
                .category(request.getCategory())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .description(request.getDescription())
                .variants(request.getVariants())
                .stock(request.getStock())
                .inStock(request.getStock() != null && request.getStock() > 0)
                .isNew(request.getIsNew() != null && request.getIsNew())
                .imageUrl(request.getImageUrl())
                .build();
        return carRepository.save(car);
    }

    public Car updateCar(Long id, CarRequest request) {
        Car car = getCarById(id);
        car.setName(request.getName());
        car.setBrand(request.getBrand());
        car.setCategory(request.getCategory());
        car.setPrice(request.getPrice());
        car.setOriginalPrice(request.getOriginalPrice());
        car.setDescription(request.getDescription());
        car.setVariants(request.getVariants());
        car.setStock(request.getStock());
        car.setInStock(request.getStock() != null && request.getStock() > 0);
        car.setIsNew(request.getIsNew() != null && request.getIsNew());
        car.setImageUrl(request.getImageUrl());
        return carRepository.save(car);
    }

    public void deleteCar(Long id) {
        if (!carRepository.existsById(id)) {
            throw new RuntimeException("Car not found");
        }
        carRepository.deleteById(id);
    }
}