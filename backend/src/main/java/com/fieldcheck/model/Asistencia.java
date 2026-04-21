package com.fieldcheck.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Asistencias")
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 36)
    private String uuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Proyecto proyecto;

    @Column(name = "tipo_verificacion", nullable = false, length = 20)
    private String tipoVerificacion;

    @Column(nullable = false, length = 20)
    private String metodo;

    @Column(precision = 5, scale = 2)
    private BigDecimal confianza;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    private void prePersist() {
        if (uuid == null) uuid = UUID.randomUUID().toString();
        if (timestamp == null) timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getUuid() { return uuid; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Proyecto getProyecto() { return proyecto; }
    public void setProyecto(Proyecto proyecto) { this.proyecto = proyecto; }
    public String getTipoVerificacion() { return tipoVerificacion; }
    public void setTipoVerificacion(String tipoVerificacion) { this.tipoVerificacion = tipoVerificacion; }
    public String getMetodo() { return metodo; }
    public void setMetodo(String metodo) { this.metodo = metodo; }
    public BigDecimal getConfianza() { return confianza; }
    public void setConfianza(BigDecimal confianza) { this.confianza = confianza; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
