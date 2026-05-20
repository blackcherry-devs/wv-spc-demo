import React, { useState, useContext } from 'react';
import DataEntryModal from './DataEntryModal';
import { AuthContext } from '../context/AuthContext';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const WeeklySemaforo = ({ processName }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const { capturedData } = useContext(AuthContext);

  const handleDayClick = (dayIndex, dayName) => {
    setSelectedDay({ index: dayIndex, name: dayName });
    setModalOpen(true);
  };

  const getDayStatus = (index) => {
    const capture = capturedData.find(d => d.dayIndex === index);
    if (!capture) return 'PENDING';
    return capture.status;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-bold text-vw-blue mb-6 border-b pb-2">Semana Actual - {processName}</h2>
      
      <div className="grid grid-cols-7 gap-4 text-center">
        {DAYS.map((day, index) => {
          const status = getDayStatus(index);
          let bgColor = 'bg-gray-300 hover:bg-gray-400';
          let shadowColor = '';

          if (status === 'OK') {
            bgColor = 'bg-green-500';
            shadowColor = 'shadow-green-500/50';
          } else if (status === 'NOK') {
            bgColor = 'bg-red-500';
            shadowColor = 'shadow-red-500/50';
          }

          return (
            <div key={day} className="flex flex-col items-center">
              <span className="text-xs font-semibold text-gray-500 mb-3">{day.substring(0, 3)}</span>
              <button
                onClick={() => handleDayClick(index, day)}
                className={`w-12 h-12 rounded-full ${bgColor} transition-all duration-300 shadow-md ${shadowColor} hover:scale-110 focus:outline-none focus:ring-4 focus:ring-vw-cyan/50`}
                title={`Capturar datos para ${day}`}
              />
              {status !== 'PENDING' && (
                <span className={`text-[10px] mt-2 font-bold ${status === 'OK' ? 'text-green-600' : 'text-red-600'}`}>
                  {status}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <DataEntryModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          dayIndex={selectedDay.index}
          dayName={selectedDay.name}
        />
      )}
    </div>
  );
};

export default WeeklySemaforo;
