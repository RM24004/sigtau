package com.sigtau.sigtau.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequestDTO {
    @NotNull(message = "La tutoría es requerida")
    private Long tutoringId;
}
