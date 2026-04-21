package com.fieldcheck.nfc

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class NfcTagParserTest {

    @Test
    fun `bytearray valido de 7 bytes retorna string hexadecimal no nulo`() {
        val tag = byteArrayOf(0x04, 0x1A, 0x2B, 0x3C, 0x4D, 0x5E, 0x6F)
        val result = NfcTagParser.extractEmployeeId(tag)
        assertNotNull("El ID no debe ser null para un tag válido", result)
        assertEquals(14, result!!.length)
    }

    @Test
    fun `bytearray vacio retorna null`() {
        val result = NfcTagParser.extractEmployeeId(byteArrayOf())
        assertNull("ByteArray vacío debe retornar null", result)
    }

    @Test
    fun `bytearray de 4 bytes es tag valido`() {
        val tag = byteArrayOf(0x01, 0x02, 0x03, 0x04)
        assertTrue("Tag de 4 bytes debe ser válido", NfcTagParser.isValidEmployeeTag(tag))
    }

    @Test
    fun `bytearray de 11 bytes no es tag valido`() {
        val tag = ByteArray(11) { it.toByte() }
        assertFalse("Tag de 11 bytes debe ser inválido", NfcTagParser.isValidEmployeeTag(tag))
    }

    @Test
    fun `bytes 04 AB FF generan exactamente 04ABFF`() {
        val tag = byteArrayOf(0x04, 0xAB.toByte(), 0xFF.toByte())
        val result = NfcTagParser.extractEmployeeId(tag)
        assertEquals("04ABFF", result)
    }
}
