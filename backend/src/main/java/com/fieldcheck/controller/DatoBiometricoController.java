package com.fieldcheck.controller;

import com.fieldcheck.model.DatoBiometrico;
import com.fieldcheck.model.dto.PageResponse;
import com.fieldcheck.service.DatoBiometricoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/datos-biometricos")
public class DatoBiometricoController {

    private final DatoBiometricoService service;

    public DatoBiometricoController(DatoBiometricoService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<DatoBiometrico> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return new PageResponse<>(service.findAll(PageRequest.of(page, size, Sort.by("id").descending())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DatoBiometrico> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<DatoBiometrico> create(@Valid @RequestBody DatoBiometrico dato) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(dato));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DatoBiometrico> update(@PathVariable Long id, @Valid @RequestBody DatoBiometrico dato) {
        return ResponseEntity.ok(service.update(id, dato));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
