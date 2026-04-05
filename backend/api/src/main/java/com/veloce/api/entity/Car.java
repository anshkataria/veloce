package com.veloce.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cars")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String brand;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Positive
    private BigDecimal price;

    private BigDecimal originalPrice;

    @Column(columnDefinition = "TEXT")
    private String description;

    // stored as comma-separated string, parsed in service layer
    private String variants;

    private Integer stock;

    private Boolean inStock = true;

    private Boolean isNew = false;

    // main image URL (Cloudinary or S3)
    private String imageUrl;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum Category { SUPERCARS, SPORTSCARS, LUXURY }
}