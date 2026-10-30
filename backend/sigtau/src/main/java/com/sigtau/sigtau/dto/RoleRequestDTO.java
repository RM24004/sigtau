package com.sigtau.sigtau.dto;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleRequestDTO {
    
    @NotBlank(message = "El nombre es requerido")
    @Size(max = 50)
    private String name;

    @Size(max = 255)
    private String description;
}
