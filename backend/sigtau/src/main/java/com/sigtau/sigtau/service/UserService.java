package com.sigtau.sigtau.service;

import com.sigtau.sigtau.dto.UserRequestDTO;
import com.sigtau.sigtau.dto.UserResponseDTO;
import com.sigtau.sigtau.entity.Role;
import com.sigtau.sigtau.entity.User;
import com.sigtau.sigtau.repository.RoleRepository;
import com.sigtau.sigtau.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Gestión de usuarios por el ADMIN (crear tutores, administradores, etc.). */
@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private UserResponseDTO toDTO(User u) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(u.getId());
        dto.setName(u.getName());
        dto.setEmail(u.getEmail());
        dto.setPhone(u.getPhone());
        dto.setRoleId(u.getRole().getId());
        dto.setRoleName(u.getRole().getName());
        return dto;
    }

    private Role findRole(Long id) {
        return roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Rol no encontrado"));
    }

    public UserResponseDTO createUser(UserRequestDTO dto) {
        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }
        User u = new User();
        u.setName(dto.getName());
        u.setEmail(dto.getEmail());
        u.setPhone(dto.getPhone());
        u.setPassword(passwordEncoder.encode(dto.getPassword()));
        u.setRole(findRole(dto.getRoleId()));
        return toDTO(userRepository.save(u));
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        return toDTO(userRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado")));
    }

    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {
        User u = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        userRepository.findByEmail(dto.getEmail()).ifPresent(other -> {
            if (!other.getId().equals(id)) throw new IllegalArgumentException("El correo ya está registrado");
        });
        u.setName(dto.getName());
        u.setEmail(dto.getEmail());
        u.setPhone(dto.getPhone());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            u.setPassword(passwordEncoder.encode(dto.getPassword())); // siempre con hash
        }
        u.setRole(findRole(dto.getRoleId()));
        return toDTO(userRepository.save(u));
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) throw new RuntimeException("Usuario no encontrado");
        userRepository.deleteById(id);
    }
}
