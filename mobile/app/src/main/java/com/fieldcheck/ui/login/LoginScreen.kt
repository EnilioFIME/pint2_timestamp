package com.fieldcheck.ui.login

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fieldcheck.ui.theme.*

@Composable
fun LoginScreen(onLogin: () -> Unit) {
    var email    by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .statusBarsPadding()
            .padding(horizontal = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(72.dp))

        // App icon
        Box(
            modifier = Modifier
                .size(72.dp)
                .background(NavyDark, RoundedCornerShape(20.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.CheckCircle,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(40.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text("WorkStamp", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
        Text("Sistema de Asistencia", fontSize = 15.sp, color = TextSecondary)

        Spacer(modifier = Modifier.height(48.dp))

        // Email
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                "Correo electrónico",
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = TextPrimary,
                modifier = Modifier.padding(bottom = 6.dp)
            )
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("checador@workstamp.com", color = TextHint) },
                shape = RoundedCornerShape(12.dp),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = NavyDark,
                    unfocusedBorderColor = BorderLight
                )
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Password
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                "Contraseña",
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = TextPrimary,
                modifier = Modifier.padding(bottom = 6.dp)
            )
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("••••••••", color = TextHint) },
                shape = RoundedCornerShape(12.dp),
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = NavyDark,
                    unfocusedBorderColor = BorderLight
                )
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        Button(
            onClick = onLogin,
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = NavyDark)
        ) {
            Text("Iniciar Sesión", fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
        }
    }
}
