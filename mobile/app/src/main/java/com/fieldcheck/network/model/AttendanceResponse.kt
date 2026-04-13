package com.fieldcheck.network.model

data class AttendanceResponse(
    val requiresFaceVerification: Boolean,
    val attendanceId: String
)
