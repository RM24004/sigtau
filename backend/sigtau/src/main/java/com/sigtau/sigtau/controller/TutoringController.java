package com.sigtau.sigtau.controller;

import com.sigtau.sigtau.dto.ApiResponse;
import com.sigtau.sigtau.dto.TutoringRequestDTO;
import com.sigtau.sigtau.dto.TutoringResponseDTO;
import com.sigtau.sigtau.service.TutoringService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tutorings")
public class TutoringController {
    private final TutoringService tutoringService;

    public TutoringController(TutoringService tutoringService) {
        this.tutoringService = tutoringService;
    }

    @GetMapping
    public ResponseEntity<List<TutoringResponseDTO>> getAll() {
        return ResponseEntity.ok(tutoringService.listAll());
    }

    /** Tutorías del tutor autenticado (ADMIN: todas). */
    @GetMapping("/mine")
    public ResponseEntity<List<TutoringResponseDTO>> getMine() {
        return ResponseEntity.ok(tutoringService.listMine());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutoringResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tutoringService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> save(@Valid @RequestBody TutoringRequestDTO dto) {
        tutoringService.save(dto);
        return ResponseEntity.ok(new ApiResponse("Tutoría creada con exito"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @Valid @RequestBody TutoringRequestDTO dto) {
        tutoringService.update(id, dto);
        return ResponseEntity.ok(new ApiResponse("Tutoría actualizada con exito"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        tutoringService.delete(id);
        return ResponseEntity.ok(new ApiResponse("Tutoría eliminada con exito"));
    }
}
