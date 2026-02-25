package com.example.event_manager.controllers;

import com.example.event_manager.domain.dtos.EventRequestDto;
import com.example.event_manager.domain.dtos.EventResponseDto;
import com.example.event_manager.services.EventService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponseDto> create(@RequestBody @Valid EventRequestDto dto, UriComponentsBuilder uriBuilder) {
        EventResponseDto response = eventService.createEvent(dto);
        var uri = uriBuilder.path("/api/events/{id}").buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    public ResponseEntity<List<EventResponseDto>> list() {
        return ResponseEntity.ok(eventService.listAllByAdmin());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDto> update(@PathVariable Long id, @RequestBody EventRequestDto dto) {
        return ResponseEntity.ok(eventService.updateEvent(id, dto));
    }
}
