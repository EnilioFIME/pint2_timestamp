package com.fieldcheck.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Proyectos")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 36, updatable = false)
    private String uuid;

    @Column(name = "IdFrente", nullable = false)
    private Long idFrente;

    @Column(name = "IdCerco")
    private Long idCerco;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(nullable = false)
    private Boolean status = true;

    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @PrePersist
    private void prePersist() {
        if (uuid == null) uuid = UUID.randomUUID().toString();
        if (createdAt == null) createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    private void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getUuid() { return uuid; }
    public Long getIdFrente() { return idFrente; }
    public void setIdFrente(Long idFrente) { this.idFrente = idFrente; }
    public Long getIdCerco() { return idCerco; }
    public void setIdCerco(Long idCerco) { this.idCerco = idCerco; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}