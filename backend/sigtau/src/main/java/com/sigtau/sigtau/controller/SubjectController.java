package com.sigtau.sigtau.controller;

import com.sigtau.sigtau.dto.ApiResponse;
import com.sigtau.sigtau.dto.SubjectRequestDTO;
import com.sigtau.sigtau.dto.SubjectResponseDTO;
import com.sigtau.sigtau.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subjects")
public class SubjectController {
    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping
    public ResponseEntity<List<SubjectResponseDTO>> getAll(@RequestParam(required = false) Long careerId) {
        return ResponseEntity.ok(subjectService.listAll(careerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubjectResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> save(@Valid @RequestBody SubjectRequestDTO dto) {
        subjectService.save(dto);
        return ResponseEntity.ok(new ApiResponse("Materia creada con exito"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @Valid @RequestBody SubjectRequestDTO dto) {
        subjectService.update(id, dto);
        return ResponseEntity.ok(new ApiResponse("Materia actualizada con exito"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        subjectService.delete(id);
        return ResponseEntity.ok(new ApiResponse("Materia eliminada con exito"));
    }
}
