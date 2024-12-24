package org.example.userregistrationapp.controller;

import org.example.userregistrationapp.model.*;
import org.example.userregistrationapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
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
    public ResponseEntity<?> topUpBalance(@RequestBody Map<String, Object> requestData) {
        try {
            Long userId = Long.parseLong(requestData.get("userId").toString());
            Long methodId = Long.parseLong(requestData.get("methodId").toString());
            BigDecimal amount = new BigDecimal(requestData.get("amount").toString());

            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body("Amount must be greater than zero");
            }

            Optional<User> userOpt = userRepository.findById(userId);
            Optional<PaymentMethod> methodOpt = paymentMethodRepository.findById(methodId);

            if (userOpt.isPresent() && methodOpt.isPresent()) {
                UserProfile profile = userProfileRepository.findByUserId(userId);
                if (profile == null) {
                    profile = new UserProfile(userOpt.get(), BigDecimal.ZERO, "Auto-created profile");
                    userProfileRepository.save(profile);
                }

                profile.setBalance(profile.getBalance().add(amount));
                profile.setUpdatedAt(LocalDateTime.now());
                userProfileRepository.save(profile);

                Payment payment = new Payment(userOpt.get(), methodOpt.get(), amount, "completed");
                paymentRepository.save(payment);

                // Возвращаем новый платеж в ответе
                return ResponseEntity.ok(payment);
            }

            return ResponseEntity.badRequest().body("User or Payment Method not found");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
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
