import React, { useState, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Calendar, Clock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const mockData = [
  { time: '06:00', ph: 9.2, conc: 5.1 },
  { time: '10:00', ph: 9.4, conc: 5.3 },
  { time: '14:00', ph: 9.1, conc: 5.2 },
  { time: '18:00', ph: 9.5, conc: 5.5 },
  { time: '22:00', ph: 9.3, conc: 5.4 },
];

const mockAuditTrail = [
  { id: 1, date: '2023-10-25 14:15', user: 'Ing. Alejandro Silva', param: 'Concentración', original: '4.8', corrected: '5.2', reason: 'Ajuste por evaporación' },
  { id: 2, date: '2023-10-24 09:30', user: 'Juan Pérez', param: 'pH', original: '8.9', corrected: '9.2', reason: 'Adición de alcalinizante' },
  { id: 3, date: '2023-10-23 18:45', user: 'Admin', param: 'Skimmer', original: 'Off', corrected: 'On', reason: 'Presencia de aceite libre' },
];
const mockWeekData = [
  { time: 'Lun', ph: 9.1, conc: 5.0 },
  { time: 'Mar', ph: 9.3, conc: 5.2 },
  { time: 'Mié', ph: 9.2, conc: 5.1 },
  { time: 'Jue', ph: 9.4, conc: 5.3 },
  { time: 'Vie', ph: 9.2, conc: 5.2 },
  { time: 'Sáb', ph: 9.1, conc: 5.1 },
  { time: 'Dom', ph: 9.3, conc: 5.3 },
];

const ChartDetail = ({ processName }) => {
  const [timeScale, setTimeScale] = useState('Semana');
  const { capturedData = [] } = useContext(AuthContext);

  const finalData = timeScale === 'Semana' 
    ? mockWeekData.map((dayObj, index) => {
        const capture = capturedData.find(c => c.dayIndex === index);
        if (capture) {
          return {
            ...dayObj,
            ph: parseFloat(capture.ph) || dayObj.ph,
            conc: parseFloat(capture.conc) || dayObj.conc
          };
        }
        return dayObj;
      })
    : mockData;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Chart Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h3 className="text-xl font-bold text-vw-blue">Tendencia de Parámetros Críticos</h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center"><Clock size={14} className="mr-1"/> Actualizado hace 5 min</p>
        </div>
        
        {/* Time Scale Toggles */}
        <div className="flex bg-gray-200 p-1 rounded-lg">
          {['Día', 'Semana', 'Mes', 'Año'].map(scale => (
            <button
              key={scale}
              onClick={() => setTimeScale(scale)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                timeScale === scale 
                  ? 'bg-white text-vw-blue shadow-sm' 
                  : 'text-gray-600 hover:text-vw-blue'
              }`}
            >
              {scale}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={finalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
            <YAxis yAxisId="left" domain={[8, 10]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
            <YAxis yAxisId="right" orientation="right" domain={[4, 6]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={10} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            
            {/* Control Limits Reference Area (Example for pH 9.0 - 9.5) */}
            <ReferenceArea yAxisId="left" y1={9.0} y2={9.5} fill="#22c55e" fillOpacity={0.1} />

            <Line yAxisId="left" type="monotone" dataKey="ph" name="pH" stroke="#002733" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey="conc" name="Concentración (%)" stroke="#00B0F0" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Audit Trail Table */}
      <div className="p-6 border-t border-gray-100">
        <h4 className="text-lg font-bold text-vw-blue mb-4 flex items-center">
          <Calendar size={18} className="mr-2 text-vw-cyan" />
          Audit Trail (Trazabilidad)
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Fecha / Hora</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Parámetro</th>
                <th className="px-4 py-3">Valor Orig.</th>
                <th className="px-4 py-3">Valor Corr.</th>
                <th className="px-4 py-3 rounded-tr-lg">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {mockAuditTrail.map((log) => (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{log.date}</td>
                  <td className="px-4 py-3 text-gray-600">{log.user}</td>
                  <td className="px-4 py-3 text-vw-blue font-semibold">{log.param}</td>
                  <td className="px-4 py-3 text-gray-500 line-through decoration-red-400">{log.original}</td>
                  <td className="px-4 py-3 font-bold text-green-600">{log.corrected}</td>
                  <td className="px-4 py-3 text-gray-600 italic">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChartDetail;
