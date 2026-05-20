const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Combine the dates logically across Sem 18, Sem 19, Sem 20 (approx May 01 to May 18)
const DATES = [
  '01-may', '02-may', '03-may', '04-may', '05-may', '06-may', '07-may', // Sem 18 (L-D)
  '08-may', '09-may', '10-may', '11-may', '12-may', '13-may', '14-may', // Sem 19 (L-D)
  '15-may', '16-may', '17-may', '18-may' // Sem 20 (L-J)
];

const mockLavadoraCentralData = {
  laboratorio: [
    {
      metricId: 'conc-ph',
      title: 'Concentración y pH',
      type: 'combined',
      limits: [{ value: 9.0, color: 'red' }, { value: 10.0, color: 'red' }, { value: 3.5, color: 'orange', dashed: true }, { value: 4.5, color: 'orange', dashed: true }],
      yDomain: [2, 11],
      data: DATES.map((date, i) => {
        const concVals = [4.86, 5.22, 4.86, 5.22, 5.30, 5.34, 5.94, 5.62, 5.62, 5.74, 5.78, 6.03, 5.90, 5.85, 5.22, 5.22, 5.22, 5.18];
        const phVals = [9.45, 9.40, 9.43, 9.42, 9.43, 9.42, 9.47, 9.45, 9.45, 9.43, 9.45, 9.42, 9.42, 9.42, 9.40, 9.43, 9.43, 9.45];
        return { date, conc: concVals[i], ph: phVals[i] };
      })
    },
    {
      metricId: 'dureza-detergente',
      title: 'Dureza de detergente',
      limits: [{ value: 150, color: 'red' }],
      yDomain: [0, 200],
      data: DATES.map(date => ({ date, val: null }))
    },
    {
      metricId: 'tasa-reposicion',
      title: 'Tasa de reposición diaria (%)',
      limits: [{ value: 2, color: 'red' }],
      yDomain: [0, 6],
      data: DATES.map((date, i) => {
        const repVals = [4, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, null, null, null, null, null];
        return { date, val: repVals[i] };
      })
    },
    {
      metricId: 'dureza-agua-di',
      title: 'Dureza agua DI',
      limits: [{ value: 10, color: 'red' }],
      yDomain: [0, 15],
      data: DATES.map((date, i) => {
        const vals = [null, null, null, null, 5, null, null, null, null, null, null, 5, null, null, null, null, null, null];
        return { date, val: vals[i] };
      })
    },
    {
      metricId: 'dureza-agua-pt',
      title: 'Dureza agua PT',
      limits: [{ value: 150, color: 'red' }],
      yDomain: [0, 200],
      data: DATES.map((date, i) => {
        const vals = [null, null, null, null, null, 35, null, null, null, null, null, 25, null, null, null, null, null, null];
        return { date, val: vals[i] };
      })
    },
    {
      metricId: 'conductividad',
      title: 'Conductividad del detergente',
      limits: [{ value: 5000, color: 'red' }],
      yDomain: [4000, 6000],
      data: DATES.map((date, i) => {
        const condVals = [4485, 4806, 4920, 4942, 5222, 5312, 5370, 5390, 5410, 5433, 5476, 5437, 5480, 4686, 4640, 4752, 4750, 4701];
        return { date, val: condVals[i] };
      })
    },
    {
      metricId: 'aceite-libre',
      title: 'Aceite libre',
      limits: [{ value: 2, color: 'red' }],
      yDomain: [0, 3],
      data: DATES.map((date, i) => {
        const vals = [null, null, null, null, null, null, 0.80, null, null, null, null, 0.59, null, null, null, null, null, null];
        return { date, val: vals[i] };
      })
    },
    {
      metricId: 'solidos-suspendidos',
      title: 'Sólidos suspendidos',
      limits: [{ value: 30, color: 'red' }],
      yDomain: [0, 80],
      data: DATES.map((date, i) => {
        const vals = [null, null, null, null, null, null, 12, null, null, null, null, 70, null, null, null, null, null, null];
        return { date, val: vals[i] };
      })
    }
  ],
  proceso: [
    {
      metricId: 'func-filtros',
      title: 'Funcionamiento de filtros (1=SI, 0=NO)',
      limits: [],
      yDomain: [0, 2],
      data: DATES.map(date => ({ date, val: 1 }))
    },
    {
      metricId: 'niveles-tanque',
      title: 'Niveles de tanque',
      limits: [{ value: 90, color: 'red' }, { value: 120, color: 'red' }],
      yDomain: [70, 130],
      data: DATES.map((date, i) => {
        const vals = [101, 101, 98, 100, 98, 90, 120, 103, 104, 98, 96, 90, 85, 85, 98, 95, 88, 102];
        return { date, val: vals[i] };
      })
    },
    {
      metricId: 'temp-trabajo',
      title: 'Temperatura de trabajo',
      limits: [{ value: 50, color: 'red' }, { value: 59, color: 'red' }],
      yDomain: [40, 70],
      data: DATES.map((date, i) => {
        const vals = [56.7, 57.4, 56.7, 57.8, 56.5, 55.2, 45, 52, 55.8, 55.8, 57.0, 56, 55.6, 53.3, 52.5, 53.7, 55.9, 56.4];
        return { date, val: vals[i] };
      })
    },
    {
      metricId: 'presion-suministro',
      title: 'Presión de suministro',
      limits: [{ value: 4, color: 'red' }, { value: 5, color: 'red' }],
      yDomain: [3, 6],
      data: DATES.map((date, i) => {
        const vals = [4.20, 4.16, 4.46, 4.03, 4.04, 4.34, 4.28, 4.17, 4.09, 3.97, 4.42, 4.20, 3.88, 4.01, 4.12, 4.38, 4.50, 3.85];
        return { date, val: vals[i] };
      })
    },
    {
      metricId: 'func-skimmer',
      title: 'Funcionamiento Skimmer',
      limits: [],
      yDomain: [0, 2],
      data: DATES.map(date => ({ date, val: 1 }))
    },
    {
      metricId: 'func-recolector',
      title: 'Funcionamiento recolector',
      limits: [],
      yDomain: [0, 2],
      data: DATES.map(date => ({ date, val: 1 }))
    },
    {
      metricId: 'retiro-paron',
      title: 'Retiro de parón de aceite',
      limits: [],
      yDomain: [0, 2],
      data: DATES.map(date => ({ date, val: 1 }))
    },
    {
      metricId: 'nivel-mirilla',
      title: 'Nivel mirilla (m3)',
      limits: [],
      yDomain: [20, 35],
      data: DATES.map((date, i) => {
        const vals = [25, 25, 25.5, 25.5, 25.5, 25, 29, 26, 27, 26, 25, 25, 23, 23, 25, 25, 23, 27];
        return { date, val: vals[i] };
      })
    },
    {
      metricId: 'control-adiciones',
      title: 'Control de adiciones',
      limits: [],
      yDomain: [0, 2],
      data: DATES.map(date => ({ date, val: 1 }))
    }
  ],
  bitacora: [
    {
      metricId: 'adicion-material',
      title: 'Adición Material (L)',
      limits: [],
      yDomain: [0, 400],
      data: DATES.map((date, i) => {
        const vals = [160, 150, 0, 60, 40, 60, 80, 120, 300, 200, 60, 60, 120, null, null, null, null, null];
        return { date, val: vals[i] };
      })
    },
    {
      metricId: 'adicion-agua',
      title: 'Adición Agua (L)',
      limits: [],
      yDomain: [0, 20000],
      data: DATES.map((date, i) => {
        const vals = [4000, 5000, 0, 3000, 2000, 3000, 4000, 6000, 15000, 10000, 3000, 3000, 6000, null, null, null, null, null];
        return { date, val: vals[i] };
      })
    },
    {
      metricId: 'estatus-operativo',
      title: 'Estatus Operativo (1=OK, 0=NOK)',
      limits: [{ value: 0.5, color: 'red' }],
      yDomain: [-1, 2],
      data: DATES.map((date, i) => {
        const vals = [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, null, null, null, null];
        return { date, val: vals[i] };
      })
    }
  ],
  waterTank: {
    level: 85,
    adicionAguaToday: 3000,
    capacidad: 40000,
    actual: 34000
  }
};

app.get('/api/operations/:processId/:operationId', (req, res) => {
  const { processId, operationId } = req.params;
  
  // Return the mock data if it's the requested operation
  if (operationId === 'lavadora central' || operationId === 'Lavadora Central') {
    res.json(mockLavadoraCentralData);
  } else {
    // Return empty but structured response for other operations
    res.json({
      laboratorio: [],
      proceso: [],
      bitacora: [],
      waterTank: { level: 0, adicionAguaToday: 0, capacidad: 100, actual: 0 }
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
