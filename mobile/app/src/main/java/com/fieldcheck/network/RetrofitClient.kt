package com.fieldcheck.network

import com.fieldcheck.BuildConfig
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
	private val baseUrl = BuildConfig.API_BASE_URL

	private val loggingInterceptor = HttpLoggingInterceptor().apply {
		level = HttpLoggingInterceptor.Level.BODY
	}

	private val okHttpClient = OkHttpClient.Builder()
		.connectTimeout(15, TimeUnit.SECONDS)
		.readTimeout(30, TimeUnit.SECONDS)
		.addInterceptor(loggingInterceptor)
		.build()

	private val retrofit: Retrofit = Retrofit.Builder()
		.baseUrl(baseUrl)
		.addConverterFactory(GsonConverterFactory.create())
		.client(okHttpClient)
		.build()

	val apiService: ApiService = retrofit.create(ApiService::class.java)
}
