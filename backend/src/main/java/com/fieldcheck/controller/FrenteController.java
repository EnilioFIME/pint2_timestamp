package com.fieldcheck.controller;

import com.fieldcheck.model.Frente;
import com.fieldcheck.service.FrenteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping
    public ResponseEntity<Frente> create(@RequestBody Frente frente) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(frente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Frente> update(@PathVariable Long id, @RequestBody Frente frente) {
        return ResponseEntity.ok(service.update(id, frente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
