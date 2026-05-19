package com.fieldcheck.repository;

import com.fieldcheck.model.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    @Query("SELECT a FROM Asistencia a WHERE " +
           "(:desde IS NULL OR a.entrada >= :desde) AND " +
           "(:hasta IS NULL OR a.entrada <= :hasta) AND " +
           "(:idProyecto IS NULL OR a.idProyecto = :idProyecto) AND " +
           "(:idUsuario IS NULL OR a.idUsuario = :idUsuario)")
    List<Asistencia> findWithFilters(
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta,
            @Param("idProyecto") Long idProyecto,
            @Param("idUsuario") Long idUsuario
    );
}
