function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel Principal</h1>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Proyectos Activos</p>
            <p className="text-3xl font-bold text-gray-800">12</p>
          </div>
          <div className="bg-blue-500 rounded-lg w-12 h-12"></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Empleados Activos</p>
            <p className="text-3xl font-bold text-gray-800">148</p>
          </div>
          <div className="bg-green-500 rounded-lg w-12 h-12"></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Asistencia de Hoy</p>
            <p className="text-3xl font-bold text-gray-800">134</p>
          </div>
          <div className="bg-purple-500 rounded-lg w-12 h-12"></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Frentes Activos</p>
            <p className="text-3xl font-bold text-gray-800">4</p>
          </div>
          <div className="bg-orange-500 rounded-lg w-12 h-12"></div>
        </div>
      </div>

      {/* Actividad reciente y estado de frentes */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Actividad Reciente</h2>
          {[
            { nombre: 'Juan Perez', detalle: 'Entrada registrada en Torre A', hora: '08:01 AM' },
            { nombre: 'Maria Garcia', detalle: 'Entrada registrada en Torre A', hora: '08:02 AM' },
            { nombre: 'Carlos Lopez', detalle: 'Entrada registrada en Torre A', hora: '08:03 AM' },
            { nombre: 'Sofia Martinez', detalle: 'Entrada registrada en Torre A', hora: '08:04 AM' },
            { nombre: 'Javier Hernandez', detalle: 'Entrada registrada en Torre A', hora: '08:05 AM' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-600">
                  {item.nombre.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.nombre}</p>
                  <p className="text-xs text-gray-500">{item.detalle}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{item.hora}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Estado de Frentes</h2>
          {[
            { nombre: 'Complejo Centro', porcentaje: 85 },
            { nombre: 'Parque Rio', porcentaje: 60 },
            { nombre: 'Nave Industrial Norte', porcentaje: 45 },
            { nombre: 'Centro Comercial Oeste', porcentaje: 20 },
          ].map((frente, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{frente.nombre}</span>
                <span className="text-gray-400">{frente.porcentaje}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${frente.porcentaje}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard