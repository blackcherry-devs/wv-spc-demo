const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Mock Data for LAV01
const mockMachineData = {
  id: "LAV01",
  name: "Lavadora Central",
  waterLevel: 70,
  phData: [9.2, 9.4, 9.1, 9.5, 9.3],
  concData: [5.1, 5.3, 5.2, 5.5, 5.4]
};

app.get('/api/operacion/:id', (req, res) => {
  const { id } = req.params;
  
  if (id === "LAV01") {
    return res.json(mockMachineData);
  }
  
  return res.status(404).json({ error: "Machine not found" });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
