package com.fieldcheck.controller;

import com.fieldcheck.model.TarjetaNFC;
import com.fieldcheck.service.TarjetaNFCService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarjetas-nfc")
public class TarjetaNFCController {

    private final TarjetaNFCService service;

    public TarjetaNFCController(TarjetaNFCService service) {
        this.service = service;
    }

    @GetMapping
    public List<TarjetaNFC> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TarjetaNFC> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<TarjetaNFC> create(@RequestBody TarjetaNFC tarjeta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(tarjeta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TarjetaNFC> update(@PathVariable Long id, @RequestBody TarjetaNFC tarjeta) {
        return ResponseEntity.ok(service.update(id, tarjeta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
