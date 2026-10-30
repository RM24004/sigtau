package com.sigtau.sigtau.dto;

import com.sigtau.sigtau.entity.TutoringStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TutoringRequestDTO {
    @NotBlank(message = "El título es requerido")
    @Size(max = 150)
    private String title;

    @Size(max = 500)
    private String description;

    @NotNull(message = "La fecha es requerida")
    private LocalDate tutoringDate;

    @NotNull(message = "La hora de inicio es requerida")
    private LocalTime startTime;

    @NotNull(message = "La hora de fin es requerida")
    private LocalTime endTime;

    @Size(max = 150)
    private String location;

    @NotNull(message = "La capacidad es requerida")
    @Min(value = 1, message = "La capacidad debe ser al menos 1")
    private Integer capacity;

    @NotNull(message = "La materia es requerida")
    private Long subjectId;

    @NotNull(message = "La modalidad es requerida")
    private Long modalityId;

    /** Solo lo usa un ADMIN; si el que crea es TUTOR se toma del token. */
    private Long tutorId;

    private TutoringStatus status;
}
