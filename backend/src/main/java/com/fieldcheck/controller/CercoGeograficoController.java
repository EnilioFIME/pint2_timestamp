package com.fieldcheck.controller;

import com.fieldcheck.model.CercoGeografico;
import com.fieldcheck.model.dto.PageResponse;
import com.fieldcheck.service.CercoGeograficoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cercos")
public class CercoGeograficoController {

    private final CercoGeograficoService service;

    public CercoGeograficoController(CercoGeograficoService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<CercoGeografico> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return new PageResponse<>(service.findAll(PageRequest.of(page, size, Sort.by("id").descending())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CercoGeografico> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<CercoGeografico> create(@Valid @RequestBody CercoGeografico cerco) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(cerco));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CercoGeografico> update(@PathVariable Long id, @Valid @RequestBody CercoGeografico cerco) {
        return ResponseEntity.ok(service.update(id, cerco));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
