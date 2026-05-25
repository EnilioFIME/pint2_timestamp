package com.fieldcheck.controller;

import com.fieldcheck.model.Registro;
import com.fieldcheck.model.dto.PageResponse;
import com.fieldcheck.service.RegistroService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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

    @GetMapping
    public PageResponse<Registro> getAll(
            @RequestParam(required = false) Long idUsuario,
            @RequestParam(required = false) Long idProyecto,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return new PageResponse<>(service.findWithFilters(idUsuario, idProyecto, pageable));
    }

    @PostMapping
    public ResponseEntity<Registro> create(@Valid @RequestBody Registro registro) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(registro));
    }
}
