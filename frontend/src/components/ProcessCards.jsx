import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const PROCESSES = [
  { name: "ZKG EA888",          opsOk: 8, opsNok: 1, lastSync: "Hace 5 min" },
  { name: "Línea Bloques",      opsOk: 6, opsNok: 0, lastSync: "Hace 12 min" },
  { name: "Fundición",          opsOk: 4, opsNok: 2, lastSync: "Hace 1 hr" },
  { name: "Mecanizado A",       opsOk: 7, opsNok: 0, lastSync: "Hace 3 min" },
  { name: "Mecanizado B",       opsOk: 5, opsNok: 1, lastSync: "Hace 22 min" },
  { name: "Ensamble Final",     opsOk: 9, opsNok: 0, lastSync: "Hace 2 min" },
  { name: "Tratamiento Térmico",opsOk: 3, opsNok: 2, lastSync: "Hace 45 min" },
  { name: "Lavadora Central",   opsOk: 6, opsNok: 1, lastSync: "Hace 8 min" },
  { name: "Pruebas",            opsOk: 10,opsNok: 0, lastSync: "Hace 1 min" },
];

const ProcessCards = ({ onSelectProcess }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.vw-process-card');
    gsap.fromTo(cards, 
      { opacity: 0, x: -80 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.8, 
        stagger: 0.08, 
        ease: 'back.out(1.2)',
        clearProps: 'transform,opacity'
      }
    );
  }, []);

  return (
    <>
      <style>{`
        .vw-process-card {
          background: #002733;
          padding: 6px 6px 6px 6px;
          overflow: hidden;
          box-shadow: rgba(0, 39, 51, 0.12) 0px 8px 24px 0px;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
        }

        .vw-process-card:hover {
          transform: scale(1.03) translateY(-4px);
          box-shadow: rgba(0, 39, 51, 0.22) 0px 16px 36px 0px;
        }

        .vw-process-card .inner-gradient-section {
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          position: relative;
          padding: 56px 20px 20px 20px;
        }

        /* Soft Neumorphic Inset Slots */
        .vw-process-card .vw-inset-slot {
          background: #f4f6f9;
          border: 1px solid rgba(0, 39, 51, 0.03);
          box-shadow: inset 3px 3px 6px rgba(0, 39, 51, 0.06), inset -3px -3px 6px rgba(255, 255, 255, 0.9);
        }

        /* Neumorphic Raised Push Buttons */
        .vw-process-card .vw-push-button {
          background: #ffffff;
          border: 1px solid rgba(0, 39, 51, 0.05);
          box-shadow: 4px 4px 10px rgba(0, 39, 51, 0.06), -4px -4px 10px rgba(255, 255, 255, 0.9);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .vw-process-card .vw-push-button:hover {
          background: #002733;
          color: #ffffff !important;
          box-shadow: 0px 4px 12px rgba(0, 39, 51, 0.15);
          border-color: transparent;
        }

        .vw-process-card .vw-push-button:active {
          transform: scale(0.98);
        }

        /* Diagonal cutout tab top-left */
        .vw-process-card .inner-gradient-section .top-cutout-border {
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
        .vw-process-card .inner-gradient-section .top-cutout-border::before {
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
        .vw-process-card .inner-gradient-section::before {
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

        .vw-process-card .header-content {
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

        .vw-process-card .header-content .process-title-container {
          width: 120px;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
        }

        .vw-process-card .header-content .process-title {
          display: inline-block;
          color: white;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 0.5px;
          animation: process-marquee 8s linear infinite alternate;
        }

        @keyframes process-marquee {
          0%, 20% {
            transform: translateX(0);
          }
          80%, 100% {
            transform: translateX(min(0px, calc(120px - 100%)));
          }
        }

        .vw-process-card .header-content .process-icon {
          color: #002733;
          font-size: 20px;
          margin-top: 2px;
        }
      `}</style>

      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROCESSES.map((process, index) => (
          <div
            key={index}
            onClick={() => onSelectProcess(process.name)}
            className="vw-process-card rounded-[28px] cursor-pointer"
          >
            <div className="inner-gradient-section">
              {/* Skewed background cutout border */}
              <div className="top-cutout-border"></div>

              {/* Absolute header content (non-skewed) */}
              <div className="header-content flex justify-between items-center w-full">
                <div className="process-title-container">
                  <span className="process-title uppercase">{process.name}</span>
                </div>
                <span className="material-symbols-outlined process-icon">precision_manufacturing</span>
              </div>

              {/* Status Header */}
              <div className="flex items-center gap-2.5 mb-4 mt-1">
                <span className="material-symbols-outlined text-[#002733] text-[20px]">monitor_heart</span>
                <span className="text-[#002733] font-bold text-sm tracking-wide">Estado de Operaciones</span>
              </div>

              {/* OK / NOK Counters Grid */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1 vw-inset-slot rounded-[24px] p-4 flex flex-col items-center">
                  <span className="text-3xl font-black text-green-600 leading-none">{process.opsOk}</span>
                  <span className="text-[9px] font-black text-green-700 uppercase tracking-widest mt-2">Sistemas OK</span>
                </div>
                <div className="w-[1px] h-10 bg-[#002733]/10"></div>
                <div className="flex-1 vw-inset-slot rounded-[24px] p-4 flex flex-col items-center">
                  <span className="text-3xl font-black text-red-600 leading-none">{process.opsNok}</span>
                  <span className="text-[9px] font-black text-red-700 uppercase tracking-widest mt-2">Sistemas NOK</span>
                </div>
              </div>

              {/* Sync Time (Full width rounded bar) */}
              <div className="flex items-center justify-center gap-2 mb-5 vw-inset-slot py-3 rounded-2xl w-full">
                <span className="material-symbols-outlined text-[18px] text-[#002733] flex-shrink-0">history</span>
                <span className="text-[#002733] text-xs font-bold">
                  Última Sincronización: <span className="font-extrabold">{process.lastSync}</span>
                </span>
              </div>

              {/* Ver Detalles Button */}
              <button 
                className="w-full py-4 rounded-2xl vw-push-button text-[#002733] text-sm font-bold tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] group/btn"
              >
                <span>Ver Detalles</span>
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProcessCards;
