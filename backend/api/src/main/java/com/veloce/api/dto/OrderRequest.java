package com.veloce.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    @NotEmpty
    private List<OrderItemRequest> items;

    @NotBlank private String shippingName;
    @NotBlank private String shippingEmail;
    @NotBlank private String shippingPhone;
    @NotBlank private String shippingAddress;
    @NotBlank private String shippingCity;
    @NotBlank private String shippingState;
    @NotBlank private String shippingPincode;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long carId;

        @NotBlank
        private String variant;

        @NotNull
        @Positive
        private Integer quantity;
    }
}
