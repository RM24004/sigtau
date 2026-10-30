package com.sigtau.sigtau.controller;

import com.sigtau.sigtau.dto.*;
import com.sigtau.sigtau.service.EnrollmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    /** Inscribirse (solo STUDENT). El estudiante se toma del token. */
    @PostMapping
    public ResponseEntity<ApiResponse> enroll(@Valid @RequestBody EnrollmentRequestDTO dto) {
        enrollmentService.enroll(dto.getTutoringId());
        return ResponseEntity.ok(new ApiResponse("Inscripción realizada con exito"));
    }

    /** Mis inscripciones (STUDENT). */
    @GetMapping("/my")
    public ResponseEntity<List<EnrollmentResponseDTO>> mine() {
        return ResponseEntity.ok(enrollmentService.listMine());
    }

    /** Todas (ADMIN) o las de mis tutorías (TUTOR). */
    @GetMapping
    public ResponseEntity<List<EnrollmentResponseDTO>> all(@RequestParam(required = false) Long tutoringId) {
        return ResponseEntity.ok(enrollmentService.listAll(tutoringId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse> cancel(@PathVariable Long id, @RequestBody(required = false) CancelEnrollmentDTO dto) {
        enrollmentService.cancel(id, dto);
        return ResponseEntity.ok(new ApiResponse("Inscripción cancelada"));
    }
}
