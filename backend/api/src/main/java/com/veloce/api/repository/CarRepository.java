package com.veloce.api.repository;

import com.veloce.api.entity.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Car> findForUpdateById(Long id);

    Page<Car> findByCategory(Car.Category category, Pageable pageable);

    Page<Car> findByNameContainingIgnoreCaseOrBrandContainingIgnoreCase(
            String name, String brand, Pageable pageable
    );

    Page<Car> findByCategoryAndNameContainingIgnoreCaseOrCategoryAndBrandContainingIgnoreCase(
            Car.Category c1, String name, Car.Category c2, String brand, Pageable pageable
    );

    List<Car> findTop4ByCategoryAndIdNot(Car.Category category, Long id);
}
