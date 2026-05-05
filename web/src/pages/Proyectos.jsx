import { useState, useEffect, Fragment } from 'react';
import { Edit, Trash2, Plus, Search, AlertTriangle } from 'lucide-react';
import Toast from '../components/Toast';

export default function Proyectos() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [frentesObra, setFrentesObra] = useState([]);
  const [cercos, setCercos] = useState([]);
  const estadoOptions = ['Activo', 'Inactivo'];

  useEffect(() => {
    fetchProyectos();
    fetchFrentes();
    fetchCercos();
  }, []);

  const fetchProyectos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/proyectos`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      setToast({ type: 'error', text: 'Error de conexión con el servidor' });
    }
  };

  const fetchFrentes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/frentes`);
      if (res.ok) {
        const data = await res.json();
        setFrentesObra(data); // Guardamos el objeto completo (id y nombre)
      }
    } catch (error) {
      console.error('Error al cargar frentes:', error);
    }
  };

  const fetchCercos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/cercos`);
      if (res.ok) {
        const data = await res.json();
        setCercos(data);
      }
    } catch (error) {
      console.error('Error al cargar cercos:', error);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async (projectData) => {
    const isEditing = !!editingProject;
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `${import.meta.env.VITE_BACKEND_BASE_URL}/api/proyectos/${editingProject.id}`
      : `${import.meta.env.VITE_BACKEND_BASE_URL}/api/proyectos`;

    // Transformación: React usa Texto ('Activo'/'Inactivo'), BD usa booleano
    const payload = {
      nombre: projectData.nombre,
      idFrente: projectData.idFrente || null,
      frente: projectData.idFrente ? { id: projectData.idFrente } : null, // Mapeo redundante por si Spring Boot espera la entidad anidada
      idCerco: projectData.idCerco || null,
      cerco: projectData.idCerco ? { id: projectData.idCerco } : null,
      status: projectData.estado === 'Activo'
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchProyectos();
        setShowModal(false);
        setEditingProject(null);
        setToast({ type: 'success', text: isEditing ? 'Proyecto actualizado correctamente' : 'Proyecto agregado correctamente' });
      }
    } catch (error) {
      setToast({ type: 'error', text: 'Error al guardar el proyecto' });
    }
  };

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    setConfirmDeleteId(null);
    setToast({ type: 'success', text: 'Proyecto ocultado localmente (Falta endpoint DELETE en Backend)' });
  };

  const getEstadoColor = (estado) => {
    return estado === 'Activo' || estado === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow">
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
          onClick={() => { setEditingProject(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre del Proyecto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frente de Obra</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cerco</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No hay proyectos registrados</td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <>
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{project.nombre}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {project.frente?.nombre || frentesObra.find(f => f.id === project.idFrente)?.nombre || 'Sin asignar'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {project.cerco ? `Cerco #${project.cerco.id}` : (project.idCerco ? `Cerco #${project.idCerco}` : 'Sin asignar')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(project.status !== undefined ? project.status : project.estado)}`}>
                        {(project.status === true || project.estado === 'Activo') ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setEditingProject(project); setShowModal(true); }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(project.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {confirmDeleteId === project.id && (
                    <tr key={`confirm-${project.id}`} className="bg-red-50">
                      <td colSpan="5" className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                          <span className="text-sm text-red-700">
                            ¿Eliminar <strong>{project.nombre}</strong>? Esta acción no se puede deshacer.
                          </span>
                          <div className="flex gap-2 ml-auto">
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-3 py-1 text-sm border rounded-lg text-gray-600 hover:bg-gray-100"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ProjectModal
          project={editingProject}
          frentesObra={frentesObra}
          cercos={cercos}
          estadoOptions={estadoOptions}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingProject(null); }}
        />
      )}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function ProjectModal({ project, frentesObra, cercos, estadoOptions, onSave, onClose }) {
  const getInitialFrente = () => {
    if (project?.idFrente) return project.idFrente;
    if (project?.frente?.id) return project.frente.id;
    return frentesObra?.length > 0 ? frentesObra[0].id : '';
  };

  const [formData, setFormData] = useState({
    nombre: project?.nombre || '',
    idFrente: getInitialFrente(),
    idCerco: project?.idCerco || project?.cerco?.id || '',
    estado: (project?.status === false || project?.estado === 'Inactivo') ? 'Inactivo' : 'Activo',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setError('El nombre del proyecto es requerido');
      return;
    }
    setError('');
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Proyecto</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => { setFormData({ ...formData, nombre: e.target.value }); setError(''); }}
                placeholder="ej. Cimentación Torre A"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-400' : ''}`}
                autoFocus
              />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frente de Obra</label>
              <select
                value={formData.idFrente}
                onChange={(e) => setFormData({ ...formData, idFrente: e.target.value ? Number(e.target.value) : '' })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un frente...</option>
                {frentesObra.map((frente) => (
                  <option key={frente.id} value={frente.id}>{frente.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cerco Geográfico (Opcional)</label>
              <select
                value={formData.idCerco}
                onChange={(e) => setFormData({ ...formData, idCerco: e.target.value ? Number(e.target.value) : '' })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin asignar</option>
                {cercos.map((cerco) => (
                  <option key={cerco.id} value={cerco.id}>Cerco #{cerco.id} (Radio: {cerco.radioMetros}m)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {estadoOptions.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 border-t flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {project ? 'Actualizar' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
