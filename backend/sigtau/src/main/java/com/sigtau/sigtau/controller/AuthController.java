package com.sigtau.sigtau.controller;

import com.sigtau.sigtau.dto.ApiResponse;
import com.sigtau.sigtau.dto.AuthRequest;
import com.sigtau.sigtau.dto.AuthResponse;
import com.sigtau.sigtau.dto.RegisterRequestDTO;
import com.sigtau.sigtau.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return authService.authenticate(request);
    }

    @PostMapping("/register")
    public ApiResponse register(@Valid @RequestBody RegisterRequestDTO dto) {
        authService.register(dto);
        return new ApiResponse("Estudiante registrado con exito");
    }
}
