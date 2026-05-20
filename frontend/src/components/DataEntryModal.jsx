import React, { useState, useContext } from 'react';
import { X, Beaker, Settings2, ClipboardList, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const DataEntryModal = ({ isOpen, onClose, dayIndex, dayName }) => {
  const [activeTab, setActiveTab] = useState('Lab');
  
  // Form State
  const [ph, setPh] = useState('');
  const [conc, setConc] = useState('');
  const [filter, setFilter] = useState(false);
  const [skimmer, setSkimmer] = useState(false);
  const [additions, setAdditions] = useState('');
  const [comments, setComments] = useState('');

  const { addCapture } = useContext(AuthContext);

  if (!isOpen) return null;

  const handleSave = () => {
    // Determine status based on simple mock logic:
    // E.g., if pH is between 9.0 and 9.5 and conc between 5.0 and 5.5, it's OK (Green), else NOK (Red).
    const isPhOk = parseFloat(ph) >= 9.0 && parseFloat(ph) <= 9.5;
    const isConcOk = parseFloat(conc) >= 5.0 && parseFloat(conc) <= 5.5;
    
    const status = (isPhOk && isConcOk) ? 'OK' : 'NOK';

    addCapture({
      dayIndex,
      ph,
      conc,
      filter,
      skimmer,
      additions,
      comments,
      status
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-vw-blue p-5 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Captura de Parámetros</h2>
            <p className="text-vw-cyan text-sm mt-1">{dayName}</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button 
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'Lab' ? 'border-vw-cyan text-vw-blue bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('Lab')}
          >
            <Beaker size={18} /> <span>Lab</span>
          </button>
          <button 
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'Process' ? 'border-vw-cyan text-vw-blue bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('Process')}
          >
            <Settings2 size={18} /> <span>Proceso</span>
          </button>
          <button 
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'Log' ? 'border-vw-cyan text-vw-blue bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('Log')}
          >
            <ClipboardList size={18} /> <span>Bitácora</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 h-64 overflow-y-auto">
          {activeTab === 'Lab' && (
            <div className="space-y-4 animate-in slide-in-from-right-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">pH (Muestra 1)</label>
                <input 
                  type="number" step="0.1" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-vw-cyan focus:border-vw-cyan outline-none"
                  value={ph} onChange={e => setPh(e.target.value)}
                  placeholder="Ej. 9.2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Concentración (%)</label>
                <input 
                  type="number" step="0.1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-vw-cyan focus:border-vw-cyan outline-none"
                  value={conc} onChange={e => setConc(e.target.value)}
                  placeholder="Ej. 5.2"
                />
              </div>
            </div>
          )}

          {activeTab === 'Process' && (
            <div className="space-y-6 animate-in slide-in-from-right-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Filtro de Banda</h4>
                  <p className="text-xs text-gray-500">¿Cambio de papel filtrante?</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={filter} onChange={() => setFilter(!filter)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vw-cyan"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Skimmer</h4>
                  <p className="text-xs text-gray-500">¿Limpieza de banda oleofílica?</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={skimmer} onChange={() => setSkimmer(!skimmer)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vw-cyan"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'Log' && (
            <div className="space-y-4 animate-in slide-in-from-right-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adiciones (Agua/Químico)</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-vw-cyan focus:border-vw-cyan outline-none"
                  value={additions} onChange={e => setAdditions(e.target.value)}
                  placeholder="Ej. 50L Agua, 2L Químico"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comentarios (Obligatorio)</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-vw-cyan focus:border-vw-cyan outline-none resize-none h-24"
                  value={comments} onChange={e => setComments(e.target.value)}
                  placeholder="Observaciones del turno..."
                  required
                ></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={activeTab === 'Log' && !comments.trim()}
            className="px-5 py-2 bg-vw-blue hover:bg-vw-blue/90 text-white text-sm font-bold rounded-lg shadow flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={16} /> <span>Guardar</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default DataEntryModal;
