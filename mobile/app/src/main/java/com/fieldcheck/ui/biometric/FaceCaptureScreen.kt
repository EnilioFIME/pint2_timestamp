package com.fieldcheck.ui.biometric

import android.Manifest
import android.graphics.Bitmap
import android.util.Base64
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.fieldcheck.network.RetrofitClient
import com.fieldcheck.network.model.BiometricImageRequest
import com.fieldcheck.session.VerificationSession
import com.fieldcheck.ui.theme.NavyMid
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream

@Composable
fun FaceCaptureScreen(
    projectId: Int,
    action: String,
    onSuccess: () -> Unit,
    onBack: () -> Unit
) {
    val coroutineScope = rememberCoroutineScope()
    val context = androidx.compose.ui.platform.LocalContext.current
    var employeeId by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var pendingCameraLaunch by remember { mutableStateOf(false) }

    val capturePreview = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicturePreview()
    ) { bitmap ->
        pendingCameraLaunch = false
        if (bitmap == null) {
            errorMessage = "No se pudo capturar la imagen"
            return@rememberLauncherForActivityResult
        }

        if (employeeId.isBlank()) {
            errorMessage = "Escanee una tarjeta NTAG213 o capture el ID manualmente"
            return@rememberLauncherForActivityResult
        }

        isLoading = true
        errorMessage = null

        coroutineScope.launch {
            runCatching {
                val request = BiometricImageRequest(
                    imageBase64 = bitmapToBase64(bitmap),
                    employeeId = employeeId.trim()
                )
                RetrofitClient.apiService.verifyBiometric(request)
            }.onSuccess { response ->
                if (response.success) {
                    VerificationSession.setEmployeeId(employeeId.trim())
                    onSuccess()
                } else {
                    errorMessage = response.reason ?: "Verificación rechazada"
                }
            }.onFailure { throwable ->
                errorMessage = throwable.message ?: "Error al conectar con backend"
            }

            isLoading = false
        }
    }

    val requestCameraPermission = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted && pendingCameraLaunch) {
            capturePreview.launch(null)
        } else if (!granted) {
            pendingCameraLaunch = false
            errorMessage = "Se requiere permiso de cámara para continuar"
        }
    }

    LaunchedEffect(Unit) {
        VerificationSession.employeeId.value?.let { employeeId = it }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(NavyMid)
    ) {
        // Face oval guide
        Box(
            modifier = Modifier.align(Alignment.Center),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.size(220.dp, 260.dp)) {
                drawOval(
                    color = Color(0xFF8899AA),
                    style = Stroke(width = 2.dp.toPx())
                )
            }
            Icon(
                imageVector = Icons.Default.Person,
                contentDescription = null,
                tint = Color(0xFF3A4A5A),
                modifier = Modifier.size(130.dp)
            )
        }

        // Instruction pill
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 190.dp)
                .background(Color(0xCC0D1520), RoundedCornerShape(50))
                .padding(horizontal = 24.dp, vertical = 12.dp)
        ) {
            Text(
                "Alinee su rostro en el marco",
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                color = Color.White
            )
        }

        OutlinedTextField(
            value = employeeId,
            onValueChange = { employeeId = it },
            singleLine = true,
            label = { Text("Employee ID") },
            enabled = !isLoading,
            keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(imeAction = ImeAction.Done),
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 92.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = Color.White,
                unfocusedBorderColor = Color.White.copy(alpha = 0.8f),
                focusedLabelColor = Color.White,
                unfocusedLabelColor = Color.White.copy(alpha = 0.8f),
                cursorColor = Color.White,
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White
            )
        )

        Button(
            onClick = {
                val permissionState = ContextCompat.checkSelfPermission(
                    context,
                    Manifest.permission.CAMERA
                )

                if (permissionState == android.content.pm.PackageManager.PERMISSION_GRANTED) {
                    capturePreview.launch(null)
                } else {
                    pendingCameraLaunch = true
                    requestCameraPermission.launch(Manifest.permission.CAMERA)
                }
            },
            enabled = !isLoading,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 36.dp)
                .height(50.dp)
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(18.dp),
                    strokeWidth = 2.dp,
                    color = Color.White
                )
            } else {
                Text("Capturar y verificar")
            }
        }

        errorMessage?.let { message ->
            Text(
                text = message,
                color = Color(0xFFFFB4AB),
                fontSize = 13.sp,
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 12.dp)
            )
        }

        // Back
        IconButton(
            onClick = onBack,
            modifier = Modifier
                .align(Alignment.TopStart)
                .statusBarsPadding()
                .padding(start = 8.dp, top = 8.dp)
        ) {
            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Volver", tint = Color.White)
        }
    }
}

private suspend fun bitmapToBase64(bitmap: Bitmap): String = withContext(Dispatchers.Default) {
    val output = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.JPEG, 92, output)
    Base64.encodeToString(output.toByteArray(), Base64.NO_WRAP)
}
