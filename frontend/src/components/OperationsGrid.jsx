import React from 'react';

const OPERATIONS = [
  { name: 'barrenado fino', icon: 'tune', status: 'ESTADO: OK', statusColor: 'bg-secondary-container text-on-secondary-container', desc: 'Precisión micrométrica en orificios críticos de bloque motor.' },
  { name: 'lavadora central', icon: 'local_laundry_service', status: 'ACTIVO', statusColor: 'bg-secondary-container text-on-secondary-container', desc: 'Sistema de limpieza por ultrasonido y alta presión.' },
  { name: 'gehring - hycut central', icon: 'architecture', status: 'MANTENIMIENTO', statusColor: 'bg-surface-variant text-on-surface-variant', desc: 'Rectificado de precisión con sistema de refrigeración Hycut.' },
  { name: 'gehring - additive central', icon: 'science', status: 'OK', statusColor: 'bg-secondary-container text-on-secondary-container', desc: 'Dosificación de aditivos para acabado superficial.' },
  { name: 'honeado - hycut central', icon: 'texture', status: 'OK', statusColor: 'bg-secondary-container text-on-secondary-container', desc: 'Pulido de cilindros para optimización de lubricación.' },
  { name: 'honeado - additive central', icon: 'water_drop', status: 'ALERTA NIVEL', statusColor: 'text-error font-bold', desc: 'Control de fluidos abrasivos con aditivos químicos.' },
  { name: 'AF 355. 1 Pre', icon: 'inbox', status: 'OK', statusColor: 'bg-secondary-container text-on-secondary-container', desc: 'Medición dimensional previa a ensamble crítico.' },
  { name: 'AF 355. 1 Post', icon: 'fact_check', status: 'OK', statusColor: 'bg-secondary-container text-on-secondary-container', desc: 'Validación final de geometría tras mecanizado AF355.' },
  { name: 'AF 355. 2 Pre', icon: 'microscope', status: 'ACTIVO', statusColor: 'bg-secondary-container text-on-secondary-container', desc: 'Inspección de fase 2 para componentes de alta tolerancia.' },
  { name: 'AF 355. 2 Post', icon: 'fact_check', status: 'COMPLETO', statusColor: 'bg-secondary-container text-on-secondary-container', desc: 'Certificación de calidad post-operación fase 2.' },
  { name: 'AF 323', icon: 'precision_manufacturing', status: 'ESTADO: OK', statusColor: 'bg-secondary-container text-on-secondary-container', desc: 'Unidad multifuncional de acabado para serie 323.' },
];

const OperationsGrid = ({ processName, onSelectOperation }) => {
  return (
    <div>
      <header className="mb-xl">
        <div className="flex items-center gap-sm text-secondary font-label-md text-label-md uppercase tracking-widest mb-xs">
          <span className="material-symbols-outlined text-[16px]">precision_manufacturing</span>
          {processName}
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Selección de Operaciones</h1>
        <p className="text-on-surface-variant font-body-lg text-body-lg mt-xs">Seleccione una unidad de operación para visualizar los parámetros de calidad en tiempo real.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
        {OPERATIONS.map((op, index) => (
          <div 
            key={index} 
            onClick={() => onSelectOperation(op.name)}
            className="bg-white p-6 border border-surface-variant rounded-xl flex flex-col justify-between group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 bg-secondary-container/40 text-secondary flex items-center justify-center rounded-lg">
                  <span className="material-symbols-outlined">{op.icon}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${op.statusColor}`}>
                  {op.status}
                </span>
              </div>
              <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-secondary transition-colors mb-2">
                {op.name}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                {op.desc}
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between text-on-surface-variant group-hover:text-secondary transition-colors">
              <span className="font-label-md font-bold text-xs">Ver Métricas</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationsGrid;
