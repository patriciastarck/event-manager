package com.example.event_manager.domain.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminRegistrationDTO(
        @NotBlank(message = "O nome é obrigatório")
        String name,

        @Email(message = "Email inválido")
        @NotBlank(message = "O email é obrigatório")
        String email,

        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
        String password
) {}
