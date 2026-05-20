import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { fetchMockOperationData } from '../mockData';

const defaultRawData = [
  { day: '01-may-26', conc: 5.30, conc2: 5.34, ph: 9.43 },
  { day: '02-may-26', conc: 5.34, conc2: null, ph: 9.42 },
  { day: '03-may-26', conc: 5.94, conc2: 5.62, ph: 9.47 },
  { day: '04-may-26', conc: 5.62, conc2: null, ph: 9.45 },
  { day: '05-may-26', conc: 5.62, conc2: 5.74, ph: 9.43 },
  { day: '06-may-26', conc: 5.74, conc2: null, ph: 9.45 },
  { day: '07-may-26', conc: 5.78, conc2: null, ph: 9.42 },
  { day: '08-may-26', conc: 6.03, conc2: 5.94, ph: 9.42 },
  { day: '09-may-26', conc: 5.90, conc2: 5.85, ph: 9.42 },
  { day: '10-may-26', conc: 5.85, conc2: 5.22, ph: 9.44 },
  { day: '11-may-26', conc: 5.22, conc2: 5.06, ph: 9.43 },
  { day: '12-may-26', conc: 5.22, conc2: 5.14, ph: 9.43 },
  { day: '13-may-26', conc: 5.22, conc2: 5.06, ph: 9.45 },
  { day: '14-may-26', conc: 5.18, conc2: null, ph: 9.45 },
];

const defaultLimits = {
  ph: { min: 9.0, max: 10.0, intMin: 9.10, intMax: 9.90, tickStep: 0.2 },
  conc: { min: 2.0, max: 6.0, intMin: 3.50, intMax: 5.40, tickStep: 0.1 }
};

const CustomDot = (props) => {
  const { cx, cy, value, dataKey, limits } = props;
  if (!cx || !cy || value === null || value === undefined || !limits) return null;

  let isExceeded = false;
  let isReached = false;
  const numValue = Number(value);

  if (dataKey === 'ph') {
    if (numValue < limits.ph.min || numValue > limits.ph.max) isExceeded = true;
    else if (numValue === limits.ph.min || numValue === limits.ph.max) isReached = true;
  } else if (dataKey === 'conc' || dataKey === 'conc2') {
    if (numValue < limits.conc.min || numValue > limits.conc.max) isExceeded = true;
    else if (numValue === limits.conc.min || numValue === limits.conc.max) isReached = true;
  }

  const fillConfig = {
    ph: '#000',
    conc: '#000',
    conc2: '#4dd0e1'
  };

  if (isExceeded || isReached) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={10} fill="red" opacity={0.5} className="animate-ping" style={{ transformOrigin: `${cx}px ${cy}px` }} />
        <circle cx={cx} cy={cy} r={4} fill="red" stroke="white" strokeWidth={1} />
      </g>
    );
  }

  return <circle cx={cx} cy={cy} r={3} fill={fillConfig[dataKey]} stroke="none" />;
};

const CustomTooltip = ({ active, payload, label, limits }) => {
  if (active && payload && payload.length && limits) {
    let hasExceeded = false;
    let hasReached = false;
    
    payload.forEach(entry => {
      const v = Number(entry.value);
      if (entry.dataKey === 'ph') {
        if (v < limits.ph.min || v > limits.ph.max) hasExceeded = true;
        else if (v === limits.ph.min || v === limits.ph.max) hasReached = true;
      }
      if (entry.dataKey === 'conc' || entry.dataKey === 'conc2') {
        if (v < limits.conc.min || v > limits.conc.max) hasExceeded = true;
        else if (v === limits.conc.min || v === limits.conc.max) hasReached = true;
      }
    });

    return (
      <div className="bg-white p-3 border border-outline/30 shadow-md rounded-lg text-sm z-50 relative">
        <p className="font-bold mb-2 border-b pb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
        {hasExceeded ? (
          <p className="text-red-600 font-bold mt-2 flex items-center gap-1 animate-pulse">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            ¡Límite excedido!
          </p>
        ) : hasReached ? (
          <p className="text-red-600 font-bold mt-2 flex items-center gap-1 animate-pulse">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            Límite alcanzado
          </p>
        ) : null}
      </div>
    );
  }
  return null;
};


const PeriodSelectorModal = ({ isOpen, onClose, onSelect, initialDate, initialViewMode }) => {
  if (!isOpen) return null;

  const [currentDate, setCurrentDate] = React.useState(initialDate || new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handleMonthChange = (e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1));
  const handleYearChange = (e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1));

  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // 0 = Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const getWeekNumber = (d) => {
    const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    dt.setUTCDate(dt.getUTCDate() + 4 - (dt.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(dt.getUTCFullYear(),0,1));
    return Math.ceil(( ( (dt - yearStart) / 86400000) + 1)/7);
  };

  const handleSelectDay = (day) => {
    onSelect('day', new Date(year, month, day));
    onClose();
  };

  const handleSelectWeek = (startDay) => {
    onSelect('week', new Date(year, month, startDay));
    onClose();
  };

  const handleSelectMonth = () => {
    onSelect('month', new Date(year, month, 1));
    onClose();
  };

  const rows = [];
  let currentDay = 1;
  let weekIdx = 0;
  
  while (currentDay <= daysInMonth) {
    const rowDays = [];
    let startOfWeekDay = currentDay;
    for (let i = 0; i < 7; i++) {
      if (weekIdx === 0 && i < startingDayOfWeek) {
        rowDays.push(null);
      } else if (currentDay > daysInMonth) {
        rowDays.push(null);
      } else {
        rowDays.push(currentDay);
        currentDay++;
      }
    }
    const repDate = new Date(year, month, startOfWeekDay);
    rows.push({ weekNum: getWeekNumber(repDate), startOfWeekDay, days: rowDays });
    weekIdx++;
  }

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-outline/10 bg-surface-container-lowest">
          <h2 className="font-semibold text-on-surface">Seleccionar Periodo</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase mb-1 block">AÑO</label>
              <select value={year} onChange={handleYearChange} className="w-full bg-white border border-outline/30 rounded-lg p-2 text-sm">
                {[2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="w-2/3">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase mb-1 block">MES</label>
              <div className="flex gap-2">
                <select value={month} onChange={handleMonthChange} className="w-full bg-white border border-outline/30 rounded-lg p-2 text-sm flex-1">
                  {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <button onClick={handleSelectMonth} className="w-full bg-secondary-container/30 hover:bg-secondary-container/50 text-secondary border border-secondary/20 py-2 rounded-lg text-sm font-semibold transition-colors">
            Ver todo el mes de {monthNames[month]}
          </button>
          
          <div className="border border-outline/10 rounded-lg p-2">
            <div className="grid grid-cols-8 text-center text-[10px] font-bold text-on-surface-variant mb-2">
              <div className="text-left pl-2">SEMANA</div>
              <div>L</div><div>M</div><div>X</div><div>J</div><div>V</div><div>S</div><div>D</div>
            </div>
            
            <div className="space-y-1">
              {rows.map((row, i) => (
                <div key={i} className="grid grid-cols-8 gap-1">
                  <button 
                    onClick={() => handleSelectWeek(row.startOfWeekDay)}
                    className="text-[10px] bg-surface hover:bg-surface-container-high border border-outline/20 rounded font-semibold text-secondary flex items-center justify-center transition-colors"
                  >
                    [Sem {row.weekNum}]
                  </button>
                  {row.days.map((day, j) => (
                    <button 
                      key={j}
                      onClick={() => day ? handleSelectDay(day) : null}
                      disabled={!day}
                      className={`h-8 flex items-center justify-center text-sm rounded ${day ? 'border border-outline/10 hover:border-secondary hover:text-secondary hover:bg-secondary/5 font-medium' : 'invisible'}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-surface p-3 rounded-lg flex gap-2 items-start text-[11px] text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <p>Selecciona una semana o un día específico para actualizar la vista.</p>
          </div>
        </div>
        
        <div className="p-4 border-t border-outline/10 flex justify-end gap-2 bg-surface-container-lowest">
          <button onClick={onClose} className="px-4 py-2 font-semibold text-sm hover:bg-surface-container rounded-lg transition-colors">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

const ChartDetail = ({
  processName = 'Lavadora Central',
  paramName = 'Concentración y pH',
  inventory = '235096',
  capacity = '40000',
  costCenter = '4002',
  concentrationRange = '2.00 % a 6.00 %',
  interventionRangeC = '≤ 3.50 % ≥ 5.40 %',
  phRange = '9.00 a 10.00',
  interventionRangePh = '≤ 9.10 a ≥ 9.90',
  authorizedMaterial = '229 4397 / Bonderite C-NE 225',
  information = '2223539896',
  coordinator = 'Omar Jon Hernández',
  date = 'mayo 2026',
  chartDataRaw: initialData = defaultRawData,
  limits: initialLimits = defaultLimits,
  operationId,
  processId,
  metricId
}) => {
  const [chartDataRaw, setChartDataRaw] = React.useState(initialData);
  const [limits, setLimits] = React.useState(initialLimits);
  
  // Period Selection State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState('week'); // 'day', 'week', 'month'
  const [targetDate, setTargetDate] = React.useState(new Date());

  React.useEffect(() => {
    if (operationId && processId) {
      fetchMockOperationData(operationId)
        .then(data => {
          if (data && data.laboratorio) {
            const combined = data.laboratorio.find(m => m.metricId === 'conc-ph');
            if (combined && combined.data) {
              const flatData = combined.data.map((item) => ({
                day: item.date.length === 6 ? item.date + '-26' : item.date, // e.g. "01-may" -> "01-may-26"
                conc: item.conc,
                ph: item.ph
              }));
              
              const storageKey = `spc_records_${processId}_${operationId}`;
              const sessionRecords = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
              
              sessionRecords.forEach(rec => {
                 const existingIdx = flatData.findIndex(d => d.day === rec.day);
                 if (existingIdx !== -1) flatData[existingIdx] = { ...flatData[existingIdx], ...rec };
                 else flatData.push({ day: rec.day, conc: rec.conc, ph: rec.ph });
              });

              setChartDataRaw(flatData);
            }
          }
        })
        .catch(err => console.error("Error fetching data:", err));
    }
  }, [operationId, processId]);

  const chartData = React.useMemo(() => {
    const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    let daysArray = [];

    if (viewMode === 'day') {
      daysArray = [new Date(targetDate)];
    } else if (viewMode === 'week') {
      const dayOfWeek = targetDate.getDay() === 0 ? 7 : targetDate.getDay();
      const startOfWeek = new Date(targetDate);
      startOfWeek.setDate(targetDate.getDate() - dayOfWeek + 1);
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        daysArray.push(d);
      }
    } else if (viewMode === 'month') {
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push(new Date(year, month, i));
      }
    }
    
    return daysArray.map(currentDay => {
      const dYear = String(currentDay.getFullYear()).slice(2);
      const dMonth = monthNames[currentDay.getMonth()];
      const dDate = String(currentDay.getDate()).padStart(2, '0');
      
      const dayStr = `${dDate}-${dMonth}-${dYear}`;
      const existing = chartDataRaw.find(d => d.day === dayStr);
      return existing || { day: dayStr, conc: null, conc2: null, ph: null };
    });
  }, [chartDataRaw, viewMode, targetDate]);

  const displayDate = React.useMemo(() => {
    const fullMonthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    if (viewMode === 'day') {
      return `${targetDate.getDate()} de ${fullMonthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
    } else if (viewMode === 'month') {
      return `${fullMonthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
    } else {
      const dayOfWeek = targetDate.getDay() === 0 ? 7 : targetDate.getDay();
      const startOfWeek = new Date(targetDate);
      startOfWeek.setDate(targetDate.getDate() - dayOfWeek + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `Semana del ${startOfWeek.getDate()} ${fullMonthNames[startOfWeek.getMonth()]} al ${endOfWeek.getDate()} ${fullMonthNames[endOfWeek.getMonth()]} ${endOfWeek.getFullYear()}`;
    }
  }, [viewMode, targetDate]);

  const phDomain = [limits.ph.min - 0.1, limits.ph.max + 0.1];
  const phTicks = React.useMemo(() => {
    const ticks = [];
    for (let v = phDomain[0]; v <= phDomain[1] + 0.01; v += limits.ph.tickStep) {
      ticks.push(parseFloat(v.toFixed(2)));
    }
    return ticks;
  }, [limits.ph, phDomain]);

  const concDomain = [limits.conc.min - 0.1, limits.conc.max + 0.1];
  const concTicks = React.useMemo(() => {
    const ticks = [];
    for (let v = concDomain[0]; v <= concDomain[1] + 0.01; v += limits.conc.tickStep) {
      ticks.push(parseFloat(v.toFixed(2)));
    }
    return ticks;
  }, [limits.conc, concDomain]);

  const renderEmptyCells = (count, className = '') => {
    return Array.from({ length: count }).map((_, i) => (
      <td key={`empty-${i}`} className={className}></td>
    ));
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-outline/30 overflow-hidden">
      {/* Title */}
      <div className="mx-6 mt-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-primary tracking-tight font-headline-lg">
            Detalles de Gráfica de {processName} - {paramName}
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-secondary text-secondary hover:bg-secondary/5 rounded-lg transition-colors font-semibold text-sm uppercase tracking-wide"
            >
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              Seleccionar Periodo
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-secondary text-secondary hover:bg-secondary/5 rounded-lg transition-colors font-semibold text-sm uppercase tracking-wide">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      <PeriodSelectorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialDate={targetDate}
        initialViewMode={viewMode}
        onSelect={(newMode, newDate) => {
          setViewMode(newMode);
          setTargetDate(newDate);
        }}
      />

      <div className="p-6 flex flex-col gap-8">
        {/* Industrial Header Panel */}
        <header className="bg-white border border-black p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="text-[11px] font-bold text-on-surface leading-relaxed">
              Gráfico de {paramName}<br />
              Laboratorio de Procesos y Emulsiones Planta Guanajuato
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold tracking-[0.25em] text-primary">VOLKSWAGEN</div>
              <div className="text-[11px] tracking-[0.4em] -mt-1 font-semibold uppercase">de méxico</div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                <span className="text-[13px] font-bold text-gray-400 italic">nuimCam</span>
                <span className="text-[9px] font-bold text-red-600 border-t border-red-600 px-1 mt-0.5">División Servicios</span>
              </div>
              <div className="border-2 border-black px-6 py-3 text-3xl font-bold">3</div>
            </div>
          </div>

          {/* Metadata Grid */}
          <table className="w-full header-metadata text-on-surface">
            <tbody>
              <tr className="align-top flex flex-col md:table-row">
                <td width="25%" className="mb-2 md:mb-0">
                  <b>Inventario:</b> {inventory}<br />
                  <b>Nombre:</b> {processName}<br />
                  <b>Capacidad (L):</b> {capacity}
                </td>
                <td width="30%" className="mb-2 md:mb-0 space-y-1 block md:table-cell">
                  <div className="flex justify-between"><span><b>Centro de Costos:</b></span> <span>{costCenter}</span></div>
                  <div className="flex justify-between"><span><b>Rango Concentración:</b></span> <span>{concentrationRange}</span></div>
                  <div className="flex justify-between"><span><b>Rango Intervención [C]:</b></span> <span>{interventionRangeC}</span></div>
                  <div className="flex justify-between"><span><b>pH:</b></span> <span>{phRange}</span></div>
                  <div className="flex justify-between"><span><b>Rango Intervención pH:</b></span> <span>{interventionRangePh}</span></div>
                </td>
                <td className="text-left md:text-right" width="45%">
                  <b>Material Autorizado:</b> {authorizedMaterial}<br />
                  <b>Información:</b> {information}<br />
                  <b>Coordinador VW:</b> {coordinator}<br />
                  <b>Mes/Fecha:</b> {displayDate}
                </td>
              </tr>
            </tbody>
          </table>
        </header>

        {/* SPC Chart Section */}
        <div className="border border-black p-4 bg-white rounded-xl shadow-sm overflow-x-auto pt-6 pb-6">
          <div className="w-full min-w-[1000px] flex flex-col pr-4 pl-4">
            
            {/* pH Chart */}
            <div className="h-[180px] w-full border border-[#e0e0e0] flex">
              <div className="w-12 h-full relative shrink-0">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 text-[13px] font-bold">pH</span>
              </div>
              <div className="flex-1 min-w-0 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} style={{ overflow: 'visible' }}>
                    <CartesianGrid stroke="#e0e0e0" />
                    <XAxis dataKey="day" interval={0} tick={false} axisLine={{ stroke: '#cccccc' }} tickLine={false} />
                    <YAxis domain={phDomain} ticks={phTicks} tickFormatter={(val) => val.toFixed(2)} tick={{ fill: '#000', fontSize: 10 }} axisLine={false} tickLine={false} />
                    
                    {/* pH Limits */}
                    <ReferenceLine y={limits.ph.max} stroke="#ff0000" strokeWidth={2} />
                    <ReferenceLine y={limits.ph.intMax} stroke="#ff0000" strokeDasharray="5 5" strokeWidth={1.5} />
                    <ReferenceLine y={limits.ph.intMin} stroke="#ff0000" strokeDasharray="5 5" strokeWidth={1.5} />
                    <ReferenceLine y={limits.ph.min} stroke="#ff0000" strokeWidth={2} />

                    <Tooltip content={<CustomTooltip limits={limits} />} cursor={{ stroke: '#e0e0e0', strokeWidth: 1 }} />

                    <Line type="monotone" dataKey="ph" name="pH" stroke="#000000" strokeWidth={2} dot={(props) => <CustomDot {...props} limits={limits} />} activeDot={{ r: 5 }} connectNulls={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Concentration Chart */}
            <div className="h-[400px] w-full mt-2 border border-[#e0e0e0] flex">
              <div className="w-12 h-full relative shrink-0">
                <span className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 -rotate-90 text-[13px] font-bold whitespace-nowrap">Concentración (v/v%)</span>
                <span className="absolute left-1/2 bottom-12 -translate-x-1/2 -rotate-90 text-[12px] font-bold">Día</span>
              </div>
              <div className="flex-1 min-w-0 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 0, right: 10, left: 0, bottom: 70 }} style={{ overflow: 'visible' }}>
                    <CartesianGrid stroke="#e0e0e0" />
                    <XAxis dataKey="day" interval={0} tick={{ fill: '#000', fontSize: 9, angle: -90, textAnchor: 'end', dy: 10 }} axisLine={{ stroke: '#cccccc' }} tickLine={{ stroke: '#cccccc' }} />
                    <YAxis domain={concDomain} ticks={concTicks} tickFormatter={(val) => val.toFixed(2)} tick={{ fill: '#000', fontSize: 10 }} axisLine={false} tickLine={false} />
                    
                    {/* Concentration Limits */}
                    <ReferenceLine y={limits.conc.max} stroke="#ff0000" strokeWidth={2} />
                    <ReferenceLine y={limits.conc.intMax} stroke="#ff0000" strokeDasharray="5 5" strokeWidth={1.5} />
                    <ReferenceLine y={limits.conc.intMin} stroke="#ff0000" strokeDasharray="5 5" strokeWidth={1.5} />
                    <ReferenceLine y={limits.conc.min} stroke="#ff0000" strokeWidth={2} />

                    <Tooltip content={<CustomTooltip limits={limits} />} cursor={{ stroke: '#e0e0e0', strokeWidth: 1 }} />

                    <Line type="monotone" dataKey="conc" name="1ra Muestra %" stroke="#000000" strokeWidth={2} dot={(props) => <CustomDot {...props} limits={limits} />} activeDot={{ r: 5 }} connectNulls={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="conc2" name="2da Muestra %" stroke="#4dd0e1" strokeWidth={2} dot={(props) => <CustomDot {...props} limits={limits} />} activeDot={{ r: 5 }} connectNulls={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

        {/* Daily Data Matrix */}
        <div className="border border-black bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="industrial-grid min-w-max">
              <thead>
                <tr>
                  <th className="row-label">Día</th>
                  {chartData.map((d, i) => (
                    <th key={`day-${i}`}>{d.day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="row-label">Concen. de trabajo %</td>
                  {chartData.map((d, i) => <td key={i}>{d.conc ?? ''}</td>)}
                </tr>
                <tr>
                  <td className="row-label">2da Muestra</td>
                  {chartData.map((d, i) => <td key={i}>{d.conc2 ?? ''}</td>)}
                </tr>
                <tr>
                  <td className="row-label">Conductividad</td>
                  {chartData.map((d, i) => <td key={i}>{d.cond2 ?? ''}</td>)}
                </tr>
                <tr>
                  <td className="row-label">pH</td>
                  {chartData.map((d, i) => <td key={i}>{d.ph ?? ''}</td>)}
                </tr>
                <tr>
                  <td className="row-label">Adición Material (L)</td>
                  {chartData.map((d, i) => <td key={i}>{d.matAdd ?? ''}</td>)}
                </tr>
                <tr>
                  <td className="row-label">Adición Agua (L)</td>
                  {chartData.map((d, i) => <td key={i}>{d.waterAdd ?? ''}</td>)}
                </tr>
                <tr>
                  <td className="row-label">% de reposición</td>
                  {chartData.map((d, i) => <td key={i}>{d.repo ?? ''}</td>)}
                </tr>
                <tr>
                  <td className="row-label">Nivel Operativo 90-110</td>
                  {chartData.map((d, i) => <td key={i}>{d.level ?? ''}</td>)}
                </tr>
                <tr>
                  <td className="row-label">Estatus</td>
                  {chartData.map((d, i) => {
                    const statusClass = d.estatusFinal === 'OK' ? 'status-ok' : (d.estatusFinal === 'NO OK' ? 'status-nok' : '');
                    return <td key={i} className={statusClass}>{d.estatusFinal ?? ''}</td>;
                  })}
                </tr>
                <tr>
                  <td className="row-label h-[120px] align-top py-2">Comentarios Adicionales</td>
                  {chartData.map((d, i) => (
                    <td key={i} className="vertical-text-container">
                      <div className="vertical-text" title={d.comentarios}>{d.comentarios ?? ''}</div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Traceability Table Section */}
        <section className="bg-surface-container-lowest border border-outline/30 rounded-xl shadow-sm overflow-hidden font-['Hanken_Grotesk']">
          <div className="px-6 py-4 border-b border-outline/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">history_edu</span>
              <h2 className="text-lg font-semibold text-on-surface tracking-tight">Trazabilidad y Registro de Correcciones</h2>
            </div>
            <a className="flex items-center gap-1 text-sm font-medium text-secondary hover:underline" href="#ver-todos">
              Ver todos
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline/20">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">FECHA</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">USUARIO</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">PARÁMETRO CAMBIADO</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-center">DATO ORIGINAL</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-center">DATO CORREGIDO</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">MOTIVO DEL CAMBIO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/10 text-sm">
                <tr className="hover:bg-surface-bright transition-colors">
                  <td className="px-6 py-4 text-on-surface whitespace-nowrap">24 Oct, 16:45</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-[10px] font-bold text-on-secondary-container">MR</div>
                      <span className="text-on-surface">M. Rodriguez</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary font-medium whitespace-nowrap">Concentración v/v%</td>
                  <td className="px-6 py-4 text-on-surface text-center">5.42</td>
                  <td className="px-6 py-4 text-on-surface font-bold text-center">5.18</td>
                  <td className="px-6 py-4 text-on-surface-variant italic">Error de captura manual en terminal HMI. Se verificó con muestra de laboratorio.</td>
                </tr>
                <tr className="hover:bg-surface-bright transition-colors">
                  <td className="px-6 py-4 text-on-surface whitespace-nowrap">24 Oct, 14:12</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-[10px] font-bold text-on-primary-container">JS</div>
                      <span className="text-on-surface">J. Schmidt</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary font-medium whitespace-nowrap">pH</td>
                  <td className="px-6 py-4 text-on-surface text-center">10.15</td>
                  <td className="px-6 py-4 text-on-surface font-bold text-center">9.45</td>
                  <td className="px-6 py-4 text-on-surface-variant italic">Calibración de sensor post-mantenimiento preventivo. Valor ajustado según buffer estándar.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChartDetail;
