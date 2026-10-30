package com.sigtau.sigtau.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/** Inscripción de un estudiante a una tutoría (reciclado de Entry/Exit). */
@Entity
@Table(name = "enrollment")
@Getter @Setter
@NoArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_enrollment")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tutoring_id", nullable = false)
    private Tutoring tutoring;

    @Column(name = "enrolled_at", nullable = false)
    private LocalDateTime enrolledAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EnrollmentStatus status = EnrollmentStatus.ACTIVE;

    @Column(name = "canceled_at")
    private LocalDateTime canceledAt;

    /** Motivo de cancelación (reutiliza el catálogo Reason). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reason_id")
    private Reason reason;
}
