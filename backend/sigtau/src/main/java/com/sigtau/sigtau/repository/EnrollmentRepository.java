package com.sigtau.sigtau.repository;

import com.sigtau.sigtau.entity.Enrollment;
import com.sigtau.sigtau.entity.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findAllByOrderByEnrolledAtDesc();
    List<Enrollment> findByStudentIdOrderByEnrolledAtDesc(Long studentId);
    List<Enrollment> findByStudentIdAndStatus(Long studentId, EnrollmentStatus status);
    List<Enrollment> findByTutoringIdOrderByEnrolledAtDesc(Long tutoringId);
    List<Enrollment> findByTutoringTutorIdOrderByEnrolledAtDesc(Long tutorId);
    boolean existsByStudentIdAndTutoringIdAndStatus(Long studentId, Long tutoringId, EnrollmentStatus status);
    long countByTutoringIdAndStatus(Long tutoringId, EnrollmentStatus status);
    void deleteByTutoringId(Long tutoringId);
}
