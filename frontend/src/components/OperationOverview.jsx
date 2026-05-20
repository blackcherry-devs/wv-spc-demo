import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import OverviewChart from './OverviewChart';
import WaterTank from './WaterTank';

import { fetchMockOperationData } from '../mockData';

// Dynamic Data fetched from API

const ExpandableSection = ({ title, children, visibleCount = 2 }) => {
  const [expanded, setExpanded] = useState(false);
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = expanded ? childrenArray : childrenArray.slice(0, visibleCount);
  const hasMore = childrenArray.length > visibleCount;
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll('.grid > div');
    gsap.fromTo(items,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'back.out(1.2)',
        clearProps: 'transform,opacity'
      }
    );
  }, [visibleChildren.length]);

  return (
    <section ref={containerRef} className="bg-white rounded-3xl shadow-sm border border-outline/10 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 border-b border-outline/5 pb-4">
        <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {visibleChildren}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-6 border-t border-outline/5 pt-4">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-secondary font-bold font-title-md hover:bg-secondary/5 px-4 py-2 rounded-lg transition-colors"
          >
            <span>{expanded ? 'Mostrar menos' : 'Ver más gráficas'}</span>
            <span className="material-symbols-outlined transition-transform" style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}>
              expand_more
            </span>
          </button>
        </div>
      )}
    </section>
  );
};

const SectionsModal = ({ apiData, activeSections, activeMetrics, onApply, onClose }) => {
  const { operationId } = useParams();
  const decodedOperation = decodeURIComponent(operationId || '');
  const [tempSections, setTempSections] = useState([...activeSections]);
  const [tempMetrics, setTempMetrics] = useState([...activeMetrics]);

  const toggleSection = (sec) => {
    setTempSections(prev => 
      prev.includes(sec) ? prev.filter(s => s !== sec) : [...prev, sec]
    );
  };

  const toggleMetric = (mId) => {
    setTempMetrics(prev => 
      prev.includes(mId) ? prev.filter(m => m !== mId) : [...prev, mId]
    );
  };

  const handleApply = () => {
    onApply(tempSections, tempMetrics);
    onClose();
  };

  const handleClear = () => {
    setTempSections(['lab', 'process', 'log']);
    const allMetrics = [
      ...apiData.laboratorio.map(m => m.metricId),
      ...apiData.proceso.map(m => m.metricId),
      ...apiData.bitacora.map(m => m.metricId)
    ];
    setTempMetrics(allMetrics);
  };

  const hasSelections = tempSections.length > 0;

  const renderMetricButtons = (categoryData, categoryName) => {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-2 mb-3 mt-4">
            <div className="w-1.5 h-4 bg-secondary rounded-full"></div>
            <h4 className="font-bold text-[#002733]/85 text-xs uppercase tracking-wider">Métricas de {categoryName}</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categoryData.map((m) => {
            const isChecked = tempMetrics.includes(m.metricId);
            return (
              <button 
                key={m.metricId}
                onClick={() => toggleMetric(m.metricId)}
                className={`h-14 border rounded-xl flex items-center justify-center text-xs font-bold text-center px-3 transition-all duration-200 active:scale-95 ${isChecked ? 'bg-[#00B0F0]/10 border-[#00B0F0] text-[#002733] shadow-sm font-extrabold' : 'bg-white border-outline/10 text-on-surface-variant hover:border-[#00B0F0]/50 hover:bg-[#00B0F0]/5'}`}
              >
                {m.title}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-[28px] shadow-2xl border border-outline/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#001016] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">filter_alt</span>
            </div>
            <div>
              <h3 className="font-headline-lg-mobile text-white font-bold">Seleccionar Secciones</h3>
              <p className="text-white/60 font-label-md text-xs mt-0.5">Semana 20 — {decodedOperation}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 flex-1 overflow-y-auto">
          {/* Blue Info Box */}
          <div className="bg-[#ebf4ff] border border-blue-100 rounded-2xl p-6 mb-6 flex items-start gap-4">
            <span className="material-symbols-outlined text-blue-600 text-2xl mt-0.5 flex-shrink-0">info</span>
            <div>
              <p className="font-title-md text-[#002733] font-bold mb-1">Categorías de Dashboard</p>
              <p className="text-[#002733]/70 font-body-md text-sm leading-relaxed">
                Active las categorías para habilitar sus gráficos específicos y luego seleccione las métricas que desea visualizar en tiempo real.
              </p>
            </div>
          </div>

          {/* Section Selector Checkboxes */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 bg-surface-container/30 p-5 rounded-2xl border border-outline/5 justify-between">
            {[
              { id: 'lab', label: 'Análisis de Laboratorio' },
              { id: 'process', label: 'Análisis de Proceso' },
              { id: 'log', label: 'Bitácora y Adiciones' }
            ].map(sec => (
              <label key={sec.id} className="flex items-center gap-3 cursor-pointer group select-none">
                <input 
                  type="checkbox" 
                  checked={tempSections.includes(sec.id)} 
                  onChange={() => toggleSection(sec.id)} 
                  className="w-5 h-5 rounded border-outline/30 text-secondary focus:ring-secondary cursor-pointer"
                />
                <span className="font-title-md text-[#002733] font-semibold group-hover:text-secondary transition-colors text-sm">{sec.label}</span>
              </label>
            ))}
          </div>
          
          <div className="space-y-6 min-h-[150px]">
            {!hasSelections && (
              <div className="text-on-surface-variant italic text-center py-10">
                Seleccione al menos una categoría para configurar sus métricas de calidad.
              </div>
            )}
            
            {tempSections.includes('lab') && renderMetricButtons(apiData.laboratorio, 'Análisis de Laboratorio')}
            {tempSections.includes('process') && renderMetricButtons(apiData.proceso, 'Análisis de Proceso')}
            {tempSections.includes('log') && renderMetricButtons(apiData.bitacora, 'Bitácora y Adiciones')}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 border-t border-outline/5 bg-surface-container-low/50 flex justify-between items-center">
          <button className="text-on-surface-variant font-bold hover:text-primary transition-colors text-sm" onClick={handleClear}>
            Restablecer Todo
          </button>
          <div className="flex gap-3">
            <button className="px-6 py-3 border border-outline/20 rounded-xl hover:bg-surface-container transition-colors bg-white font-bold text-sm" onClick={onClose}>
              Cancelar
            </button>
            <button 
              className={`px-8 py-3 rounded-xl transition-all font-bold text-sm shadow-md active:scale-95 ${hasSelections ? 'bg-[#001016] text-white hover:opacity-90' : 'bg-outline text-white/50 cursor-not-allowed'}`}
              disabled={!hasSelections}
              onClick={handleApply}
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PeriodModal = ({ onClose, onApply, currentWeek }) => {
  const { operationId } = useParams();
  const decodedOperation = decodeURIComponent(operationId || '');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('Mayo');
  const [selectedWeek, setSelectedWeek] = useState(currentWeek || 20);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-[28px] shadow-2xl border border-outline/10 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#001016] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">calendar_today</span>
            </div>
            <div>
              <h3 className="font-headline-lg-mobile text-white font-bold">Seleccionar Periodo</h3>
              <p className="text-white/60 font-label-md text-xs mt-0.5">Semana {selectedWeek} — {decodedOperation}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 flex-1 overflow-y-auto">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-2 tracking-wider">Año</label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-white border border-outline/20 rounded-xl px-4 py-3 text-on-surface font-title-md focus:border-[#00B0F0] focus:ring-1 focus:ring-[#00B0F0] outline-none cursor-pointer"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-2 tracking-wider">Mes</label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-white border border-outline/20 rounded-xl px-4 py-3 text-on-surface font-title-md focus:border-[#00B0F0] focus:ring-1 focus:ring-[#00B0F0] outline-none cursor-pointer"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="Enero">Enero</option>
                  <option value="Febrero">Febrero</option>
                  <option value="Marzo">Marzo</option>
                  <option value="Abril">Abril</option>
                  <option value="Mayo">Mayo</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="mb-6">
            <div className="grid grid-cols-8 gap-1 mb-2 text-center text-[10px] font-extrabold text-[#002733]/60">
              <div className="text-left flex items-end pb-1">SEMANA</div>
              <div className="pb-1">L</div>
              <div className="pb-1">M</div>
              <div className="pb-1">X</div>
              <div className="pb-1">J</div>
              <div className="pb-1">V</div>
              <div className="pb-1">S</div>
              <div className="pb-1">D</div>
            </div>

            {/* Weeks Mock Data */}
            {[
              { week: 18, days: [null, null, null, null, 1, 2, 3] },
              { week: 19, days: [4, 5, 6, 7, 8, 9, 10] },
              { week: 20, days: [11, 12, 13, 14, 15, 16, 17] },
              { week: 21, days: [18, 19, 20, 21, 22, 23, 24] }
            ].map(row => (
              <div key={row.week} className="grid grid-cols-8 gap-1 mb-2">
                <button 
                  onClick={() => setSelectedWeek(row.week)}
                  className={`h-10 text-[10px] font-bold rounded-lg flex items-center justify-center transition-all ${selectedWeek === row.week ? 'bg-[#00B0F0]/10 text-[#002733] border border-[#00B0F0] font-extrabold shadow-sm' : 'bg-surface-container-low border border-transparent text-on-surface-variant hover:border-outline/20'}`}
                >
                  Sem {row.week}
                </button>
                {row.days.map((day, idx) => (
                  <div 
                    key={idx} 
                    className={`h-10 text-xs rounded-lg flex items-center justify-center border transition-all ${day ? 'bg-white border-outline/10 text-on-surface font-bold' : 'bg-transparent border-transparent'} ${selectedWeek === row.week && day ? 'border-[#00B0F0]/30 bg-[#00B0F0]/5 font-black text-[#002733]' : ''}`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Info Banner */}
          <div className="bg-[#ebf4ff] border border-blue-100 rounded-2xl p-4 flex items-center gap-3 text-[#002733]/80">
            <span className="material-symbols-outlined text-blue-600 text-[20px] flex-shrink-0">info</span>
            <p className="text-[11px] leading-relaxed flex-1 font-semibold">
              Seleccione una semana o un día específico para actualizar la visualización de la bitácora del dashboard.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 border-t border-outline/5 bg-surface-container-low/50 flex justify-between items-center gap-4">
          <button className="px-6 py-3 border border-outline/20 rounded-xl hover:bg-surface-container transition-colors bg-white font-bold text-sm flex-1" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="px-6 py-3 bg-[#001016] text-white rounded-xl font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-md flex-1" 
            onClick={() => { onApply(selectedWeek); onClose(); }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

const OperationOverview = ({ isOperator = false }) => {
  const { processId, operationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const decodedProcess = decodeURIComponent(processId || '');
  const decodedOperation = decodeURIComponent(operationId || '');
  const base = location.pathname.startsWith('/operator') ? '/operator' : '';

  // Modals state
  const [showSectionsModal, setShowSectionsModal] = useState(false);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);


  // Filters state
  const [activeSections, setActiveSections] = useState(['lab', 'process', 'log']);
  const [activeMetrics, setActiveMetrics] = useState([]);
  const [activeWeek, setActiveWeek] = useState(20);

  const filterDataByWeek = (dataArray) => {
    if (!dataArray) return [];
    if (activeWeek === 18) return dataArray.slice(0, 7);
    if (activeWeek === 19) return dataArray.slice(7, 14);
    if (activeWeek === 20) return dataArray.slice(14, 18);
    if (activeWeek === 21) return []; // No data available in backend for 21
    return dataArray;
  };

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetchMockOperationData(decodedOperation)
      .then(data => {
        const storageKey = `spc_records_${decodedProcess}_${decodedOperation}`;
        const sessionRecords = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
        
        sessionRecords.forEach(newRecord => {
          const shortDate = newRecord.day ? newRecord.day.split('-').slice(0, 2).join('-') : 'Hoy';

          const updateMetric = (category, metricId, valKey, valSource) => {
            const metric = data[category].find(m => m.metricId === metricId);
            if (metric && valSource !== undefined && valSource !== null) {
              let pt = metric.data.find(d => d.date === shortDate);
              if (!pt) {
                pt = { date: shortDate };
                metric.data.push(pt);
              }
              if (valKey === 'conc-ph') {
                pt.conc = newRecord.conc !== undefined ? newRecord.conc : pt.conc;
                pt.ph = newRecord.ph !== undefined ? newRecord.ph : pt.ph;
              } else {
                pt.val = valSource;
              }
            }
          };

          updateMetric('laboratorio', 'conc-ph', 'conc-ph', newRecord.conc);
          updateMetric('laboratorio', 'tasa-reposicion', 'val', newRecord.repo);
          updateMetric('laboratorio', 'conductividad', 'val', newRecord.cond2);
          updateMetric('proceso', 'niveles-tanque', 'val', newRecord.level || newRecord.nivelTanque);
          updateMetric('proceso', 'temp-trabajo', 'val', newRecord.tempTrabajo);
          updateMetric('proceso', 'presion-suministro', 'val', newRecord.presionSuministro);
          updateMetric('proceso', 'nivel-mirilla', 'val', newRecord.nivelMirilla);
          updateMetric('proceso', 'func-filtros', 'val', newRecord.filtroStatus === 'SI' ? 1 : 0);
          updateMetric('proceso', 'func-skimmer', 'val', newRecord.skimmerStatus === 'SI' ? 1 : 0);
          updateMetric('proceso', 'func-recolector', 'val', newRecord.recolectorStatus === 'SI' ? 1 : 0);
          updateMetric('proceso', 'control-adiciones', 'val', newRecord.adicionesStatus === 'SI' ? 1 : 0);
          updateMetric('bitacora', 'adicion-material', 'val', newRecord.matAdd);
          updateMetric('bitacora', 'adicion-agua', 'val', newRecord.waterAdd);
          updateMetric('bitacora', 'estatus-operativo', 'val', newRecord.estatusFinal === 'OK' ? 1 : 0);
          
          if (newRecord.waterAdd && data.waterTank) {
             data.waterTank.adicionAguaToday += newRecord.waterAdd;
             data.waterTank.actual = Math.min(data.waterTank.actual + newRecord.waterAdd, data.waterTank.capacidad);
             data.waterTank.level = Math.round((data.waterTank.actual / data.waterTank.capacidad) * 100);
          }
        });

        const allMetrics = [
          ...data.laboratorio.map(m => m.metricId),
          ...data.proceso.map(m => m.metricId),
          ...data.bitacora.map(m => m.metricId)
        ];
        setActiveMetrics(allMetrics);
        setApiData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load mock operation data", err);
        setError(err.message);
        setLoading(false);
      });
  }, [decodedProcess, decodedOperation]);

  const mainContainerRef = useRef(null);

  useEffect(() => {
    if (loading || !mainContainerRef.current) return;

    // 1. Animate header elements
    const headerTitle = mainContainerRef.current.querySelector('.flex.justify-between.items-end');
    if (headerTitle) {
      gsap.fromTo(headerTitle,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.1)', clearProps: 'all' }
      );
    }

    // 2. Animate filter cards block & water capacity card
    const filterBlocks = mainContainerRef.current.querySelectorAll('.grid-cols-12 > div');
    if (filterBlocks.length > 0) {
      gsap.fromTo(filterBlocks,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: 'back.out(1.1)', clearProps: 'all' }
      );
    }
  }, [loading]);

  return (
    <div ref={mainContainerRef} className="animate-in fade-in duration-500 pb-12">
      {/* Header - Always visible */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-12">
        <div>
          <nav className="flex items-center gap-xs text-on-surface-variant font-label-md text-label-md mb-xs">
            <span className="cursor-pointer hover:text-secondary" onClick={() => navigate(`${base}/`)}>Proceso: {decodedProcess}</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-secondary font-bold">{decodedOperation}</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg">Overview de Operación: {decodedOperation}</h1>
          <p className="text-on-surface-variant font-body-md text-body-md">Monitoreo en tiempo real - Semana {activeWeek} (Mayo)</p>
        </div>
        <div className="flex gap-sm">
          <button 
            onClick={() => setShowPeriodModal(true)}
            className="bg-surface border border-outline/20 px-4 py-2 rounded-lg flex items-center gap-sm shadow-sm hover:bg-surface-container transition-colors disabled:opacity-50"
            disabled={loading || error}
          >
            <span className="material-symbols-outlined text-secondary">calendar_today</span>
            <span className="font-code-data text-code-data">Semana {activeWeek}</span>
          </button>
          <button 
            disabled={loading || error}
            className="bg-primary text-on-primary px-lg py-2 rounded-lg font-title-md text-title-md active:scale-95 transition-transform hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Exportar SPC
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 mt-12">
          <span className="material-symbols-outlined text-secondary animate-spin text-4xl mb-4">progress_activity</span>
          <p className="text-on-surface-variant font-body-md">Cargando métricas de operación...</p>
        </div>
      ) : error || !apiData || !apiData.laboratorio ? (
        <div className="bg-error/5 border border-error/20 rounded-2xl p-12 mt-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">cloud_off</span>
          </div>
          <h2 className="text-error font-headline-lg-mobile mb-2">Error de Conexión</h2>
          <p className="text-on-surface-variant max-w-md font-body-md">
            No se pudo conectar con el servidor para obtener las métricas en tiempo real. Por favor verifique que el servicio backend esté en ejecución o intente nuevamente más tarde.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-white border border-outline/20 rounded-lg hover:bg-surface-container transition-colors font-bold text-on-surface"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          {/* Filters and Status */}
          <div className="grid grid-cols-12 gap-6 md:gap-8 mb-8 md:mb-12 items-stretch">
            <div className="col-span-12 lg:col-span-8 flex flex-row items-center gap-4">
              <button 
                onClick={() => setShowSectionsModal(true)}
                className="flex items-center gap-3 px-6 py-4 bg-white border border-secondary text-secondary rounded-3xl font-title-lg hover:bg-secondary/5 transition-colors whitespace-nowrap shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-secondary text-2xl">filter_alt</span>
                <span className="flex-1 text-left">Seleccionar Secciones</span>
              </button>
              {isOperator && (
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-3 px-6 py-4 bg-primary text-on-primary rounded-3xl font-title-lg hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-2xl">edit_note</span>
                  <span className="flex-1 text-left">Editar Información</span>
                </button>
              )}
            </div>
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white border border-outline/10 rounded-3xl p-6 shadow-sm flex flex-row items-center gap-6 h-full">
                <div className="h-full flex items-center justify-center flex-shrink-0">
                    <WaterTank level={apiData.waterTank.level} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-2">Capacidad del Tanque</p>
                  <p className="font-display-lg text-headline-lg text-secondary leading-none mb-2">{apiData.waterTank.actual.toLocaleString()}L</p>
                  <p className="text-on-surface-variant font-body-lg mb-4">{apiData.waterTank.capacidad.toLocaleString()}L Total ({apiData.waterTank.level}%)</p>
                  <div className="bg-secondary/10 px-3 py-2 rounded-lg border border-secondary/20 inline-block w-fit">
                    <p className="text-xs text-vw-cyan font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">water_drop</span>
                      Adición Agua: +{apiData.waterTank.adicionAguaToday}L
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grouped Sections */}
          <div className="space-y-8 md:space-y-12">
            {/* 1. Análisis de Laboratorio */}
            {activeSections.includes('lab') && (
              <ExpandableSection title="Análisis de Laboratorio">
                {apiData.laboratorio.filter(m => activeMetrics.includes(m.metricId)).map(metric => {
                  const filteredData = filterDataByWeek(metric.data);
                  const status = filteredData.length > 0 && filteredData[filteredData.length - 1]?.val === null ? 'PENDING' : 'ESTABLE';
                  
                  return (
                    <OverviewChart 
                      key={metric.metricId}
                      title={metric.title} 
                      status={status} 
                      metricId={metric.metricId}
                      data={filteredData}
                      yDomain={metric.yDomain}
                      lines={metric.type === 'combined' 
                        ? [{ dataKey: 'ph', color: '#002733' }, { dataKey: 'conc', color: '#00B0F0' }] 
                        : [{ dataKey: 'val', color: '#002733' }]
                      }
                      referenceLines={metric.limits}
                    />
                  );
                })}
              </ExpandableSection>
            )}

        {/* 2. Análisis de Proceso */}
        {activeSections.includes('process') && (
          <ExpandableSection title="Análisis de Proceso">
             {apiData.proceso.filter(m => activeMetrics.includes(m.metricId)).map(metric => {
                const filteredData = filterDataByWeek(metric.data);
                const status = filteredData.length > 0 && filteredData[filteredData.length - 1]?.val === null ? 'PENDING' : 'OK';

                return (
                  <OverviewChart 
                    key={metric.metricId}
                    title={metric.title} 
                    status={status} 
                    metricId={metric.metricId}
                    data={filteredData}
                    yDomain={metric.yDomain}
                    lines={[{ dataKey: 'val', color: '#002733' }]}
                    referenceLines={metric.limits}
                  />
                );
             })}
          </ExpandableSection>
        )}

        {/* 3. Bitácora y Adiciones */}
        {activeSections.includes('log') && (
          <ExpandableSection title="Bitácora y Adiciones">
            {apiData.bitacora.filter(m => activeMetrics.includes(m.metricId)).map(metric => {
                const filteredData = filterDataByWeek(metric.data);
                const status = filteredData.length > 0 && filteredData[filteredData.length - 1]?.val === null ? 'PENDING' : 'REGISTRADO';

                return (
                  <OverviewChart 
                    key={metric.metricId}
                    title={metric.title} 
                    status={status} 
                    metricId={metric.metricId}
                    data={filteredData}
                    yDomain={metric.yDomain}
                    lines={[{ dataKey: 'val', color: '#002733' }]}
                    referenceLines={metric.limits}
                  />
                );
             })}
          </ExpandableSection>
        )}
      </div>
      </>
      )}

      {/* Modals */}
      {showSectionsModal && (
        <SectionsModal 
          apiData={apiData} 
          activeSections={activeSections} 
          activeMetrics={activeMetrics}
          onApply={(secs, mets) => {
            setActiveSections(secs);
            setActiveMetrics(mets);
          }}
          onClose={() => setShowSectionsModal(false)}
        />
      )}

      {showPeriodModal && (
        <PeriodModal 
          currentWeek={activeWeek}
          onApply={(week) => setActiveWeek(week)}
          onClose={() => setShowPeriodModal(false)} 
        />
      )}


      {showEditModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[28px] shadow-2xl border border-outline/10 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#001016] px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">edit_note</span>
                </div>
                <div>
                  <h3 className="font-headline-lg-mobile text-white font-bold">Editar Información</h3>
                  <p className="text-white/60 font-label-md text-xs mt-0.5">Semana {activeWeek} — {decodedOperation}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors" onClick={() => setShowEditModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {/* Light Blue Banner Box */}
              <div className="bg-[#ebf4ff] border border-blue-100 rounded-2xl p-6 mb-6 flex items-start gap-4">
                <span className="material-symbols-outlined text-blue-600 text-2xl mt-0.5 flex-shrink-0">engineering</span>
                <div>
                  <p className="font-title-md text-[#002733] font-bold mb-1">Módulo en Desarrollo</p>
                  <p className="text-[#002733]/70 font-body-md text-sm leading-relaxed">
                    El módulo de captura y edición de información de parámetros está en desarrollo activo para la siguiente versión del sistema.
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <div className="flex flex-col gap-4 mb-2 select-none">
                <div className="flex items-center gap-3 text-on-surface-variant font-semibold text-sm">
                  <span className="material-symbols-outlined text-[#0e6f85] text-[20px] flex-shrink-0">check_circle</span>
                  Captura diaria de parámetros de laboratorio
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant font-semibold text-sm">
                  <span className="material-symbols-outlined text-[#0e6f85] text-[20px] flex-shrink-0">check_circle</span>
                  Histórico retroactivo de 30 días
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant font-semibold text-sm">
                  <span className="material-symbols-outlined text-[#0e6f85] text-[20px] flex-shrink-0">check_circle</span>
                  Edición de bitácora y adiciones
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 pb-8">
              <button 
                onClick={() => setShowEditModal(false)} 
                className="w-full py-4 bg-[#001016] text-white rounded-2xl font-bold hover:opacity-95 transition-all active:scale-[0.98] shadow-md"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OperationOverview;
