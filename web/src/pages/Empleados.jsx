import { useState, useEffect, Fragment } from 'react';
import { Edit, Trash2, Plus, Search, X, Smartphone, Fingerprint, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Toast from '../components/Toast';

const BASE = import.meta.env.VITE_BACKEND_BASE_URL;

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchEmpleados(); }, []);

  const fetchEmpleados = async () => {
    try {
      const res = await fetch(`${BASE}/api/usuarios?rol=Empleado`);
      if (res.ok) setEmpleados(await res.json());
    } catch {
      setToast({ type: 'error', text: 'Error de conexión con el servidor' });
    }
  };

  const filteredEmpleados = empleados.filter(e => {
    const nombreCompleto = `${e.nombre} ${e.apellido}`.toLowerCase();
    const term = searchTerm.toLowerCase();
    return nombreCompleto.includes(term) || (e.numeroEmpleado || '').toLowerCase().includes(term);
  });

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE}/api/usuarios/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConfirmDeleteId(null);
        await fetchEmpleados();
        setToast({ type: 'success', text: 'Empleado eliminado correctamente' });
      } else {
        const err = await res.json().catch(() => ({}));
        setConfirmDeleteId(null);
        setToast({ type: 'error', text: err.message || 'No se puede eliminar: tiene registros asociados' });
      }
    } catch {
      setConfirmDeleteId(null);
      setToast({ type: 'error', text: 'Error de conexión al eliminar' });
    }
  };

  const handleSave = async (formData) => {
    const isEditing = !!editingEmpleado;
    const url = isEditing ? `${BASE}/api/usuarios/${editingEmpleado.id}` : `${BASE}/api/usuarios`;

    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      numeroEmpleado: formData.numeroEmpleado,
      rol: 'Empleado',
      email: null,
      status: formData.status,
      tarjetaNFC: formData.idTarjetaNFC ? { id: parseInt(formData.idTarjetaNFC) } : null,
      datoBiometrico: formData.idDatoBiometrico ? { id: parseInt(formData.idDatoBiometrico) } : null,
    };

    try {
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchEmpleados();
        setShowModal(false);
        setEditingEmpleado(null);
        setToast({ type: 'success', text: isEditing ? 'Empleado actualizado' : 'Empleado registrado correctamente' });
      } else {
        const err = await res.json().catch(() => ({}));
        setToast({ type: 'error', text: err.message || 'Error al guardar el empleado' });
      }
    } catch {
      setToast({ type: 'error', text: 'Error de conexión al guardar' });
    }
  };

  const renderBadge = (tiene) => {
    return tiene
      ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"><CheckCircle size={12} /> Asignado</span>
      : <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800"><XCircle size={12} /> Faltante</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => { setEditingEmpleado(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Agregar Empleado</span>
        </button>
      </div>

      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-base font-semibold text-gray-800">Administre los registros de empleados y métodos de acceso</h2>
        <p className="mt-2 text-sm text-gray-600">Aquí puede revisar, editar o eliminar empleados y verificar sus accesos por NFC y biométrico.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NFC</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Biométrico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEmpleados.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No hay empleados registrados</td>
              </tr>
            ) : (
              filteredEmpleados.map((emp) => (
                <Fragment key={emp.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">{emp.numeroEmpleado}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{emp.nombre} {emp.apellido}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {emp.status ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{renderBadge(!!emp.tarjetaNFC)}</td>
                    <td className="px-6 py-4">{renderBadge(!!emp.datoBiometrico)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button onClick={() => { setEditingEmpleado(emp); setShowModal(true); }} className="text-blue-600 hover:text-blue-800" title="Editar">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => setConfirmDeleteId(emp.id)} className="text-red-600 hover:text-red-800" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {confirmDeleteId === emp.id && (
                    <tr className="bg-red-50">
                      <td colSpan="6" className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                          <span className="text-sm text-red-700">¿Eliminar a <strong>{emp.nombre} {emp.apellido}</strong>? Esta acción no se puede deshacer.</span>
                          <div className="flex gap-2 ml-auto">
                            <button onClick={() => setConfirmDeleteId(null)} className="px-3 py-1 text-sm border rounded-lg text-gray-600 hover:bg-gray-100">Cancelar</button>
                            <button onClick={() => handleDelete(emp.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Eliminar</button>
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

      {showModal && (
        <EmpleadoModal
          empleado={editingEmpleado}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingEmpleado(null); }}
        />
      )}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function EmpleadoModal({ empleado, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nombre: empleado?.nombre || '',
    apellido: empleado?.apellido || '',
    numeroEmpleado: empleado?.numeroEmpleado || '',
    status: empleado?.status !== false,
    idTarjetaNFC: empleado?.tarjetaNFC?.id?.toString() || '',
    idDatoBiometrico: empleado?.datoBiometrico?.id?.toString() || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) e.apellido = 'El apellido es requerido';
    if (!formData.numeroEmpleado.trim()) e.numeroEmpleado = 'El número de empleado es requerido';
    if (!formData.idTarjetaNFC) e.idTarjetaNFC = 'Requerido (Empleados deben tener NFC)';
    if (!formData.idDatoBiometrico) e.idDatoBiometrico = 'Requerido (Empleados deben tener biométrico)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSave(formData);
  };

  const field = (label, key, placeholder, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={formData[key]}
        onChange={(e) => { setFormData({ ...formData, [key]: e.target.value }); setErrors({ ...errors, [key]: undefined }); }}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[key] ? 'border-red-400' : ''}`}
      />
      {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">{empleado ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            {field('Nombre', 'nombre', 'ej. Juan')}
            {field('Apellido', 'apellido', 'ej. Pérez')}
            {field('Número de Empleado', 'numeroEmpleado', 'ej. EMP001')}

            <div className="border-t pt-3 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Smartphone size={16} /> <span>IDs de acceso (requeridos para empleados)</span>
              </div>
              {field('ID Tarjeta NFC', 'idTarjetaNFC', 'Número ID de la tarjeta NFC', 'number')}
              {field('ID Dato Biométrico', 'idDatoBiometrico', 'Número ID del dato biométrico', 'number')}
            </div>

            <div className="flex items-center justify-between border rounded-lg px-3 py-2">
              <span className="text-sm font-medium text-gray-700">Estado activo</span>
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
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{empleado ? 'Actualizar' : 'Registrar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
