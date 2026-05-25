package com.fieldcheck.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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

    @NotBlank(message = "El rol es obligatorio")
    @Pattern(regexp = "Empleado|Checador|Administrador",
             message = "El rol debe ser 'Empleado', 'Checador' o 'Administrador'")
    @Column(name = "Rol", nullable = false, length = 20)
    private String rol;

    @NotBlank(message = "El número de empleado es obligatorio")
    @Size(max = 6, message = "El número de empleado no puede superar 6 caracteres")
    @Column(name = "NumeroEmpleado", nullable = false, unique = true, length = 6)
    private String numeroEmpleado;

    @Email(message = "Formato de email inválido")
    @Size(max = 60, message = "El email no puede superar 60 caracteres")
    @Column(name = "Email", length = 60)
    private String email;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100, message = "El apellido no puede superar 100 caracteres")
    @Column(name = "Apellido", nullable = false, length = 100)
    private String apellido;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
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
