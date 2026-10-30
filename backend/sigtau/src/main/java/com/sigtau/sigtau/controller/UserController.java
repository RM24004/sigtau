package com.sigtau.sigtau.controller;
import com.sigtau.sigtau.dto.UserResponseDTO;
import com.sigtau.sigtau.dto.ApiResponse;
import com.sigtau.sigtau.dto.UserRequestDTO;
import com.sigtau.sigtau.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")

public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    //Obtener Todos los registros
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> listAll() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    //Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getById(@PathVariable Long id) {
        UserResponseDTO user = userService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    //Crear
    @PostMapping
    public ResponseEntity<ApiResponse> save(@Valid @RequestBody UserRequestDTO dto) {
        userService.createUser(dto);
        return ResponseEntity.ok(new ApiResponse("Usuario creado con exito"));
    }

    //Actualizar
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @Valid @RequestBody UserRequestDTO dto) {
        userService.updateUser(id, dto);
        return ResponseEntity.ok(new ApiResponse("Usuario actualizado con exito"));
    }

    //Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new ApiResponse("Usuario eliminado con exito"));
    }
}
