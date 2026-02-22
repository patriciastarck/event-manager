package com.example.event_manager.repositories;

import com.example.event_manager.entities.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdministratorRepository extends JpaRepository<AdministratorRepository, Long> {
    // Método customizado para buscar por email (usaremos no Login)
    Optional<Administrator> findByEmail(String email);
}
