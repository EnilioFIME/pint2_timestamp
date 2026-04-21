package com.fieldcheck.repository;

import com.fieldcheck.model.TarjetaNFC;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TarjetaNFCRepository extends JpaRepository<TarjetaNFC, Long> {
    Optional<TarjetaNFC> findByNfcUuid(String nfcUuid);
    boolean existsByNfcUuid(String nfcUuid);
}
