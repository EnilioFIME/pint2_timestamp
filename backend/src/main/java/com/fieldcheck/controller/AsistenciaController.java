package com.fieldcheck.controller;

import com.fieldcheck.model.dto.AsistenciaDTO;
import com.fieldcheck.service.AsistenciaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/asistencias")
public class AsistenciaController {

    private final AsistenciaService service;

    public AsistenciaController(AsistenciaService service) {
        this.service = service;
    }

    @GetMapping
    public List<AsistenciaDTO> getAll(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaDesde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaHasta,
            @RequestParam(required = false) Long idProyecto,
            @RequestParam(required = false) Long idUsuario
    ) {
        LocalDateTime desde = fechaDesde != null ? fechaDesde.atStartOfDay() : null;
        LocalDateTime hasta  = fechaHasta  != null ? fechaHasta.atTime(23, 59, 59) : null;
        return service.findWithFilters(desde, hasta, idProyecto, idUsuario);
    }
}
