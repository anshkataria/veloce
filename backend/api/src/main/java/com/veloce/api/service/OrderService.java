package com.veloce.api.service;

import com.veloce.api.dto.OrderRequest;
import com.veloce.api.entity.*;
import com.veloce.api.repository.CarRepository;
import com.veloce.api.repository.OrderRepository;
import com.veloce.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository  userRepository;
    private final CarRepository   carRepository;

    @Transactional
    public Order createOrder(String userEmail, OrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // build order first (needed for OrderItem foreign key)
        Order order = Order.builder()
                .user(user)
                .status(Order.Status.PROCESSING)
                .paymentStatus(Order.PaymentStatus.PENDING)
                .shippingName(request.getShippingName())
                .shippingEmail(request.getShippingEmail())
                .shippingPhone(request.getShippingPhone())
                .shippingAddress(request.getShippingAddress())
                .shippingCity(request.getShippingCity())
                .shippingState(request.getShippingState())
                .shippingPincode(request.getShippingPincode())
                .build();

        // build items and calculate total
        List<OrderItem> items = request.getItems().stream().map(itemReq -> {
            Car car = carRepository.findById(itemReq.getCarId())
                    .orElseThrow(() -> new RuntimeException("Car not found: " + itemReq.getCarId()));

            return OrderItem.builder()
                    .order(order)
                    .car(car)
                    .variant(itemReq.getVariant())
                    .quantity(itemReq.getQuantity())
                    .priceAtPurchase(car.getPrice())
                    .build();
        }).toList();

        BigDecimal total = items.stream()
                .map(i -> i.getPriceAtPurchase()
                        .multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setItems(items);
        order.setTotalAmount(total);

        return orderRepository.save(order);
    }

    public List<Order> getMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(Order.Status.valueOf(status.toUpperCase()));
        return orderRepository.save(order);
    }
}