package com.fieldcheck.service;

import com.fieldcheck.model.Registro;
import com.fieldcheck.repository.RegistroRepository;
import org.springframework.stereotype.Service;

@Service
public class RegistroService {

    private final RegistroRepository repository;

    public RegistroService(RegistroRepository repository) {
        this.repository = repository;
    }

    public Registro save(Registro registro) {
        return repository.save(registro);
    }
}
