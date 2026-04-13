package com.fieldcheck.ui.biometric

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fieldcheck.ui.theme.NavyMid

@Composable
fun FaceCaptureScreen(
    projectId: Int,
    action: String,
    onSuccess: () -> Unit,
    onBack: () -> Unit
) {
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
                .padding(bottom = 120.dp)
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

        // Simulate button (demo)
        TextButton(
            onClick = onSuccess,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 56.dp)
        ) {
            Text("Simular captura", color = Color.White.copy(alpha = 0.5f), fontSize = 13.sp)
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
