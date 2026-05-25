package com.fieldcheck.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    // Campo de escritura — usado por ProyectoService en save/update
    @NotNull(message = "El frente de obra es obligatorio")
    @Column(name = "IdFrente", nullable = false)
    private Long idFrente;

    // Campo de escritura — usado por ProyectoService en save/update
    @Column(name = "IdCerco")
    private Long idCerco;

    @NotBlank(message = "El nombre del proyecto es obligatorio")
    @Size(max = 200, message = "El nombre no puede superar 200 caracteres")
    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(nullable = false)
    private Boolean status = true;

    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    // Relación de lectura — Hibernate la carga automáticamente, Jackson la serializa
    // insertable/updatable=false porque la columna ya está mapeada en idFrente
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdFrente", insertable = false, updatable = false)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Frente frente;

    // Relación de lectura — misma razón que frente
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdCerco", insertable = false, updatable = false)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private CercoGeografico cerco;

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
    public Frente getFrente() { return frente; }
    public CercoGeografico getCerco() { return cerco; }
}
