package com.example.event_manager.repositories;

import com.example.event_manager.domain.entities.Administrator; // Certifique-se de importar a entidade
import com.example.event_manager.domain.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    // ADICIONE ESTE MÉTODO: Ele resolve o erro no EventService
    List<Event> findByAdministrator(Administrator administrator);

    // Mantém os outros filtros que você já criou
    List<Event> findByAdministratorId(Long adminId);
    List<Event> findByTitleContainingIgnoreCase(String title);
    List<Event> findByDateBetween(LocalDateTime start, LocalDateTime end);
}