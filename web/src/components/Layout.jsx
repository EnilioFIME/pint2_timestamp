import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Layout({ children }) {
  const navigate = useNavigate()
  const { username, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const initials = (username || 'AD').slice(0, 2).toUpperCase()

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
      isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'
    }`

  return (
    <div className="flex h-screen bg-gray-100">

      <aside className="w-48 bg-white shadow-md flex flex-col justify-between py-6 px-4">

        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-blue-600 rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-white text-sm font-bold">W</span>
            </div>
            <span className="font-bold text-gray-800">WorkStamp</span>
          </div>

          <nav className="flex flex-col gap-1">
            <NavLink to="/dashboard" className={linkClass}>Inicio</NavLink>

            <p className="text-xs text-gray-400 mt-4 mb-1 px-3">GESTIÓN</p>
            <NavLink to="/frentes" className={linkClass}>Frentes de Obra</NavLink>
            <NavLink to="/proyectos" className={linkClass}>Proyectos</NavLink>
            <NavLink to="/empleados" className={linkClass}>Empleados</NavLink>

            <p className="text-xs text-gray-400 mt-4 mb-1 px-3">OPERACIONES</p>
            <NavLink to="/asistencia" className={linkClass}>Asistencia</NavLink>
            <NavLink to="/registros" className={linkClass}>Registros NFC/Bio</NavLink>
            <NavLink to="/geocerca" className={linkClass}>Geocerca</NavLink>

            <p className="text-xs text-gray-400 mt-4 mb-1 px-3">ACCESOS</p>
            <NavLink to="/tarjetas-nfc" className={linkClass}>Tarjetas NFC</NavLink>
            <NavLink to="/datos-biometricos" className={linkClass}>Datos Biométricos</NavLink>

            <p className="text-xs text-gray-400 mt-4 mb-1 px-3">SISTEMA</p>
            <NavLink to="/usuarios" className={linkClass}>Usuarios y Roles</NavLink>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-500"
        >
          Cerrar Sesión
        </button>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">

        <header className="bg-white shadow-sm px-8 py-4 flex justify-end items-center">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{username || 'Admin'}</span>
            <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
