package com.fieldcheck.ui.nfc

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fieldcheck.ui.theme.NavyDeep

private enum class NfcScanState { SCANNING, ERROR }

@Composable
fun NfcScanScreen(
    projectId: Int,
    action: String,
    onSuccess: () -> Unit,
    onCancel: () -> Unit
) {
    var state by remember { mutableStateOf(NfcScanState.SCANNING) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(NavyDeep),
        contentAlignment = Alignment.Center
    ) {
        when (state) {
            NfcScanState.SCANNING -> ScanningContent(
                onSuccess = onSuccess,
                onSimulateError = { state = NfcScanState.ERROR }
            )
            NfcScanState.ERROR -> ErrorContent(
                onRetry = { state = NfcScanState.SCANNING },
                onCancel = onCancel
            )
        }
    }
}

@Composable
private fun ScanningContent(onSuccess: () -> Unit, onSimulateError: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.padding(horizontal = 32.dp)
    ) {
        // Circle with scan brackets
        Box(
            modifier = Modifier
                .size(180.dp)
                .border(2.dp, Color(0xFF3D5A80), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.size(80.dp)) {
                val sw = 5f
                val cl = size.width * 0.3f
                val c  = Color(0xFF6B8CC7)

                // Top-left
                drawLine(c, Offset(0f, cl), Offset(0f, 0f), sw)
                drawLine(c, Offset(0f, 0f), Offset(cl, 0f), sw)
                // Top-right
                drawLine(c, Offset(size.width - cl, 0f), Offset(size.width, 0f), sw)
                drawLine(c, Offset(size.width, 0f), Offset(size.width, cl), sw)
                // Bottom-left
                drawLine(c, Offset(0f, size.height - cl), Offset(0f, size.height), sw)
                drawLine(c, Offset(0f, size.height), Offset(cl, size.height), sw)
                // Bottom-right
                drawLine(c, Offset(size.width - cl, size.height), Offset(size.width, size.height), sw)
                drawLine(c, Offset(size.width, size.height - cl), Offset(size.width, size.height), sw)
            }
        }

        Spacer(modifier = Modifier.height(40.dp))

        Text("Acerque Tarjeta NFC", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color.White)
        Spacer(modifier = Modifier.height(8.dp))
        Text("Mantenga tarjeta cerca del dispositivo", fontSize = 14.sp, color = Color(0xFF94A3B8))

        Spacer(modifier = Modifier.height(48.dp))

        // Demo controls
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            OutlinedButton(
                onClick = onSuccess,
                border = BorderStroke(1.dp, Color.White.copy(alpha = 0.4f)),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)
            ) { Text("Simular éxito") }

            OutlinedButton(
                onClick = onSimulateError,
                border = BorderStroke(1.dp, Color.White.copy(alpha = 0.4f)),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)
            ) { Text("Simular error") }
        }
    }
}

@Composable
private fun ErrorContent(onRetry: () -> Unit, onCancel: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.padding(horizontal = 32.dp)
    ) {
        Box(
            modifier = Modifier
                .size(120.dp)
                .background(Color(0xFFE53E3E), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.Warning, contentDescription = null, tint = Color.White, modifier = Modifier.size(60.dp))
        }

        Spacer(modifier = Modifier.height(32.dp))

        Text("Error de Lectura", fontSize = 26.sp, fontWeight = FontWeight.Bold, color = Color.White)

        Spacer(modifier = Modifier.height(32.dp))

        OutlinedButton(
            onClick = onRetry,
            modifier = Modifier.fillMaxWidth().height(52.dp),
            border = BorderStroke(2.dp, Color.White),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)
        ) {
            Text("Intentar de nuevo", fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = onCancel) {
            Text(
                "Cancelar",
                fontSize = 16.sp,
                color = Color.White.copy(alpha = 0.8f),
                textDecoration = TextDecoration.Underline
            )
        }
    }
}
