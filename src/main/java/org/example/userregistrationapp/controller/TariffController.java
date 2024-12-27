package org.example.userregistrationapp.controller;

import org.example.userregistrationapp.model.Tariff;
import org.example.userregistrationapp.model.User;
import org.example.userregistrationapp.model.UserProfile;
import org.example.userregistrationapp.model.UserTariff;
import org.example.userregistrationapp.repository.TariffRepository;
import org.example.userregistrationapp.repository.UserProfileRepository;
import org.example.userregistrationapp.repository.UserRepository;
import org.example.userregistrationapp.repository.UserTariffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tariffs")
public class TariffController {

    @Autowired
    private TariffRepository tariffRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

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
    public ResponseEntity<?> getActiveTariff(@PathVariable Long userId) {
        List<UserTariff> userTariffs = userTariffRepository.findByUserId(userId);
        if (userTariffs.isEmpty()) {
            return ResponseEntity.noContent().build(); // Возвращаем HTTP 204
        }
        return ResponseEntity.ok(userTariffs.get(userTariffs.size() - 1).getTariff());
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
    public ResponseEntity<?> assignTariff(@PathVariable Long userId, @PathVariable Long tariffId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Tariff> tariffOpt = tariffRepository.findById(tariffId);

        if (userOpt.isPresent() && tariffOpt.isPresent()) {
            User user = userOpt.get();
            Tariff tariff = tariffOpt.get();
            UserProfile profile = userProfileRepository.findByUserId(userId);

            // Проверка баланса пользователя
            if (profile.getBalance().compareTo(tariff.getPrice()) < 0) {
                return ResponseEntity.badRequest().body("Insufficient balance");
            }

            // Списание средств с баланса
            profile.setBalance(profile.getBalance().subtract(tariff.getPrice()));
            userProfileRepository.save(profile);

            // Привязка тарифа к пользователю
            UserTariff userTariff = new UserTariff(user, tariff, LocalDateTime.now());
            userTariffRepository.save(userTariff);

            return ResponseEntity.ok("Tariff assigned successfully");
        }
        return ResponseEntity.badRequest().body("User or Tariff not found");
    }

    @GetMapping("/user/{userId}/active-tariff")
    public ResponseEntity<?> getUserActiveTariff(@PathVariable Long userId) {
        List<UserTariff> userTariffs = userTariffRepository.findByUserId(userId); // Получаем тарифы пользователя&#8203;:contentReference[oaicite:0]{index=0}

        if (userTariffs.isEmpty()) {
            return ResponseEntity.badRequest().body("No active tariff found for user");
        }

        UserTariff latestTariff = userTariffs.get(userTariffs.size() - 1); // Последний тариф
        Tariff tariff = latestTariff.getTariff(); // Получаем тариф&#8203;:contentReference[oaicite:1]{index=1}

        // Рассчитываем следующую дату списания
        LocalDateTime nextPaymentDate = latestTariff.getAssignedAt().plusMonths(1); // Через месяц

        // Возвращаем данные в JSON
        Map<String, Object> response = new HashMap<>();
        response.put("id", tariff.getId());
        response.put("name", tariff.getName());
        response.put("price", tariff.getPrice());
        response.put("nextPaymentDate", nextPaymentDate.toLocalDate());

        return ResponseEntity.ok(response);
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