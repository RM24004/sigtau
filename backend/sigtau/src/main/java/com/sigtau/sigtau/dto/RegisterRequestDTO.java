package com.sigtau.sigtau.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/** Registro público: siempre crea un ESTUDIANTE (no se acepta rol desde el cliente). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email invalido")
    private String email;

    @NotBlank(message = "El telefono es obligatorio")
    @Size(max = 20)
    private String phone;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, max = 64, message = "La contraseña debe tener entre 6 y 64 caracteres")
    private String password;
}
