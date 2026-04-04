package com.veloce.api.repository;

import com.veloce.api.entity.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    Page<Car> findByCategory(Car.Category category, Pageable pageable);

    Page<Car> findByInStockTrue(Pageable pageable);

    @Query("SELECT c FROM Car c WHERE " +
            "(:category IS NULL OR c.category = :category) AND " +
            "(:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(c.brand) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Car> findWithFilters(
            @Param("category") Car.Category category,
            @Param("search") String search,
            Pageable pageable
    );

    List<Car> findTop4ByCategoryAndIdNot(Car.Category category, Long id);
}