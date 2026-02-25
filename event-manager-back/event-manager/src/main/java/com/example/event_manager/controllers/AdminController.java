package com.example.event_manager.controllers;

import com.example.event_manager.domain.dtos.AdminRegistrationDTO;
import com.example.event_manager.domain.dtos.LoginRequestDTO;
import com.example.event_manager.services.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid AdminRegistrationDTO dto) {
        String message = adminService.registerAdmin(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDTO data) {
        String token = adminService.login(data.email(), data.password());
        return ResponseEntity.ok(token);
    }

}
