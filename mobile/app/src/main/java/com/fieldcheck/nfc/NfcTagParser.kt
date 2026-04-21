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
