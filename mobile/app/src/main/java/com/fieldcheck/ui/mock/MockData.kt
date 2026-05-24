package com.fieldcheck.ui.mock

data class MockProject(val id: Int, val name: String, val front: String, val isInside: Boolean)
data class MockUser(val name: String, val role: String)

object MockData {
    val projects = listOf(
        MockProject(1, "Torre Reforma",        "Frente Norte", true),
        MockProject(2, "Puente Centenario",    "Acceso B",     false),
        MockProject(3, "Bodegas Industriales", "Nave 4",       true)
    )
    val user = MockUser("Carlos Rivera", "Checador")

    private val employeeNames = mapOf(
        "luis"   to "Luis Espinosa",
        "emilio" to "Emilio"
    )

    fun getEmployeeName(id: String?): String =
        id?.let { employeeNames[it.trim().lowercase()] } ?: id?.ifBlank { null } ?: "Empleado"
}
