import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const OverviewChart = ({ title, status, data, lines, yDomain, referenceLines, metricId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { processId, operationId } = useParams();
  const isOperator = location.pathname.startsWith('/operator');
  const base = isOperator ? '/operator' : '';

  const handleClick = () => {
    navigate(`${base}/proceso/${processId}/operacion/${operationId}/metrica/${metricId}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white border border-outline/10 p-6 shadow-sm cursor-pointer hover:shadow-md hover:border-secondary/50 transition-all group rounded-3xl flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-title-lg text-on-surface text-base uppercase group-hover:text-secondary transition-colors leading-tight pr-4">{title}</h3>
        {status && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md bg-surface-container ${status === 'NOK' ? 'text-error' : status === 'PENDING' ? 'text-orange-500' : 'text-green-600'}`}>
            {status}
          </span>
        )}
      </div>
      <div 
        className="h-48 border border-outline/10 relative rounded-xl overflow-hidden mt-auto"
        style={{
          backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '15px 15px',
          backgroundColor: 'white'
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" hide />
            <YAxis domain={yDomain || ['auto', 'auto']} hide />
            
            {referenceLines && referenceLines.map((ref, idx) => (
              <ReferenceLine 
                key={idx} 
                y={ref.value} 
                stroke={ref.color || "red"} 
                strokeWidth={ref.width || 1.5} 
                strokeDasharray={ref.dashed ? "3 3" : ""} 
              />
            ))}

            {lines.map((line, idx) => (
              <Line 
                key={idx}
                type="monotone" 
                dataKey={line.dataKey} 
                stroke={line.color || "#000000"} 
                strokeWidth={2} 
                dot={{ r: 3, fill: line.color || "#000000" }} 
                activeDot={{ r: 5 }} 
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-[10px] font-code-data text-on-surface-variant flex justify-between px-1">
        {data.length > 0 && <span>{data[0].date}</span>}
        {data.length > 1 && <span>{data[Math.floor(data.length / 2)].date}</span>}
        {data.length > 2 && <span>{data[data.length - 1].date}</span>}
      </div>
    </div>
  );
};

export default OverviewChart;
