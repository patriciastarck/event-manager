package com.example.event_manager.services;

import com.example.event_manager.domain.dtos.EventRequestDto;
import com.example.event_manager.domain.dtos.EventResponseDto;
import com.example.event_manager.domain.entities.Administrator;
import com.example.event_manager.domain.entities.Event;
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

    public EventResponseDto updateEvent(Long id, EventRequestDto dto) {
        // 1. Busca o evento pelo ID (Requisito 5 do PDF)
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));

        // 2 recupera o admin logado via token
        Administrator admin = (Administrator) org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();

        // 3 valida se o admin é o dono do envento
        if(!event.getAdministrator().getId().equals(admin.getId())) {
            throw new RuntimeException("Você não pode alterar este evento.");
        }

        // 4 atualiza os campos exigidos: Data e localização
        event.setDate(dto.date());
        event.setLocation(dto.location());

        // opcional: pode alterar o titulo e imagem se quiser
        event.setTitle(dto.title());
        event.setImageUrl(dto.imageUrl());

        Event updateEvent = eventRepository.save(event);
        return toDto(updateEvent);
    }
}