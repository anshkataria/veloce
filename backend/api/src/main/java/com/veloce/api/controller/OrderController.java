package com.veloce.api.controller;

import com.veloce.api.dto.OrderRequest;
import com.veloce.api.entity.Order;
import com.veloce.api.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.veloce.api.service.OrderEventService;
import com.veloce.api.service.PaymentService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderEventService orderEventService;
    private final PaymentService paymentService;

    // customer places an order
    @PostMapping
    public ResponseEntity<Order> createOrder(
            @AuthenticationPrincipal String userEmail,
            @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(userEmail, request));
    }

    // customer sees their own orders
    @GetMapping("/my")
    public ResponseEntity<List<Order>> myOrders(
            @AuthenticationPrincipal String userEmail) {
        return ResponseEntity.ok(orderService.getMyOrders(userEmail));
    }

    // admin sees all orders
    @GetMapping
    public ResponseEntity<List<Order>> allOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // admin updates order status
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, body.get("status")));
    }

    @PostMapping("/{id}/checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(
            @PathVariable Long id, @AuthenticationPrincipal String userEmail) {
        Order order = orderService.getOwnedOrder(id, userEmail);
        return ResponseEntity.ok(Map.of("checkoutUrl", paymentService.createCheckoutSession(order)));
    }

    @GetMapping(value = "/events", produces = "text/event-stream")
    public SseEmitter events() {
        return orderEventService.subscribe();
    }
}
