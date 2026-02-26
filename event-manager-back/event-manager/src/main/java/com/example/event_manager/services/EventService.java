package com.example.event_manager.services;

import com.example.event_manager.domain.dtos.EventRequestDto;
import com.example.event_manager.domain.dtos.EventResponseDto;
import com.example.event_manager.domain.entities.Administrator;
import com.example.event_manager.domain.entities.Event;
import com.example.event_manager.infra.exceptions.ResourceNotFoundException;
import com.example.event_manager.repositories.AdminRepository;
import com.example.event_manager.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final AdminRepository adminRepository;

    /**
     * Método auxiliar para recuperar o Administrator logado de forma segura.
     * Resolve o erro de ClassCastException ao lidar com o Principal do SecurityContext.
     */
    private Administrator getAuthenticatedAdmin() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;

        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }

        return adminRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador não encontrado"));
    }

    public EventResponseDto createEvent(EventRequestDto dto) {
        // Busca o admin de forma segura pelo e-mail extraído do token
        Administrator admin = getAuthenticatedAdmin();

        Event event = new Event();
        event.setTitle(dto.title());
        event.setDate(dto.date());
        event.setLocation(dto.location());
        event.setImageUrl(dto.imageUrl());
        event.setAdministrator(admin);

        Event savedEvent = eventRepository.save(event);
        return toDto(savedEvent);
    }

    public List<EventResponseDto> listAllByAdmin() {
        // Busca o admin logado
        Administrator admin = getAuthenticatedAdmin();

        // Usa o método findByAdministrator que deve estar no seu EventRepository
        return eventRepository.findByAdministrator(admin).stream()
                .map(this::toDto)
                .toList();
    }

    public EventResponseDto updateEvent(Long id, EventRequestDto dto) {
        // 1. Busca o evento original
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado"));

        // 2. Recupera o admin logado com segurança
        Administrator admin = getAuthenticatedAdmin();

        // 3. Valida se o admin logado é o dono do evento
        if (!event.getAdministrator().getId().equals(admin.getId())) {
            throw new RuntimeException("Você não tem permissão para alterar este evento.");
        }

        // 4. Atualiza os campos
        event.setDate(dto.date());
        event.setLocation(dto.location());
        event.setTitle(dto.title());
        event.setImageUrl(dto.imageUrl());

        Event updatedEvent = eventRepository.save(event);
        return toDto(updatedEvent);
    }

    public void deleteEvent(Long id) {
        // Opcional: Adicionar validação de dono aqui também antes de deletar
        eventRepository.deleteById(id);
    }

    private EventResponseDto toDto(Event event) {
        return new EventResponseDto(
                event.getId(),
                event.getTitle(),
                event.getDate(),
                event.getLocation(),
                event.getImageUrl(),
                event.getAdministrator().getId()
        );
    }
}