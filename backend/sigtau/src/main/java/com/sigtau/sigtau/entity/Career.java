package com.sigtau.sigtau.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Data
@Table(name = "career")
@NoArgsConstructor
@AllArgsConstructor
public class Career {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_career")
    private Long id;
    
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
    private String name;
    
    @Size(max = 255, message = "La descripción no puede superar los 255 caracteres")
    private String description;
}
