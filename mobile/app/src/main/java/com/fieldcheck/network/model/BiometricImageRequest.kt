package com.fieldcheck.network.model

data class BiometricImageRequest(
    val imageBase64: String,
    val employeeId: String
)