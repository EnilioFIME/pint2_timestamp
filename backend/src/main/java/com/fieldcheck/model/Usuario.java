package com.fieldcheck.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Usuarios")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "UUID", nullable = false, unique = true, length = 36, updatable = false)
    private String uuid;

    // FK a TarjetasNFC — nullable (Checadores/Admins no la requieren)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdTarjetasNFC")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private TarjetaNFC tarjetaNFC;

    // FK a DatosBiometricosAWS — nullable (Checadores/Admins no la requieren)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdDatosBiometricos")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DatoBiometrico datoBiometrico;

    @Column(name = "Rol", nullable = false, length = 20)
    private String rol;

    @Column(name = "NumeroEmpleado", nullable = false, unique = true, length = 6)
    private String numeroEmpleado;

    @Column(name = "Email", length = 60)
    private String email;

    @Column(name = "Apellido", nullable = false, length = 100)
    private String apellido;

    @Column(name = "Nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "Status", nullable = false)
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
    public TarjetaNFC getTarjetaNFC() { return tarjetaNFC; }
    public void setTarjetaNFC(TarjetaNFC tarjetaNFC) { this.tarjetaNFC = tarjetaNFC; }
    public DatoBiometrico getDatoBiometrico() { return datoBiometrico; }
    public void setDatoBiometrico(DatoBiometrico datoBiometrico) { this.datoBiometrico = datoBiometrico; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getNumeroEmpleado() { return numeroEmpleado; }
    public void setNumeroEmpleado(String numeroEmpleado) { this.numeroEmpleado = numeroEmpleado; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
