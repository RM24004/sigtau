package com.sigtau.sigtau.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

/** Tutoría ofrecida por un tutor (reciclado de Product: el stock pasa a ser cupos). */
@Entity
@Table(name = "tutoring")
@Getter @Setter
@NoArgsConstructor
public class Tutoring {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tutoring")
    private Long id;

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String title;

    @Size(max = 500)
    @Column(length = 500)
    private String description;

    @NotNull
    @Column(name = "tutoring_date", nullable = false)
    private LocalDate tutoringDate;

    @NotNull
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @NotNull
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Size(max = 150)
    private String location;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer capacity;

    @NotNull
    @Min(0)
    @Column(name = "available_spots", nullable = false)
    private Integer availableSpots;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TutoringStatus status = TutoringStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modality_id", nullable = false)
    private Modality modality;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tutor_id", nullable = false)
    private User tutor;
}
