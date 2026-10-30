package com.sigtau.sigtau.service;
import com.sigtau.sigtau.entity.Modality;
import com.sigtau.sigtau.repository.ModalityRepository;
import com.sigtau.sigtau.dto.ModalityRequestDTO;
import com.sigtau.sigtau.dto.ModalityResponseDTO;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ModalityService {
    private final ModalityRepository modalityRepository;
    public ModalityService(ModalityRepository modalityRepository) {
        this.modalityRepository = modalityRepository;
    }
    //Entity → DTO
    private ModalityResponseDTO toDTO(Modality modality) {
        return new ModalityResponseDTO(
                modality.getId(),
                modality.getName(),
                modality.getDescription()
        );
    }

    //DTO → Entity
    private Modality toEntity(ModalityRequestDTO dto) {
        Modality modality = new Modality();
        modality.setName(dto.getName());
        modality.setDescription(dto.getDescription());
        return modality;
    }
    
    //Crear
    public ModalityResponseDTO save(ModalityRequestDTO dto) {
        Modality modality = toEntity(dto);
        modality.setId(null);
        return toDTO(modalityRepository.save(modality));
    }

    //Todos los registros
    public List<ModalityResponseDTO> listAll() {
        return modalityRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }
    
    //Buscar por ID
    public ModalityResponseDTO findById(Long id) {
        Modality modality = modalityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plataform no Encontrada"));
        return toDTO(modality);
    }
    
    //Actualizar
    public ModalityResponseDTO update(Long id, ModalityRequestDTO dto) {
        Modality modality = modalityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plataform no Encontrada"));

        modality.setName(dto.getName());
        modality.setDescription(dto.getDescription());

        return toDTO(modalityRepository.save(modality));
    }

    //Eliminar
    public void delete(Long id) {
        Modality modality = modalityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plataform no Encontrada"));
        modalityRepository.delete(modality);
    }
}
