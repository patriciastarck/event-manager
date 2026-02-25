package com.example.event_manager.repositories;

import com.example.event_manager.domain.entities.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Administrator, Long> {
    // Método customizado para buscar por email (usaremos no Login)
    Optional<Administrator> findByEmail(String email);
}
