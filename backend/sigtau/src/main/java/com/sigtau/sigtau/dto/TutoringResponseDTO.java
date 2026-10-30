package com.sigtau.sigtau.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TutoringResponseDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate tutoringDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;
    private Integer capacity;
    private Integer availableSpots;
    private String status;
    private Long subjectId;
    private String subjectName;
    private String careerName;
    private Long modalityId;
    private String modalityName;
    private Long tutorId;
    private String tutorName;
    /** true si el usuario autenticado (estudiante) ya está inscrito. */
    private boolean enrolledByMe;
}
