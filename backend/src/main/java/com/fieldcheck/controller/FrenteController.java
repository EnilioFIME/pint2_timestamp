package com.fieldcheck.controller;

import com.fieldcheck.model.Frente;
import com.fieldcheck.model.dto.PageResponse;
import com.fieldcheck.service.FrenteService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/frentes")
public class FrenteController {

    private final FrenteService service;

    public FrenteController(FrenteService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<Frente> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return new PageResponse<>(service.findAll(PageRequest.of(page, size, Sort.by("id").descending())));
    }

    @PostMapping
    public ResponseEntity<Frente> create(@Valid @RequestBody Frente frente) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(frente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Frente> update(@PathVariable Long id, @Valid @RequestBody Frente frente) {
        return ResponseEntity.ok(service.update(id, frente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
