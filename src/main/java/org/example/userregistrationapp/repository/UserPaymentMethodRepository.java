package org.example.userregistrationapp.repository;

import org.example.userregistrationapp.model.PaymentMethod;
import org.example.userregistrationapp.model.UserPaymentMethod;
import org.example.userregistrationapp.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Репозиторий для привязок методов оплаты к пользователям
@Repository
public interface UserPaymentMethodRepository extends JpaRepository<UserPaymentMethod, Long> {
    List<UserPaymentMethod> findByUserId(Long userId);
}