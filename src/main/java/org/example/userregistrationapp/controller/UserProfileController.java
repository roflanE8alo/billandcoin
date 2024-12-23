package org.example.userregistrationapp.controller;

import org.example.userregistrationapp.model.*;
import org.example.userregistrationapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/user-profile")
public class UserProfileController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    // Получить профиль пользователя
    @GetMapping("/{userId}")
    public UserProfile getUserProfile(@PathVariable Long userId) {
        return userProfileRepository.findByUserId(userId);
    }

    // Пополнение баланса
    @PostMapping("/top-up")
    public String topUpBalance(@RequestBody Payment payment) {
        Optional<User> userOpt = userRepository.findById(payment.getUser().getId());
        Optional<PaymentMethod> methodOpt = paymentMethodRepository.findById(payment.getPaymentMethod().getId());

        if (userOpt.isPresent() && methodOpt.isPresent()) {
            UserProfile profile = userProfileRepository.findByUserId(payment.getUser().getId());

            if (profile == null) { // Если профиль отсутствует, создаем его
                profile = new UserProfile(userOpt.get(), BigDecimal.ZERO, "Auto-created profile");
                userProfileRepository.save(profile);
            }

            profile.setBalance(profile.getBalance().add(payment.getAmount()));
            profile.setUpdatedAt(LocalDateTime.now());
            userProfileRepository.save(profile);

            if (payment.getStatus() == null) {
                payment.setStatus("completed");
            }

            paymentRepository.save(payment);
            return "Balance topped up successfully";
        }
        return "User or Payment Method not found";
    }

    // Обновление личной информации
    @PutMapping("/update/{userId}")
    public String updateUserProfile(@PathVariable Long userId, @RequestBody UserProfile updatedProfile) {
        UserProfile profile = userProfileRepository.findByUserId(userId);
        if (profile != null) {
            profile.setDetails(updatedProfile.getDetails());
            profile.setUpdatedAt(LocalDateTime.now());
            userProfileRepository.save(profile);
            return "Profile updated successfully";
        }
        return "User profile not found";
    }
}
