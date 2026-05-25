package com.fieldcheck.service;

import com.fieldcheck.exception.ResourceNotFoundException;
import com.fieldcheck.model.Usuario;
import com.fieldcheck.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private static final Logger log = LoggerFactory.getLogger(UsuarioService.class);

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public Page<Usuario> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Page<Usuario> findByRol(String rol, Pageable pageable) {
        return repository.findByRol(rol, pageable);
    }

    public Page<Usuario> findByRoles(List<String> roles, Pageable pageable) {
        return repository.findByRolIn(roles, pageable);
    }

    public Usuario findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
    }

    public Usuario save(Usuario usuario) {
        validarReglasPorRol(usuario);
        Usuario saved = repository.save(usuario);
        log.info("Usuario creado id={} numEmp={} rol={}", saved.getId(), saved.getNumeroEmpleado(), saved.getRol());
        return saved;
    }

    public Usuario update(Long id, Usuario datos) {
        Usuario usuario = findById(id);
        usuario.setNombre(datos.getNombre());
        usuario.setApellido(datos.getApellido());
        usuario.setEmail(datos.getEmail());
        usuario.setRol(datos.getRol());
        usuario.setNumeroEmpleado(datos.getNumeroEmpleado());
        usuario.setStatus(datos.getStatus());
        usuario.setTarjetaNFC(datos.getTarjetaNFC());
        usuario.setDatoBiometrico(datos.getDatoBiometrico());
        validarReglasPorRol(usuario);
        Usuario updated = repository.save(usuario);
        log.info("Usuario actualizado id={} numEmp={}", updated.getId(), updated.getNumeroEmpleado());
        return updated;
    }

    public void delete(Long id) {
        Usuario usuario = findById(id);
        repository.delete(usuario);
        log.info("Usuario eliminado id={} numEmp={}", id, usuario.getNumeroEmpleado());
    }

    // Replica la regla CHK_Usuarios_Reglas_Rol del schema para dar mensajes claros antes del INSERT
    private void validarReglasPorRol(Usuario u) {
        String rol = u.getRol();
        if ("Empleado".equals(rol)) {
            if (u.getEmail() != null) {
                throw new IllegalArgumentException("Los empleados no deben tener email asignado.");
            }
            if (u.getTarjetaNFC() == null || u.getDatoBiometrico() == null) {
                throw new IllegalArgumentException("Los empleados requieren tarjeta NFC y dato biométrico.");
            }
        } else if ("Checador".equals(rol) || "Administrador".equals(rol)) {
            if (u.getEmail() == null || u.getEmail().isBlank()) {
                throw new IllegalArgumentException("Los usuarios con rol " + rol + " requieren email.");
            }
        } else {
            throw new IllegalArgumentException("Rol inválido: " + rol +
                    ". Debe ser 'Empleado', 'Checador' o 'Administrador'.");
        }
    }
}
