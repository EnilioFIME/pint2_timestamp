package com.fieldcheck.nfc.model

data class NfcCardData(
    val cardId: String,
    val tagUid: String,
    val tagType: String
)
