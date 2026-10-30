package com.sigtau.sigtau.repository;

import com.sigtau.sigtau.entity.Modality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModalityRepository extends JpaRepository<Modality, Long> {

}
