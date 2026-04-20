package com.fieldcheck.biometric;

public record VerificationResult(
    boolean success,
    float similarity,
    String matchedEmployeeId,
    String reason
) {
    public static VerificationResult success(float similarity, String employeeId) {
        return new VerificationResult(true, similarity, employeeId, null);
    }

    public static VerificationResult failed(float similarity, String reason) {
        return new VerificationResult(false, similarity, null, reason);
    }
}