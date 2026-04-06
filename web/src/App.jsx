import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      
      {/* Rutas con Layout */}
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/frentes" element={<Layout><div>Frentes próximamente</div></Layout>} />
      <Route path="/proyectos" element={<Layout><div>Proyectos próximamente</div></Layout>} />
      <Route path="/empleados" element={<Layout><div>Empleados próximamente</div></Layout>} />
      <Route path="/asistencia" element={<Layout><div>Asistencia próximamente</div></Layout>} />
      <Route path="/geocerca" element={<Layout><div>Geocerca próximamente</div></Layout>} />
      <Route path="/usuarios" element={<Layout><div>Usuarios próximamente</div></Layout>} />
    </Routes>
  )
}

export default App