package com.fieldcheck.repository;

import com.fieldcheck.model.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
    List<Proyecto> findByStatusTrue();
    List<Proyecto> findByFrenteId(Long frenteId);
}
