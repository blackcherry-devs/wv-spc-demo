import React from 'react';
import { Activity, Droplet, Settings } from 'lucide-react';

const PROCESSES = [
  "ZKG EA888", "Línea Bloques", "Fundición",
  "Mecanizado A", "Mecanizado B", "Ensamble Final",
  "Tratamiento Térmico", "Lavadora Central", "Pruebas"
];

const ProcessCards = ({ onSelectProcess }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PROCESSES.map((process, index) => (
        <div 
          key={index}
          onClick={() => onSelectProcess(process)}
          className="bg-vw-blue rounded-xl border-l-4 border-vw-cyan shadow-lg overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white group-hover:text-vw-cyan transition-colors">{process}</h3>
              <div className="bg-white/10 p-2 rounded-lg">
                <Settings className="text-vw-cyan" size={24} />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Activity size={18} className="mr-2 text-green-400" />
                <span className="text-sm">Estado: <span className="font-semibold text-white">Operando</span></span>
              </div>
              <div className="flex items-center text-gray-300">
                <Droplet size={18} className="mr-2 text-blue-400" />
                <span className="text-sm">Última lectura: <span className="font-semibold text-white">Hace 2 hrs</span></span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <span className="text-vw-cyan text-sm font-medium group-hover:underline">Ver detalles →</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessCards;
