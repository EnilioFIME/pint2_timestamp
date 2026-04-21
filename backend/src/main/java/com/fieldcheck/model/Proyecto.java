package com.fieldcheck.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Proyectos")
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 36)
    private String uuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "frente_id", nullable = false)
    private Frente frente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cerco_id")
    private CercoGeografico cerco;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(nullable = false)
    private Boolean status = true;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    private void prePersist() {
        if (uuid == null) uuid = UUID.randomUUID().toString();
        if (timestamp == null) timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getUuid() { return uuid; }
    public Frente getFrente() { return frente; }
    public void setFrente(Frente frente) { this.frente = frente; }
    public CercoGeografico getCerco() { return cerco; }
    public void setCerco(CercoGeografico cerco) { this.cerco = cerco; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
