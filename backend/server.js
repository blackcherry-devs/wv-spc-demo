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

const fs = require('fs');
const path = require('path');

const RECORDS_FILE = path.join(__dirname, 'data', 'records.json');

app.get('/api/records/:id', (req, res) => {
  const { id } = req.params;
  try {
    if (!fs.existsSync(RECORDS_FILE)) {
      return res.json([]);
    }
    const data = JSON.parse(fs.readFileSync(RECORDS_FILE, 'utf8'));
    return res.json(data[id] || []);
  } catch (error) {
    console.error("Error reading records:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/records/:id', (req, res) => {
  const { id } = req.params;
  const newRecord = req.body;
  
  try {
    let data = {};
    if (fs.existsSync(RECORDS_FILE)) {
      data = JSON.parse(fs.readFileSync(RECORDS_FILE, 'utf8'));
    }
    
    if (!data[id]) {
      data[id] = [];
    }
    
    // Append or replace if same day exists
    const existingIndex = data[id].findIndex(r => r.day === newRecord.day);
    if (existingIndex >= 0) {
      data[id][existingIndex] = { ...data[id][existingIndex], ...newRecord };
    } else {
      data[id].push(newRecord);
    }
    
    fs.writeFileSync(RECORDS_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, record: newRecord });
  } catch (error) {
    console.error("Error saving record:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
