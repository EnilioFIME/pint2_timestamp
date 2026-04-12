import { useState } from 'react';
import { Building2, Users, CalendarCheck, MapPin, TrendingUp, Clock } from 'lucide-react';
import Frentes from './Frentes';
import Proyectos from './Proyectos';
import Empleados from './Empleados';
import Asistencia from './Asistencia';
import Geocerca from './Geocerca';
import Usuarios from './Usuarios';

export default function Dashboard() {
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState('dashboard');

  // Datos de ejemplo  
  const stats = {
    proyectosActivos: 12,
    empleadosActivos: 148,
    asistenciaHoy: 134,
    frentesActivos: 4
  };

  const actividadReciente = [
    { nombre: 'Juan Perez', detalle: 'Entrada registrada en Torre A', hora: '08:01 AM', avatar: 'JP' },
    { nombre: 'Maria Garcia', detalle: 'Entrada registrada en Torre A', hora: '08:02 AM', avatar: 'MG' },
    { nombre: 'Carlos Lopez', detalle: 'Entrada registrada en Torre A', hora: '08:03 AM', avatar: 'CL' },
    { nombre: 'Sofia Martinez', detalle: 'Salida registrada en Parque Rio', hora: '05:02 PM', avatar: 'SM' },
    { nombre: 'Javier Hernandez', detalle: 'Entrada registrada en Torre A', hora: '08:05 AM', avatar: 'JH' },
  ];

  const frentesEstado = [
    { nombre: 'Complejo Centro', porcentaje: 85, color: 'bg-blue-500' },
    { nombre: 'Parque Rio', porcentaje: 60, color: 'bg-green-500' },
    { nombre: 'Nave Industrial Norte', porcentaje: 45, color: 'bg-yellow-500' },
    { nombre: 'Centro Comercial Oeste', porcentaje: 20, color: 'bg-red-500' },
  ];

  const metricCards = [
    { title: 'Proyectos Activos', value: stats.proyectosActivos, icon: Building2, color: 'bg-blue-500' },
    { title: 'Empleados Activos', value: stats.empleadosActivos, icon: Users, color: 'bg-green-500' },
    { title: 'Asistencia de Hoy', value: stats.asistenciaHoy, icon: CalendarCheck, color: 'bg-purple-500' },
    { title: 'Frentes Activos', value: stats.frentesActivos, icon: MapPin, color: 'bg-orange-500' },
  ];

  // Vista del panel principal
  const DashboardView = () => (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel Principal</h1>

      {/* Tarjetas de metricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div className={`${card.color} rounded-lg w-12 h-12 flex items-center justify-center`}>
                <card.icon size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <TrendingUp size={14} className="text-green-500" />
              <span className="text-xs text-green-500">+12%</span>
              <span className="text-xs text-gray-400 ml-1">vs mes anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Actividad reciente y estado de frentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-5 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Actividad Reciente</h2>
              <Clock size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="p-4">
            {actividadReciente.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold text-white">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.nombre}</p>
                    <p className="text-xs text-gray-500">{item.detalle}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{item.hora}</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Ver todas las actividades →
            </button>
          </div>
        </div>

        {/* Estado de Frentes */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Estado de Frentes</h2>
          </div>
          <div className="p-5">
            {frentesEstado.map((frente, i) => (
              <div key={i} className="mb-5 last:mb-0">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{frente.nombre}</span>
                  <span className="text-gray-500">{frente.porcentaje}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${frente.color} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${frente.porcentaje}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t bg-gray-50 rounded-b-xl">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avance promedio</span>
              <span className="text-lg font-bold text-gray-800">
                {Math.round(frentesEstado.reduce((acc, f) => acc + f.porcentaje, 0) / frentesEstado.length)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderiza el contenido segun la pestaña seleccionada
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'frentes':
        return <Frentes />;
      case 'proyectos':
        return <Proyectos />;
      case 'empleados':
        return <Empleados />;
      case 'asistencia':
        return <Asistencia />;
      case 'geocerca':
        return <Geocerca />;
      case 'usuarios':
        return <Usuarios />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <main className="p-6">
        {renderContent()}
      </main>
    </div>
  );
}