package com.fieldcheck.session

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

object VerificationSession {
    private val _employeeId = MutableStateFlow<String?>(null)
    val employeeId = _employeeId.asStateFlow()

    fun setEmployeeId(value: String) {
        _employeeId.value = value
    }
}