package org.example.userregistrationapp.repository;

import org.example.userregistrationapp.model.PaymentMethod;
import org.example.userregistrationapp.model.UserPaymentMethod;
import org.example.userregistrationapp.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(Long userId);
}