package com.veloce.api.repository;

import com.veloce.api.entity.Order;
import com.veloce.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findAllByOrderByCreatedAtDesc();
    Optional<Order> findByIdAndUserEmail(Long id, String email);
}
