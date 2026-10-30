package com.sigtau.sigtau.service;

import com.sigtau.sigtau.entity.User;
import com.sigtau.sigtau.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/** Obtiene el usuario autenticado a partir del JWT (nunca se confía en ids enviados por el cliente). */
@Service
public class CurrentUserService {
    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User get() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null || !a.isAuthenticated() || a instanceof AnonymousAuthenticationToken) {
            throw new AccessDeniedException("No autenticado");
        }
        return userRepository.findByEmail(a.getName())
                .orElseThrow(() -> new AccessDeniedException("Usuario no encontrado"));
    }

    public boolean hasRole(String role) {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        return a != null && a.getAuthorities().stream()
                .anyMatch(g -> g.getAuthority().equals("ROLE_" + role));
    }
}
