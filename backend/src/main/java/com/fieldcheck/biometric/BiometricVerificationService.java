package com.fieldcheck.biometric;

public interface BiometricVerificationService {
    VerificationResult verify(byte[] capturedFace, String employeeId);
    void registerFace(byte[] faceImage, String employeeId);
    void initializeCollection();
}