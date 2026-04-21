import { useState } from 'react';
import { Search, Download, Calendar, Filter, User, FolderOpen, Clock, MapPin } from 'lucide-react';

// Datos iniciales de asistencia
const initialRegistros = [
  { id: 1, empleado: 'Antonio Rodríguez', proyecto: 'Cimentación Torre A', tipo: 'Entrada', metodo: 'NFC', hora: '07:58 AM', fecha: '2026-02-11', fechaDisplay: 'Feb 11, 2026' },
  { id: 2, empleado: 'Maria Garcia', proyecto: 'Cimentación Torre A', tipo: 'Entrada', metodo: 'Facial', hora: '08:02 AM', fecha: '2026-02-11', fechaDisplay: 'Feb 11, 2026' },
  { id: 3, empleado: 'Sofia Martinez', proyecto: 'Nivelación Paisaje', tipo: 'Entrada', metodo: 'NFC', hora: '08:15 AM', fecha: '2026-02-11', fechaDisplay: 'Feb 11, 2026' },
  { id: 4, empleado: 'Antonio Rodríguez', proyecto: 'Cimentación Torre A', tipo: 'Salida', metodo: 'NFC', hora: '05:00 PM', fecha: '2026-02-10', fechaDisplay: 'Feb 10, 2026' },
  { id: 5, empleado: 'Maria Garcia', proyecto: 'Cimentación Torre A', tipo: 'Salida', metodo: 'Facial', hora: '05:10 PM', fecha: '2026-02-10', fechaDisplay: 'Feb 10, 2026' },
  { id: 6, empleado: 'Carlos Lopez', proyecto: 'Excavación Torre B', tipo: 'Entrada', metodo: 'NFC', hora: '07:45 AM', fecha: '2026-02-11', fechaDisplay: 'Feb 11, 2026' },
  { id: 7, empleado: 'Javier Hernandez', proyecto: 'Instalación de Juegos', tipo: 'Entrada', metodo: 'Facial', hora: '08:30 AM', fecha: '2026-02-11', fechaDisplay: 'Feb 11, 2026' },
];

// Lista de empleados y proyectos para filtros
const empleadosList = ['Todos', 'Antonio Rodríguez', 'Maria Garcia', 'Sofia Martinez', 'Carlos Lopez', 'Javier Hernandez'];
const proyectosList = ['Todos', 'Cimentación Torre A', 'Nivelación Paisaje', 'Excavación Torre B', 'Instalación de Juegos'];
const tiposList = ['Todos', 'Entrada', 'Salida'];
const metodosList = ['Todos', 'NFC', 'Facial'];

export default function Asistencia() {
  const [registros, setRegistros] = useState(initialRegistros);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState({
    empleado: 'Todos',
    proyecto: 'Todos',
    tipo: 'Todos',
    metodo: 'Todos',
    fechaInicio: '',
    fechaFin: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar registros
  const filteredRegistros = registros.filter(registro => {
    // Búsqueda por texto
    const matchesSearch = registro.empleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registro.proyecto.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por empleado
    const matchesEmpleado = filtros.empleado === 'Todos' || registro.empleado === filtros.empleado;
    
    // Filtro por proyecto
    const matchesProyecto = filtros.proyecto === 'Todos' || registro.proyecto === filtros.proyecto;
    
    // Filtro por tipo
    const matchesTipo = filtros.tipo === 'Todos' || registro.tipo === filtros.tipo;
    
    // Filtro por método
    const matchesMetodo = filtros.metodo === 'Todos' || registro.metodo === filtros.metodo;
    
    // Filtro por fechas
    let matchesFecha = true;
    if (filtros.fechaInicio && registro.fecha < filtros.fechaInicio) matchesFecha = false;
    if (filtros.fechaFin && registro.fecha > filtros.fechaFin) matchesFecha = false;
    
    return matchesSearch && matchesEmpleado && matchesProyecto && matchesTipo && matchesMetodo && matchesFecha;
  });

  // Exportar reporte a CSV
  const exportarReporte = () => {
    const escaparCampo = (valor) => {
      const str = String(valor ?? '');
      // Si contiene coma, comilla o salto de línea, envolver en comillas dobles
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ['Empleado', 'Proyecto', 'Tipo', 'Método', 'Hora', 'Fecha'];
    const csvData = filteredRegistros.map(r => [
      r.empleado,
      r.proyecto,
      r.tipo,
      r.metodo,
      r.hora,
      r.fechaDisplay,
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(escaparCampo).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_asistencia_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Obtener color según tipo
  const getTipoColor = (tipo) => {
    return tipo === 'Entrada' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  // Obtener color según método
  const getMetodoColor = (metodo) => {
    return metodo === 'NFC' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header con título y exportar */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Registro de Asistencia</h2>
          <p className="text-sm text-gray-500">Todos los Proyectos</p>
        </div>
        <button
          onClick={exportarReporte}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download size={18} />
          <span>Exportar Reporte</span>
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="p-4 border-b">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar empleado o proyecto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-500 text-blue-600' : 'hover:bg-gray-50'
            }`}
          >
            <Filter size={18} />
            <span>Filtros</span>
          </button>
        </div>

        {/* Panel de filtros avanzados */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
            {/* Fila 1: selects */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Empleado</label>
                <select
                  value={filtros.empleado}
                  onChange={(e) => setFiltros({ ...filtros, empleado: e.target.value })}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {empleadosList.map(emp => (
                    <option key={emp} value={emp}>{emp}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Proyecto</label>
                <select
                  value={filtros.proyecto}
                  onChange={(e) => setFiltros({ ...filtros, proyecto: e.target.value })}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {proyectosList.map(proj => (
                    <option key={proj} value={proj}>{proj}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
                <select
                  value={filtros.tipo}
                  onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tiposList.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Método</label>
                <select
                  value={filtros.metodo}
                  onChange={(e) => setFiltros({ ...filtros, metodo: e.target.value })}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {metodosList.map(metodo => (
                    <option key={metodo} value={metodo}>{metodo}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Fila 2: fechas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
                <input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
                <input
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de registros */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empleado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRegistros.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No hay registros de asistencia
                </td>
              </tr>
            ) : (
              filteredRegistros.map((registro) => (
                <tr key={registro.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      {registro.empleado}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <FolderOpen size={16} className="text-gray-400" />
                      {registro.proyecto}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(registro.tipo)}`}>
                      {registro.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMetodoColor(registro.metodo)}`}>
                      {registro.metodo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      {registro.hora}
                    </div>
                   </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {registro.fechaDisplay}
                   </td>
                 </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con contador */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Mostrando {filteredRegistros.length} de {registros.length} registros
          </span>
          <button
            onClick={() => {
              setSearchTerm('');
              setFiltros({
                empleado: 'Todos',
                proyecto: 'Todos',
                tipo: 'Todos',
                metodo: 'Todos',
                fechaInicio: '',
                fechaFin: ''
              });
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
