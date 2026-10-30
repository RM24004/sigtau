package com.sigtau.sigtau.controller;

import com.sigtau.sigtau.dto.ApiResponse;
import com.sigtau.sigtau.dto.CareerRequestDTO;
import com.sigtau.sigtau.dto.CareerResponseDTO;
import com.sigtau.sigtau.service.CareerService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/careers")

public class CareerController {

    private final CareerService careerService;

    public CareerController(CareerService careerService) {
        this.careerService = careerService;
    }
    //GET ALL
    @GetMapping
    public ResponseEntity<List<CareerResponseDTO>> getAll() {
        List<CareerResponseDTO> careers = careerService.listAll();
        return new ResponseEntity<>(careers, HttpStatus.OK);
    }

    //GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<CareerResponseDTO> getById(@PathVariable Long id) {
        CareerResponseDTO career = careerService.findById(id);
        return new ResponseEntity<>(career, HttpStatus.OK);
    }

    //CREATE
    @PostMapping
    public ResponseEntity<ApiResponse> save(@Valid @RequestBody CareerRequestDTO dto) {
        careerService.save(dto);
        return ResponseEntity.ok(new ApiResponse("Carrera Creada con Exito"));
    }

    //UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @Valid @RequestBody CareerRequestDTO dto) {
        careerService.update(id, dto);
        return ResponseEntity.ok(new ApiResponse("Carrera actualizada con exito"));
    }

    //DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        careerService.delete(id);
        return ResponseEntity.ok(new ApiResponse("Carrera eliminada con exito"));
    }
}


