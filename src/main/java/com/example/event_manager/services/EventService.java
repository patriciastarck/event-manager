package com.example.event_manager.services;

import com.example.event_manager.dtos.EventRequestDto;
import com.example.event_manager.dtos.EventResponseDto;
import com.example.event_manager.entities.Administrator;
import com.example.event_manager.entities.Event;
import com.example.event_manager.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public EventResponseDto createEvent(EventRequestDto dto) {
        // Pega o admin que o SecurityFilter salvou no 'crachá' (contexto)
        Administrator admin = (Administrator) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

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
        Administrator admin = (Administrator) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // Busca apenas os eventos que pertencem ao ID do admin logado
        return eventRepository.findByAdministratorId(admin.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void deleteEvent(Long id) {
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