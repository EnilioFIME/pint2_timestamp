package com.fieldcheck.controller;

import com.fieldcheck.model.Proyecto;
import com.fieldcheck.service.ProyectoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "*") // Habilitamos CORS temporalmente para desarrollo con Vite (puerto 5173)
public class ProyectoController {

    private final ProyectoService service;

    public ProyectoController(ProyectoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Proyecto> getAll() {
        System.out.println("\n---> [1] RECIBIENDO PETICION EN SPRING BOOT...");
        List<Proyecto> proyectos = service.findAll();
        System.out.println("---> [2] CONSULTA A AZURE SQL TERMINADA CON EXITO.");
        System.out.println("---> [3] SE ENCONTRARON " + proyectos.size() + " PROYECTOS. DEVOLVIENDO A REACT...\n");
        return proyectos;
    }

    @PostMapping
    public ResponseEntity<Proyecto> create(@RequestBody Proyecto proyecto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(proyecto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Proyecto> update(@PathVariable Long id, @RequestBody Proyecto proyecto) {
        try {
            return ResponseEntity.ok(service.update(id, proyecto));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}