package org.example.userregistrationapp.controller;

import org.example.userregistrationapp.model.*;
import org.example.userregistrationapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPaymentMethodRepository userPaymentMethodRepository;

    @PostMapping
    public PaymentMethod addPaymentMethod(@RequestBody PaymentMethod method) {
        return paymentMethodRepository.save(method);
    }

    @GetMapping
    public List<PaymentMethod> getAllMethods() {
        return paymentMethodRepository.findAll();
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> addPaymentMethodToUser(@PathVariable Long userId, @RequestBody PaymentMethod method) {
        if (method.getName() == null || method.getName().isEmpty()) {
            return ResponseEntity.badRequest().body("Method name is required");
        }

        // Сохранение метода оплаты
        PaymentMethod savedMethod = paymentMethodRepository.save(method);

        // Привязка метода к пользователю
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        UserPaymentMethod userPaymentMethod = new UserPaymentMethod(user, savedMethod);
        userPaymentMethodRepository.save(userPaymentMethod);

        return ResponseEntity.ok(savedMethod);
    }

    @DeleteMapping("/{id}")
    public String deleteMethod(@PathVariable Long id) {
        if (paymentMethodRepository.existsById(id)) {
            paymentMethodRepository.deleteById(id);
            return "Payment method deleted successfully";
        }
        return "Payment method not found";
    }

    @GetMapping("/user/{userId}")
    public List<Map<String, Object>> getUserPaymentMethods(@PathVariable Long userId) {
        List<UserPaymentMethod> userMethods = userPaymentMethodRepository.findByUserId(userId);

        return userMethods.stream().map(userMethod -> {
            PaymentMethod method = userMethod.getPaymentMethod(); // Получаем объект PaymentMethod
            if (method != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", method.getId()); // Используем метод getId()
                response.put("name", method.getName());
                response.put("description", method.getDescription());
                return response;
            }
            return null;
        }).filter(Objects::nonNull).toList();
    }
}