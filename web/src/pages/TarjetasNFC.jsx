import { useState, useEffect, Fragment } from 'react';
import { Edit, Trash2, Plus, Search, X, AlertTriangle, CreditCard } from 'lucide-react';
import Toast from '../components/Toast';
import Pagination from '../components/Pagination';
import { apiFetch, PAGE_SIZE } from '../lib/api';

export default function TarjetasNFC() {
  const [tarjetas, setTarjetas] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTarjeta, setEditingTarjeta] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchTarjetas(); }, [page]);

  const fetchTarjetas = async () => {
    try {
      const res = await apiFetch(`/api/tarjetas-nfc?page=${page}&size=${PAGE_SIZE}`);
      if (res.ok) {
        const data = await res.json();
        setTarjetas(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch {
      setToast({ type: 'error', text: 'Error de conexión con el servidor' });
    }
  };

  const filtered = tarjetas.filter(t =>
    (t.nfcUid || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      const res = await apiFetch(`/api/tarjetas-nfc/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConfirmDeleteId(null);
        await fetchTarjetas();
        setToast({ type: 'success', text: 'Tarjeta eliminada correctamente' });
      } else {
        const err = await res.json().catch(() => ({}));
        setConfirmDeleteId(null);
        setToast({ type: 'error', text: err.message || 'No se puede eliminar: está asignada a un empleado' });
      }
    } catch {
      setConfirmDeleteId(null);
      setToast({ type: 'error', text: 'Error de conexión al eliminar' });
    }
  };

  const handleSave = async (data) => {
    const isEditing = !!editingTarjeta;
    const path = isEditing ? `/api/tarjetas-nfc/${editingTarjeta.id}` : `/api/tarjetas-nfc`;
    const payload = { nfcUid: data.nfcUid.trim(), status: data.status };

    try {
      const res = await apiFetch(path, {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchTarjetas();
        setShowModal(false);
        setEditingTarjeta(null);
        setToast({ type: 'success', text: isEditing ? 'Tarjeta actualizada' : 'Tarjeta creada correctamente' });
      } else {
        const err = await res.json().catch(() => ({}));
        setToast({ type: 'error', text: err.message || 'Error al guardar la tarjeta' });
      }
    } catch {
      setToast({ type: 'error', text: 'Error de conexión al guardar' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por UID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => { setEditingTarjeta(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          <span>Nueva Tarjeta NFC</span>
        </button>
      </div>

      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-base font-semibold text-gray-800">Tarjetas NFC registradas</h2>
        <p className="mt-2 text-sm text-gray-600">Gestione las tarjetas NFC disponibles para asignar a empleados.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">UID NFC</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No hay tarjetas registradas</td>
              </tr>
            ) : (
              filtered.map(t => (
                <Fragment key={t.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">{t.id}</td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-gray-400" />
                        {t.nfcUid}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        t.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {t.status ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {t.createdAt ? new Date(t.createdAt).toLocaleString('es-MX') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button onClick={() => { setEditingTarjeta(t); setShowModal(true); }} className="text-blue-600 hover:text-blue-800" title="Editar">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => setConfirmDeleteId(t.id)} className="text-red-600 hover:text-red-800" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {confirmDeleteId === t.id && (
                    <tr className="bg-red-50">
                      <td colSpan="5" className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                          <span className="text-sm text-red-700">¿Eliminar tarjeta <strong>{t.nfcUid}</strong>? Esta acción no se puede deshacer.</span>
                          <div className="flex gap-2 ml-auto">
                            <button onClick={() => setConfirmDeleteId(null)} className="px-3 py-1 text-sm border rounded-lg text-gray-600 hover:bg-gray-100">Cancelar</button>
                            <button onClick={() => handleDelete(t.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Eliminar</button>
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

      <Pagination page={page} totalPages={totalPages} totalElements={totalElements} size={PAGE_SIZE} onPageChange={setPage} />

      {showModal && (
        <TarjetaModal
          tarjeta={editingTarjeta}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingTarjeta(null); }}
        />
      )}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function TarjetaModal({ tarjeta, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nfcUid: tarjeta?.nfcUid || '',
    status: tarjeta?.status !== false,
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nfcUid.trim()) {
      setError('El UID NFC es requerido');
      return;
    }
    setError('');
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">{tarjeta ? 'Editar Tarjeta NFC' : 'Nueva Tarjeta NFC'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UID NFC</label>
              <input
                type="text"
                value={formData.nfcUid}
                onChange={(e) => { setFormData({ ...formData, nfcUid: e.target.value }); setError(''); }}
                placeholder="ej. 04:A2:B3:C4:D5:E6"
                className={`w-full border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-400' : ''}`}
                autoFocus
              />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>

            <div className="flex items-center justify-between border rounded-lg px-3 py-2">
              <span className="text-sm font-medium text-gray-700">Activa</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: !formData.status })}
                className={`w-11 h-6 rounded-full transition-colors relative ${formData.status ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.status ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="p-4 border-t flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{tarjeta ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
