package com.veloce.api.controller;

import com.veloce.api.config.SecurityConfig;
import com.veloce.api.config.TestCacheConfig;
import com.veloce.api.dto.AuthResponse;
import com.veloce.api.exception.ApiException;
import com.veloce.api.security.JwtAuthFilter;
import com.veloce.api.security.JwtUtil;
import com.veloce.api.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import({ SecurityConfig.class, JwtAuthFilter.class, TestCacheConfig.class })
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private AuthService authService;

    @Test
    void registerIsPubliclyReachableAndReturnsToken() throws Exception {
        when(authService.register(any())).thenReturn(
                new AuthResponse("token", "alex@example.com", "Alex Driver", "CUSTOMER"));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Alex Driver","email":"alex@example.com","password":"password1"}
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void registerRejectsInvalidPayloadWithBadRequest() throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"","email":"not-an-email","password":"short"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void registerMapsDuplicateEmailToConflict() throws Exception {
        when(authService.register(any()))
                .thenThrow(new ApiException(HttpStatus.CONFLICT, "Email already registered"));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Alex Driver","email":"alex@example.com","password":"password1"}
                                """))
                .andExpect(status().isConflict());
    }

    @Test
    void loginMapsBadCredentialsToUnauthorized() throws Exception {
        when(authService.login(any()))
                .thenThrow(new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"alex@example.com","password":"wrong"}
                                """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginSucceedsWithoutAToken() throws Exception {
        when(authService.login(any())).thenReturn(
                new AuthResponse("token", "alex@example.com", "Alex Driver", "CUSTOMER"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"alex@example.com","password":"password1"}
                                """))
                .andExpect(status().isOk());
    }
}
