package com.fieldcheck.network

import com.fieldcheck.network.model.BiometricImageRequest
import com.fieldcheck.network.model.BiometricVerifyResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
	@POST("api/biometrics/verify")
	suspend fun verifyBiometric(@Body request: BiometricImageRequest): BiometricVerifyResponse
}
