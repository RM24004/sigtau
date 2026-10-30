package com.sigtau.sigtau.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "modality")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Modality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_modality")
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 255)
    private String description;

}