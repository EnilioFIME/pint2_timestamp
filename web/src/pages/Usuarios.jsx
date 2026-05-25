import { useState, useEffect, Fragment } from 'react';
import { Search, Plus, Edit, Trash2, X, Mail, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Toast from '../components/Toast';
import Pagination from '../components/Pagination';
import { apiFetch, PAGE_SIZE } from '../lib/api';

// UI muestra "Verificador" pero la BD usa "Checador"
const ROLES_UI = ['Administrador', 'Verificador'];
const toDbRol = (uiRol) => uiRol === 'Verificador' ? 'Checador' : uiRol;
const toUiRol = (dbRol) => dbRol === 'Checador' ? 'Verificador' : dbRol;

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchUsuarios(); }, [page]);

  const fetchUsuarios = async () => {
    try {
      const res = await apiFetch(`/api/usuarios?rol=Administrador&rol=Checador&page=${page}&size=${PAGE_SIZE}`);
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch {
      setToast({ type: 'error', text: 'Error de conexión con el servidor' });
    }
  };

  const filteredUsuarios = usuarios.filter(u => {
    const term = searchTerm.toLowerCase();
    return (u.email || '').toLowerCase().includes(term) ||
           toUiRol(u.rol).toLowerCase().includes(term) ||
           `${u.nombre} ${u.apellido}`.toLowerCase().includes(term);
  });

  const handleDelete = async (id) => {
    try {
      const res = await apiFetch(`/api/usuarios/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConfirmDeleteId(null);
        await fetchUsuarios();
        setToast({ type: 'success', text: 'Usuario eliminado correctamente' });
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
    const isEditing = !!editingUser;
    const path = isEditing ? `/api/usuarios/${editingUser.id}` : `/api/usuarios`;

    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      numeroEmpleado: formData.numeroEmpleado,
      email: formData.email,
      rol: toDbRol(formData.rol),
      status: formData.status,
      tarjetaNFC: null,
      datoBiometrico: null,
    };

    try {
      const res = await apiFetch(path, {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchUsuarios();
        setShowModal(false);
        setEditingUser(null);
        setToast({ type: 'success', text: isEditing ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente' });
      } else {
        const err = await res.json().catch(() => ({}));
        setToast({ type: 'error', text: err.message || 'Error al guardar el usuario' });
      }
    } catch {
      setToast({ type: 'error', text: 'Error de conexión al guardar' });
    }
  };

  const getEstadoColor = (status) =>
    status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  const getRolColor = (rol) =>
    rol === 'Administrador' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Gestión de Usuarios</h2>
            <p className="text-sm text-gray-500">Administre los administradores y verificadores</p>
          </div>
          <button
            onClick={() => { setEditingUser(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-b">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por correo, nombre o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo Electrónico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último Acceso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsuarios.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No hay usuarios registrados</td>
              </tr>
            ) : (
              filteredUsuarios.map((usuario) => (
                <Fragment key={usuario.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{usuario.nombre} {usuario.apellido}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span className="text-gray-900">{usuario.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRolColor(usuario.rol)}`}>
                        <Shield size={12} />
                        {toUiRol(usuario.rol)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(usuario.status)}`}>
                        {usuario.status ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {usuario.status ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {usuario.updatedAt ? new Date(usuario.updatedAt).toLocaleString('es-MX') : 'Nunca'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button onClick={() => { setEditingUser(usuario); setShowModal(true); }} className="text-blue-600 hover:text-blue-800" title="Editar">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => setConfirmDeleteId(usuario.id)} className="text-red-600 hover:text-red-800" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {confirmDeleteId === usuario.id && (
                    <tr className="bg-red-50">
                      <td colSpan="6" className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                          <span className="text-sm text-red-700">¿Eliminar a <strong>{usuario.email}</strong>? Esta acción no se puede deshacer.</span>
                          <div className="flex gap-2 ml-auto">
                            <button onClick={() => setConfirmDeleteId(null)} className="px-3 py-1 text-sm border rounded-lg text-gray-600 hover:bg-gray-100">Cancelar</button>
                            <button onClick={() => handleDelete(usuario.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Eliminar</button>
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
        <UserModal
          user={editingUser}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingUser(null); }}
        />
      )}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function UserModal({ user, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    numeroEmpleado: user?.numeroEmpleado || '',
    email: user?.email || '',
    rol: toUiRol(user?.rol) || 'Verificador',
    status: user?.status !== false,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const e = {};
    if (!formData.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) e.apellido = 'El apellido es requerido';
    if (!formData.numeroEmpleado.trim()) e.numeroEmpleado = 'El número de empleado es requerido';
    if (!formData.email) e.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Correo inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) onSave(formData);
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
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">{user ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            {field('Nombre', 'nombre', 'ej. Juan')}
            {field('Apellido', 'apellido', 'ej. Pérez')}
            {field('Número de Empleado', 'numeroEmpleado', 'ej. ADM001')}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: undefined }); }}
                  placeholder="ejemplo@workstamp.com"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <div className="relative">
                <Shield size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ROLES_UI.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
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
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{user ? 'Actualizar' : 'Crear Usuario'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
