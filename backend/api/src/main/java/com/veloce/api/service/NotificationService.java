package com.veloce.api.service;

import com.veloce.api.entity.Order;
import com.veloce.api.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}") private boolean enabled;
    @Value("${app.mail.from}") private String from;

    @Async
    public void sendWelcomeEmail(User user) {
        send(user.getEmail(), "Welcome to VELOCE", "Your VELOCE account is ready, " + user.getName() + ".");
    }

    @Async
    public void sendOrderConfirmation(Order order) {
        send(order.getShippingEmail(), "VELOCE order #" + order.getId(),
                "We received your order. Total: $" + order.getTotalAmount() + ". Status: " + order.getStatus() + ".");
    }

    private void send(String to, String subject, String body) {
        if (!enabled) {
            log.info("Email disabled; would send '{}' to {}", subject, to);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (RuntimeException ex) {
            log.error("Email delivery failed for {}", to, ex);
        }
    }
}
