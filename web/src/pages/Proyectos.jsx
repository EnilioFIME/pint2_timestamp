import { useState } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

// Datos de ejemplo
const initialProjects = [
  { id: 1, nombre: 'Cimentación Torre A', frenteObra: 'Complejo Centro', estado: 'En Progreso' },
  { id: 2, nombre: 'Excavación Torre B', frenteObra: 'Complejo Centro', estado: 'En Progreso' },
  { id: 3, nombre: 'Nivelación Paisaje', frenteObra: 'Parque Río', estado: 'Completado' },
  { id: 4, nombre: 'Instalación de Juegos', frenteObra: 'Parque Río', estado: 'Pendiente' },
];

// Opciones para el select de estado
const estadoOptions = ['Pendiente', 'En Progreso', 'Completado', 'Cancelado'];

export default function Proyectos() {
  // Estados del componente
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [frentesObra] = useState(['Complejo Centro', 'Parque Río', 'Nave Industrial Norte']);

  // Filtra proyectos por busqueda
  const filteredProjects = projects.filter(project =>
    project.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.frenteObra.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Elimina un proyecto
  const handleDelete = (id) => {
    if (confirm('Seguro que deseas eliminar este proyecto?')) {
      setProjects(projects.filter(project => project.id !== id));
    }
  };

  // Guarda proyecto nuevo o editado
  const handleSave = (projectData) => {
    if (editingProject) {
      // Actualiza proyecto existente
      setProjects(projects.map(p => p.id === editingProject.id ? { ...projectData, id: editingProject.id } : p));
    } else {
      // Crea nuevo proyecto
      setProjects([...projects, { ...projectData, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingProject(null);
  };

  // Color segun el estado del proyecto
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'En Progreso': return 'bg-blue-100 text-blue-800';
      case 'Completado': return 'bg-green-100 text-green-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Cabecera con buscador y boton nuevo */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o frente de obra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {/* Tabla de proyectos */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nombre del Proyecto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Frente de Obra
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No hay proyectos registrados
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {project.nombre}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {project.frenteObra}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(project.estado)}`}>
                      {project.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      {/* Boton editar */}
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      {/* Boton eliminar */}
                      <button
                        onClick={() => handleDelete(project.id)}
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

      {/* Modal para crear o editar proyecto */}
      {showModal && (
        <ProjectModal
          project={editingProject}
          frentesObra={frentesObra}
          estadoOptions={estadoOptions}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
}

// Componente del modal
function ProjectModal({ project, frentesObra, estadoOptions, onSave, onClose }) {
  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre: project?.nombre || '',
    frenteObra: project?.frenteObra || frentesObra[0] || '',
    estado: project?.estado || 'Pendiente',
  });

  // Envia el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validaciones
    if (!formData.nombre.trim()) {
      alert('El nombre del proyecto es requerido');
      return;
    }
    if (!formData.frenteObra) {
      alert('Debes seleccionar un frente de obra');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        
        {/* Cabecera del modal */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">
            {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            
            {/* Campo nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Proyecto
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="ej. Cimentación Torre A"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Select de frente de obra */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frente de Obra
              </label>
              <select
                value={formData.frenteObra}
                onChange={(e) => setFormData({ ...formData, frenteObra: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {frentesObra.map((frente) => (
                  <option key={frente} value={frente}>
                    {frente}
                  </option>
                ))}
              </select>
            </div>

            {/* Select de estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {estadoOptions.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
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
              {project ? 'Actualizar' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}