function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 rounded-2xl w-14 h-14 flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">W</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">WorkStamp</h1>
          <p className="text-gray-500 text-sm">Inicio de Sesión Administrativo</p>
        </div>

        {/* Formulario */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            placeholder="admin@workstamp.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Iniciar Sesión
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          ¿Olvidó su contraseña? Contacte al administrador.
        </p>
      </div>
    </div>
  )
}

export default Login