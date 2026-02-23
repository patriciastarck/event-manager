package com.example.event_manager.repositories;

import com.example.event_manager.domain.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    // Busca todos os eventos que pertencem a um admin específico
    List<Event> findByAdministratorId(Long adminId);
}
