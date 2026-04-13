package com.fieldcheck.biometric.model

sealed class VerificationResult {
    object Approved : VerificationResult()
    object Rejected : VerificationResult()
    data class Error(val message: String) : VerificationResult()
}
