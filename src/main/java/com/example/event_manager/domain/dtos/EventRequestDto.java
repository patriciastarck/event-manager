package com.example.event_manager.domain.dtos;

import java.time.LocalDateTime;

public record EventRequestDto(
        String title,
        LocalDateTime date,
        String location,
        String imageUrl
) {}
