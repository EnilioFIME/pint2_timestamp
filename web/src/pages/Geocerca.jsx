import { useState, useEffect } from 'react';
import { MapPin, Radio, Save, Target, AlertCircle, CheckCircle } from 'lucide-react';

const BASE = import.meta.env.VITE_BACKEND_BASE_URL;

export default function Geocerca() {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [radio, setRadio] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { fetchProyectos(); }, []);

  const fetchProyectos = async () => {
    try {
      const res = await fetch(`${BASE}/api/proyectos`);
      if (res.ok) {
        const data = await res.json();
        setProyectos(data);
        if (data.length > 0) seleccionarProyecto(data[0]);
      }
    } catch {
      mostrarMensaje('error', 'Error al cargar proyectos');
    }
  };

  const seleccionarProyecto = async (proyecto) => {
    setProyectoSeleccionado(proyecto);
    setMensaje(null);
    if (proyecto.idCerco) {
      try {
        const res = await fetch(`${BASE}/api/cercos/${proyecto.idCerco}`);
        if (res.ok) {
          const cerco = await res.json();
          setLatitud(cerco.latitud?.toString() || '');
          setLongitud(cerco.longitud?.toString() || '');
          setRadio(cerco.radioMetros?.toString() || '');
          return;
        }
      } catch {
        // Si falla la carga del cerco, dejar campos vacíos
      }
    }
    setLatitud('');
    setLongitud('');
    setRadio('');
  };

  const handleProyectoChange = (e) => {
    const proyecto = proyectos.find(p => p.id === parseInt(e.target.value));
    if (proyecto) seleccionarProyecto(proyecto);
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), tipo === 'error' ? 4000 : 3000);
  };

  const obtenerUbicacionActual = () => {
    setObteniendoUbicacion(true);
    if (!navigator.geolocation) {
      mostrarMensaje('error', 'Tu navegador no soporta geolocalización');
      setObteniendoUbicacion(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitud(pos.coords.latitude.toFixed(6));
        setLongitud(pos.coords.longitude.toFixed(6));
        mostrarMensaje('success', 'Ubicación obtenida correctamente');
        setObteniendoUbicacion(false);
      },
      (error) => {
        const msgs = { 1: 'Permiso denegado.', 2: 'Ubicación no disponible.', 3: 'Tiempo agotado.' };
        mostrarMensaje('error', msgs[error.code] || 'Error al obtener la ubicación.');
        setObteniendoUbicacion(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const guardarConfiguracion = async () => {
    if (!proyectoSeleccionado) return;

    const lat = parseFloat(latitud);
    const lng = parseFloat(longitud);
    const rad = parseFloat(radio);

    if (isNaN(lat) || lat < -90 || lat > 90) { mostrarMensaje('error', 'Latitud inválida (entre -90 y 90)'); return; }
    if (isNaN(lng) || lng < -180 || lng > 180) { mostrarMensaje('error', 'Longitud inválida (entre -180 y 180)'); return; }
    if (isNaN(rad) || rad < 10 || rad > 500) { mostrarMensaje('error', 'Radio inválido (entre 10 y 500 metros)'); return; }

    setGuardando(true);
    try {
      const payload = { latitud: lat, longitud: lng, radioMetros: rad, status: true };

      if (proyectoSeleccionado.idCerco) {
        // Actualizar cerco existente
        const res = await fetch(`${BASE}/api/cercos/${proyectoSeleccionado.idCerco}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Error al actualizar cerco');
      } else {
        // Crear nuevo cerco y asociarlo al proyecto
        const resCerco = await fetch(`${BASE}/api/cercos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!resCerco.ok) throw new Error('Error al crear cerco');
        const nuevoCerco = await resCerco.json();

        // Asignar el cerco al proyecto vía PUT
        const resProyecto = await fetch(`${BASE}/api/proyectos/${proyectoSeleccionado.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...proyectoSeleccionado, idCerco: nuevoCerco.id }),
        });
        if (!resProyecto.ok) throw new Error('Error al asociar cerco al proyecto');
      }

      mostrarMensaje('success', 'Configuración guardada correctamente');
      await fetchProyectos();
    } catch (e) {
      mostrarMensaje('error', e.message || 'Error al guardar la geocerca');
    } finally {
      setGuardando(false);
    }
  };

  const radioNum = parseFloat(radio) || 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <MapPin size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Configuración de Geocerca</h2>
              <p className="text-sm text-gray-500">Define el área permitida para marcar asistencia</p>
            </div>
          </div>
        </div>

        {mensaje && (
          <div className={`mx-5 mt-4 p-3 rounded-lg flex items-center gap-2 ${
            mensaje.tipo === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {mensaje.tipo === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm">{mensaje.texto}</span>
          </div>
        )}

        <div className="p-5 space-y-5">
          <div>
            <label htmlFor="proyecto" className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar Proyecto
            </label>
            <select
              id="proyecto"
              value={proyectoSeleccionado?.id || ''}
              onChange={handleProyectoChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={proyectos.length === 0}
            >
              {proyectos.length === 0 && <option value="">Cargando proyectos...</option>}
              {proyectos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre}{p.idCerco ? '' : ' (sin geocerca)'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitud" className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
              <div className="relative">
                <Target size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="latitud"
                  type="number"
                  step="0.000001"
                  value={latitud}
                  onChange={(e) => setLatitud(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="19.4326"
                />
              </div>
            </div>
            <div>
              <label htmlFor="longitud" className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
              <div className="relative">
                <Target size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="longitud"
                  type="number"
                  step="0.000001"
                  value={longitud}
                  onChange={(e) => setLongitud(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="-99.1332"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="radio" className="block text-sm font-medium text-gray-700 mb-1">Radio (metros)</label>
            <div className="relative">
              <Radio size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="radio"
                type="number"
                step="1"
                value={radio}
                onChange={(e) => setRadio(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
                min="10"
                max="500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Rango permitido: 10 - 500 metros</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-600">
                Los empleados deben estar dentro de un radio de <strong>{radio || 0} metros</strong>{' '}
                del punto <strong>({latitud || '—'}, {longitud || '—'})</strong> para poder marcar asistencia.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={obtenerUbicacionActual}
              disabled={obteniendoUbicacion}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Target size={18} />
              <span>{obteniendoUbicacion ? 'Obteniendo...' : 'Usar mi ubicación actual'}</span>
            </button>
            <button
              onClick={guardarConfiguracion}
              disabled={guardando || !proyectoSeleccionado}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              <span>{guardando ? 'Guardando...' : 'Guardar Configuración'}</span>
            </button>
          </div>
        </div>

        <div className="p-5 border-t bg-gray-50 rounded-b-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Vista previa de la geocerca</h3>
          <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div
                className="border-2 border-blue-500 border-dashed rounded-full flex items-center justify-center"
                style={{ width: `${Math.min(radioNum / 2, 180)}px`, height: `${Math.min(radioNum / 2, 180)}px` }}
              >
                <div className="w-4 h-4 bg-blue-600 rounded-full" />
              </div>
            </div>
            <p className="absolute bottom-2 right-2 text-xs text-gray-400">Radio: {radio || 0}m · No a escala</p>
          </div>
        </div>
      </div>
    </div>
  );
}
