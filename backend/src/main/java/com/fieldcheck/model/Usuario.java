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
    private Long id;

    @Column(nullable = false, unique = true, length = 36)
    private String uuid;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tarjeta_nfc_id")
    private TarjetaNFC tarjetaNfc;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dato_biometrico_id")
    private DatoBiometrico datoBiometrico;

    @Column(nullable = false, length = 20)
    private String rol;

    @Column(name = "numero_empleado", nullable = false, unique = true, length = 6)
    private String numeroEmpleado;

    @Column(unique = true, length = 60)
    private String email;

    @Column(length = 255)
    private String password;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false)
    private Boolean status = true;

    @Column(name = "modified_by", length = 60)
    private String modifiedBy;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    private void prePersist() {
        if (uuid == null) uuid = UUID.randomUUID().toString();
        if (timestamp == null) timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getUuid() { return uuid; }
    public TarjetaNFC getTarjetaNfc() { return tarjetaNfc; }
    public void setTarjetaNfc(TarjetaNFC tarjetaNfc) { this.tarjetaNfc = tarjetaNfc; }
    public DatoBiometrico getDatoBiometrico() { return datoBiometrico; }
    public void setDatoBiometrico(DatoBiometrico datoBiometrico) { this.datoBiometrico = datoBiometrico; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getNumeroEmpleado() { return numeroEmpleado; }
    public void setNumeroEmpleado(String numeroEmpleado) { this.numeroEmpleado = numeroEmpleado; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }
    public String getModifiedBy() { return modifiedBy; }
    public void setModifiedBy(String modifiedBy) { this.modifiedBy = modifiedBy; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
