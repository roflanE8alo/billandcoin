package org.example.userregistrationapp.controller;

import org.example.userregistrationapp.model.User;
import org.example.userregistrationapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        String hashedPassword = user.getPasswordHash();
        user.setPasswordHash(hashedPassword);
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent() && user.getPasswordHash().equals(existingUser.get().getPasswordHash())) {
            return "Login successful";
        } else {
            return "Invalid username or password";
        }
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}