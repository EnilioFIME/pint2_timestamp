import { useState, useEffect } from 'react';
import { Search, Download, Filter, User, FolderOpen, Clock } from 'lucide-react';
import Pagination from '../components/Pagination';
import { apiFetch, PAGE_SIZE } from '../lib/api';

const ESTADOS = ['Todos', 'Completada', 'En Curso', 'Inconsistente'];
const METODOS = ['Todos', 'NFC', 'Facial'];

export default function Asistencia() {
  const [registros, setRegistros] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState({
    estado: 'Todos',
    metodo: 'Todos',
    fechaInicio: '',
    fechaFin: '',
  });

  useEffect(() => { fetchAsistencias(); }, [page]);

  const fetchAsistencias = async () => {
    const params = new URLSearchParams();
    if (filtros.fechaInicio) params.set('fechaDesde', filtros.fechaInicio);
    if (filtros.fechaFin) params.set('fechaHasta', filtros.fechaFin);
    params.set('page', page);
    params.set('size', PAGE_SIZE);

    try {
      const res = await apiFetch(`/api/asistencias?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRegistros(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch {
      console.error('Error al cargar asistencias');
    }
  };

  const filteredRegistros = registros.filter((r) => {
    const nombreEmpleado = r.usuario ? `${r.usuario.nombre} ${r.usuario.apellido}` : '';
    const nombreProyecto = r.proyecto?.nombre || '';
    const term = searchTerm.toLowerCase();

    const matchesSearch = nombreEmpleado.toLowerCase().includes(term) || nombreProyecto.toLowerCase().includes(term);
    const matchesEstado = filtros.estado === 'Todos' || r.estado === filtros.estado;
    const matchesMetodo = filtros.metodo === 'Todos' || r.tipoVerificacion === filtros.metodo;

    return matchesSearch && matchesEstado && matchesMetodo;
  });

  const aplicarFiltros = () => {
    if (page !== 0) setPage(0);
    else fetchAsistencias();
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setFiltros({ estado: 'Todos', metodo: 'Todos', fechaInicio: '', fechaFin: '' });
    setPage(0);
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
  };

  const exportarReporte = () => {
    const escapar = (v) => {
      const s = String(v ?? '');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const headers = ['Empleado', 'No. Empleado', 'Proyecto', 'Entrada', 'Salida', 'Estado', 'Horas', 'Método'];
    const rows = filteredRegistros.map(r => [
      r.usuario ? `${r.usuario.nombre} ${r.usuario.apellido}` : '',
      r.usuario?.numeroEmpleado || '',
      r.proyecto?.nombre || '',
      formatDateTime(r.entrada),
      formatDateTime(r.salida),
      r.estado || '',
      r.horasTotales ?? '',
      r.tipoVerificacion || '',
    ]);
    const csv = [headers, ...rows].map(row => row.map(escapar).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asistencia_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Completada': return 'bg-green-100 text-green-800';
      case 'En Curso': return 'bg-blue-100 text-blue-800';
      case 'Inconsistente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetodoColor = (m) =>
    m === 'NFC' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Registro de Asistencia</h2>
          <p className="text-sm text-gray-500">Sesiones de trabajo por empleado y proyecto</p>
        </div>
        <button
          onClick={exportarReporte}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download size={18} />
          <span>Exportar Reporte</span>
        </button>
      </div>

      <div className="p-4 border-b">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-blue-50 border-blue-500 text-blue-600' : 'hover:bg-gray-50'}`}
          >
            <Filter size={18} />
            <span>Filtros</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
                <select
                  value={filtros.estado}
                  onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Método</label>
                <select
                  value={filtros.metodo}
                  onChange={(e) => setFiltros({ ...filtros, metodo: e.target.value })}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {METODOS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
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
            <button
              onClick={aplicarFiltros}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Aplicar filtros de fecha
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empleado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entrada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salida</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRegistros.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No hay registros de asistencia</td>
              </tr>
            ) : (
              filteredRegistros.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <p>{r.usuario ? `${r.usuario.nombre} ${r.usuario.apellido}` : '—'}</p>
                        {r.usuario?.numeroEmpleado && (
                          <p className="text-xs text-gray-400">{r.usuario.numeroEmpleado}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <FolderOpen size={16} className="text-gray-400" />
                      {r.proyecto?.nombre || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-400" />
                      {formatDateTime(r.entrada)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{formatDateTime(r.salida)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(r.estado)}`}>
                      {r.estado || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {r.horasTotales != null ? `${r.horasTotales}h` : '—'}
                  </td>
                  <td className="px-6 py-4">
                    {r.tipoVerificacion ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMetodoColor(r.tipoVerificacion)}`}>
                        {r.tipoVerificacion}
                      </span>
                    ) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 pt-3 border-t bg-gray-50 flex justify-end">
        <button onClick={limpiarFiltros} className="text-sm text-blue-600 hover:text-blue-700">
          Limpiar filtros
        </button>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        size={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}
