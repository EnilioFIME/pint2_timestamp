import { useState, useEffect } from 'react';
import { FileText, User, FolderOpen, Clock } from 'lucide-react';
import Pagination from '../components/Pagination';
import { apiFetch, PAGE_SIZE } from '../lib/api';

export default function Registros() {
  const [registros, setRegistros] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [usuarios, setUsuarios] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [filtros, setFiltros] = useState({ idUsuario: '', idProyecto: '' });
  const [aplicados, setAplicados] = useState({ idUsuario: '', idProyecto: '' });

  // Carga de catálogos para los selectores de filtro
  useEffect(() => {
    (async () => {
      try {
        const [resU, resP] = await Promise.all([
          apiFetch('/api/usuarios?page=0&size=200'),
          apiFetch('/api/proyectos?page=0&size=200'),
        ]);
        if (resU.ok) setUsuarios((await resU.json()).content || []);
        if (resP.ok) setProyectos((await resP.json()).content || []);
      } catch {
        // catálogos opcionales — si fallan, los selectores aparecen vacíos
      }
    })();
  }, []);

  useEffect(() => { fetchRegistros(); }, [page, aplicados]);

  const fetchRegistros = async () => {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('size', PAGE_SIZE);
    if (aplicados.idUsuario) params.set('idUsuario', aplicados.idUsuario);
    if (aplicados.idProyecto) params.set('idProyecto', aplicados.idProyecto);

    try {
      const res = await apiFetch(`/api/registros?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRegistros(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch {
      // toast omitido a propósito — la página es solo lectura
      console.error('Error al cargar registros');
    }
  };

  const aplicarFiltros = () => {
    setPage(0);
    setAplicados({ ...filtros });
  };

  const limpiarFiltros = () => {
    setFiltros({ idUsuario: '', idProyecto: '' });
    setAplicados({ idUsuario: '', idProyecto: '' });
    setPage(0);
  };

  const formatDateTime = (iso) => iso ? new Date(iso).toLocaleString('es-MX') : '—';

  const tipoBadge = (tipo) =>
    tipo === 'Entrada' ? 'bg-green-100 text-green-800' :
    tipo === 'Salida'  ? 'bg-blue-100 text-blue-800'  : 'bg-gray-100 text-gray-800';

  const metodoBadge = (m) =>
    m === 'NFC'        ? 'bg-blue-100 text-blue-800' :
    m === 'Biometrico' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-1">
          <FileText size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Registros NFC / Biométricos</h2>
        </div>
        <p className="text-sm text-gray-500">Eventos individuales registrados por la app móvil al verificar entrada o salida.</p>
      </div>

      <div className="p-4 border-b bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Usuario</label>
            <select
              value={filtros.idUsuario}
              onChange={(e) => setFiltros({ ...filtros, idUsuario: e.target.value })}
              className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>{u.nombre} {u.apellido} ({u.numeroEmpleado})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Proyecto</label>
            <select
              value={filtros.idProyecto}
              onChange={(e) => setFiltros({ ...filtros, idProyecto: e.target.value })}
              className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {proyectos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={aplicarFiltros}
              className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Aplicar filtros
            </button>
            <button
              onClick={limpiarFiltros}
              className="px-3 py-1.5 text-sm border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confianza</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {registros.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No hay registros</td>
              </tr>
            ) : (
              registros.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      {formatDateTime(r.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium">
                          {r.usuario ? `${r.usuario.nombre} ${r.usuario.apellido}` : '—'}
                        </p>
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
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipoBadge(r.tipoRegistro)}`}>
                      {r.tipoRegistro || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${metodoBadge(r.tipoVerificacion)}`}>
                      {r.tipoVerificacion || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {r.confianza != null ? `${r.confianza}%` : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} totalElements={totalElements} size={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}
