import React from 'react';

const OPERATIONS = [
  { name: 'barrenado fino', icon: 'tune', status: 'ESTADO: OK', desc: 'Precisión micrométrica en orificios críticos de bloque motor.', metricsOk: 12, metricsNok: 1 },
  { name: 'lavadora central', icon: 'local_laundry_service', status: 'ACTIVO', desc: 'Sistema de limpieza por ultrasonido y alta presión.', metricsOk: 8, metricsNok: 0 },
  { name: 'gehring - hycut central', icon: 'architecture', status: 'MANTENIMIENTO', desc: 'Rectificado de precisión con sistema de refrigeración Hycut.', metricsOk: 10, metricsNok: 2 },
  { name: 'gehring - additive central', icon: 'science', status: 'OK', desc: 'Dosificación de aditivos para acabado superficial.', metricsOk: 9, metricsNok: 0 },
  { name: 'honeado - hycut central', icon: 'texture', status: 'OK', desc: 'Pulido de cilindros para optimización de lubricación.', metricsOk: 11, metricsNok: 0 },
  { name: 'honeado - additive central', icon: 'water_drop', status: 'ALERTA NIVEL', desc: 'Control de fluidos abrasivos con aditivos químicos.', metricsOk: 7, metricsNok: 3 },
  { name: 'AF 355. 1 Pre', icon: 'inbox', status: 'OK', desc: 'Medición dimensional previa a ensamble crítico.', metricsOk: 14, metricsNok: 0 },
  { name: 'AF 355. 1 Post', icon: 'fact_check', status: 'OK', desc: 'Validación final de geometría tras mecanizado AF355.', metricsOk: 15, metricsNok: 0 },
  { name: 'AF 355. 2 Pre', icon: 'microscope', status: 'ACTIVO', desc: 'Inspección de fase 2 para componentes de alta tolerancia.', metricsOk: 12, metricsNok: 1 },
  { name: 'AF 355. 2 Post', icon: 'fact_check', status: 'COMPLETO', desc: 'Certificación de calidad post-operación fase 2.', metricsOk: 13, metricsNok: 0 },
  { name: 'AF 323', icon: 'precision_manufacturing', status: 'ESTADO: OK', desc: 'Unidad multifuncional de acabado para serie 323.', metricsOk: 10, metricsNok: 0 },
];

const OperationsGrid = ({ processName, onSelectOperation }) => {
  return (
    <>
      <style>{`
        .vw-operation-card {
          background: #002733;
          padding: 6px 6px 20px 6px;
          overflow: hidden;
          box-shadow: rgba(0, 39, 51, 0.12) 0px 8px 24px 0px;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
        }

        .vw-operation-card:hover {
          transform: scale(1.03) translateY(-4px);
          box-shadow: rgba(0, 39, 51, 0.22) 0px 16px 36px 0px;
        }

        .vw-operation-card .inner-gradient-section {
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          background: linear-gradient(45deg, rgb(4, 159, 187) 0%, rgb(80, 246, 255) 100%);
          position: relative;
          padding: 56px 20px 20px 20px;
        }

        /* Diagonal cutout tab top-left */
        .vw-operation-card .inner-gradient-section .top-cutout-border {
          border-bottom-right-radius: 12px;
          height: 38px;
          width: 175px;
          background: #002733;
          position: absolute;
          top: -1px;
          left: -1px;
          transform: skew(-40deg);
          transform-origin: top left;
          box-shadow: -10px -10px 0 0 #002733;
        }

        /* Smooth inside rounded corner right side of cutout */
        .vw-operation-card .inner-gradient-section .top-cutout-border::before {
          content: "";
          position: absolute;
          width: 16px;
          height: 16px;
          top: 0;
          right: -16px;
          background: transparent;
          border-top-left-radius: 12px;
          box-shadow: -6px -6px 0 2px #002733;
        }

        /* Smooth inside rounded corner below cutout */
        .vw-operation-card .inner-gradient-section::before {
          content: "";
          position: absolute;
          top: 37px;
          left: 0;
          background: transparent;
          height: 16px;
          width: 16px;
          border-top-left-radius: 12px;
          box-shadow: -6px -6px 0 2px #002733;
        }

        .vw-operation-card .header-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 38px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px 0 20px;
          z-index: 10;
        }

        .vw-operation-card .header-content .operation-title-container {
          width: 120px;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
        }

        .vw-operation-card .header-content .operation-title {
          display: inline-block;
          color: white;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.5px;
          animation: operation-marquee 8s linear infinite alternate;
        }

        @keyframes operation-marquee {
          0%, 20% {
            transform: translateX(0);
          }
          80%, 100% {
            transform: translateX(min(0px, calc(120px - 100%)));
          }
        }

        .vw-operation-card .header-content .operation-icon {
          color: #002733;
          font-size: 20px;
          margin-top: 2px;
        }
      `}</style>

      <div>
        <header className="mb-xl">
          <div className="flex items-center gap-sm text-secondary font-label-md text-label-md uppercase tracking-widest mb-xs">
            <span className="material-symbols-outlined text-[16px]">precision_manufacturing</span>
            {processName}
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Selección de Operaciones</h1>
          <p className="text-on-surface-variant font-body-lg text-body-lg mt-xs">Seleccione una unidad de operación para visualizar los parámetros de calidad en tiempo real.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {OPERATIONS.map((op, index) => (
            <div
              key={index}
              onClick={() => onSelectOperation(op.name)}
              className="vw-operation-card rounded-[28px] cursor-pointer"
            >
              <div className="inner-gradient-section h-full flex flex-col justify-between">
                <div>
                  {/* Skewed background cutout border */}
                  <div className="top-cutout-border"></div>

                  {/* Absolute header content (non-skewed) */}
                  <div className="header-content">
                    <div className="operation-title-container">
                      <span className="operation-title uppercase">{op.name}</span>
                    </div>
                    <span className="material-symbols-outlined operation-icon">{op.icon}</span>
                  </div>

                  {/* Status Header */}
                  <div className="flex items-center justify-between gap-2.5 mb-4 mt-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#002733] text-[20px]">analytics</span>
                      <span className="text-[#002733] font-bold text-sm tracking-wide">Métricas del Proceso</span>
                    </div>
                    
                    
                  </div>

                  {/* Metrics OK / NOK Counters Grid */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 bg-white rounded-[24px] p-4 flex flex-col items-center border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                      <span className="text-3xl font-black text-green-700 leading-none">{op.metricsOk}</span>
                      <span className="text-[9px] font-black text-green-800 uppercase tracking-widest mt-2">Métricas OK</span>
                    </div>
                    <div className="w-[1px] h-10 bg-[#002733]/10"></div>
                    <div className="flex-1 bg-white rounded-[24px] p-4 flex flex-col items-center border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                      <span className="text-3xl font-black text-red-700 leading-none">{op.metricsNok}</span>
                      <span className="text-[9px] font-black text-red-800 uppercase tracking-widest mt-2">Métricas NOK</span>
                    </div>
                  </div>

                  {/* Description Box */}
                  <p className="text-xs font-semibold text-[#002733]/70 leading-relaxed mb-6">
                    {op.desc}
                  </p>
                </div>

                {/* Ver Métricas Button (now inside light blue area) */}
                <button 
                  className="w-full py-4 rounded-2xl bg-white hover:bg-[#002733] text-[#002733] hover:text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 border border-white/40 hover:border-transparent active:scale-[0.98] shadow-sm group/btn"
                >
                  <span>Ver Métricas</span>
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OperationsGrid;
