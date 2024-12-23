package org.example.userregistrationapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "user_tariffs")
public class UserTariff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_tariff_id") // Привязка к SQL
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "tariff_id", nullable = false)
    @JsonIgnore // Добавлено для избежания рекурсии
    private Tariff tariff;


    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt; // Привязка к SQL

    public UserTariff() {}

    // Конструктор с 2 параметрами
    public UserTariff(User user, Tariff tariff) {
        this.user = user;
        this.tariff = tariff;
        this.assignedAt = LocalDateTime.now(); // По умолчанию текущая дата
    }

    // Конструктор с 3 параметрами
    public UserTariff(User user, Tariff tariff, LocalDateTime assignedAt) {
        this.user = user;
        this.tariff = tariff;
        this.assignedAt = assignedAt; // Явное указание даты
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Tariff getTariff() {
        return tariff;
    }

    public void setTariff(Tariff tariff) {
        this.tariff = tariff;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }
}