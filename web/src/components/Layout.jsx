import { NavLink, useNavigate } from 'react-router-dom'

function Layout({ children }) {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-48 bg-white shadow-md flex flex-col justify-between py-6 px-4">
        
        {/* Logo */}
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-blue-600 rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-white text-sm font-bold">W</span>
            </div>
            <span className="font-bold text-gray-800">WorkStamp</span>
          </div>

          {/* Navegación */}
          <nav className="flex flex-col gap-1">
            <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              Inicio
            </NavLink>

            <p className="text-xs text-gray-400 mt-4 mb-1 px-3">GESTIÓN</p>
            <NavLink to="/frentes" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              Frentes de Obra
            </NavLink>
            <NavLink to="/proyectos" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              Proyectos
            </NavLink>
            <NavLink to="/empleados" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              Empleados
            </NavLink>

            <p className="text-xs text-gray-400 mt-4 mb-1 px-3">OPERACIONES</p>
            <NavLink to="/asistencia" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              Asistencia
            </NavLink>
            <NavLink to="/geocerca" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              Geocerca
            </NavLink>

            <p className="text-xs text-gray-400 mt-4 mb-1 px-3">SISTEMA</p>
            <NavLink to="/usuarios" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              Usuarios y Roles
            </NavLink>
          </nav>
        </div>

        {/* Cerrar sesión */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-500"
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Navbar */}
        <header className="bg-white shadow-sm px-8 py-4 flex justify-end items-center">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Admin</span>
            <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-white text-xs font-bold">AD</span>
            </div>
          </div>
        </header>

        {/* Página actual */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout