import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import WeeklySemaforo from '../components/WeeklySemaforo';
import { Settings } from 'lucide-react';

const OperatorDashboard = () => {
  const { user } = useContext(AuthContext);

  // Extract the operation name from the user's name or hardcode for demo
  const operationName = user?.name?.includes('ZKG') ? 'Línea ZKG EA888' : 'Operación Asignada';

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vw-blue">Panel de Operador</h1>
          <p className="text-gray-500 mt-1">Captura diaria de parámetros</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center">
          <Settings className="text-vw-cyan mr-2" size={20} />
          <span className="font-semibold text-vw-blue">{operationName}</span>
        </div>
      </div>

      <WeeklySemaforo processName={operationName} />

      <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <h4 className="text-sm font-bold text-vw-blue mb-2">Instrucciones:</h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Seleccione el día actual en el semáforo para realizar la captura.</li>
          <li>Asegúrese de llenar todos los campos obligatorios en las 3 pestañas.</li>
          <li>Una vez guardado, el color del día cambiará automáticamente.</li>
        </ul>
      </div>

    </div>
  );
};

export default OperatorDashboard;
