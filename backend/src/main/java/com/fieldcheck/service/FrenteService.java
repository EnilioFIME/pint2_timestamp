package com.fieldcheck.service;

import com.fieldcheck.exception.ResourceNotFoundException;
import com.fieldcheck.model.Frente;
import com.fieldcheck.repository.FrenteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FrenteService {

    private final FrenteRepository repository;

    public FrenteService(FrenteRepository repository) {
        this.repository = repository;
    }

    public List<Frente> findAll() {
        return repository.findAll();
    }

    public Frente findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Frente de obra no encontrado: " + id));
    }

    public Frente save(Frente frente) {
        return repository.save(frente);
    }

    public Frente update(Long id, Frente datos) {
        Frente frente = findById(id);
        frente.setNombre(datos.getNombre());
        frente.setStatus(datos.getStatus());
        return repository.save(frente);
    }

    public void delete(Long id) {
        Frente frente = findById(id);
        repository.delete(frente);
    }
}
