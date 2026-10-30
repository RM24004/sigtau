package com.sigtau.sigtau.controller;
import com.sigtau.sigtau.dto.ApiResponse;
import com.sigtau.sigtau.dto.ReasonRequestDTO;
import com.sigtau.sigtau.dto.ReasonResponseDTO;
import com.sigtau.sigtau.service.ReasonService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/reasons")

public class ReasonController {
    private final ReasonService reasonService;
    public ReasonController(ReasonService reasonService) {
        this.reasonService = reasonService;
    }

    //Obtener Todos los registros
    @GetMapping
    public ResponseEntity<List<ReasonResponseDTO>> listAll() {
        List<ReasonResponseDTO> reasons = reasonService.listAll();
        return new ResponseEntity<>(reasons, HttpStatus.OK);
    }

    //Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<ReasonResponseDTO> getById(@PathVariable Long id) {
        ReasonResponseDTO reason = reasonService.findById(id);
        return new ResponseEntity<>(reason, HttpStatus.OK);
    }

    //Crear
    @PostMapping
    public ResponseEntity<ApiResponse> save(@Valid @RequestBody ReasonRequestDTO dto) {
        reasonService.save(dto);
        return ResponseEntity.ok(new ApiResponse("Motivo creado con exito"));
    }
    
    //Actualizar
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @Valid @RequestBody ReasonRequestDTO dto) {
        reasonService.update(id, dto);
        return ResponseEntity.ok(new ApiResponse("Motivo actualizado con exito"));
    }   

    //Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        reasonService.delete(id);
        return ResponseEntity.ok(new ApiResponse("Motivo eliminado con exito"));
    }   
}
