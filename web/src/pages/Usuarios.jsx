import { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Mail, Shield, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

// Datos de ejemplo
const initialUsuarios = [
  { id: 1, email: 'admin@workstamp.com', rol: 'Administrador', estado: 'Activo', ultimoAcceso: '2026-02-11 09:30 AM' },
  { id: 2, email: 'checker1@workstamp.com', rol: 'Verificador', estado: 'Activo', ultimoAcceso: '2026-02-10 03:15 PM' },
  { id: 3, email: 'supervisor@workstamp.com', rol: 'Administrador', estado: 'Inactivo', ultimoAcceso: '2026-02-05 11:20 AM' },
];

// Opciones para selects
const rolesOptions = ['Administrador', 'Verificador'];
const estadosOptions = ['Activo', 'Inactivo'];

export default function Usuarios() {
  // Estados del componente
  const [usuarios, setUsuarios] = useState(initialUsuarios);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Filtra usuarios por texto de busqueda
  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Elimina un usuario
  const handleDelete = (id) => {
    if (confirm('Seguro que deseas eliminar este usuario?')) {
      setUsuarios(usuarios.filter(usuario => usuario.id !== id));
    }
  };

  // Guarda usuario nuevo o editado
  const handleSave = (usuarioData) => {
    if (editingUser) {
      // Editar existente
      setUsuarios(usuarios.map(u => 
        u.id === editingUser.id ? { ...usuarioData, id: editingUser.id, ultimoAcceso: u.ultimoAcceso } : u
      ));
    } else {
      // Crear nuevo
      const newUser = {
        ...usuarioData,
        id: Date.now(),
        ultimoAcceso: 'Nunca'
      };
      setUsuarios([...usuarios, newUser]);
    }
    setShowModal(false);
    setEditingUser(null);
  };

  // Colores segun estado
  const getEstadoColor = (estado) => {
    return estado === 'Activo' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  // Colores segun rol
  const getRolColor = (rol) => {
    return rol === 'Administrador'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Cabecera */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Gestion de Usuarios</h2>
            <p className="text-sm text-gray-500">Administre los administradores y verificadores</p>
          </div>
          <button
            onClick={() => {
              setEditingUser(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por correo o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo Electronico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ultimo Acceso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsuarios.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              filteredUsuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-900">{usuario.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRolColor(usuario.rol)}`}>
                      <Shield size={12} />
                      {usuario.rol}
                    </span>
                   </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(usuario.estado)}`}>
                      {usuario.estado === 'Activo' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {usuario.estado}
                    </span>
                   </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {usuario.ultimoAcceso}
                   </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingUser(usuario);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(usuario.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                   </td>
                 </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pie de tabla con contadores */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Total: {usuarios.length} usuarios
          </span>
          <div className="flex gap-4">
            <span className="text-xs text-gray-500">
              Administradores: {usuarios.filter(u => u.rol === 'Administrador').length}
            </span>
            <span className="text-xs text-gray-500">
              Verificadores: {usuarios.filter(u => u.rol === 'Verificador').length}
            </span>
          </div>
        </div>
      </div>

      {/* Modal para agregar/editar */}
      {showModal && (
        <UserModal
          user={editingUser}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      )}
    </div>
  );
}

// Modal de usuario
function UserModal({ user, onSave, onClose, showPassword, setShowPassword }) {
  // Datos del formulario
  const [formData, setFormData] = useState({
    email: user?.email || '',
    rol: user?.rol || 'Verificador',
    estado: user?.estado || 'Activo',
    password: '',
    confirmPassword: '',
  });

  // Errores de validacion
  const [errors, setErrors] = useState({});

  // Valida el formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo invalido';
    }
    
    // Solo validar contraseña si es usuario nuevo
    if (!user) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envia el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { password, confirmPassword, ...userData } = formData;
      onSave(userData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        
        {/* Cabecera del modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {user ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            
            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electronico
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ejemplo@workstamp.com"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  autoFocus
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <div className="relative">
                <Shield size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {rolesOptions.map(rol => (
                    <option key={rol} value={rol}>{rol}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {estadosOptions.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            {/* Contraseña - solo para nuevos usuarios */}
            {!user && (
              <>
                <div className="border-t pt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Minimo 6 caracteres"
                      className={`w-full pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Contraseña
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>
              </>
            )}
          </div>

          {/* Botones del modal */}
          <div className="p-4 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {user ? 'Actualizar' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}