package org.example.userregistrationapp.controller;

import org.example.userregistrationapp.model.*;
import org.example.userregistrationapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @PostMapping
    public PaymentMethod addPaymentMethod(@RequestBody PaymentMethod method) {
        return paymentMethodRepository.save(method);
    }

    @GetMapping
    public List<PaymentMethod> getAllMethods() {
        return paymentMethodRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public String deleteMethod(@PathVariable Long id) {
        if (paymentMethodRepository.existsById(id)) {
            paymentMethodRepository.deleteById(id);
            return "Payment method deleted successfully";
        }
        return "Payment method not found";
    }
}