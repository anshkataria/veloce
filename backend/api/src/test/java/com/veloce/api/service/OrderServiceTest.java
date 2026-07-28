package com.veloce.api.service;

import com.veloce.api.dto.OrderRequest;
import com.veloce.api.entity.*;
import com.veloce.api.exception.ApiException;
import com.veloce.api.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    @Mock OrderRepository orders; @Mock UserRepository users; @Mock CarRepository cars;
    @Mock NotificationService notifications; @Mock OrderEventService events;
    @InjectMocks OrderService service;
    private OrderRequest request;
    private Car car;

    @BeforeEach void setup() {
        User user = User.builder().email("buyer@example.com").name("Buyer").password("hash").build();
        car = Car.builder().id(7L).name("F40").brand("Ferrari").price(new BigDecimal("250000"))
                .stock(3).inStock(true).build();
        OrderRequest.OrderItemRequest item = new OrderRequest.OrderItemRequest();
        item.setCarId(7L); item.setQuantity(2); item.setVariant("Rosso");
        request = new OrderRequest(); request.setItems(List.of(item));
        request.setShippingName("Buyer"); request.setShippingEmail("buyer@example.com");
        request.setShippingPhone("123"); request.setShippingAddress("1 Road"); request.setShippingCity("Brisbane");
        request.setShippingState("QLD"); request.setShippingPincode("4000");
        when(users.findByEmail("buyer@example.com")).thenReturn(Optional.of(user));
    }

    @Test void calculatesServerSideTotalAndDecrementsStock() {
        when(cars.findForUpdateById(7L)).thenReturn(Optional.of(car));
        when(orders.save(any())).thenAnswer(invocation -> { Order order = invocation.getArgument(0); order.setId(10L); return order; });

        Order order = service.createOrder("buyer@example.com", request);

        assertThat(order.getTotalAmount()).isEqualByComparingTo("500000");
        assertThat(car.getStock()).isEqualTo(1);
        verify(notifications).sendOrderConfirmation(order);
        verify(events).publish(order);
    }

    @Test void rejectsInsufficientStockWithoutSavingOrder() {
        car.setStock(1);
        when(cars.findForUpdateById(7L)).thenReturn(Optional.of(car));

        assertThatThrownBy(() -> service.createOrder("buyer@example.com", request))
                .isInstanceOf(ApiException.class).hasMessageContaining("Insufficient stock");
        verify(orders, never()).save(any());
    }
}
