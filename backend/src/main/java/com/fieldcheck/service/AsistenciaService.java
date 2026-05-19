package com.fieldcheck.service;

import com.fieldcheck.model.Asistencia;
import com.fieldcheck.model.Proyecto;
import com.fieldcheck.model.Registro;
import com.fieldcheck.model.Usuario;
import com.fieldcheck.model.dto.AsistenciaDTO;
import com.fieldcheck.repository.AsistenciaRepository;
import com.fieldcheck.repository.ProyectoRepository;
import com.fieldcheck.repository.RegistroRepository;
import com.fieldcheck.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.function.Function.identity;

@Service
public class AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProyectoRepository proyectoRepository;
    private final RegistroRepository registroRepository;

    public AsistenciaService(AsistenciaRepository asistenciaRepository,
                              UsuarioRepository usuarioRepository,
                              ProyectoRepository proyectoRepository,
                              RegistroRepository registroRepository) {
        this.asistenciaRepository = asistenciaRepository;
        this.usuarioRepository = usuarioRepository;
        this.proyectoRepository = proyectoRepository;
        this.registroRepository = registroRepository;
    }

    public List<AsistenciaDTO> findWithFilters(LocalDateTime desde, LocalDateTime hasta,
                                               Long idProyecto, Long idUsuario) {
        List<Asistencia> rows = asistenciaRepository.findWithFilters(desde, hasta, idProyecto, idUsuario);

        // Batch-load para evitar N+1
        Set<Long> usuarioIds = rows.stream().map(Asistencia::getIdUsuario).collect(Collectors.toSet());
        Set<Long> proyectoIds = rows.stream().map(Asistencia::getIdProyecto).collect(Collectors.toSet());

        Map<Long, Usuario> usuariosMap = usuarioRepository.findAllById(usuarioIds)
                .stream().collect(Collectors.toMap(Usuario::getId, identity()));
        Map<Long, Proyecto> proyectosMap = proyectoRepository.findAllById(proyectoIds)
                .stream().collect(Collectors.toMap(Proyecto::getId, identity()));

        return rows.stream().map(a -> {
            Usuario u = usuariosMap.get(a.getIdUsuario());
            Proyecto p = proyectosMap.get(a.getIdProyecto());

            // El Id en la vista corresponde al Id del Registro de Entrada
            String tipoVerificacion = registroRepository.findById(a.getId())
                    .map(Registro::getTipoVerificacion)
                    .orElse("Desconocido");

            AsistenciaDTO.UsuarioResumen usuarioResumen = u != null
                    ? new AsistenciaDTO.UsuarioResumen(u.getId(), u.getNombre(), u.getApellido(), u.getNumeroEmpleado())
                    : null;
            AsistenciaDTO.ProyectoResumen proyectoResumen = p != null
                    ? new AsistenciaDTO.ProyectoResumen(p.getId(), p.getNombre())
                    : null;

            return new AsistenciaDTO(
                    a.getId(), a.getEntrada(), a.getSalida(),
                    a.getEstado(), a.getHorasTotales(),
                    usuarioResumen, proyectoResumen, tipoVerificacion
            );
        }).toList();
    }
}
