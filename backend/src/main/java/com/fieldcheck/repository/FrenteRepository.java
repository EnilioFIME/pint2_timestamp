package com.fieldcheck.repository;

import com.fieldcheck.model.Frente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FrenteRepository extends JpaRepository<Frente, Long> {
    List<Frente> findByStatusTrue();
    boolean existsByNombre(String nombre);
}
