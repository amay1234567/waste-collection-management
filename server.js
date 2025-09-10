const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// ✅ Pincode mapping
const pincodeData = {
  "400001": { area: "Fort", city: "Mumbai", state: "Maharashtra" },
  "400002": { area: "Kalbadevi", city: "Mumbai", state: "Maharashtra" },
  "400003": { area: "Mandvi", city: "Mumbai", state: "Maharashtra" },
  "560001": { area: "Bangalore GPO", city: "Bangalore", state: "Karnataka" },
  "560002": { area: "Bangalore Cantonment", city: "Bangalore", state: "Karnataka" },
  "560003": { area: "Malleshwaram", city: "Bangalore", state: "Karnataka" },
  "110001": { area: "Connaught Place", city: "New Delhi", state: "Delhi" },
  "110002": { area: "Daryaganj", city: "New Delhi", state: "Delhi" },
  "110003": { area: "Lodhi Road", city: "New Delhi", state: "Delhi" },
  "575019": { area: "Mangalore", city: "Mangalore", state: "Karnataka" }
};

const DATA_FILE = path.join(__dirname, 'data.json');

// ✅ Helper: Load + Save
function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return content ? JSON.parse(content) : [];
  } catch (err) {
    console.error("Error reading data file:", err);
    return [];
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing data file:", err);
  }
}

// 🔹 Lookup area by pincode
app.get("/api/pincode/:code", (req, res) => {
  const code = req.params.code;
  if (pincodeData[code]) {
    res.json(pincodeData[code]);
  } else {
    res.status(404).json({ error: "Pincode not found" });
  }
});

// ✅ API: Get all requests
app.get('/api/requests', (req, res) => {
  res.json(loadData());
});

// ✅ API: Add request
app.post('/api/requests', (req, res) => {
  try {
    const { location, wasteType, pincode } = req.body;
    if (!location || !wasteType || !pincode) {
      return res.status(400).json({ error: "Missing fields" });
    }

    let locationData = {};
    if (pincodeData[pincode]) {
      locationData = pincodeData[pincode];
    }

    const newRequest = {
      id: Date.now(),
      location,
      wasteType,
      pincode,
      ...locationData,
      status: 'Pending',
      timestamp: new Date().toLocaleString(),
      estimatedPickup: getEstimatedPickupDate()
    };

    const data = loadData();
    data.push(newRequest);
    saveData(data);

    res.json(newRequest);
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ error: "Failed to save request" });
  }
});

// ✅ API: Update request
app.put('/api/requests/:id', (req, res) => {
  try {
    let data = loadData();
    data = data.map(r => r.id == req.params.id ? { ...r, ...req.body } : r);
    saveData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update request" });
  }
});

// ✅ API: Delete request
app.delete('/api/requests/:id', (req, res) => {
  try {
    let data = loadData();
    data = data.filter(r => r.id != req.params.id);
    saveData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete request" });
  }
});

// ✅ Serve frontend (React build OR plain public)
const buildPath = path.join(__dirname, 'build');
const publicPath = path.join(__dirname, 'public');

if (fs.existsSync(buildPath)) {
  console.log("⚡ Serving React build...");
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  console.log("⚡ Serving public folder...");
  app.use(express.static(publicPath));
  app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Start server
const PORT = 9000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));

// Helper
function getEstimatedPickupDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toLocaleDateString();
}
