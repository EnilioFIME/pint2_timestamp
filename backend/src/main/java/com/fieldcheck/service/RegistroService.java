package com.fieldcheck.service;

import com.fieldcheck.model.Registro;
import com.fieldcheck.repository.RegistroRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class RegistroService {

    private static final Logger log = LoggerFactory.getLogger(RegistroService.class);

    private final RegistroRepository repository;

    public RegistroService(RegistroRepository repository) {
        this.repository = repository;
    }

    public Page<Registro> findWithFilters(Long idUsuario, Long idProyecto, Pageable pageable) {
        if (idUsuario != null && idProyecto != null) {
            return repository.findByUsuarioIdAndProyectoId(idUsuario, idProyecto, pageable);
        }
        if (idUsuario != null) {
            return repository.findByUsuarioId(idUsuario, pageable);
        }
        if (idProyecto != null) {
            return repository.findByProyectoId(idProyecto, pageable);
        }
        return repository.findAll(pageable);
    }

    public Registro save(Registro registro) {
        Registro saved = repository.save(registro);
        log.info("Registro creado id={} usuario={} proyecto={} tipo={}/{}",
                saved.getId(),
                saved.getUsuario() != null ? saved.getUsuario().getId() : null,
                saved.getProyecto() != null ? saved.getProyecto().getId() : null,
                saved.getTipoVerificacion(), saved.getTipoRegistro());
        return saved;
    }
}
