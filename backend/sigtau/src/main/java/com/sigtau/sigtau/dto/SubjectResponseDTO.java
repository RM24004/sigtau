package com.sigtau.sigtau.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Long careerId;
    private String careerName;
}
