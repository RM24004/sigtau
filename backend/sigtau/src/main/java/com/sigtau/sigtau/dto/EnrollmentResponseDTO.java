package com.sigtau.sigtau.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponseDTO {
    private Long id;
    private Long tutoringId;
    private String tutoringTitle;
    private String subjectName;
    private LocalDate tutoringDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String tutorName;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String status;
    private LocalDateTime enrolledAt;
    private LocalDateTime canceledAt;
    private String reasonName;
}
