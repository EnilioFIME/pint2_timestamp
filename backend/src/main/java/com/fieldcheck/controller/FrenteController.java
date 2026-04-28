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
@CrossOrigin(origins = "*") // Habilitamos CORS temporalmente para desarrollo con Vite (puerto 5173)
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
        try {
            return ResponseEntity.ok(service.update(id, frente));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}