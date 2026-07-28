package com.veloce.api.service;

import com.veloce.api.entity.Order;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class OrderEventService {
    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        try { emitter.send(SseEmitter.event().name("connected").data("ready")); }
        catch (IOException ex) { emitter.completeWithError(ex); }
        return emitter;
    }

    public void publish(Order order) {
        emitters.forEach(emitter -> {
            try { emitter.send(SseEmitter.event().name("order-updated").data(order.getId())); }
            catch (IOException ex) { emitter.complete(); emitters.remove(emitter); }
        });
    }
}
