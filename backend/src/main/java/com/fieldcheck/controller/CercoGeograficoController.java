package com.fieldcheck.controller;

import com.fieldcheck.model.CercoGeografico;
import com.fieldcheck.service.CercoGeograficoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cercos")
public class CercoGeograficoController {

    private final CercoGeograficoService service;

    public CercoGeograficoController(CercoGeograficoService service) {
        this.service = service;
    }

    @GetMapping
    public List<CercoGeografico> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CercoGeografico> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<CercoGeografico> create(@RequestBody CercoGeografico cerco) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(cerco));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CercoGeografico> update(@PathVariable Long id, @RequestBody CercoGeografico cerco) {
        return ResponseEntity.ok(service.update(id, cerco));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
