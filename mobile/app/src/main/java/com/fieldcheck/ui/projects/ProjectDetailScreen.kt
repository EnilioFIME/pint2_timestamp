package com.fieldcheck.ui.projects

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fieldcheck.ui.mock.MockData
import com.fieldcheck.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProjectDetailScreen(
    projectId: Int,
    onBack: () -> Unit,
    onAction: (String) -> Unit
) {
    val project = MockData.projects.find { it.id == projectId } ?: MockData.projects.first()

    Scaffold(
        topBar = {
            Column {
                TopAppBar(
                    title = { Text("Asistencia", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = TextPrimary) },
                    navigationIcon = {
                        IconButton(onClick = onBack) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Volver", tint = TextPrimary)
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
                )
                HorizontalDivider(color = BorderLight)
            }
        },
        containerColor = Color.White
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            // Geofence banner
            Row(modifier = Modifier.fillMaxWidth()) {
                Box(
                    modifier = Modifier
                        .width(4.dp)
                        .height(52.dp)
                        .background(GreenSuccess, RoundedCornerShape(topStart = 4.dp, bottomStart = 4.dp))
                )
                Row(
                    modifier = Modifier
                        .weight(1f)
                        .height(52.dp)
                        .background(GreenSuccessLight, RoundedCornerShape(topEnd = 12.dp, bottomEnd = 12.dp))
                        .padding(horizontal = 16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(Icons.Default.LocationOn, contentDescription = null, tint = GreenSuccess, modifier = Modifier.size(18.dp))
                    Text("Dentro del área autorizada", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = GreenSuccess)
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Project name + subtitle
            Text(
                project.name,
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                "Seleccione una acción para continuar",
                fontSize = 15.sp,
                color = TextSecondary,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.weight(1f))

            // Entrada
            Button(
                onClick = { onAction("entrada") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(90.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = NavyDark)
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Color.White, modifier = Modifier.size(28.dp))
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Entrada", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.White)
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Salida
            OutlinedButton(
                onClick = { onAction("salida") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(90.dp),
                shape = RoundedCornerShape(16.dp),
                border = BorderStroke(1.5.dp, BorderLight),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary)
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.AutoMirrored.Filled.ExitToApp, contentDescription = null, tint = TextPrimary, modifier = Modifier.size(28.dp))
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Salida", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            Text("WorkStamp v1.0.0", fontSize = 12.sp, color = TextHint)

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
