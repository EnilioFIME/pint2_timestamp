package com.fieldcheck.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "DatosBiometricosAWS")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class DatoBiometrico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "UUID", nullable = false, unique = true, length = 36, updatable = false)
    private String uuid;

    @NotBlank(message = "El RekognitionFaceId es obligatorio")
    @Size(max = 100, message = "El RekognitionFaceId no puede superar 100 caracteres")
    @Column(name = "RekognitionFaceId", nullable = false, unique = true, length = 100)
    private String rekognitionFaceId;

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
    public String getRekognitionFaceId() { return rekognitionFaceId; }
    public void setRekognitionFaceId(String rekognitionFaceId) { this.rekognitionFaceId = rekognitionFaceId; }
    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
