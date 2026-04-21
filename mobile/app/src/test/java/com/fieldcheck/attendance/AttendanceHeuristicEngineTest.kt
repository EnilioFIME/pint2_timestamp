package com.fieldcheck.attendance

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class AttendanceHeuristicEngineTest {

    private lateinit var engine: AttendanceHeuristicEngine

    private val NOW = System.currentTimeMillis()
    private val FOUR_HOURS_AGO = NOW - (4 * 60 * 60 * 1000L)
    private val TWO_MINUTES_AGO = NOW - (2 * 60 * 1000L)

    @Before
    fun setUp() {
        engine = AttendanceHeuristicEngine()
    }

    @Test
    fun `registro normal no requiere biometrico`() {
        val result = engine.requiresBiometricVerification(
            employeeId = "EMP001",
            lastCheckInTimestamp = FOUR_HOURS_AGO,
            currentTimestamp = NOW,
            locationAccuracyMeters = 15f,
            dailyEventCount = 1
        )
        assertFalse("Registro normal no debe requerir biométrico", result)
    }

    @Test
    fun `checkin demasiado rapido requiere biometrico`() {
        val result = engine.requiresBiometricVerification(
            employeeId = "EMP001",
            lastCheckInTimestamp = TWO_MINUTES_AGO,
            currentTimestamp = NOW,
            locationAccuracyMeters = 15f,
            dailyEventCount = 1
        )
        assertTrue("Check-in < 3 min desde el anterior debe requerir biométrico", result)
    }

    @Test
    fun `doble checkin mismo dia requiere biometrico`() {
        val result = engine.requiresBiometricVerification(
            employeeId = "EMP001",
            lastCheckInTimestamp = FOUR_HOURS_AGO,
            currentTimestamp = NOW,
            locationAccuracyMeters = 15f,
            dailyEventCount = 2
        )
        assertTrue("Tercer evento del día debe requerir biométrico", result)
    }

    @Test
    fun `ubicacion con baja precision GPS requiere biometrico`() {
        val result = engine.requiresBiometricVerification(
            employeeId = "EMP001",
            lastCheckInTimestamp = FOUR_HOURS_AGO,
            currentTimestamp = NOW,
            locationAccuracyMeters = 150f,
            dailyEventCount = 1
        )
        assertTrue("Precisión GPS > 100m debe requerir biométrico", result)
    }

    @Test
    fun `primer registro empleado no requiere biometrico`() {
        val result = engine.requiresBiometricVerification(
            employeeId = "EMP_NEW",
            lastCheckInTimestamp = null,
            currentTimestamp = NOW,
            locationAccuracyMeters = 15f,
            dailyEventCount = 0
        )
        assertFalse("Primer registro (null lastCheckIn) no debe requerir biométrico", result)
    }
}
