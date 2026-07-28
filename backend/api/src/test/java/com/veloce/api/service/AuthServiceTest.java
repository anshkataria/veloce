package com.veloce.api.service;

import com.veloce.api.dto.RegisterRequest;
import com.veloce.api.entity.User;
import com.veloce.api.exception.ApiException;
import com.veloce.api.repository.UserRepository;
import com.veloce.api.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock UserRepository users;
    @Mock PasswordEncoder encoder;
    @Mock JwtUtil jwt;
    @Mock NotificationService notifications;
    @InjectMocks AuthService service;

    @Test
    void registrationRejectsDuplicateEmail() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Alex Driver"); request.setEmail("alex@example.com"); request.setPassword("password1");
        when(users.existsByEmail(request.getEmail())).thenReturn(true);

        assertThatThrownBy(() -> service.register(request))
                .isInstanceOf(ApiException.class).hasMessage("Email already registered");
        verify(users, never()).save(any());
    }

    @Test
    void registrationAlwaysCreatesCustomerAndSendsWelcomeEmail() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Alex Driver"); request.setEmail("alex@example.com"); request.setPassword("password1");
        when(encoder.encode("password1")).thenReturn("hash");
        when(jwt.generateToken(anyString(), anyString())).thenReturn("token");

        service.register(request);

        verify(users).save(argThat(user -> user.getRole() == User.Role.CUSTOMER && user.getPassword().equals("hash")));
        verify(notifications).sendWelcomeEmail(any(User.class));
    }
}
