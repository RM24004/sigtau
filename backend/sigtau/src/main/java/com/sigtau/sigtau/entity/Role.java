package com.sigtau.sigtau.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "role")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_role")
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50)
    @Column(unique = true, nullable = false)
    private String name;

    @Size(max = 255)
    private String description;
}
