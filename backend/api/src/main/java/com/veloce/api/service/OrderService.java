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
import org.springframework.http.HttpStatus;
import com.veloce.api.exception.ApiException;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository  userRepository;
    private final CarRepository   carRepository;
    private final NotificationService notificationService;
    private final OrderEventService orderEventService;

    @Transactional
    public Order createOrder(String userEmail, OrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

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
            Car car = carRepository.findForUpdateById(itemReq.getCarId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Car not found: " + itemReq.getCarId()));

            int requestedQuantity = itemReq.getQuantity();
            int availableStock = car.getStock() == null ? 0 : car.getStock();
            if (!Boolean.TRUE.equals(car.getInStock()) || availableStock < requestedQuantity) {
                throw new ApiException(HttpStatus.CONFLICT, "Insufficient stock for " + car.getName());
            }

            int updatedStock = availableStock - requestedQuantity;
            car.setStock(updatedStock);
            car.setInStock(updatedStock > 0);

            return OrderItem.builder()
                    .order(order)
                    .car(car)
                    .variant(itemReq.getVariant())
                    .quantity(requestedQuantity)
                    .priceAtPurchase(car.getPrice())
                    .build();
        }).toList();

        BigDecimal total = items.stream()
                .map(i -> i.getPriceAtPurchase()
                        .multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setItems(items);
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);
        notificationService.sendOrderConfirmation(saved);
        orderEventService.publish(saved);
        return saved;
    }

    public List<Order> getMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
        try {
            order.setStatus(Order.Status.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException | NullPointerException ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid order status");
        }
        Order saved = orderRepository.save(order);
        orderEventService.publish(saved);
        return saved;
    }

    public Order getOwnedOrder(Long id, String email) {
        return orderRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
    }
}
