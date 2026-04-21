package com.fieldcheck.repository;

import com.fieldcheck.model.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    List<Asistencia> findByUsuarioId(Long usuarioId);

    List<Asistencia> findByProyectoId(Long proyectoId);

    List<Asistencia> findByTimestampBetween(LocalDateTime desde, LocalDateTime hasta);

    @Query("SELECT a FROM Asistencia a WHERE a.timestamp >= :inicio AND a.timestamp < :fin ORDER BY a.timestamp DESC")
    List<Asistencia> findByFecha(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    @Query("SELECT a FROM Asistencia a WHERE a.usuario.id = :usuarioId ORDER BY a.timestamp DESC")
    List<Asistencia> findUltimasPorUsuario(@Param("usuarioId") Long usuarioId);
}
