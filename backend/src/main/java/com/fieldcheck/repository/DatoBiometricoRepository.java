package com.fieldcheck.repository;

import com.fieldcheck.model.DatoBiometrico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DatoBiometricoRepository extends JpaRepository<DatoBiometrico, Long> {
    Optional<DatoBiometrico> findByRekognitionFaceId(String faceId);
}
