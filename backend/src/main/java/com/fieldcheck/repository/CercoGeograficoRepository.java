package com.fieldcheck.repository;

import com.fieldcheck.model.CercoGeografico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CercoGeograficoRepository extends JpaRepository<CercoGeografico, Long> {
    Optional<CercoGeografico> findByStatusTrue();
}
