package com.example.event_manager.domain.dtos;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record EventRequestDto(
        @NotBlank(message = "O título é obrigatório")
        String title,

        @NotNull (message = "A data é obrigatória")
        @Future(message = "A data deve ser no futuro")
        LocalDateTime date,

        @NotBlank(message = "A localização é obrigatória")
        String location,

        String imageUrl
) {}
