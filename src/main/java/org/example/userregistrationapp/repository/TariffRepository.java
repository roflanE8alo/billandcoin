package org.example.userregistrationapp.repository;

import org.example.userregistrationapp.model.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TariffRepository extends JpaRepository<Tariff, Long> {
    List<Tariff> findByActiveTrue(); // Найти все активные тарифы
    Optional<Tariff> findByName(String name); // Найти тариф по имени (добавлено)
}