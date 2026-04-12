import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Frentes from './pages/Frentes'
import Proyectos from './pages/Proyectos'
import Empleados from './pages/Empleados'
import Asistencia from './pages/Asistencia'
import Geocerca from './pages/Geocerca'
import Usuarios from './pages/Usuarios'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      
      {/* Rutas con Layout */}
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/frentes" element={<Layout><Frentes /></Layout>} />
      <Route path="/proyectos" element={<Layout><Proyectos /></Layout>} />
      <Route path="/empleados" element={<Layout><Empleados /></Layout>} />
      <Route path="/asistencia" element={<Layout><Asistencia /></Layout>} />
      <Route path="/geocerca" element={<Layout><Geocerca /></Layout>} />
      <Route path="/usuarios" element={<Layout><Usuarios /></Layout>} />
    </Routes>
  )
}

export default App