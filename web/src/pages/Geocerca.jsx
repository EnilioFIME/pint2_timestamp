import { useState } from 'react';
import { MapPin, Radio, Save, Target, AlertCircle, CheckCircle } from 'lucide-react';

// Datos de proyectos para selector
const proyectosList = [
  { id: 1, nombre: 'Cimentación Torre A', lat: 19.4326, lng: -99.1332, radio: 100 },
  { id: 2, nombre: 'Excavación Torre B', lat: 19.4326, lng: -99.1350, radio: 80 },
  { id: 3, nombre: 'Nivelación Paisaje', lat: 19.4330, lng: -99.1340, radio: 120 },
  { id: 4, nombre: 'Instalación de Juegos', lat: 19.4340, lng: -99.1320, radio: 90 },
];

export default function Geocerca() {
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(proyectosList[0]);
  const [latitud, setLatitud] = useState(proyectosList[0].lat.toString());
  const [longitud, setLongitud] = useState(proyectosList[0].lng.toString());
  const [radio, setRadio] = useState(proyectosList[0].radio.toString());
  const [mensaje, setMensaje] = useState(null);
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);

  // Cambiar proyecto seleccionado
  const handleProyectoChange = (e) => {
    const proyecto = proyectosList.find(p => p.nombre === e.target.value);
    setProyectoSeleccionado(proyecto);
    setLatitud(proyecto.lat.toString());
    setLongitud(proyecto.lng.toString());
    setRadio(proyecto.radio.toString());
    setMensaje(null);
  };

  // Obtener ubicación actual del navegador
  const obtenerUbicacionActual = () => {
    setObteniendoUbicacion(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitud(position.coords.latitude.toFixed(6));
          setLongitud(position.coords.longitude.toFixed(6));
          setMensaje({ tipo: 'success', texto: 'Ubicación obtenida correctamente' });
          setObteniendoUbicacion(false);
          setTimeout(() => setMensaje(null), 3000);
        },
        (error) => {
          let errorMsg = '';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = 'Permiso denegado. Activa la ubicación en tu navegador.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = 'Información de ubicación no disponible.';
              break;
              case error.TIMEOUT:
              errorMsg = 'Tiempo de espera agotado.';
              break;
            default:
              errorMsg = 'Error al obtener la ubicación.';
          }
          setMensaje({ tipo: 'error', texto: errorMsg });
          setObteniendoUbicacion(false);
          setTimeout(() => setMensaje(null), 4000);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setMensaje({ tipo: 'error', texto: 'Tu navegador no soporta geolocalización' });
      setObteniendoUbicacion(false);
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  // Guardar configuración
  const guardarConfiguracion = () => {
    const lat = parseFloat(latitud);
    const lng = parseFloat(longitud);
    const rad = parseInt(radio);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setMensaje({ tipo: 'error', texto: 'Latitud inválida (debe ser entre -90 y 90)' });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      setMensaje({ tipo: 'error', texto: 'Longitud inválida (debe ser entre -180 y 180)' });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }

    if (isNaN(rad) || rad < 10 || rad > 500) {
      setMensaje({ tipo: 'error', texto: 'Radio inválido (debe ser entre 10 y 500 metros)' });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }

    // Actualizar el proyecto en la lista
    const index = proyectosList.findIndex(p => p.nombre === proyectoSeleccionado.nombre);
    if (index !== -1) {
      proyectosList[index] = {
        ...proyectosList[index],
        lat: lat,
        lng: lng,
        radio: rad
      };
    }

    setProyectoSeleccionado({
      ...proyectoSeleccionado,
      lat: lat,
      lng: lng,
      radio: rad
    });

    setMensaje({ tipo: 'success', texto: 'Configuración guardada correctamente' });
    setTimeout(() => setMensaje(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
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

        {/* Mensaje de alerta */}
        {mensaje && (
          <div className={`mx-5 mt-4 p-3 rounded-lg flex items-center gap-2 ${
            mensaje.tipo === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {mensaje.tipo === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className="text-sm">{mensaje.texto}</span>
          </div>
        )}

        {/* Formulario */}
        <div className="p-5 space-y-5">
          {/* Seleccionar Proyecto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar Proyecto
            </label>
            <select
              value={proyectoSeleccionado.nombre}
              onChange={handleProyectoChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {proyectosList.map(proyecto => (
                <option key={proyecto.id} value={proyecto.nombre}>
                  {proyecto.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Coordenadas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitud
              </label>
              <div className="relative">
                <Target size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitud
              </label>
              <div className="relative">
                <Target size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
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

          {/* Radio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Radio (metros)
            </label>
            <div className="relative">
              <Radio size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={radio}
                onChange={(e) => setRadio(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
                min="10"
                max="500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Rango permitido: 10 - 500 metros
            </p>
          </div>

          {/* Información de la geocerca */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Área de cobertura</p>
                <p className="text-sm text-blue-600 mt-1">
                  Los empleados deben estar dentro de un radio de <strong>{radio} metros</strong>{' '}
                  del punto <strong>({latitud}, {longitud})</strong> para poder marcar asistencia.
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
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
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={18} />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </div>

        {/* Preview del radio */}
        <div className="p-5 border-t bg-gray-50 rounded-b-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Vista previa de la geocerca</h3>
          <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Centro */}
                <div className="absolute w-4 h-4 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2" 
                     style={{ left: '50%', top: '50%' }} />
                {/* Círculo del radio */}
                <div 
                  className="absolute border-2 border-blue-500 border-dashed rounded-full"
                  style={{
                    width: `${Math.min(parseInt(radio) / 2, 200)}px`,
                    height: `${Math.min(parseInt(radio) / 2, 200)}px`,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
                <p className="absolute text-xs text-gray-500 whitespace-nowrap"
                   style={{ left: '50%', top: '55%', transform: 'translateX(-50%)' }}>
                  Radio: {radio}m
                </p>
              </div>
            </div>
            <p className="absolute bottom-2 left-2 text-xs text-gray-400">
              Representación visual no a escala
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}