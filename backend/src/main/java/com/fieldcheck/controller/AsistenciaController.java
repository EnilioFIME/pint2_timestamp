package com.fieldcheck.controller;

import com.fieldcheck.model.Asistencia;
import com.fieldcheck.service.AsistenciaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/asistencias")
public class AsistenciaController {

    private final AsistenciaService service;

    public AsistenciaController(AsistenciaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Asistencia> getAll(
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false) Long proyectoId,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String metodo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {

        if (usuarioId == null && proyectoId == null && tipo == null && metodo == null && desde == null && hasta == null) {
            return service.findAll();
        }
        return service.findByFiltros(usuarioId, proyectoId, tipo, metodo, desde, hasta);
    }

    @PostMapping
    public ResponseEntity<Asistencia> create(@RequestBody Asistencia asistencia) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(asistencia));
    }
}
