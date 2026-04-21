package com.fieldcheck.service;

import com.fieldcheck.model.CercoGeografico;
import com.fieldcheck.model.Proyecto;
import com.fieldcheck.repository.CercoGeograficoRepository;
import com.fieldcheck.repository.ProyectoRepository;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class CercoGeograficoService {

    private final CercoGeograficoRepository repository;
    private final ProyectoRepository proyectoRepository;

    public CercoGeograficoService(CercoGeograficoRepository repository, ProyectoRepository proyectoRepository) {
        this.repository = repository;
        this.proyectoRepository = proyectoRepository;
    }

    public Optional<CercoGeografico> findByProyectoId(Long proyectoId) {
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new NoSuchElementException("Proyecto no encontrado: " + proyectoId));
        return Optional.ofNullable(proyecto.getCerco());
    }

    public CercoGeografico save(CercoGeografico cerco) {
        return repository.save(cerco);
    }

    public CercoGeografico update(Long id, CercoGeografico datos) {
        CercoGeografico cerco = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Cerco no encontrado: " + id));
        cerco.setLatitud(datos.getLatitud());
        cerco.setLongitud(datos.getLongitud());
        cerco.setRadioMetros(datos.getRadioMetros());
        cerco.setStatus(datos.getStatus());
        return repository.save(cerco);
    }
}
