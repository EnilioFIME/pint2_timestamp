package com.fieldcheck.controller;

import com.fieldcheck.model.DatoBiometrico;
import com.fieldcheck.service.DatoBiometricoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/datos-biometricos")
public class DatoBiometricoController {

    private final DatoBiometricoService service;

    public DatoBiometricoController(DatoBiometricoService service) {
        this.service = service;
    }

    @GetMapping
    public List<DatoBiometrico> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DatoBiometrico> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<DatoBiometrico> create(@RequestBody DatoBiometrico dato) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(dato));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DatoBiometrico> update(@PathVariable Long id, @RequestBody DatoBiometrico dato) {
        return ResponseEntity.ok(service.update(id, dato));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
