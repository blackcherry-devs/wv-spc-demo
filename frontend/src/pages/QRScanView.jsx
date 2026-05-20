import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import WaterTank from '../components/WaterTank';
import ChartDetail from '../components/ChartDetail';
import { QrCode, AlertTriangle, ArrowLeft } from 'lucide-react';

const QRScanView = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulated mock fetch to prevent serverless deployment connection errors
    const fetchData = async () => {
      try {
        // Simulating 400ms server response latency
        await new Promise(res => setTimeout(res, 400));
        
        const result = {
          id: id || 'OP-120',
          name: 'Lavadora Central - Cavidades K01',
          waterLevel: 85,
          processId: 'Cilindros',
          operationId: 'Lavadora Central'
        };
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vw-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error de Consulta</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/login" className="text-vw-cyan hover:underline font-semibold flex items-center">
          <ArrowLeft size={16} className="mr-1" /> Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Banner indicating Read-Only Mode */}
      <div className="bg-yellow-400 text-yellow-900 px-4 py-2 text-center text-sm font-bold flex items-center justify-center shadow-sm">
        <QrCode size={16} className="mr-2" />
        Vista de Piso vía QR - Modo Consulta
      </div>

      <div className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-vw-blue">{data.name}</h1>
            <p className="text-gray-500 mt-1">ID Equipo: <span className="font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{data.id}</span></p>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-bold text-sm text-center border border-green-200">
            ESTADO: OPERATIVO
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 pointer-events-none">
            {/* Using pointer-events-none to enforce read-only feel if needed, 
                though ChartDetail is mostly view-only anyway */}
            <ChartDetail processName={data.name} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center h-full min-h-[400px]">
             <h3 className="text-lg font-bold text-vw-blue mb-8 w-full text-center border-b pb-2">Nivel Actual</h3>
             <WaterTank level={data.waterLevel} />
          </div>

        </div>

      </div>
    </div>
  );
};

export default QRScanView;
