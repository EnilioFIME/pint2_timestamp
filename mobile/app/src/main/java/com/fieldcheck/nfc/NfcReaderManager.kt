package com.fieldcheck.nfc

import android.nfc.Tag
import android.nfc.tech.NfcA
import com.fieldcheck.nfc.model.NfcCardData
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow

object NfcReaderManager {

	private const val NTAG_GET_VERSION_CMD: Byte = 0x60
	private const val NTAG213_STORAGE_SIZE_BYTE: Byte = 0x0F

	private val _scanEvents = MutableSharedFlow<Result<NfcCardData>>(extraBufferCapacity = 1)
	val scanEvents = _scanEvents.asSharedFlow()

	fun onTagDiscovered(tag: Tag) {
		val result = runCatching {
			val tagId = tag.id ?: error("TAG_ID_EMPTY")
			require(NfcTagParser.isValidEmployeeTag(tagId)) { "TAG_ID_INVALID" }

			val employeeId = NfcTagParser.extractEmployeeId(tagId) ?: error("TAG_ID_PARSE_FAILED")
			require(isNtag213(tag)) { "UNSUPPORTED_TAG_TYPE" }

			NfcCardData(
				cardId = employeeId,
				tagUid = employeeId,
				tagType = "NTAG213"
			)
		}

		_scanEvents.tryEmit(result)
	}

	private fun isNtag213(tag: Tag): Boolean {
		val nfca = NfcA.get(tag) ?: return false

		return runCatching {
			nfca.connect()
			val version = nfca.transceive(byteArrayOf(NTAG_GET_VERSION_CMD))
			version.size >= 7 && version[6] == NTAG213_STORAGE_SIZE_BYTE
		}.getOrDefault(false).also {
			runCatching { nfca.close() }
		}
	}
}
