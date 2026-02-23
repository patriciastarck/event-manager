package com.example.event_manager.services;

import com.example.event_manager.dtos.AdminRegistrationDTO;
import com.example.event_manager.entities.Administrator;
import com.example.event_manager.repositories.AdminRepository;
import com.example.event_manager.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public String registerAdmin(AdminRegistrationDTO dto) {
        //1 - validar se o email já existe
        if(adminRepository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("Email já está em uso");
        }
        // 2 - criar a entidade e criptografar a senha
        Administrator admin = new Administrator();
        admin.setName(dto.name());
        admin.setEmail(dto.email());

        // Aqui o BCrypt entra em ação
        String encryptedPassword = passwordEncoder.encode(dto.password());
        admin.setPassword(encryptedPassword);

        // 3 - Salvar no banco
        adminRepository.save(admin);

        return "Administrador registrado com sucesso";
    }

    public String login(String email, String password) {
        Administrator admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verifica se a senha enviada (plana) bate com a do banco (criptografada)
        if (passwordEncoder.matches(password, admin.getPassword())) {
            return tokenService.generateToken(admin); // Retorna o JWT
        }

        throw new RuntimeException("Invalid credentials");
    }
}
