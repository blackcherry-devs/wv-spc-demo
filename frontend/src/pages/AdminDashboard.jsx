import React, { useContext } from 'react';
import ProcessCards from '../components/ProcessCards';
import OperationsGrid from '../components/OperationsGrid';
import ChartDetail from '../components/ChartDetail';
import DataEntry from './DataEntry';
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
            onClick={() => navigate(`/proceso/${processId}`)}
            className="flex items-center px-4 py-2 bg-surface-container-high hover:bg-surface-variant text-on-surface-variant rounded-lg transition-colors font-label-md text-label-md"
          >
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Volver a Operaciones
          </button>
        </div>
      </header>

      <div className="w-full">
        <ChartDetail processName={decodedOperation} operationId={operationId} />
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isProcessView = location.pathname === '/' || location.pathname === '';
  const isOperationOrMetricsView = location.pathname.includes('/proceso/');

  return (
    <div className="bg-background text-on-surface h-[calc(100vh-4rem)] flex font-sans w-full">
      
      {/* SideNavBar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 z-40 bg-surface border-r border-outline/20 shadow-lg flex flex-col py-lg pt-8">
        <div className="px-6 mb-lg">
          <h2 className="font-title-md text-title-md text-primary">Gestión de Calidad</h2>
          <p className="font-label-md text-label-md text-on-surface-variant">Planta de Producción</p>
        </div>
        <nav className="flex-1 space-y-sm mt-4">
          <button 
            onClick={() => navigate('/')}
            className={`w-full flex items-center px-4 py-3 mx-2 transition-all font-label-md text-label-md ${isProcessView ? 'bg-secondary-container text-on-secondary-container rounded-full font-bold shadow-sm' : 'text-on-surface-variant hover:text-secondary hover:bg-surface-container-high rounded-full'}`}
          >
            <span className="material-symbols-outlined mr-3">factory</span>
            Selección de Proceso
          </button>
          
          <div className={`w-full flex items-center px-4 py-3 mx-2 transition-all font-label-md text-label-md ${isOperationOrMetricsView && !location.pathname.includes('/llenado') ? 'bg-secondary-container text-on-secondary-container rounded-full font-bold shadow-sm' : 'text-outline/50'}`}>
            <span className="material-symbols-outlined mr-3">settings_heart</span>
            Selección de Operación
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
        <div className="mt-auto border-t border-outline/10 pt-md space-y-sm">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center text-on-surface-variant hover:text-secondary px-4 py-3 mx-2 transition-all font-label-md text-label-md text-error"
          >
            <span className="material-symbols-outlined mr-3 text-error">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-64 pt-8 pb-12 px-8 w-full overflow-y-auto">
        <Routes>
          <Route path="/" element={<ProcessCardsWrapper />} />
          <Route path="/proceso/:processId" element={<OperationsGridWrapper />} />
          <Route path="/proceso/:processId/operacion/:operationId" element={<MetricsWrapper />} />
          <Route path="/proceso/:processId/operacion/:operationId/llenado" element={<DataEntry />} />
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
