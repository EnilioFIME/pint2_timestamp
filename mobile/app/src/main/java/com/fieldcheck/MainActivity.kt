package com.fieldcheck

import android.nfc.NfcAdapter
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.fieldcheck.nfc.NfcReaderManager
import androidx.navigation.compose.rememberNavController
import com.fieldcheck.ui.navigation.AppNavGraph
import com.fieldcheck.ui.theme.FieldCheckTheme

class MainActivity : ComponentActivity() {

    private var nfcAdapter: NfcAdapter? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        nfcAdapter = NfcAdapter.getDefaultAdapter(this)
        enableEdgeToEdge()
        setContent {
            FieldCheckTheme {
                val navController = rememberNavController()
                AppNavGraph(navController = navController)
            }
        }
    }

    override fun onResume() {
        super.onResume()
        enableNfcReaderMode()
    }

    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableReaderMode(this)
    }

    private fun enableNfcReaderMode() {
        val flags =
            NfcAdapter.FLAG_READER_NFC_A or
                NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK or
                NfcAdapter.FLAG_READER_NO_PLATFORM_SOUNDS

        val extras = Bundle().apply {
            putInt(NfcAdapter.EXTRA_READER_PRESENCE_CHECK_DELAY, 200)
        }

        nfcAdapter?.enableReaderMode(this, { tag ->
            NfcReaderManager.onTagDiscovered(tag)
        }, flags, extras)
    }
}