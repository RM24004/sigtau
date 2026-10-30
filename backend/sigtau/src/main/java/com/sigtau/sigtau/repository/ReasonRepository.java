package com.sigtau.sigtau.repository;

import com.sigtau.sigtau.entity.Reason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReasonRepository extends JpaRepository<Reason, Long> {

}
