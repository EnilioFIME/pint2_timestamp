package com.fieldcheck.repository;

import com.fieldcheck.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Page<Usuario> findByRol(String rol, Pageable pageable);
    Page<Usuario> findByRolIn(List<String> roles, Pageable pageable);
    Optional<Usuario> findByNumeroEmpleado(String numeroEmpleado);
    Optional<Usuario> findByEmail(String email);
}
