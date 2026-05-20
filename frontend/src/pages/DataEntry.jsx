import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DataEntry = () => {
  const { processId, operationId } = useParams();
  const navigate = useNavigate();
  const decodedOperation = decodeURIComponent(operationId);

  const [activeTab, setActiveTab] = useState('grupo1');

  const [formData, setFormData] = useState({
    conc: '', ph: '', concMin: '2.00', concMax: '6.00', concIntMin: '3.50', concIntMax: '5.40',
    phMin: '9.00', phMax: '10.00', phIntMin: '9.10', phIntMax: '9.90',
    durezaDetControl: '< 150 ppm', repoDiariaControl: '≤ 2%', durezaAguaDIControl: '< 10 ppm',
    durezaAguaPTControl: '< 150 ppm', condDetControl: '< 5000 uS/cm', aceiteLibreControl: '< 2%',
    solidosControl: '< 30 ppm',
    filtroStatus: 'SI', skimmerStatus: 'SI', recolectorStatus: 'SI', adicionesStatus: 'SI', porronStatus: 'NO',
    nivelTanque: '', tempTrabajo: '', presionSuministro: '', nivelMirilla: '',
    tanqueMin: '90', tanqueMax: '120', tempMin: '50', tempMax: '59',
    presionMin: '4', presionMax: '5', filtroVacio: '',
    conc2: '', cond2: '', matAdd: '', waterAdd: '', capacity: '', repo: '', level: '100', estatusFinal: 'OK'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const today = new Date();
    const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const dayStr = `${String(today.getDate()).padStart(2, '0')}-${monthNames[today.getMonth()]}-${String(today.getFullYear()).slice(2)}`;
    
    const record = {
      day: dayStr,
      timestamp: today.toISOString(),
      conc: formData.conc ? parseFloat(formData.conc) : null,
      conc2: formData.conc2 ? parseFloat(formData.conc2) : null,
      ph: formData.ph ? parseFloat(formData.ph) : null,
      cond2: formData.cond2 ? parseFloat(formData.cond2) : null,
      matAdd: formData.matAdd ? parseFloat(formData.matAdd) : null,
      waterAdd: formData.waterAdd ? parseFloat(formData.waterAdd) : null,
      capacity: formData.capacity ? parseFloat(formData.capacity) : null,
      repo: formData.repo ? parseFloat(formData.repo) : null,
      level: formData.level ? parseFloat(formData.level) : null,
      estatusFinal: formData.estatusFinal,
      comentarios: formData.comentarioLab || '',
      limits: {
        ph: { 
          min: parseFloat(formData.phMin) || 9.0, 
          max: parseFloat(formData.phMax) || 10.0, 
          intMin: parseFloat(formData.phIntMin?.replace('≤', '')?.replace('≥', '')) || 9.1, 
          intMax: parseFloat(formData.phIntMax?.replace('≤', '')?.replace('≥', '')) || 9.9,
          tickStep: 0.2
        },
        conc: { 
          min: parseFloat(formData.concMin) || 2.0, 
          max: parseFloat(formData.concMax) || 6.0, 
          intMin: parseFloat(formData.concIntMin?.replace('≤', '')?.replace('≥', '')) || 3.5, 
          intMax: parseFloat(formData.concIntMax?.replace('≤', '')?.replace('≥', '')) || 5.4,
          tickStep: 0.1
        }
      }
    };

    try {
      const isOperator = window.location.pathname.startsWith('/operator');
      const storageKey = `spc_records_${processId}_${operationId}`;
      const existing = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
      
      // Update if exists, otherwise push
      const existingIdx = existing.findIndex(r => r.day === record.day);
      if (existingIdx !== -1) existing[existingIdx] = record;
      else existing.push(record);
      
      sessionStorage.setItem(storageKey, JSON.stringify(existing));
      
      navigate(`${isOperator ? '/operator' : ''}/proceso/${processId}/operacion/${operationId}`);
    } catch (error) {
      console.error("Error saving to session storage:", error);
      alert("Error al guardar el registro en memoria local");
    }
  };

  const todayStr = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <nav className="flex text-[12px] text-on-surface-variant mb-1 gap-1">
            <span className="text-secondary font-bold capitalize">{todayStr}</span>
          </nav>
          <h1 className="font-headline-lg text-[32px] text-on-surface font-semibold">Llenado de Información</h1>
          <p className="text-[14px] text-on-surface-variant">{decodedOperation}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSave}
            className="bg-primary-container hover:bg-primary-container/90 text-on-primary-container px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: '"FILL" 1'}}>save</span>
            Guardar Registro
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex border-b border-outline/20 mb-8 overflow-x-auto gap-8">
        <button 
          onClick={() => setActiveTab('grupo1')}
          className={`pb-4 px-1 font-semibold text-[18px] border-b-2 transition-colors ${activeTab === 'grupo1' ? 'text-secondary border-secondary' : 'text-on-surface-variant border-transparent hover:text-secondary'}`}
        >
          Análisis de Laboratorio
        </button>
        <button 
          onClick={() => setActiveTab('grupo2')}
          className={`pb-4 px-1 font-semibold text-[18px] border-b-2 transition-colors ${activeTab === 'grupo2' ? 'text-secondary border-secondary' : 'text-on-surface-variant border-transparent hover:text-secondary'}`}
        >
          Análisis de Proceso
        </button>
        <button 
          onClick={() => setActiveTab('grupo3')}
          className={`pb-4 px-1 font-semibold text-[18px] border-b-2 transition-colors ${activeTab === 'grupo3' ? 'text-secondary border-secondary' : 'text-on-surface-variant border-transparent hover:text-secondary'}`}
        >
          Bitácora y Adiciones
        </button>
      </div>

      {/* Tab Content: Grupo 1 */}
      {activeTab === 'grupo1' && (
        <section className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-xl border border-outline/10 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-secondary">biotech</span>
                <h3 className="font-semibold text-[18px]">Parámetros Químicos</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-on-surface-variant">Concentración (%)</label>
                  <input name="conc" value={formData.conc} onChange={handleInputChange} className="w-full bg-surface border border-outline/30 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg p-2" placeholder="0.00" step="0.01" type="number" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-on-surface-variant">pH</label>
                  <input name="ph" value={formData.ph} onChange={handleInputChange} className="w-full bg-surface border border-outline/30 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg p-2" placeholder="7.0" step="0.1" type="number" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-on-surface-variant">Dureza de detergente (ºdH)</label>
                  <input className="w-full bg-surface border border-outline/30 rounded-lg p-2" placeholder="12" type="number" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-on-surface-variant">Conductividad detergente (µS/cm)</label>
                  <input className="w-full bg-surface border border-outline/30 rounded-lg p-2" placeholder="1200" type="number" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[12px] font-medium text-on-surface-variant">Comentario</label>
                  <textarea className="w-full bg-surface border border-outline/30 rounded-lg p-2 h-20 resize-none" placeholder="Observaciones adicionales de laboratorio..."></textarea>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-outline/10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-secondary">settings_input_component</span>
                  <h3 className="font-semibold text-[18px]">Rangos de Control</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-on-surface-variant">Rango de concentracion (%)</label>
                    <div className="flex gap-2">
                      <input name="concMin" value={formData.concMin} onChange={handleInputChange} className="w-1/2 bg-surface border border-outline/30 rounded-lg p-2 text-sm" placeholder="Min" />
                      <input name="concMax" value={formData.concMax} onChange={handleInputChange} className="w-1/2 bg-surface border border-outline/30 rounded-lg p-2 text-sm" placeholder="Max" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-on-surface-variant">Rango de intervencion [C]</label>
                    <div className="flex gap-2">
                      <input name="concIntMin" value={formData.concIntMin} onChange={handleInputChange} className="w-1/2 bg-surface border border-outline/30 rounded-lg p-2 text-sm" placeholder="Min" />
                      <input name="concIntMax" value={formData.concIntMax} onChange={handleInputChange} className="w-1/2 bg-surface border border-outline/30 rounded-lg p-2 text-sm" placeholder="Max" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-on-surface-variant">Rango pH</label>
                    <div className="flex gap-2">
                      <input name="phMin" value={formData.phMin} onChange={handleInputChange} className="w-1/2 bg-surface border border-outline/30 rounded-lg p-2 text-sm" placeholder="Min" />
                      <input name="phMax" value={formData.phMax} onChange={handleInputChange} className="w-1/2 bg-surface border border-outline/30 rounded-lg p-2 text-sm" placeholder="Max" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-on-surface-variant">Rango intervencion pH</label>
                    <div className="flex gap-2">
                      <input name="phIntMin" value={formData.phIntMin} onChange={handleInputChange} className="w-1/2 bg-surface border border-outline/30 rounded-lg p-2 text-sm" placeholder="Min" />
                      <input name="phIntMax" value={formData.phIntMax} onChange={handleInputChange} className="w-1/2 bg-surface border border-outline/30 rounded-lg p-2 text-sm" placeholder="Max" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-on-surface-variant">Dureza detergente</label>
                    <input name="durezaDetControl" value={formData.durezaDetControl} onChange={handleInputChange} className="w-full bg-surface border border-outline/30 rounded-lg p-2 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-on-surface-variant">Reposicion diaria agua/concentrado</label>
                    <input name="repoDiariaControl" value={formData.repoDiariaControl} onChange={handleInputChange} className="w-full bg-surface border border-outline/30 rounded-lg p-2 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-on-surface-variant">Dureza agua DI</label>
                    <input name="durezaAguaDIControl" value={formData.durezaAguaDIControl} onChange={handleInputChange} className="w-full bg-surface border border-outline/30 rounded-lg p-2 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-on-surface-variant">Dureza agua PT</label>
                    <input name="durezaAguaPTControl" value={formData.durezaAguaPTControl} onChange={handleInputChange} className="w-full bg-surface border border-outline/30 rounded-lg p-2 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-on-surface-variant">Conductividad detergente</label>
                    <input name="condDetControl" value={formData.condDetControl} onChange={handleInputChange} className="w-full bg-surface border border-outline/30 rounded-lg p-2 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-on-surface-variant">Aceite libre</label>
                    <input name="aceiteLibreControl" value={formData.aceiteLibreControl} onChange={handleInputChange} className="w-full bg-surface border border-outline/30 rounded-lg p-2 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-on-surface-variant">Solidos suspendidos</label>
                    <input name="solidosControl" value={formData.solidosControl} onChange={handleInputChange} className="w-full bg-surface border border-outline/30 rounded-lg p-2 text-sm" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary-container/10 p-6 rounded-xl border border-secondary/20">
              <h3 className="font-semibold text-[18px] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">water_drop</span>
                Calidad de Agua
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-on-surface-variant">Dureza agua DI</label>
                  <input className="w-full bg-white border border-outline/30 rounded-lg p-2" type="number" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-on-surface-variant">Dureza agua PT</label>
                  <input className="w-full bg-white border border-outline/30 rounded-lg p-2" type="number" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab Content: Grupo 2 */}
      {activeTab === 'grupo2' && (
        <section className="space-y-6 animate-in slide-in-from-right duration-500">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            <div className="xl:col-span-1 bg-white p-4 rounded-xl border border-outline/10 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary text-lg">precision_manufacturing</span>
                <h3 className="text-[16px] font-bold">Estado Mecánico</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-surface rounded-lg">
                  <span className="text-[12px]">Funcionamento de filtros</span>
                  <div className="flex gap-1">
                    <button onClick={() => handleToggle('filtroStatus', 'SI')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${formData.filtroStatus === 'SI' ? 'bg-secondary text-on-secondary' : 'border border-outline/30 text-on-surface-variant'}`}>SI</button>
                    <button onClick={() => handleToggle('filtroStatus', 'NO')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${formData.filtroStatus === 'NO' ? 'bg-secondary text-on-secondary' : 'border border-outline/30 text-on-surface-variant'}`}>NO</button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface rounded-lg">
                  <span className="text-[12px]">Funcionamiento Skimmer</span>
                  <div className="flex gap-1">
                    <button onClick={() => handleToggle('skimmerStatus', 'SI')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${formData.skimmerStatus === 'SI' ? 'bg-secondary text-on-secondary' : 'border border-outline/30 text-on-surface-variant'}`}>SI</button>
                    <button onClick={() => handleToggle('skimmerStatus', 'NO')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${formData.skimmerStatus === 'NO' ? 'bg-secondary text-on-secondary' : 'border border-outline/30 text-on-surface-variant'}`}>NO</button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface rounded-lg">
                  <span className="text-[12px]">Funcionamiento recolector<br/>de aceite tanque principal</span>
                  <div className="flex gap-1">
                    <button onClick={() => handleToggle('recolectorStatus', 'SI')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${formData.recolectorStatus === 'SI' ? 'bg-secondary text-on-secondary' : 'border border-outline/30 text-on-surface-variant'}`}>SI</button>
                    <button onClick={() => handleToggle('recolectorStatus', 'NO')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${formData.recolectorStatus === 'NO' ? 'bg-secondary text-on-secondary' : 'border border-outline/30 text-on-surface-variant'}`}>NO</button>
                  </div>
                </div>
                <div className="pt-2 border-t border-outline/10 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px]">Control de Adiciones</span>
                    <div className="flex gap-1">
                      <button onClick={() => handleToggle('adicionesStatus', 'SI')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${formData.adicionesStatus === 'SI' ? 'bg-secondary text-on-secondary' : 'border border-outline/30 text-on-surface-variant'}`}>SI</button>
                      <button onClick={() => handleToggle('adicionesStatus', 'NO')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${formData.adicionesStatus === 'NO' ? 'bg-secondary text-on-secondary' : 'border border-outline/30 text-on-surface-variant'}`}>NO</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px]">Retiro de porrón de Aceite</span>
                    <div className="flex gap-1">
                      <button onClick={() => handleToggle('porronStatus', 'SI')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${formData.porronStatus === 'SI' ? 'bg-secondary text-on-secondary' : 'border border-outline/30 text-on-surface-variant'}`}>SI</button>
                      <button onClick={() => handleToggle('porronStatus', 'NO')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${formData.porronStatus === 'NO' ? 'bg-secondary text-on-secondary' : 'border border-outline/30 text-on-surface-variant'}`}>NO</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-outline/10 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-secondary text-lg">thermostat</span>
                  <h3 className="text-[16px] font-bold">Niveles y Temperatura</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-on-surface-variant">Niveles de tanque</label>
                    <input name="nivelTanque" value={formData.nivelTanque} onChange={handleInputChange} className="w-full bg-surface border border-outline/30 rounded-lg p-1.5 text-sm" placeholder="85" type="text" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-on-surface-variant">Temperatura de trabajo (ºC)</label>
                    <input name="tempTrabajo" value={formData.tempTrabajo} onChange={handleInputChange} className="w-full bg-surface border border-outline/30 rounded-lg p-1.5 text-sm" placeholder="60" type="number" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-on-surface-variant">Presión suministro (bar)</label>
                    <input name="presionSuministro" value={formData.presionSuministro} onChange={handleInputChange} className="w-full bg-surface border border-outline/30 rounded-lg p-1.5 text-sm" placeholder="4.5" step="0.1" type="number" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-on-surface-variant">Nivel de mirilla del tanque de filtro de vacio</label>
                    <input name="nivelMirilla" value={formData.nivelMirilla} onChange={handleInputChange} className="w-full bg-surface border border-outline/30 rounded-lg p-1.5 text-sm" placeholder="25" type="text" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-outline/10 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-secondary text-lg">settings_input_component</span>
                  <h3 className="text-[16px] font-bold">Rangos Control Operativos</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-on-surface-variant">Tanque (Min-Max)</label>
                    <div className="flex gap-1">
                      <input name="tanqueMin" value={formData.tanqueMin} onChange={handleInputChange} className="w-1/2 bg-surface border border-outline/30 rounded-lg p-1.5 text-xs" placeholder="90" type="number" />
                      <input name="tanqueMax" value={formData.tanqueMax} onChange={handleInputChange} className="w-1/2 bg-surface border border-outline/30 rounded-lg p-1.5 text-xs" placeholder="120" type="number" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-on-surface-variant">Temp. (Min-Max º)</label>
                    <div className="flex gap-1">
                      <input name="tempMin" value={formData.tempMin} onChange={handleInputChange} className="w-1/2 bg-surface border border-outline/30 rounded-lg p-1.5 text-xs" placeholder="50" type="number" />
                      <input name="tempMax" value={formData.tempMax} onChange={handleInputChange} className="w-1/2 bg-surface border border-outline/30 rounded-lg p-1.5 text-xs" placeholder="59" type="number" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-on-surface-variant">Presión (Min-Max bar)</label>
                    <div className="flex gap-1">
                      <input name="presionMin" value={formData.presionMin} onChange={handleInputChange} className="w-1/2 bg-surface border border-outline/30 rounded-lg p-1.5 text-xs" placeholder="4" type="number" />
                      <input name="presionMax" value={formData.presionMax} onChange={handleInputChange} className="w-1/2 bg-surface border border-outline/30 rounded-lg p-1.5 text-xs" placeholder="5" type="number" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-on-surface-variant">Filtro Vacio (m3)</label>
                    <input name="filtroVacio" value={formData.filtroVacio} onChange={handleInputChange} className="w-full bg-surface border border-outline/30 rounded-lg p-1.5 text-xs" placeholder="Valor m3" type="text" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab Content: Grupo 3 */}
      {activeTab === 'grupo3' && (
        <section className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="bg-white p-8 rounded-xl border border-outline/10 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <span className="material-symbols-outlined text-secondary">history_edu</span>
              <h3 className="text-[24px] font-semibold">Resumen de Bitácora y Adiciones</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="p-6 bg-surface rounded-xl border border-outline/10">
                  <label className="text-[12px] font-medium text-on-surface-variant block mb-2">Concentración 2da Muestra</label>
                  <div className="flex items-center gap-4">
                    <input name="conc2" value={formData.conc2} onChange={handleInputChange} className="flex-1 bg-white border border-outline/30 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg p-2 text-[20px]" placeholder="0.0" type="number" step="0.01" />
                    <span className="text-[16px]">%</span>
                  </div>
                </div>
                <div className="p-6 bg-surface rounded-xl border border-outline/10">
                  <label className="text-[12px] font-medium text-on-surface-variant block mb-2">Conductividad</label>
                  <div className="flex items-center gap-4">
                    <input name="cond2" value={formData.cond2} onChange={handleInputChange} className="flex-1 bg-white border border-outline/30 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg p-2 text-[20px]" placeholder="000" type="number" />
                    <span className="text-[16px]">µS</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-6 bg-[#ffdcc6]/20 rounded-xl border border-[#ffdcc6]">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[12px] font-medium text-[#713700]">Adición de Material</label>
                    <span className="material-symbols-outlined text-[#ffb785]">inventory_2</span>
                  </div>
                  <input name="matAdd" value={formData.matAdd} onChange={handleInputChange} className="w-full bg-white border border-outline/30 rounded-lg p-2 text-[20px]" placeholder="Litros" type="number" />
                </div>
                <div className="p-6 bg-secondary-container/20 rounded-xl border border-secondary/30">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[12px] font-medium text-on-secondary-container">Adición de Agua</label>
                    <span className="material-symbols-outlined text-secondary">waves</span>
                  </div>
                  <input name="waterAdd" value={formData.waterAdd} onChange={handleInputChange} className="w-full bg-white border border-outline/30 rounded-lg p-2 text-[20px]" placeholder="Litros" type="number" />
                </div>
              </div>
              
              <div className="space-y-4 bg-surface p-6 rounded-xl border border-outline/10">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-on-surface-variant">Capacidad (L)</label>
                  <input name="capacity" value={formData.capacity} onChange={handleInputChange} className="w-full border border-outline/30 rounded-lg p-2" placeholder="0" type="number" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-on-surface-variant">% de Reposición</label>
                  <input name="repo" value={formData.repo} onChange={handleInputChange} className="w-full border border-outline/30 rounded-lg p-2" placeholder="Valor decimal" type="number" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[12px] font-medium text-on-surface-variant">Nivel cm operativo (90-110)</label>
                    {(parseInt(formData.level) < 90 || parseInt(formData.level) > 110) && (
                      <span className="text-[10px] text-red-600 font-bold">FUERA DE RANGO</span>
                    )}
                  </div>
                  <input name="level" value={formData.level} onChange={handleInputChange} className={`w-full border ${parseInt(formData.level) < 90 || parseInt(formData.level) > 110 ? 'border-red-600 focus:ring-red-600' : 'border-outline/30'} rounded-lg p-2`} placeholder="100" type="number" />
                </div>
                <div className="pt-2">
                  <label className="text-[12px] font-medium text-on-surface-variant block mb-2">Estatus Final</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleToggle('estatusFinal', 'OK')} className={`py-2 rounded-lg font-bold border transition-colors ${formData.estatusFinal === 'OK' ? 'bg-secondary text-on-secondary border-secondary' : 'border-secondary text-secondary hover:bg-secondary/5'}`}>OK</button>
                    <button onClick={() => handleToggle('estatusFinal', 'NO OK')} className={`py-2 rounded-lg font-bold border transition-colors ${formData.estatusFinal === 'NO OK' ? 'bg-red-600 text-white border-red-600' : 'border-red-600 text-red-600 hover:bg-red-600/5'}`}>NO OK</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default DataEntry;
