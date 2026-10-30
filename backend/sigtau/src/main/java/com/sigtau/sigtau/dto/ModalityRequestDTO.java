package com.sigtau.sigtau.dto;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModalityRequestDTO {

    private Long id;
    
    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
    private String name;

    @Size(max = 255, message = "La descripcion no puede superar los 255 caracteres")
    private String description;
}
