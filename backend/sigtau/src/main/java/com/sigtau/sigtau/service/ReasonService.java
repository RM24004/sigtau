package com.sigtau.sigtau.service;
import com.sigtau.sigtau.entity.Reason;
import com.sigtau.sigtau.repository.ReasonRepository;
import com.sigtau.sigtau.dto.ReasonRequestDTO;
import com.sigtau.sigtau.dto.ReasonResponseDTO;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReasonService {
    private final ReasonRepository reasonRepository;
    public ReasonService(ReasonRepository reasonRepository) {
        this.reasonRepository = reasonRepository;
    }

    //Entity → DTO
    private ReasonResponseDTO toDTO(Reason reason) {
         return new ReasonResponseDTO(
                reason.getId(),
                reason.getName(),
                reason.getDescription()
        );
    }

    //DTO → Entity
    private Reason toEntity(ReasonRequestDTO dto) {
        Reason reason = new Reason();
        reason.setName(dto.getName());
        reason.setDescription(dto.getDescription());
        return reason;
    }

    //Crear
    public ReasonResponseDTO save(ReasonRequestDTO dto) {
        Reason reason = toEntity(dto);
        reason.setId(null);
        return toDTO(reasonRepository.save(reason));
    }

    //Todos los registros
    public List<ReasonResponseDTO> listAll() {
        return reasonRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    //Buscar por ID
    public ReasonResponseDTO findById(Long id) {
        Reason reason = reasonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Motivo no encontrado"));
        return toDTO(reason);
    }

    //Actualizar
    public ReasonResponseDTO update(Long id, ReasonRequestDTO dto) {
        Reason reason = reasonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Motivo no encontrado"));

        reason.setName(dto.getName());
        reason.setDescription(dto.getDescription());

        return toDTO(reasonRepository.save(reason));
    }

    //Eliminar
    public void delete(Long id) {
        Reason reason = reasonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Motivo no encontrado"));
        reasonRepository.delete(reason);
    }
}
