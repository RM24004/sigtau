package com.sigtau.sigtau.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {
    private final JwtFilter jwtFilter;
    private final String allowedOrigin;

    public SecurityConfig(JwtFilter jwtFilter, @Value("${app.cors.allowed-origin}") String allowedOrigin) {
        this.jwtFilter = jwtFilter;
        this.allowedOrigin = allowedOrigin;
    }

    /**
     * IMPORTANTE: Spring Security aplica la PRIMERA regla que coincide.
     * Por eso van de lo más específico a lo más general.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(e -> e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Públicas: login y registro de estudiantes
                .requestMatchers("/auth/**").permitAll()

                // Catálogos visibles sin sesión (lectura)
                .requestMatchers(HttpMethod.GET, "/careers/**", "/subjects/**", "/modalities/**").permitAll()

                // Motivos de cancelación: cualquiera autenticado los lee
                .requestMatchers(HttpMethod.GET, "/reasons/**").authenticated()

                // Tutorías
                .requestMatchers(HttpMethod.GET, "/tutorings/mine").hasAnyRole("ADMIN", "TUTOR")
                .requestMatchers(HttpMethod.GET, "/tutorings/**").authenticated()
                .requestMatchers("/tutorings/**").hasAnyRole("ADMIN", "TUTOR")

                // Inscripciones
                .requestMatchers(HttpMethod.POST, "/enrollments").hasRole("STUDENT")
                .requestMatchers(HttpMethod.GET, "/enrollments/my").hasRole("STUDENT")
                .requestMatchers(HttpMethod.PUT, "/enrollments/*/cancel").hasAnyRole("STUDENT", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/enrollments/**").hasAnyRole("ADMIN", "TUTOR")

                // Lista de tutores para armar tutorías (solo ADMIN)
                // Administración de catálogos y usuarios: solo ADMIN
                .requestMatchers("/careers/**", "/subjects/**", "/modalities/**",
                                 "/reasons/**", "/roles/**", "/users/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigin));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
