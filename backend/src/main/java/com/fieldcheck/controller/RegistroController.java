package com.fieldcheck.controller;

import com.fieldcheck.model.Registro;
import com.fieldcheck.service.RegistroService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registros")
public class RegistroController {

    private final RegistroService service;

    public RegistroController(RegistroService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Registro> create(@RequestBody Registro registro) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(registro));
    }
}
