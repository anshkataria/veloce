package com.veloce.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItem> items;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PROCESSING;

    private BigDecimal totalAmount;

    private String shippingName;
    private String shippingEmail;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingCity;
    private String shippingState;
    private String shippingPincode;

    // Razorpay payment ID after successful payment
    private String paymentId;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Status { PROCESSING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED }
    public enum PaymentStatus { PENDING, PAID, FAILED, REFUNDED }
}