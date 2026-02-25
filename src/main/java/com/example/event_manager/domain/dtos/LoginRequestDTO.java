package com.example.event_manager.domain.dtos;

public record LoginRequestDTO(
        String email,
        String password
) {}
