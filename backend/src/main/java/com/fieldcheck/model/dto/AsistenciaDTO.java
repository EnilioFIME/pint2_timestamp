package com.fieldcheck.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AsistenciaDTO(
        Long id,
        LocalDateTime entrada,
        LocalDateTime salida,
        String estado,
        BigDecimal horasTotales,
        UsuarioResumen usuario,
        ProyectoResumen proyecto
) {
    public record UsuarioResumen(Long id, String nombre, String apellido, String numeroEmpleado) {}
    public record ProyectoResumen(Long id, String nombre) {}
}
