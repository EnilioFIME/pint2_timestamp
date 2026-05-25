package com.fieldcheck.controller;

import com.fieldcheck.model.TarjetaNFC;
import com.fieldcheck.model.dto.PageResponse;
import com.fieldcheck.service.TarjetaNFCService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tarjetas-nfc")
public class TarjetaNFCController {

    private final TarjetaNFCService service;

    public TarjetaNFCController(TarjetaNFCService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<TarjetaNFC> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return new PageResponse<>(service.findAll(PageRequest.of(page, size, Sort.by("id").descending())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TarjetaNFC> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<TarjetaNFC> create(@Valid @RequestBody TarjetaNFC tarjeta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(tarjeta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TarjetaNFC> update(@PathVariable Long id, @Valid @RequestBody TarjetaNFC tarjeta) {
        return ResponseEntity.ok(service.update(id, tarjeta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
