package com.fieldcheck.controller;

import com.fieldcheck.model.Proyecto;
import com.fieldcheck.model.dto.PageResponse;
import com.fieldcheck.service.ProyectoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/proyectos")
public class ProyectoController {

    private final ProyectoService service;

    public ProyectoController(ProyectoService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<Proyecto> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return new PageResponse<>(service.findAll(PageRequest.of(page, size, Sort.by("id").descending())));
    }

    @PostMapping
    public ResponseEntity<Proyecto> create(@Valid @RequestBody Proyecto proyecto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(proyecto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Proyecto> update(@PathVariable Long id, @Valid @RequestBody Proyecto proyecto) {
        return ResponseEntity.ok(service.update(id, proyecto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
