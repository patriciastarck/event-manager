//package com.example.event_manager.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**") // Libera todos os endpoints [cite: 114, 139]
//                .allowedOrigins("http://localhost:5173", "http://localhost:3000") // Portas comuns do React
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos exigidos pelo desafio [cite: 14, 15, 34, 37]
//                .allowedHeaders("*")
//                .allowCredentials(true);
//    }
//}
