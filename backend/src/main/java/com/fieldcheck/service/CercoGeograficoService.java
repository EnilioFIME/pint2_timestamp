package com.fieldcheck.service;

import com.fieldcheck.exception.ResourceNotFoundException;
import com.fieldcheck.model.CercoGeografico;
import com.fieldcheck.repository.CercoGeograficoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CercoGeograficoService {

    private final CercoGeograficoRepository repository;

    public CercoGeograficoService(CercoGeograficoRepository repository) {
        this.repository = repository;
    }

    public List<CercoGeografico> findAll() {
        return repository.findAll();
    }

    public CercoGeografico findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CercoGeografico no encontrado: " + id));
    }

    public CercoGeografico save(CercoGeografico cerco) {
        return repository.save(cerco);
    }

    public CercoGeografico update(Long id, CercoGeografico datos) {
        CercoGeografico cerco = findById(id);
        cerco.setLatitud(datos.getLatitud());
        cerco.setLongitud(datos.getLongitud());
        cerco.setRadioMetros(datos.getRadioMetros());
        cerco.setStatus(datos.getStatus());
        return repository.save(cerco);
    }

    public void delete(Long id) {
        CercoGeografico cerco = findById(id);
        repository.delete(cerco);
    }
}
