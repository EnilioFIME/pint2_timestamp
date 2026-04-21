package com.fieldcheck.service;

import com.fieldcheck.model.Usuario;
import com.fieldcheck.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<Usuario> findAll() {
        return repository.findAll();
    }

    public List<Usuario> findEmpleados() {
        return repository.findByRol("Empleado");
    }

    public List<Usuario> findAdmins() {
        return repository.findByRolIn(List.of("Administrador", "Checador"));
    }

    public Usuario findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado: " + id));
    }

    public Usuario save(Usuario usuario) {
        return repository.save(usuario);
    }

    public Usuario update(Long id, Usuario datos) {
        Usuario usuario = findById(id);
        usuario.setNombre(datos.getNombre());
        usuario.setApellido(datos.getApellido());
        usuario.setRol(datos.getRol());
        usuario.setEmail(datos.getEmail());
        usuario.setStatus(datos.getStatus());
        usuario.setModifiedBy(datos.getModifiedBy());
        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            usuario.setPassword(datos.getPassword());
        }
        return repository.save(usuario);
    }

    public void delete(Long id) {
        repository.delete(findById(id));
    }
}
