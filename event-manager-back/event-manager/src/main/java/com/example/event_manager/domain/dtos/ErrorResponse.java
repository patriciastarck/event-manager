package com.example.event_manager.domain.dtos;

import java.time.LocalDateTime;

public record ErrorResponse (
        int status,
        String message,
        LocalDateTime timestamp
) {}
