package com.fieldcheck.service;

import com.fieldcheck.exception.ResourceNotFoundException;
import com.fieldcheck.model.Proyecto;
import com.fieldcheck.repository.ProyectoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProyectoService {

    private static final Logger log = LoggerFactory.getLogger(ProyectoService.class);

    private final ProyectoRepository repository;

    public ProyectoService(ProyectoRepository repository) {
        this.repository = repository;
    }

    public Page<Proyecto> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Proyecto findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado: " + id));
    }

    public Proyecto save(Proyecto proyecto) {
        Proyecto saved = repository.save(proyecto);
        log.info("Proyecto creado id={} nombre='{}'", saved.getId(), saved.getNombre());
        return saved;
    }

    public Proyecto update(Long id, Proyecto datos) {
        Proyecto proyecto = findById(id);
        proyecto.setNombre(datos.getNombre());
        proyecto.setStatus(datos.getStatus());
        proyecto.setIdFrente(datos.getIdFrente());
        proyecto.setIdCerco(datos.getIdCerco());
        Proyecto updated = repository.save(proyecto);
        log.info("Proyecto actualizado id={} nombre='{}'", updated.getId(), updated.getNombre());
        return updated;
    }

    public void delete(Long id) {
        Proyecto proyecto = findById(id);
        repository.delete(proyecto);
        log.info("Proyecto eliminado id={} nombre='{}'", id, proyecto.getNombre());
    }
}
