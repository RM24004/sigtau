package com.sigtau.sigtau.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CancelEnrollmentDTO {
    /** Opcional: motivo del catálogo Reason. */
    private Long reasonId;
}
