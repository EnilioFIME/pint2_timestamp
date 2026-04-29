package com.fieldcheck.attendance

private const val MIN_INTERVAL_MS = 3 * 60 * 1000L   // 3 minutes
private const val MAX_DAILY_EVENTS = 2
private const val GPS_ACCURACY_THRESHOLD_M = 100f

class AttendanceHeuristicEngine {

    fun requiresBiometricVerification(
        employeeId: String,
        lastCheckInTimestamp: Long?,
        currentTimestamp: Long,
        locationAccuracyMeters: Float,
        dailyEventCount: Int = 0
    ): Boolean {
        if (lastCheckInTimestamp == null) return false

        val elapsed = currentTimestamp - lastCheckInTimestamp
        if (elapsed < MIN_INTERVAL_MS) return true

        if (dailyEventCount >= MAX_DAILY_EVENTS) return true

        if (locationAccuracyMeters > GPS_ACCURACY_THRESHOLD_M) return true

        return false
    }
}
