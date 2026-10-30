package com.sigtau.sigtau.service;
import com.sigtau.sigtau.entity.Role;
import com.sigtau.sigtau.repository.RoleRepository;
import com.sigtau.sigtau.dto.RoleRequestDTO;
import com.sigtau.sigtau.dto.RoleResponseDTO;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoleService {
    private final RoleRepository roleRepository;
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }
    //Entity → DTO
    private RoleResponseDTO toDTO(Role rol) {
         return new RoleResponseDTO(
                rol.getId(),
                rol.getName(),
                rol.getDescription()
        );
    }

    //DTO → Entity
    private Role toEntity(RoleRequestDTO dto) {
        Role rol = new Role();
        rol.setName(dto.getName());
        rol.setDescription(dto.getDescription());
        return rol;
    }

    //Crear
    public RoleResponseDTO save(RoleRequestDTO dto) {
        Role rol = toEntity(dto);
        rol.setId(null);
        return toDTO(roleRepository.save(rol));
    }

    //Todos los registros
    public List<RoleResponseDTO> listAll() {
        return roleRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    //Buscar por ID
    public RoleResponseDTO findById(Long id) {
        Role rol = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        return toDTO(rol);
    }

    //Actualizar
    public RoleResponseDTO update(Long id, RoleRequestDTO dto) {
        Role rol = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        rol.setName(dto.getName());
        rol.setDescription(dto.getDescription());

        return toDTO(roleRepository.save(rol));
    }

    //Eliminar
    public void delete(Long id) {
        Role rol = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        roleRepository.delete(rol);
    }
}
