package com.sigtau.sigtau.controller;
import com.sigtau.sigtau.dto.ApiResponse;
import com.sigtau.sigtau.dto.RoleRequestDTO;
import com.sigtau.sigtau.dto.RoleResponseDTO;
import com.sigtau.sigtau.service.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {
    private final RoleService roleService;
    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    //Obtener Todos los registros
    @GetMapping
    public ResponseEntity<List<RoleResponseDTO>> listAll() {
        List<RoleResponseDTO> roles = roleService.listAll();
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }

    //Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<RoleResponseDTO> getById(@PathVariable Long id) {
        RoleResponseDTO role = roleService.findById(id);
        return new ResponseEntity<>(role, HttpStatus.OK);
    }

    //Crear
    @PostMapping
    public ResponseEntity<ApiResponse> save(@Valid @RequestBody RoleRequestDTO dto) {
        roleService.save(dto);
        return ResponseEntity.ok(new ApiResponse("Rol creado con exito"));
    }

    //Actualizar
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @Valid @RequestBody RoleRequestDTO dto) {
        roleService.update(id, dto);
        return ResponseEntity.ok(new ApiResponse("Rol actualizado con exito"));
    }
    
    //Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        roleService.delete(id);
        return ResponseEntity.ok(new ApiResponse("Rol eliminado con exito"));
    }
}
