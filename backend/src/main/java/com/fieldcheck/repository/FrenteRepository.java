package com.fieldcheck.repository;

import com.fieldcheck.model.Frente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FrenteRepository extends JpaRepository<Frente, Long> {
    // Métodos estándar (findAll, save, findById) heredados automáticamente.
    // Aquí podemos agregar filtros personalizados en el futuro, ej. findByStatusTrue()
}