package com.fieldcheck.service;

import com.fieldcheck.exception.ResourceNotFoundException;
import com.fieldcheck.model.CercoGeografico;
import com.fieldcheck.repository.CercoGeograficoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CercoGeograficoService {

    private static final Logger log = LoggerFactory.getLogger(CercoGeograficoService.class);

    private final CercoGeograficoRepository repository;

    public CercoGeograficoService(CercoGeograficoRepository repository) {
        this.repository = repository;
    }

    public Page<CercoGeografico> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public CercoGeografico findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CercoGeografico no encontrado: " + id));
    }

    public CercoGeografico save(CercoGeografico cerco) {
        CercoGeografico saved = repository.save(cerco);
        log.info("CercoGeografico creado id={} ({}, {}) radio={}m",
                saved.getId(), saved.getLatitud(), saved.getLongitud(), saved.getRadioMetros());
        return saved;
    }

    public CercoGeografico update(Long id, CercoGeografico datos) {
        CercoGeografico cerco = findById(id);
        cerco.setLatitud(datos.getLatitud());
        cerco.setLongitud(datos.getLongitud());
        cerco.setRadioMetros(datos.getRadioMetros());
        cerco.setStatus(datos.getStatus());
        CercoGeografico updated = repository.save(cerco);
        log.info("CercoGeografico actualizado id={}", updated.getId());
        return updated;
    }

    public void delete(Long id) {
        CercoGeografico cerco = findById(id);
        repository.delete(cerco);
        log.info("CercoGeografico eliminado id={}", id);
    }
}
