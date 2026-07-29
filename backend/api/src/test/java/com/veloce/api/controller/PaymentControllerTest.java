package com.veloce.api.controller;

import com.veloce.api.config.SecurityConfig;
import com.veloce.api.config.TestCacheConfig;
import com.veloce.api.exception.ApiException;
import com.veloce.api.security.JwtAuthFilter;
import com.veloce.api.security.JwtUtil;
import com.veloce.api.service.PaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PaymentController.class)
@Import({ SecurityConfig.class, JwtAuthFilter.class, TestCacheConfig.class })
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private PaymentService paymentService;

    @Test
    void webhookIsReachableWithoutAuthentication() throws Exception {
        mockMvc.perform(post("/api/v1/payments/webhook")
                        .header("Stripe-Signature", "test-signature")
                        .content("{}"))
                .andExpect(status().isOk());
    }

    @Test
    void webhookRequiresStripeSignatureHeader() throws Exception {
        mockMvc.perform(post("/api/v1/payments/webhook").content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void webhookMapsInvalidSignatureToBadRequest() throws Exception {
        doThrow(new ApiException(HttpStatus.BAD_REQUEST, "Invalid Stripe signature"))
                .when(paymentService).handleWebhook(anyString(), anyString());

        mockMvc.perform(post("/api/v1/payments/webhook")
                        .header("Stripe-Signature", "bad-signature")
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
