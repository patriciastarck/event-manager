package com.example.event_manager.dtos;

import java.time.LocalDateTime;

public record EventRequestDto(
        String title,
        LocalDateTime date,
        String location,
        String imageUrl
) {}
