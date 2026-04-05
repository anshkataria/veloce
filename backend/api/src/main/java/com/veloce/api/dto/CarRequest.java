package com.veloce.api.dto;

import com.veloce.api.entity.Car;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CarRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String brand;

    private Car.Category category;

    @Positive
    private BigDecimal price;

    private BigDecimal originalPrice;
    private String description;
    private String variants;
    private Integer stock;
    private Boolean isNew;
    private String imageUrl;
}