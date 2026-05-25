package com.fieldcheck.repository;

import com.fieldcheck.model.Registro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    Optional<Registro> findTopByUsuarioIdAndProyectoIdOrderByCreatedAtDesc(Long idUsuario, Long idProyecto);

    Page<Registro> findByUsuarioId(Long idUsuario, Pageable pageable);

    Page<Registro> findByProyectoId(Long idProyecto, Pageable pageable);

    Page<Registro> findByUsuarioIdAndProyectoId(Long idUsuario, Long idProyecto, Pageable pageable);
}
