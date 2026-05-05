package com.fieldcheck.repository;

import com.fieldcheck.model.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
    // Métodos estándar (findAll, save, findById) heredados automáticamente.
    // Aquí podemos agregar filtros personalizados en el futuro, ej. findByStatusTrue()
}