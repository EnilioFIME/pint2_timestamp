package com.fieldcheck.repository;

import com.fieldcheck.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    List<Usuario> findByRol(String rol);
    List<Usuario> findByRolIn(List<String> roles);
    Optional<Usuario> findByNumeroEmpleado(String numeroEmpleado);
    Optional<Usuario> findByEmail(String email);
}
