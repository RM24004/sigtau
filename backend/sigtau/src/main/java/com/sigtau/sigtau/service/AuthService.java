package com.sigtau.sigtau.service;

import com.sigtau.sigtau.config.JwtUtil;
import com.sigtau.sigtau.dto.AuthRequest;
import com.sigtau.sigtau.dto.AuthResponse;
import com.sigtau.sigtau.dto.RegisterRequestDTO;
import com.sigtau.sigtau.entity.Role;
import com.sigtau.sigtau.entity.User;
import com.sigtau.sigtau.repository.RoleRepository;
import com.sigtau.sigtau.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public AuthResponse authenticate(AuthRequest request) {
        // Mismo mensaje para usuario inexistente y contraseña incorrecta (evita enumerar usuarios)
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Credenciales inválidas");
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().getName(), user.getId(), user.getName());
        return new AuthResponse(token);
    }

    /** Registro público: el rol siempre es STUDENT. */
    @Transactional
    public void register(RegisterRequestDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }
        Role role = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new IllegalStateException("El rol STUDENT no está configurado"));
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(role);
        userRepository.save(user);
    }
}
