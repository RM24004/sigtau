package com.sigtau.sigtau.dto;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReasonRequestDTO {

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 255)
    private String name;

    @Size(max = 255)
    @NotBlank(message = "La descripción es requerida")
    private String description;

}
