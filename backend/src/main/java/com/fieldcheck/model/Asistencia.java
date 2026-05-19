package com.fieldcheck.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Immutable
@Table(name = "vw_Asistencias")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Asistencia {

    @Id
    @Column(name = "Id")
    private Long id;

    @Column(name = "UUID")
    private String uuid;

    @Column(name = "IdUsuario")
    private Long idUsuario;

    @Column(name = "IdProyecto")
    private Long idProyecto;

    @Column(name = "Entrada")
    private LocalDateTime entrada;

    @Column(name = "Salida")
    private LocalDateTime salida;

    @Column(name = "Estado")
    private String estado;

    @Column(name = "HorasTotales", precision = 5, scale = 2)
    private BigDecimal horasTotales;

    public Long getId() { return id; }
    public String getUuid() { return uuid; }
    public Long getIdUsuario() { return idUsuario; }
    public Long getIdProyecto() { return idProyecto; }
    public LocalDateTime getEntrada() { return entrada; }
    public LocalDateTime getSalida() { return salida; }
    public String getEstado() { return estado; }
    public BigDecimal getHorasTotales() { return horasTotales; }
}
