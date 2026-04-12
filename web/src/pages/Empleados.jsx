import { useState } from 'react';
import { Edit, Trash2, Plus, Search, X, Smartphone, Fingerprint, CheckCircle, XCircle } from 'lucide-react';

// Datos iniciales de empleados
const initialEmpleados = [
  { id: 'EMP-001', nombre: 'Antonio Rodriguez', estado: 'Activo', nfc: 'Asignado', biometrico: 'Registrado' },
  { id: 'EMP-002', nombre: 'Maria Garcia', estado: 'Activo', nfc: 'Asignado', biometrico: 'Faltante' },
  { id: 'EMP-003', nombre: 'Carlos Lopez', estado: 'De Vacaciones', nfc: 'Faltante', biometrico: 'Registrado' },
  { id: 'EMP-004', nombre: 'Sofia Martinez', estado: 'Activo', nfc: 'Asignado', biometrico: 'Registrado' },
  { id: 'EMP-005', nombre: 'Javier Hernandez', estado: 'Terminado', nfc: 'Faltante', biometrico: 'Faltante' },
];

const estadosOptions = ['Activo', 'De Vacaciones', 'Terminado', 'Suspendido'];
const nfcOptions = ['Asignado', 'Faltante', 'No Aplica'];
const biometricoOptions = ['Registrado', 'Faltante', 'No Aplica'];

export default function Empleados() {
  const [empleados, setEmpleados] = useState(initialEmpleados);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);

  // Filtrar empleados
  const filteredEmpleados = empleados.filter(empleado =>
    empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Eliminar empleado
  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      setEmpleados(empleados.filter(empleado => empleado.id !== id));
    }
  };

  // Guardar empleado
  const handleSave = (empleadoData) => {
    if (editingEmpleado) {
      setEmpleados(empleados.map(e => e.id === editingEmpleado.id ? empleadoData : e));
    } else {
      const newId = `EMP-${String(empleados.length + 1).padStart(3, '0')}`;
      setEmpleados([...empleados, { ...empleadoData, id: newId }]);
    }
    setShowModal(false);
    setEditingEmpleado(null);
  };

  // Obtener color según estado
  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Activo': return 'bg-green-100 text-green-800';
      case 'De Vacaciones': return 'bg-yellow-100 text-yellow-800';
      case 'Terminado': return 'bg-red-100 text-red-800';
      case 'Suspendido': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Renderizar badge para NFC y Biométrico
  const renderBadge = (valor) => {
    if (valor === 'Asignado' || valor === 'Registrado') {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
        <CheckCircle size={12} /> {valor}
      </span>;
    } else if (valor === 'Faltante') {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
        <XCircle size={12} /> {valor}
      </span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">{valor}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => {
            setEditingEmpleado(null);
            setShowModal(true);
          }}
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

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
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
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No hay empleados registrados
                </td>
              </tr>
            ) : (
              filteredEmpleados.map((empleado) => (
                <tr key={empleado.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">
                    {empleado.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {empleado.nombre}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(empleado.estado)}`}>
                      {empleado.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {renderBadge(empleado.nfc)}
                  </td>
                  <td className="px-6 py-4">
                    {renderBadge(empleado.biometrico)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingEmpleado(empleado);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(empleado.id)}
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

      {/* Modal */}
      {showModal && (
        <EmpleadoModal
          empleado={editingEmpleado}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingEmpleado(null);
          }}
        />
      )}
    </div>
  );
}

// Modal para registrar/editar empleado
function EmpleadoModal({ empleado, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nombre: empleado?.nombre || '',
    estado: empleado?.estado || 'Activo',
    nfc: empleado?.nfc || 'Faltante',
    biometrico: empleado?.biometrico || 'Faltante',
  });

  const [nfcActivado, setNfcActivado] = useState(formData.nfc === 'Asignado');
  const [biometricoActivado, setBiometricoActivado] = useState(formData.biometrico === 'Registrado');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert('El nombre completo es requerido');
      return;
    }
    onSave({
      ...formData,
      nfc: nfcActivado ? 'Asignado' : 'Faltante',
      biometrico: biometricoActivado ? 'Registrado' : 'Faltante',
    });
  };

  const handleNfcToggle = () => {
    setNfcActivado(!nfcActivado);
  };

  const handleBiometricoToggle = () => {
    setBiometricoActivado(!biometricoActivado);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {empleado ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-5">
            {/* Nombre Completo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="ej. Juan Perez"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
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

            {/* Separador */}
            <div className="border-t pt-3"></div>

            {/* Tarjeta NFC */}
            <div 
              onClick={handleNfcToggle}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                nfcActivado ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Smartphone size={20} className={nfcActivado ? 'text-blue-600' : 'text-gray-400'} />
                <div>
                  <p className="font-medium text-gray-800">Tarjeta NFC</p>
                  <p className="text-xs text-gray-500">Asignar acceso con tarjeta física</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                nfcActivado ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
              }`}>
                {nfcActivado && <CheckCircle size={16} className="text-white" />}
              </div>
            </div>

            {/* Datos Biométricos */}
            <div 
              onClick={handleBiometricoToggle}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                biometricoActivado ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Fingerprint size={20} className={biometricoActivado ? 'text-blue-600' : 'text-gray-400'} />
                <div>
                  <p className="font-medium text-gray-800">Datos Biométricos</p>
                  <p className="text-xs text-gray-500">Habilitar reconocimiento facial</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                biometricoActivado ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
              }`}>
                {biometricoActivado && <CheckCircle size={16} className="text-white" />}
              </div>
            </div>
          </div>

          {/* Footer */}
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
              {empleado ? 'Actualizar' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}