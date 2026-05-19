package com.fieldcheck.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Registros")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Registro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "UUID", nullable = false, unique = true, length = 100, updatable = false)
    private String uuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdUsuario", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdProyecto", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Proyecto proyecto;

    @Column(name = "TipoVerificacion", nullable = false, length = 20)
    private String tipoVerificacion;

    @Column(name = "TipoRegistro", nullable = false, length = 20)
    private String tipoRegistro;

    @Column(name = "Confianza", precision = 5, scale = 2)
    private BigDecimal confianza;

    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt;

    // Tabla inmutable — solo @PrePersist, sin @PreUpdate
    @PrePersist
    private void prePersist() {
        if (uuid == null) uuid = UUID.randomUUID().toString();
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getUuid() { return uuid; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Proyecto getProyecto() { return proyecto; }
    public void setProyecto(Proyecto proyecto) { this.proyecto = proyecto; }
    public String getTipoVerificacion() { return tipoVerificacion; }
    public void setTipoVerificacion(String tipoVerificacion) { this.tipoVerificacion = tipoVerificacion; }
    public String getTipoRegistro() { return tipoRegistro; }
    public void setTipoRegistro(String tipoRegistro) { this.tipoRegistro = tipoRegistro; }
    public BigDecimal getConfianza() { return confianza; }
    public void setConfianza(BigDecimal confianza) { this.confianza = confianza; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
