package org.example.userregistrationapp.controller;

import org.example.userregistrationapp.model.Role;
import org.example.userregistrationapp.model.User;
import org.example.userregistrationapp.model.UserProfile;
import org.example.userregistrationapp.repository.RoleRepository;
import org.example.userregistrationapp.repository.UserRepository;
import org.example.userregistrationapp.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.userregistrationapp.util.PasswordUtil;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private RoleRepository roleRepository;

    @PostMapping(value = "/register", consumes = { "application/json", "application/json;charset=UTF-8" })
    public User registerUser(@RequestBody User user) {
        // Хешируем пароль перед сохранением
        user.setPasswordHash(PasswordUtil.hashPassword(user.getPasswordHash()));

        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Role defaultRole = roleRepository.findByName("USER");
            Set<Role> roles = new HashSet<>();
            roles.add(defaultRole);
            user.setRoles(roles);
        }

        // Сохраняем пользователя
        User savedUser = userRepository.save(user);

        // Создаем профиль
        UserProfile userProfile = new UserProfile(savedUser, BigDecimal.ZERO, "Default profile");
        userProfileRepository.save(userProfile);

        return savedUser;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("passwordHash"); // Обычный пароль, не хешированный

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Проверяем пароль с помощью утилиты
            if (PasswordUtil.checkPassword(password, user.getPasswordHash())) {
                String role = user.getRoles().iterator().next().getName(); // Получаем роль

                Map<String, String> response = new HashMap<>();
                response.put("role", role);

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    /*@GetMapping("/current/{userId}")
    public ResponseEntity<?> getCurrentUser(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("roles", user.getRoles());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }*/

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser() {
        // Возвращаем фиктивного пользователя для демонстрации
        Map<String, Object> user = new HashMap<>();
        user.put("id", 1); // Фиксированный ID
        user.put("username", "demo_user");
        return ResponseEntity.ok(user);
    }

    @PostMapping("/assign-role/{userId}/{roleName}")
    public String assignRole(@PathVariable Long userId, @PathVariable String roleName) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Role role = roleRepository.findByName(roleName);

            if (role != null) {
                // Очистка старых ролей
                user.getRoles().clear();

                // Назначение новой роли
                user.getRoles().add(role);
                userRepository.save(user);
                return "Role assigned successfully";
            } else {
                return "Role not found";
            }
        } else {
            return "User not found";
        }
    }

    @GetMapping("/roles/{userId}")
    public Set<Role> getUserRoles(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return userOpt.get().getRoles(); // Возвращаем роли пользователя
        } else {
            return Collections.emptySet(); // Возвращаем пустой список, если пользователь не найден
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        // Проверяем, существует ли пользователь
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id); // Удаляем пользователя
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}