package org.example.userregistrationapp.repository;

import org.example.userregistrationapp.model.UserTariff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserTariffRepository extends JpaRepository<UserTariff, Long> {
    List<UserTariff> findByUserId(Long userId); // Найти все тарифы для пользователя
    List<UserTariff> findByTariffId(Long tariffId); // Поиск тарифов по ID тарифа (добавлено)
}
