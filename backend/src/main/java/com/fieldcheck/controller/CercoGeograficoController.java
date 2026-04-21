package com.fieldcheck.controller;

import com.fieldcheck.model.CercoGeografico;
import com.fieldcheck.service.CercoGeograficoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/cercos")
public class CercoGeograficoController {

    private final CercoGeograficoService service;

    public CercoGeograficoController(CercoGeograficoService service) {
        this.service = service;
    }

    @GetMapping("/proyecto/{proyectoId}")
    public ResponseEntity<CercoGeografico> getByProyecto(@PathVariable Long proyectoId) {
        try {
            return service.findByProyectoId(proyectoId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.noContent().build());
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<CercoGeografico> create(@RequestBody CercoGeografico cerco) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(cerco));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CercoGeografico> update(@PathVariable Long id, @RequestBody CercoGeografico cerco) {
        try {
            return ResponseEntity.ok(service.update(id, cerco));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
