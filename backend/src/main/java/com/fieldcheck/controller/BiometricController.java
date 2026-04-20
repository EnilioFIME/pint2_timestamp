package com.fieldcheck.controller;

import com.fieldcheck.biometric.BiometricVerificationService;
import com.fieldcheck.biometric.VerificationResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/biometrics")
public class BiometricController {

    // Spring Boot inyecta mágicamente la implementación de AWS aquí
    private final BiometricVerificationService biometricService;

    public BiometricController(BiometricVerificationService biometricService) {
        this.biometricService = biometricService;
    }

    // Endpoint para registrar un nuevo rostro
    @PostMapping("/register")
    public String registerFace(@RequestParam("image") MultipartFile image, @RequestParam("employeeId") String employeeId) {
        try {
            byte[] faceBytes = image.getBytes();
            biometricService.registerFace(faceBytes, employeeId);
            return "Empleado registrado correctamente en Rekognition";
        } catch (IOException e) {
            return "Error al leer la imagen";
        }
    }

    // Endpoint para verificar un rostro en campo
    @PostMapping("/verify")
    public VerificationResult verifyFace(@RequestParam("image") MultipartFile image, @RequestParam("employeeId") String employeeId) {
        try {
            byte[] faceBytes = image.getBytes();
            return biometricService.verify(faceBytes, employeeId);
        } catch (IOException e) {
            return VerificationResult.failed(0f, "ERROR_READING_FILE");
        }
    }
}