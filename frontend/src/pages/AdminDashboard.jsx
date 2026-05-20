import React, { useContext, useState, useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ProcessCards from '../components/ProcessCards';
import OperationsGrid from '../components/OperationsGrid';
import ChartDetail from '../components/ChartDetail';
import WaterTank from '../components/WaterTank';
import OperationOverview from '../components/OperationOverview';
import { AuthContext } from '../context/AuthContext';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';

const OperationsGridWrapper = () => {
  const { processId } = useParams();
  const navigate = useNavigate();
  const decodedProcess = decodeURIComponent(processId);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <OperationsGrid 
        processName={decodedProcess} 
        onSelectOperation={(op) => navigate(`/proceso/${processId}/operacion/${encodeURIComponent(op)}`)} 
      />
    </div>
  );
};

const MetricsWrapper = () => {
  const { processId, operationId } = useParams();
  const navigate = useNavigate();
  const decodedProcess = decodeURIComponent(processId);
  const decodedOperation = decodeURIComponent(operationId);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="mb-8">
        <div className="flex items-center gap-sm text-secondary font-label-md text-label-md uppercase tracking-widest mb-xs">
          <span className="material-symbols-outlined text-[16px]">precision_manufacturing</span>
          {decodedProcess} / {decodedOperation}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Métricas en Tiempo Real</h1>
            <p className="text-on-surface-variant font-body-lg text-body-lg mt-xs">Visualización de parámetros para la operación seleccionada.</p>
          </div>
          <button 
            onClick={() => navigate(`/proceso/${processId}/operacion/${operationId}`)}
            className="flex items-center px-4 py-2 bg-surface-container-high hover:bg-surface-variant text-on-surface-variant rounded-lg transition-colors font-label-md text-label-md"
          >
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Volver al Overview
          </button>
        </div>
      </header>

      <div className="w-full">
        <ChartDetail processName={decodedOperation} />
      </div>
    </div>
  );
};

const ProcessCardsWrapper = () => {
  const navigate = useNavigate();
  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Selección de Proceso</h1>
        <p className="text-on-surface-variant font-body-lg text-body-lg mt-xs">Seleccione una línea de producción general.</p>
      </header>
      <ProcessCards onSelectProcess={(p) => navigate(`/proceso/${encodeURIComponent(p)}`)} />
    </div>
  );
};

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isMinimized, setIsMinimized] = useState(false);
  const sidebarRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const texts = sidebarRef.current.querySelectorAll('.nav-text');
    if (isMinimized) {
      gsap.to(texts, { opacity: 0, y: 10, duration: 0.2, stagger: 0.02, onComplete: () => {
        texts.forEach(t => t.style.display = 'none');
        gsap.to(sidebarRef.current, { width: 80, duration: 0.6, ease: 'back.out(1.2)' });
      }});
    } else {
      gsap.to(sidebarRef.current, { width: 256, duration: 0.6, ease: 'back.out(1.2)', onComplete: () => {
        texts.forEach(t => t.style.display = ''); // Restore display
        gsap.fromTo(texts, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.02 });
      }});
    }
  }, [isMinimized]);

  // Keep newly rendered texts hidden if the sidebar is already minimized
  useLayoutEffect(() => {
    if (isMinimized) {
      const texts = sidebarRef.current.querySelectorAll('.nav-text');
      gsap.set(texts, { opacity: 0, display: 'none' });
    }
  }, [location.pathname, isMinimized]);

  const pathParts = location.pathname.split('/').filter(Boolean);
  let activeProcess = null;
  let activeOperation = null;

  if (pathParts[0] === 'proceso') {
    activeProcess = decodeURIComponent(pathParts[1] || '');
  }
  if (pathParts[2] === 'operacion') {
    activeOperation = decodeURIComponent(pathParts[3] || '');
  }

  const isProcessView = location.pathname === '/';
  const isOperationView = pathParts[0] === 'proceso' && !pathParts[2];
  const isOverview = pathParts[2] === 'operacion';

  return (
    <div className="bg-background text-on-surface h-[calc(100vh-4rem)] flex font-sans w-full">
      
      {/* SideNavBar */}
      <aside ref={sidebarRef} className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 z-40 bg-surface border-r border-outline/20 shadow-lg flex flex-col py-lg pt-8">
        
        <div className="px-6 mb-lg">
          <h2 className="font-title-md text-title-md text-primary nav-text whitespace-nowrap">Gestión de Calidad</h2>
          <p className="font-label-md text-label-md text-on-surface-variant nav-text whitespace-nowrap">Planta de Producción</p>
        </div>
        <nav className="flex-1 space-y-sm mt-4 px-2">
          <div>
            <button 
              onClick={() => navigate('/')}
              className={`w-full flex items-center px-4 py-3 transition-all font-label-md text-label-md rounded-lg ${isProcessView ? 'bg-[#A3E4F9] text-[#002733] font-bold shadow-sm' : 'text-on-surface-variant hover:text-secondary hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined mr-3 shrink-0">factory</span>
              <span className="nav-text whitespace-nowrap">Selección de Proceso</span>
            </button>
            {activeProcess && (
              <div className="flex ml-8 mt-2 mb-2 nav-text whitespace-nowrap">
                <div className="w-[2px] h-6 bg-outline/20 mr-4 rounded-full"></div>
                <span className="font-bold text-sm text-[#002733] flex items-center capitalize">{activeProcess}</span>
              </div>
            )}
          </div>
          
          <div>
            <div 
              onClick={() => activeProcess && navigate(`/proceso/${encodeURIComponent(activeProcess)}`)}
              className={`w-full flex items-center px-4 py-3 transition-all font-label-md text-label-md rounded-lg ${isOperationView || isOverview ? 'bg-[#A3E4F9] text-[#002733] font-bold shadow-sm' : activeProcess ? 'text-on-surface-variant hover:text-secondary hover:bg-surface-container-high cursor-pointer' : 'text-outline/50 cursor-not-allowed'}`}
            >
              <span className="material-symbols-outlined mr-3 shrink-0">settings_heart</span>
              <span className="nav-text whitespace-nowrap">Selección de Operación</span>
            </div>
            {activeOperation && (
              <div className="flex ml-8 mt-2 mb-2 nav-text whitespace-nowrap">
                <div className="w-[2px] h-6 bg-outline/20 mr-4 rounded-full"></div>
                <span className="font-bold text-sm text-[#002733] flex items-center capitalize">{activeOperation}</span>
              </div>
            )}
          </div>
          
          {isOperationOrMetricsView && (
            <button 
              onClick={() => {
                const parts = location.pathname.split('/');
                if (parts.length >= 5) {
                  navigate(`/proceso/${parts[2]}/operacion/${parts[4]}/llenado`);
                }
              }}
              className={`w-full flex items-center px-4 py-3 mx-2 transition-all font-label-md text-label-md ${location.pathname.includes('/llenado') ? 'bg-secondary-container text-on-secondary-container rounded-full font-bold shadow-sm' : 'text-on-surface-variant hover:text-secondary hover:bg-surface-container-high rounded-full'}`}
            >
              <span className="material-symbols-outlined mr-3">edit_document</span>
              Llenado de Información
            </button>
          )}
        </nav>
        <div className="mt-auto border-t border-outline/10 pt-md space-y-sm relative">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center text-on-surface-variant hover:text-secondary px-4 py-3 mx-2 transition-all font-label-md text-label-md text-error"
          >
            <span className="material-symbols-outlined mr-3 shrink-0 text-error">logout</span>
            <span className="nav-text whitespace-nowrap">Cerrar Sesión</span>
          </button>

          {/* Toggle Button */}
          <button 
            onClick={() => setIsMinimized(!isMinimized)} 
            className="absolute right-[-14px] top-1/2 -translate-y-1/2 bg-white border border-outline/20 shadow-md w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container z-50 text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">{isMinimized ? 'chevron_right' : 'chevron_left'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className={`transition-all duration-500 ease-out pt-8 pb-12 px-8 w-full overflow-y-auto ${isMinimized ? 'ml-20' : 'ml-64'}`}>
        <Routes>
          <Route path="/" element={<ProcessCardsWrapper />} />
          <Route path="/proceso/:processId" element={<OperationsGridWrapper />} />
          <Route path="/proceso/:processId/operacion/:operationId" element={<OperationOverview />} />
          <Route path="/proceso/:processId/operacion/:operationId/metrica/:metricId" element={<MetricsWrapper />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <footer className="fixed bottom-0 left-64 right-0 bg-surface-container-lowest border-t border-outline/10 flex justify-between items-center px-8 py-2 z-50">
        <div className="flex items-center gap-lg">
          <span className="font-code-data text-code-data text-on-surface-variant">v2.4.0-stable</span>
          <span className="flex items-center gap-xs font-code-data text-code-data text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed shadow-[0_0_8px_rgba(178,235,255,0.8)]"></span>
            Estado del Sistema: OK
          </span>
        </div>
        <div className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">
            © 2024 Volkswagen AG | Control de Calidad Industrial
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
