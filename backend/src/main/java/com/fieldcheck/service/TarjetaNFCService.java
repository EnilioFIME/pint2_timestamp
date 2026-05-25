package com.fieldcheck.service;

import com.fieldcheck.exception.ResourceNotFoundException;
import com.fieldcheck.model.TarjetaNFC;
import com.fieldcheck.repository.TarjetaNFCRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TarjetaNFCService {

    private final TarjetaNFCRepository repository;

    public TarjetaNFCService(TarjetaNFCRepository repository) {
        this.repository = repository;
    }

    public Page<TarjetaNFC> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public TarjetaNFC findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TarjetaNFC no encontrada: " + id));
    }

    public Optional<TarjetaNFC> findByNfcUid(String nfcUid) {
        return repository.findByNfcUid(nfcUid);
    }

    public TarjetaNFC save(TarjetaNFC tarjeta) {
        return repository.save(tarjeta);
    }

    public TarjetaNFC update(Long id, TarjetaNFC datos) {
        TarjetaNFC tarjeta = findById(id);
        tarjeta.setNfcUid(datos.getNfcUid());
        tarjeta.setStatus(datos.getStatus());
        return repository.save(tarjeta);
    }

    public void delete(Long id) {
        TarjetaNFC tarjeta = findById(id);
        repository.delete(tarjeta);
    }
}
