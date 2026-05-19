package com.fieldcheck.repository;

import com.fieldcheck.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    Optional<Registro> findTopByUsuarioIdAndProyectoIdOrderByCreatedAtDesc(Long idUsuario, Long idProyecto);
}
