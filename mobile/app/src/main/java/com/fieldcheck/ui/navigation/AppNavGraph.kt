package com.fieldcheck.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.fieldcheck.ui.biometric.FaceCaptureScreen
import com.fieldcheck.ui.confirmation.ConfirmationScreen
import com.fieldcheck.ui.login.LoginScreen
import com.fieldcheck.ui.nfc.NfcScanScreen
import com.fieldcheck.ui.profile.ProfileScreen
import com.fieldcheck.ui.projects.ProjectDetailScreen
import com.fieldcheck.ui.projects.ProjectListScreen
import com.fieldcheck.ui.verification.VerificationScreen

object Routes {
    const val LOGIN          = "login"
    const val PROJECT_LIST   = "project_list"
    const val PROJECT_DETAIL = "project_detail/{projectId}"
    const val VERIFICATION   = "verification/{projectId}/{action}"
    const val NFC_SCAN       = "nfc_scan/{projectId}/{action}"
    const val FACE_CAPTURE   = "face_capture/{projectId}/{action}"
    const val CONFIRMATION   = "confirmation/{projectId}/{action}/{method}"
    const val PROFILE        = "profile"

    fun projectDetail(id: Int)                              = "project_detail/$id"
    fun verification(id: Int, action: String)               = "verification/$id/$action"
    fun nfcScan(id: Int, action: String)                    = "nfc_scan/$id/$action"
    fun faceCapture(id: Int, action: String)                = "face_capture/$id/$action"
    fun confirmation(id: Int, action: String, method: String) = "confirmation/$id/$action/$method"
}

@Composable
fun AppNavGraph(navController: NavHostController) {
    NavHost(navController = navController, startDestination = Routes.LOGIN) {

        composable(Routes.LOGIN) {
            LoginScreen(onLogin = {
                navController.navigate(Routes.PROJECT_LIST) {
                    popUpTo(Routes.LOGIN) { inclusive = true }
                }
            })
        }

        composable(Routes.PROJECT_LIST) {
            ProjectListScreen(
                onProjectClick = { id -> navController.navigate(Routes.projectDetail(id)) },
                onProfileClick = { navController.navigate(Routes.PROFILE) },
                onBack = {
                    navController.navigate(Routes.LOGIN) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }

        composable(
            Routes.PROJECT_DETAIL,
            arguments = listOf(navArgument("projectId") { type = NavType.IntType })
        ) { back ->
            val projectId = back.arguments?.getInt("projectId") ?: 1
            ProjectDetailScreen(
                projectId = projectId,
                onBack    = { navController.popBackStack() },
                onAction  = { action -> navController.navigate(Routes.verification(projectId, action)) }
            )
        }

        composable(
            Routes.VERIFICATION,
            arguments = listOf(
                navArgument("projectId") { type = NavType.IntType },
                navArgument("action")    { type = NavType.StringType }
            )
        ) { back ->
            val projectId = back.arguments?.getInt("projectId") ?: 1
            val action    = back.arguments?.getString("action") ?: "entrada"
            VerificationScreen(
                onBack   = { navController.popBackStack() },
                onNfc    = { navController.navigate(Routes.nfcScan(projectId, action)) },
                onFacial = { navController.navigate(Routes.faceCapture(projectId, action)) }
            )
        }

        composable(
            Routes.NFC_SCAN,
            arguments = listOf(
                navArgument("projectId") { type = NavType.IntType },
                navArgument("action")    { type = NavType.StringType }
            )
        ) { back ->
            val projectId = back.arguments?.getInt("projectId") ?: 1
            val action    = back.arguments?.getString("action") ?: "entrada"
            NfcScanScreen(
                projectId = projectId,
                action    = action,
                onSuccess = {
                    navController.navigate(Routes.confirmation(projectId, action, "NFC")) {
                        popUpTo(Routes.PROJECT_LIST)
                    }
                },
                onCancel  = { navController.popBackStack() }
            )
        }

        composable(
            Routes.FACE_CAPTURE,
            arguments = listOf(
                navArgument("projectId") { type = NavType.IntType },
                navArgument("action")    { type = NavType.StringType }
            )
        ) { back ->
            val projectId = back.arguments?.getInt("projectId") ?: 1
            val action    = back.arguments?.getString("action") ?: "entrada"
            FaceCaptureScreen(
                projectId = projectId,
                action    = action,
                onSuccess = {
                    navController.navigate(Routes.confirmation(projectId, action, "Facial")) {
                        popUpTo(Routes.PROJECT_LIST)
                    }
                },
                onBack    = { navController.popBackStack() }
            )
        }

        composable(
            Routes.CONFIRMATION,
            arguments = listOf(
                navArgument("projectId") { type = NavType.IntType },
                navArgument("action")    { type = NavType.StringType },
                navArgument("method")    { type = NavType.StringType }
            )
        ) { back ->
            val projectId = back.arguments?.getInt("projectId") ?: 1
            val action    = back.arguments?.getString("action") ?: "entrada"
            val method    = back.arguments?.getString("method") ?: "NFC"
            ConfirmationScreen(
                projectId        = projectId,
                action           = action,
                method           = method,
                onBack           = { navController.popBackStack() },
                onVolverAsistencia = {
                    navController.popBackStack(Routes.PROJECT_LIST, inclusive = false)
                }
            )
        }

        composable(Routes.PROFILE) {
            ProfileScreen(
                onBack   = { navController.popBackStack() },
                onLogout = {
                    navController.navigate(Routes.LOGIN) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
    }
}
