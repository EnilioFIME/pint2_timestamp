package com.fieldcheck.service;

import com.fieldcheck.model.Proyecto;
import com.fieldcheck.repository.ProyectoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProyectoService {

    private final ProyectoRepository repository;

    public ProyectoService(ProyectoRepository repository) {
        this.repository = repository;
    }

    public List<Proyecto> findAll() {
        return repository.findAll();
    }

    public Proyecto findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Frente de obra no encontrado: " + id));
    }

    public Proyecto save(Proyecto proyecto) {
        return repository.save(proyecto);
    }

    public Proyecto update(Long id, Proyecto datos) {
        Proyecto proyecto = findById(id);
        proyecto.setNombre(datos.getNombre());
        proyecto.setStatus(datos.getStatus());
        proyecto.setIdFrente(datos.getIdFrente());
        proyecto.setIdCerco(datos.getIdCerco());
        return repository.save(proyecto);
    }
}