package com.fieldcheck.service;

import com.fieldcheck.exception.ResourceNotFoundException;
import com.fieldcheck.model.Frente;
import com.fieldcheck.repository.FrenteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class FrenteService {

    private static final Logger log = LoggerFactory.getLogger(FrenteService.class);

    private final FrenteRepository repository;

    public FrenteService(FrenteRepository repository) {
        this.repository = repository;
    }

    public Page<Frente> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Frente findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Frente de obra no encontrado: " + id));
    }

    public Frente save(Frente frente) {
        Frente saved = repository.save(frente);
        log.info("Frente creado id={} nombre='{}'", saved.getId(), saved.getNombre());
        return saved;
    }

    public Frente update(Long id, Frente datos) {
        Frente frente = findById(id);
        frente.setNombre(datos.getNombre());
        frente.setStatus(datos.getStatus());
        Frente updated = repository.save(frente);
        log.info("Frente actualizado id={} nombre='{}'", updated.getId(), updated.getNombre());
        return updated;
    }

    public void delete(Long id) {
        Frente frente = findById(id);
        repository.delete(frente);
        log.info("Frente eliminado id={} nombre='{}'", id, frente.getNombre());
    }
}
