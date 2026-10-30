package com.sigtau.sigtau.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/** Materia que pertenece a una carrera (reciclado de Brand). */
@Entity
@Table(name = "subject")
@Getter @Setter
@NoArgsConstructor
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_subject")
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @Size(max = 255)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "career_id", nullable = false)
    private Career career;
}
