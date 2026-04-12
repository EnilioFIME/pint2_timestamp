import { useState } from 'react';
import { Edit, Trash2, Plus, Search, X } from 'lucide-react';

// Datos iniciales
const initialFrentes = [
  { id: 1, nombre: 'Complejo Centro', descripcion: 'Proyecto principal de edificio comercial', estado: 'Activo' },
  { id: 2, nombre: 'Parque Rio', descripcion: 'Renovación de parque público', estado: 'Activo' },
  { id: 3, nombre: 'Nave Industrial Norte', descripcion: 'Construcción de bodega', estado: 'Inactivo' },
];

export default function Frentes() {
  const [frentes, setFrentes] = useState(initialFrentes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFrente, setEditingFrente] = useState(null);

  // Filtrar frentes
  const filteredFrentes = frentes.filter(frente =>
    frente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    frente.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Eliminar frente
  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este frente de obra?')) {
      setFrentes(frentes.filter(frente => frente.id !== id));
    }
  };

  // Guardar frente (nuevo o editado)
  const handleSave = (frenteData) => {
    if (editingFrente) {
      // Editar existente
      setFrentes(frentes.map(f => 
        f.id === editingFrente.id ? { ...frenteData, id: editingFrente.id } : f
      ));
    } else {
      // Crear nuevo
      setFrentes([...frentes, { ...frenteData, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingFrente(null);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header con búsqueda y botón */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar frente de obra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => {
            setEditingFrente(null);
            setShowModal(true);
          }}
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

      {/* Tabla de frentes */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
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
                <tr key={frente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {frente.nombre}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {frente.descripcion}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      frente.estado === 'Activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {frente.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingFrente(frente);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(frente.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
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

      {/* Modal para agregar/editar frente */}
      {showModal && (
        <FrenteModal
          frente={editingFrente}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingFrente(null);
          }}
        />
      )}
    </div>
  );
}

// Componente Modal
function FrenteModal({ frente, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nombre: frente?.nombre || '',
    descripcion: frente?.descripcion || '',
    estado: frente?.estado || 'Activo',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert('El nombre del frente es requerido');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {frente ? 'Editar Frente de Obra' : 'Agregar Nuevo Frente de Obra'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            {/* Nombre del Frente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Frente
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="ej. Centro Comercial Oeste"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Breve descripción del sitio"
                rows="3"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="p-4 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {frente ? 'Actualizar Frente' : 'Agregar Frente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}