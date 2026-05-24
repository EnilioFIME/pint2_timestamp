package com.fieldcheck.network.model

data class BiometricVerifyResponse(
    val success: Boolean,
    val similarity: Float,
    val matchedEmployeeId: String?,
    val reason: String?
)