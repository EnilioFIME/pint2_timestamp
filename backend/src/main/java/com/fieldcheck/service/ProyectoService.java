package com.fieldcheck.service;

import com.fieldcheck.model.Frente;
import com.fieldcheck.model.Proyecto;
import com.fieldcheck.repository.FrenteRepository;
import com.fieldcheck.repository.ProyectoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProyectoService {

    private final ProyectoRepository repository;
    private final FrenteRepository frenteRepository;

    public ProyectoService(ProyectoRepository repository, FrenteRepository frenteRepository) {
        this.repository = repository;
        this.frenteRepository = frenteRepository;
    }

    public List<Proyecto> findAll() {
        return repository.findAll();
    }

    public Proyecto findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Proyecto no encontrado: " + id));
    }

    public Proyecto save(Proyecto proyecto) {
        return repository.save(proyecto);
    }

    public Proyecto update(Long id, Proyecto datos) {
        Proyecto proyecto = findById(id);
        proyecto.setNombre(datos.getNombre());
        proyecto.setStatus(datos.getStatus());
        if (datos.getFrente() != null && datos.getFrente().getId() != null) {
            Frente frente = frenteRepository.findById(datos.getFrente().getId())
                    .orElseThrow(() -> new NoSuchElementException("Frente no encontrado"));
            proyecto.setFrente(frente);
        }
        return repository.save(proyecto);
    }

    public void delete(Long id) {
        repository.delete(findById(id));
    }
}
