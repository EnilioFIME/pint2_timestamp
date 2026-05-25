package com.fieldcheck.service;

import com.fieldcheck.exception.ResourceNotFoundException;
import com.fieldcheck.model.DatoBiometrico;
import com.fieldcheck.repository.DatoBiometricoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DatoBiometricoService {

    private final DatoBiometricoRepository repository;

    public DatoBiometricoService(DatoBiometricoRepository repository) {
        this.repository = repository;
    }

    public Page<DatoBiometrico> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public DatoBiometrico findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DatoBiometrico no encontrado: " + id));
    }

    public Optional<DatoBiometrico> findByRekognitionFaceId(String faceId) {
        return repository.findByRekognitionFaceId(faceId);
    }

    public DatoBiometrico save(DatoBiometrico dato) {
        return repository.save(dato);
    }

    public DatoBiometrico update(Long id, DatoBiometrico datos) {
        DatoBiometrico dato = findById(id);
        dato.setRekognitionFaceId(datos.getRekognitionFaceId());
        dato.setStatus(datos.getStatus());
        return repository.save(dato);
    }

    public void delete(Long id) {
        DatoBiometrico dato = findById(id);
        repository.delete(dato);
    }
}
