package com.fieldcheck.service;

import com.fieldcheck.model.Asistencia;
import com.fieldcheck.repository.AsistenciaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AsistenciaService {

    private final AsistenciaRepository repository;

    public AsistenciaService(AsistenciaRepository repository) {
        this.repository = repository;
    }

    public List<Asistencia> findAll() {
        return repository.findAll();
    }

    public List<Asistencia> findByFiltros(
            Long usuarioId,
            Long proyectoId,
            String tipoVerificacion,
            String metodo,
            LocalDate desde,
            LocalDate hasta) {

        return repository.findAll().stream()
                .filter(a -> usuarioId == null || a.getUsuario().getId().equals(usuarioId))
                .filter(a -> proyectoId == null || a.getProyecto().getId().equals(proyectoId))
                .filter(a -> tipoVerificacion == null || a.getTipoVerificacion().equalsIgnoreCase(tipoVerificacion))
                .filter(a -> metodo == null || a.getMetodo().equalsIgnoreCase(metodo))
                .filter(a -> desde == null || !a.getTimestamp().toLocalDate().isBefore(desde))
                .filter(a -> hasta == null || !a.getTimestamp().toLocalDate().isAfter(hasta))
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(Collectors.toList());
    }

    public Asistencia save(Asistencia asistencia) {
        return repository.save(asistencia);
    }
}
