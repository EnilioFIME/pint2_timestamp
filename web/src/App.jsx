import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Frentes from './pages/Frentes'
import Proyectos from './pages/Proyectos'
import Empleados from './pages/Empleados'
import Asistencia from './pages/Asistencia'
import Geocerca from './pages/Geocerca'
import Usuarios from './pages/Usuarios'
import TarjetasNFC from './pages/TarjetasNFC'
import DatosBiometricos from './pages/DatosBiometricos'
import Registros from './pages/Registros'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/frentes" element={<Protected><Frentes /></Protected>} />
        <Route path="/proyectos" element={<Protected><Proyectos /></Protected>} />
        <Route path="/empleados" element={<Protected><Empleados /></Protected>} />
        <Route path="/asistencia" element={<Protected><Asistencia /></Protected>} />
        <Route path="/geocerca" element={<Protected><Geocerca /></Protected>} />
        <Route path="/usuarios" element={<Protected><Usuarios /></Protected>} />
        <Route path="/tarjetas-nfc" element={<Protected><TarjetasNFC /></Protected>} />
        <Route path="/datos-biometricos" element={<Protected><DatosBiometricos /></Protected>} />
        <Route path="/registros" element={<Protected><Registros /></Protected>} />
      </Routes>
    </AuthProvider>
  )
}

export default App
