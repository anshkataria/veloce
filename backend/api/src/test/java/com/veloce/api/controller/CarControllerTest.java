package com.veloce.api.controller;

import com.veloce.api.config.SecurityConfig;
import com.veloce.api.config.TestCacheConfig;
import com.veloce.api.entity.Car;
import com.veloce.api.security.JwtAuthFilter;
import com.veloce.api.security.JwtUtil;
import com.veloce.api.service.CarService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CarController.class)
@Import({ SecurityConfig.class, JwtAuthFilter.class, TestCacheConfig.class })
class CarControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private CarService carService;

    @Test
    void listCarsIsPublicForUnauthenticatedUsers() throws Exception {
        Car car = Car.builder().id(1L).name("F40").brand("Ferrari").price(new BigDecimal("250000")).build();
        when(carService.getCars(any(), any(), anyInt(), anyInt(), anyString()))
                .thenReturn(new PageImpl<>(List.of(car)));

        mockMvc.perform(get("/api/v1/cars"))
                .andExpect(status().isOk());
    }

    @Test
    void createCarIsRejectedForUnauthenticatedUsers() throws Exception {
        // Spring Security treats an anonymous principal as "authenticated but
        // lacking the role", so a role-gated endpoint denies with 403 here
        // rather than 401 (which is reserved for missing/invalid credentials).
        mockMvc.perform(post("/api/v1/cars")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"F40","brand":"Ferrari","price":250000}
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void createCarIsForbiddenForNonAdminUsers() throws Exception {
        mockMvc.perform(post("/api/v1/cars")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"F40","brand":"Ferrari","price":250000}
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createCarSucceedsForAdminUsers() throws Exception {
        Car car = Car.builder().id(1L).name("F40").brand("Ferrari").price(new BigDecimal("250000")).build();
        when(carService.createCar(any())).thenReturn(car);

        mockMvc.perform(post("/api/v1/cars")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"F40","brand":"Ferrari","price":250000}
                                """))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createCarRejectsInvalidPayload() throws Exception {
        mockMvc.perform(post("/api/v1/cars")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"","brand":"","price":-5}
                                """))
                .andExpect(status().isBadRequest());
    }
}
