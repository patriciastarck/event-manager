package com.example.event_manager.domain.dtos;

import java.time.LocalDateTime;

public record EventResponseDto (
    Long id,
    String title,
    LocalDateTime date,
    String location,
    String imageUrl,
    Long adminId
){}
