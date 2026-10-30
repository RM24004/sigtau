package com.sigtau.sigtau.service;

import com.sigtau.sigtau.entity.Career;
import com.sigtau.sigtau.repository.CareerRepository;
import com.sigtau.sigtau.dto.CareerRequestDTO;
import com.sigtau.sigtau.dto.CareerResponseDTO;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class CareerService {
     private final CareerRepository careerRepository;

    public CareerService(CareerRepository careerRepository) {
        this.careerRepository = careerRepository;
    }

    //Entity → DTO
    private CareerResponseDTO toDTO(Career c) {
        return new CareerResponseDTO(
                c.getId(),
                c.getName(),
                c.getDescription()
        );
    }

    //DTO → Entity
    private Career toEntity(CareerRequestDTO dto) {
        Career c = new Career();
        c.setName(dto.getName());
        c.setDescription(dto.getDescription());
        return c;
    }

    //Crear
    public CareerResponseDTO save(CareerRequestDTO dto) {
        Career c = toEntity(dto);
        c.setId(null);
        return toDTO(careerRepository.save(c));
    }

    //Todos los registros
    public List<CareerResponseDTO> listAll() {
        return careerRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    //Buscar por ID
    public CareerResponseDTO findById(Long id) {
        Career c = careerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrera no encontrada"));
        return toDTO(c);
    }

    //Actualizar
    public CareerResponseDTO update(Long id, CareerRequestDTO dto) {
        Career c = careerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrera no encontrada"));

        c.setName(dto.getName());
        c.setDescription(dto.getDescription());

        return toDTO(careerRepository.save(c));
    }

    //Eliminar
    public void delete(Long id) {
        if (!careerRepository.existsById(id)) {
            throw new RuntimeException("Carrera no encontrada");
        }
        careerRepository.deleteById(id);
    }
}
