package com.example.event_manager.dtos;

import java.time.LocalDateTime;

public record EventResponseDto (
    Long id,
    String title,
    LocalDateTime date,
    String location,
    String imageUrl,
    Long adminId
){}
