package com.fieldcheck

import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Assume
import org.junit.Test
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

class AiCheckInAuditTest {

    private val heuristicEngineSource = """
package com.fieldcheck.attendance

private const val MIN_INTERVAL_MS = 3 * 60 * 1000L
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
""".trimIndent()

    private val nfcTagParserSource = """
package com.fieldcheck.nfc

object NfcTagParser {
    fun extractEmployeeId(tagId: ByteArray): String? {
        if (tagId.isEmpty()) return null
        return tagId.joinToString("") { "%02X".format(it) }
    }
    fun isValidEmployeeTag(tagId: ByteArray): Boolean {
        return tagId.size in 4..10
    }
}
""".trimIndent()

    @Test(timeout = 30000)
    fun `ai auditor identifica vectores de ataque en el flujo de checkin`() {
        val apiKey = System.getenv("ANTHROPIC_API_KEY")
        Assume.assumeTrue(
            "ANTHROPIC_API_KEY no configurada — test omitido",
            !apiKey.isNullOrBlank()
        )

        val userContent = """
Analiza estas dos clases del sistema de control de acceso físico FieldCheck:

=== AttendanceHeuristicEngine.kt ===
$heuristicEngineSource

=== NfcTagParser.kt ===
$nfcTagParserSource
""".trimIndent()

        val requestBody = """
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 1024,
  "system": "Eres un auditor de seguridad especializado en apps móviles de control de acceso físico. Analiza el código y responde ÚNICAMENTE con JSON válido, sin markdown, con este schema exacto: {\"attack_vectors\": [], \"missing_validations\": [], \"nfc_spoofing_risks\": [], \"recommended_test_cases\": []}",
  "messages": [
    {
      "role": "user",
      "content": ${escapeJson(userContent)}
    }
  ]
}
""".trimIndent()

        val url = URL("https://api.anthropic.com/v1/messages")
        val conn = url.openConnection() as HttpURLConnection
        conn.requestMethod = "POST"
        conn.setRequestProperty("x-api-key", apiKey)
        conn.setRequestProperty("anthropic-version", "2023-06-01")
        conn.setRequestProperty("content-type", "application/json")
        conn.doOutput = true
        conn.connectTimeout = 20000
        conn.readTimeout = 25000

        OutputStreamWriter(conn.outputStream, Charsets.UTF_8).use { it.write(requestBody) }

        val statusCode = conn.responseCode
        assertTrue("API debe responder 200, recibido: $statusCode", statusCode == 200)

        val responseText = BufferedReader(InputStreamReader(conn.inputStream, Charsets.UTF_8))
            .use { it.readText() }

        val contentText = extractContentText(responseText)
        assertNotNull("La respuesta no debe ser nula", contentText)

        val json = parseSimpleJsonObject(contentText!!)

        assertTrue("Respuesta debe contener 'attack_vectors'", json.containsKey("attack_vectors"))
        assertTrue("Respuesta debe contener 'missing_validations'", json.containsKey("missing_validations"))
        assertTrue("Respuesta debe contener 'nfc_spoofing_risks'", json.containsKey("nfc_spoofing_risks"))
        assertTrue("Respuesta debe contener 'recommended_test_cases'", json.containsKey("recommended_test_cases"))

        val spoofingRisks = extractJsonArray(contentText, "nfc_spoofing_risks")
        assertFalse(
            "nfc_spoofing_risks no debe estar vacío — la IA debe identificar al menos un riesgo",
            spoofingRisks.isEmpty()
        )

        println("=== AI AUDIT RESULT ===")
        println(contentText)
        println("attack_vectors: ${extractJsonArray(contentText, "attack_vectors")}")
        println("missing_validations: ${extractJsonArray(contentText, "missing_validations")}")
        println("nfc_spoofing_risks: $spoofingRisks")
        println("recommended_test_cases: ${extractJsonArray(contentText, "recommended_test_cases")}")
    }

    private fun escapeJson(s: String): String {
        return "\"" + s
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t") + "\""
    }

    private fun extractContentText(apiResponse: String): String? {
        val marker = "\"text\":"
        val start = apiResponse.indexOf(marker)
        if (start == -1) return null
        val valueStart = apiResponse.indexOf("\"", start + marker.length)
        if (valueStart == -1) return null
        val sb = StringBuilder()
        var i = valueStart + 1
        while (i < apiResponse.length) {
            val c = apiResponse[i]
            if (c == '\\' && i + 1 < apiResponse.length) {
                when (apiResponse[i + 1]) {
                    '"' -> { sb.append('"'); i += 2 }
                    'n' -> { sb.append('\n'); i += 2 }
                    'r' -> { sb.append('\r'); i += 2 }
                    't' -> { sb.append('\t'); i += 2 }
                    '\\' -> { sb.append('\\'); i += 2 }
                    else -> { sb.append(apiResponse[i + 1]); i += 2 }
                }
            } else if (c == '"') {
                break
            } else {
                sb.append(c)
                i++
            }
        }
        return sb.toString()
    }

    private fun parseSimpleJsonObject(json: String): Map<String, Any> {
        val keys = listOf("attack_vectors", "missing_validations", "nfc_spoofing_risks", "recommended_test_cases")
        return keys.filter { json.contains("\"$it\"") }.associateWith { it }
    }

    private fun extractJsonArray(json: String, key: String): List<String> {
        val marker = "\"$key\":"
        val start = json.indexOf(marker)
        if (start == -1) return emptyList()
        val arrStart = json.indexOf("[", start + marker.length)
        if (arrStart == -1) return emptyList()
        val arrEnd = json.indexOf("]", arrStart)
        if (arrEnd == -1) return emptyList()
        val arrContent = json.substring(arrStart + 1, arrEnd).trim()
        if (arrContent.isBlank()) return emptyList()
        return arrContent.split(",").map { it.trim().trim('"') }.filter { it.isNotBlank() }
    }
}
