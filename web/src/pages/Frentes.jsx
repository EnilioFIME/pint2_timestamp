import { useState, useEffect, Fragment } from 'react';
import { Edit, Trash2, Plus, Search, X, AlertTriangle } from 'lucide-react';
import Toast from '../components/Toast';
import Pagination from '../components/Pagination';
import { apiFetch, PAGE_SIZE } from '../lib/api';

export default function Frentes() {
  const [frentes, setFrentes] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFrente, setEditingFrente] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchFrentes(); }, [page]);

  const fetchFrentes = async () => {
    try {
      const res = await apiFetch(`/api/frentes?page=${page}&size=${PAGE_SIZE}`);
      if (res.ok) {
        const data = await res.json();
        setFrentes(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (error) {
      console.error('Error al cargar frentes:', error);
      setToast({ type: 'error', text: 'Error de conexión con el servidor' });
    }
  };

  const filteredFrentes = frentes.filter(frente =>
    frente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      const res = await apiFetch(`/api/frentes/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setConfirmDeleteId(null);
        await fetchFrentes();
        setToast({ type: 'success', text: 'Frente eliminado correctamente' });
      } else {
        const err = await res.json().catch(() => ({}));
        setConfirmDeleteId(null);
        setToast({ type: 'error', text: err.message || 'No se puede eliminar: tiene proyectos asociados' });
      }
    } catch {
      setConfirmDeleteId(null);
      setToast({ type: 'error', text: 'Error de conexión al eliminar' });
    }
  };

  const handleSave = async (frenteData) => {
    const isEditing = !!editingFrente;
    const method = isEditing ? 'PUT' : 'POST';
    const path = isEditing ? `/api/frentes/${editingFrente.id}` : `/api/frentes`;

    // Transformación: React usa Texto ('Activo'/'Inactivo'), BD usa booleano
    const payload = {
      nombre: frenteData.nombre,
      status: frenteData.estado === 'Activo'
    };

    try {
      const res = await apiFetch(path, {
        method,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchFrentes();
        setShowModal(false);
        setEditingFrente(null);
        setToast({ type: 'success', text: isEditing ? 'Frente actualizado correctamente' : 'Frente agregado correctamente' });
      }
    } catch (error) {
      setToast({ type: 'error', text: 'Error al guardar el frente' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar frente de obra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => { setEditingFrente(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Agregar Frente</span>
        </button>
      </div>

      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-base font-semibold text-gray-800">Administre sus sitios de construcción y ubicaciones</h2>
        <p className="mt-2 text-sm text-gray-600">Desde aquí puede agregar, editar o eliminar frentes de obra y su información de ubicación.</p>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredFrentes.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No hay frentes de obra registrados
                </td>
              </tr>
            ) : (
              filteredFrentes.map((frente) => (
                <Fragment key={frente.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{frente.nombre}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        frente.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {frente.status ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setEditingFrente(frente); setShowModal(true); }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(frente.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {confirmDeleteId === frente.id && (
                    <tr key={`confirm-${frente.id}`} className="bg-red-50">
                      <td colSpan="4" className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                          <span className="text-sm text-red-700">
                            ¿Eliminar <strong>{frente.nombre}</strong>? Esta acción no se puede deshacer.
                          </span>
                          <div className="flex gap-2 ml-auto">
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-3 py-1 text-sm border rounded-lg text-gray-600 hover:bg-gray-100"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleDelete(frente.id)}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        size={PAGE_SIZE}
        onPageChange={setPage}
      />

      {showModal && (
        <FrenteModal
          frente={editingFrente}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingFrente(null); }}
        />
      )}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function FrenteModal({ frente, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nombre: frente?.nombre || '',
    estado: frente?.status === false ? 'Inactivo' : 'Activo',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setError('El nombre del frente es requerido');
      return;
    }
    setError('');
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {frente ? 'Editar Frente de Obra' : 'Agregar Nuevo Frente de Obra'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Frente</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => { setFormData({ ...formData, nombre: e.target.value }); setError(''); }}
                placeholder="ej. Centro Comercial Oeste"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-400' : ''}`}
                autoFocus
              />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="p-4 border-t flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {frente ? 'Actualizar Frente' : 'Agregar Frente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
