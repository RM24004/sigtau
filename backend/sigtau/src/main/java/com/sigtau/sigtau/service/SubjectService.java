package com.sigtau.sigtau.service;

import com.sigtau.sigtau.dto.SubjectRequestDTO;
import com.sigtau.sigtau.dto.SubjectResponseDTO;
import com.sigtau.sigtau.entity.Career;
import com.sigtau.sigtau.entity.Subject;
import com.sigtau.sigtau.repository.CareerRepository;
import com.sigtau.sigtau.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SubjectService {
    private final SubjectRepository subjectRepository;
    private final CareerRepository careerRepository;

    public SubjectService(SubjectRepository subjectRepository, CareerRepository careerRepository) {
        this.subjectRepository = subjectRepository;
        this.careerRepository = careerRepository;
    }

    private SubjectResponseDTO toDTO(Subject s) {
        return new SubjectResponseDTO(s.getId(), s.getName(), s.getDescription(),
                s.getCareer().getId(), s.getCareer().getName());
    }

    private void apply(Subject s, SubjectRequestDTO dto) {
        s.setName(dto.getName());
        s.setDescription(dto.getDescription());
        Career c = careerRepository.findById(dto.getCareerId())
                .orElseThrow(() -> new RuntimeException("Carrera no encontrada"));
        s.setCareer(c);
    }

    @Transactional(readOnly = true)
    public List<SubjectResponseDTO> listAll(Long careerId) {
        List<Subject> list = careerId == null ? subjectRepository.findAll() : subjectRepository.findByCareerId(careerId);
        return list.stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public SubjectResponseDTO findById(Long id) {
        return toDTO(subjectRepository.findById(id).orElseThrow(() -> new RuntimeException("Materia no encontrada")));
    }

    public SubjectResponseDTO save(SubjectRequestDTO dto) {
        Subject s = new Subject();
        apply(s, dto);
        return toDTO(subjectRepository.save(s));
    }

    public SubjectResponseDTO update(Long id, SubjectRequestDTO dto) {
        Subject s = subjectRepository.findById(id).orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        apply(s, dto);
        return toDTO(subjectRepository.save(s));
    }

    public void delete(Long id) {
        if (!subjectRepository.existsById(id)) throw new RuntimeException("Materia no encontrada");
        subjectRepository.deleteById(id);
    }
}
