package com.example.event_manager.security; // ou configs, dependendo de onde o arquivo está

import com.example.event_manager.repositories.AdminRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final AdminRepository adminRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // Tentativa de recuperar o token
        var token = this.recoverToken(request);

        // LOG 1: Vamos ver se o token chegou do Neki
        System.out.println("DEBUG: Token recebido do Header: " + token);

        if (token != null) {
            var login = tokenService.validateToken(token);

            // LOG 2: Vamos ver se o TokenService conseguiu ler o email dentro do token
            System.out.println("DEBUG: Email extraído do Token: " + login);

            if (login != null && !login.isEmpty()) {
                var user = adminRepository.findByEmail(login);

                if (user.isPresent()) {
                    var authorities = user.get().getAuthorities();
                    var authentication = new UsernamePasswordAuthenticationToken(
                            user.get(),
                            null,
                            authorities // Passando as permissões, o 403 some!
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    System.out.println("DEBUG: Token válido, mas usuário não existe mais no banco.");
                }
            } else {
                System.out.println("DEBUG: Falha na validação do Token (login nulo ou vazio).");
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}