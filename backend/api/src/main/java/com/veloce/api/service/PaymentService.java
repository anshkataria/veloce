package com.veloce.api.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.veloce.api.entity.Order;
import com.veloce.api.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.veloce.api.repository.OrderRepository;

@Service
public class PaymentService {
    private final OrderRepository orderRepository;
    private final OrderEventService orderEventService;

    public PaymentService(OrderRepository orderRepository, OrderEventService orderEventService) {
        this.orderRepository = orderRepository;
        this.orderEventService = orderEventService;
    }
    @Value("${app.stripe.secret-key:}") private String secretKey;
    @Value("${app.stripe.webhook-secret:}") private String webhookSecret;
    @Value("${app.stripe.success-url}") private String successUrl;
    @Value("${app.stripe.cancel-url}") private String cancelUrl;

    public String createCheckoutSession(Order order) {
        if (secretKey == null || secretKey.isBlank()) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "Stripe checkout is not configured");
        }
        Stripe.apiKey = secretKey;
        SessionCreateParams.LineItem.PriceData.ProductData product = SessionCreateParams.LineItem.PriceData.ProductData.builder()
                .setName("VELOCE order #" + order.getId()).build();
        SessionCreateParams.LineItem.PriceData price = SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency("usd").setUnitAmount(order.getTotalAmount().movePointRight(2).longValueExact())
                .setProductData(product).build();
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setCustomerEmail(order.getShippingEmail())
                .setSuccessUrl(successUrl).setCancelUrl(cancelUrl)
                .putMetadata("orderId", order.getId().toString())
                .addLineItem(SessionCreateParams.LineItem.builder().setQuantity(1L).setPriceData(price).build())
                .build();
        try { return Session.create(params).getUrl(); }
        catch (StripeException ex) { throw new ApiException(HttpStatus.BAD_GATEWAY, "Payment provider is unavailable"); }
    }

    public void handleWebhook(String payload, String signature) {
        if (webhookSecret == null || webhookSecret.isBlank()) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "Stripe webhook is not configured");
        }
        try {
            Event event = Webhook.constructEvent(payload, signature, webhookSecret);
            if (!"checkout.session.completed".equals(event.getType())) return;
            Session session = (Session) event.getDataObjectDeserializer().getObject()
                    .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Invalid Stripe event"));
            Long orderId = Long.valueOf(session.getMetadata().get("orderId"));
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
            order.setPaymentId(session.getPaymentIntent());
            order.setPaymentStatus(Order.PaymentStatus.PAID);
            order.setStatus(Order.Status.CONFIRMED);
            orderEventService.publish(orderRepository.save(order));
        } catch (com.stripe.exception.SignatureVerificationException ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid Stripe signature");
        }
    }
}
