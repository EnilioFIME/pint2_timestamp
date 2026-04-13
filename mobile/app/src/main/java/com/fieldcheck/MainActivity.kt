package com.fieldcheck

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.navigation.compose.rememberNavController
import com.fieldcheck.ui.navigation.AppNavGraph
import com.fieldcheck.ui.theme.FieldCheckTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            FieldCheckTheme {
                val navController = rememberNavController()
                AppNavGraph(navController = navController)
            }
        }
    }
}