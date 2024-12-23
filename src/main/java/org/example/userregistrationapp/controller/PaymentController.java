package org.example.userregistrationapp.controller;

import org.example.userregistrationapp.model.*;
import org.example.userregistrationapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @PostMapping
    public String createPayment(@RequestBody Payment payment) {
        Optional<User> userOpt = userRepository.findById(payment.getUser().getId());
        Optional<PaymentMethod> methodOpt = paymentMethodRepository.findById(payment.getPaymentMethod().getId());

        if (userOpt.isPresent() && methodOpt.isPresent()) {
            payment.setStatus("pending");
            paymentRepository.save(payment);
            return "Payment created successfully";
        }
        return "User or Payment Method not found";
    }

    @GetMapping("/history/{userId}")
    public List<Payment> getPaymentHistory(@PathVariable Long userId) {
        return paymentRepository.findByUserId(userId);
    }
}