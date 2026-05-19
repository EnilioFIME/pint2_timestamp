package com.fieldcheck.service;

import com.fieldcheck.exception.ResourceNotFoundException;
import com.fieldcheck.model.Usuario;
import com.fieldcheck.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<Usuario> findAll() {
        return repository.findAll();
    }

    public List<Usuario> findByRol(String rol) {
        return repository.findByRol(rol);
    }

    public List<Usuario> findByRoles(List<String> roles) {
        return repository.findByRolIn(roles);
    }

    public Usuario findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
    }

    public Usuario save(Usuario usuario) {
        validarReglasPorRol(usuario);
        return repository.save(usuario);
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
        return repository.save(usuario);
    }

    public void delete(Long id) {
        Usuario usuario = findById(id);
        repository.delete(usuario);
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
