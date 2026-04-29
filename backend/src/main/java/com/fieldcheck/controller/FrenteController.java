package com.fieldcheck.controller;

import com.fieldcheck.model.Frente;
import com.fieldcheck.service.FrenteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/frentes")
public class FrenteController {

    private final FrenteService service;

    public FrenteController(FrenteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Frente> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Frente> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.findById(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Frente> create(@RequestBody Frente frente) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(frente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Frente> update(@PathVariable Long id, @RequestBody Frente frente) {
        try {
            return ResponseEntity.ok(service.update(id, frente));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
