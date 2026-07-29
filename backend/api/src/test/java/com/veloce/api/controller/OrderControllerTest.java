package com.veloce.api.controller;

import com.veloce.api.config.SecurityConfig;
import com.veloce.api.config.TestCacheConfig;
import com.veloce.api.entity.Order;
import com.veloce.api.security.JwtAuthFilter;
import com.veloce.api.security.JwtUtil;
import com.veloce.api.service.OrderEventService;
import com.veloce.api.service.OrderService;
import com.veloce.api.service.PaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
@Import({ SecurityConfig.class, JwtAuthFilter.class, TestCacheConfig.class })
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private OrderService orderService;

    @MockitoBean
    private OrderEventService orderEventService;

    @MockitoBean
    private PaymentService paymentService;

    private static final String VALID_ORDER_PAYLOAD = """
            {
              "items": [{"carId": 1, "variant": "Rosso", "quantity": 1}],
              "shippingName": "Buyer",
              "shippingEmail": "buyer@example.com",
              "shippingPhone": "123",
              "shippingAddress": "1 Road",
              "shippingCity": "Brisbane",
              "shippingState": "QLD",
              "shippingPincode": "4000"
            }
            """;

    @Test
    void createOrderRequiresAuthentication() throws Exception {
        // Anonymous requests carry an (anonymous) principal, so Spring Security
        // denies with 403 rather than 401 for the anyRequest().authenticated() rule.
        mockMvc.perform(post("/api/v1/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_ORDER_PAYLOAD))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "buyer@example.com", roles = "CUSTOMER")
    void createOrderSucceedsForAuthenticatedCustomer() throws Exception {
        Order order = Order.builder().id(10L).totalAmount(new BigDecimal("250000")).build();
        when(orderService.createOrder(anyString(), any())).thenReturn(order);

        mockMvc.perform(post("/api/v1/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_ORDER_PAYLOAD))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void listAllOrdersIsForbiddenForCustomers() throws Exception {
        mockMvc.perform(get("/api/v1/orders"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void listAllOrdersSucceedsForAdmin() throws Exception {
        when(orderService.getAllOrders()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/orders"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void updateStatusIsForbiddenForNonAdmin() throws Exception {
        mockMvc.perform(put("/api/v1/orders/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"status":"SHIPPED"}
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateStatusSucceedsForAdmin() throws Exception {
        Order order = Order.builder().id(1L).status(Order.Status.SHIPPED).build();
        when(orderService.updateOrderStatus(1L, "SHIPPED")).thenReturn(order);

        mockMvc.perform(put("/api/v1/orders/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"status":"SHIPPED"}
                                """))
                .andExpect(status().isOk());
    }
}
