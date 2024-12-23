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
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Role defaultRole = roleRepository.findByName("USER");
            Set<Role> roles = new HashSet<>();
            roles.add(defaultRole);
            user.setRoles(roles);
        }

        // Сохранение пользователя
        User savedUser = userRepository.save(user);

        // Создание профиля пользователя с балансом по умолчанию
        UserProfile userProfile = new UserProfile(savedUser, BigDecimal.ZERO, "Default profile");
        userProfileRepository.save(userProfile);

        return savedUser;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        // Получаем данные из запроса
        String username = loginData.get("username");
        String passwordHash = loginData.get("passwordHash");

        // Поиск пользователя в базе данных
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Проверка пароля
            if (user.getPasswordHash().equals(passwordHash)) {

                // Получаем роль пользователя
                String role = user.getRoles().iterator().next().getName(); // Предполагаем одну роль

                // Возвращаем роль
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
}