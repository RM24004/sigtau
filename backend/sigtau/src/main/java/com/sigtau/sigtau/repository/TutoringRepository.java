package com.sigtau.sigtau.repository;

import com.sigtau.sigtau.entity.Tutoring;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TutoringRepository extends JpaRepository<Tutoring, Long> {
    List<Tutoring> findByTutorId(Long tutorId);

    /** Bloqueo pesimista: evita que dos inscripciones simultáneas tomen el mismo último cupo. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from Tutoring t where t.id = :id")
    Optional<Tutoring> findByIdForUpdate(@Param("id") Long id);
}
