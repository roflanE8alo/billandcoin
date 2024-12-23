package org.example.userregistrationapp.controller;

import org.example.userregistrationapp.model.Tariff;
import org.example.userregistrationapp.model.User;
import org.example.userregistrationapp.model.UserTariff;
import org.example.userregistrationapp.repository.TariffRepository;
import org.example.userregistrationapp.repository.UserRepository;
import org.example.userregistrationapp.repository.UserTariffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tariffs")
public class TariffController {

    @Autowired
    private TariffRepository tariffRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserTariffRepository userTariffRepository;

    // Получить список всех активных тарифов
    @GetMapping
    public List<Tariff> getActiveTariffs() {
        return tariffRepository.findByActiveTrue();
    }

    // Получить тариф по имени
    @GetMapping("/name/{tariffName}")
    public Optional<Tariff> getTariffByName(@PathVariable String tariffName) {
        return tariffRepository.findByName(tariffName);
    }

    // Получить тариф по id
    @GetMapping("/active/{userId}")
    public Tariff getActiveTariff(@PathVariable Long userId) {
        // Поиск активного тарифа по ID пользователя
        List<UserTariff> userTariffs = userTariffRepository.findByUserId(userId);

        // Проверка наличия тарифа
        if (userTariffs.isEmpty()) {
            throw new RuntimeException("No active tariff found for user");
        }

        // Возвращаем последний назначенный тариф
        return userTariffs.get(userTariffs.size() - 1).getTariff();
    }

    // Добавить новый тариф
    @PostMapping
    public Tariff addTariff(@RequestBody Tariff tariff) {
        if (tariff.getCreatedAt() == null) {
            tariff.setCreatedAt(LocalDateTime.now());
        }
        return tariffRepository.save(tariff);
    }

    // Привязать тариф к пользователю
    @PostMapping("/assign/{userId}/{tariffId}")
    public String assignTariff(@PathVariable Long userId, @PathVariable Long tariffId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Tariff> tariffOpt = tariffRepository.findById(tariffId);

        if (userOpt.isPresent() && tariffOpt.isPresent()) {
            User user = userOpt.get();
            Tariff tariff = tariffOpt.get();

            UserTariff userTariff = new UserTariff(user, tariff, LocalDateTime.now());
            userTariffRepository.save(userTariff);
            return "Tariff assigned successfully";
        }
        return "User or Tariff not found";
    }

    // Активация или деактивация тарифа
    @PutMapping("/{id}/status")
    public String updateTariffStatus(@PathVariable Long id, @RequestParam boolean active) {
        Optional<Tariff> tariffOpt = tariffRepository.findById(id);
        if (tariffOpt.isPresent()) {
            Tariff tariff = tariffOpt.get();
            tariff.setActive(active);
            tariffRepository.save(tariff);
            return "Tariff status updated successfully";
        }
        return "Tariff not found";
    }

    // Редактирование тарифа
    @PutMapping("/{id}")
    public String updateTariff(@PathVariable Long id, @RequestBody Tariff updatedTariff) {
        Optional<Tariff> tariffOpt = tariffRepository.findById(id);
        if (tariffOpt.isPresent()) {
            Tariff tariff = tariffOpt.get();
            tariff.setName(updatedTariff.getName());
            tariff.setPrice(updatedTariff.getPrice());
            tariff.setDescription(updatedTariff.getDescription());
            tariff.setActive(updatedTariff.isActive());
            tariffRepository.save(tariff);
            return "Tariff updated successfully";
        }
        return "Tariff not found";
    }

    // Удаление тарифа
    @DeleteMapping("/{id}")
    public String deleteTariff(@PathVariable Long id) {
        if (tariffRepository.existsById(id)) {
            tariffRepository.deleteById(id);
            return "Tariff deleted successfully";
        }
        return "Tariff not found";
    }
}