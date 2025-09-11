const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Path to data file
const dataFilePath = path.join(__dirname, "data.json");

// Load existing requests
let requests = [];
if (fs.existsSync(dataFilePath)) {
  requests = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
}

// ----------------------
// API Routes
// ----------------------

// Get all requests
app.get("/api/requests", (req, res) => {
  res.json(requests);
});

// Create new request
app.post("/api/requests", (req, res) => {
  const { location, wasteType, pincode } = req.body;
  if (!location || !wasteType || !pincode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newRequest = {
    id: Date.now(),
    location,
    wasteType,
    pincode,
    status: "Pending",
    timestamp: new Date().toISOString(),
  };

  requests.push(newRequest);
  fs.writeFileSync(dataFilePath, JSON.stringify(requests, null, 2));

  res.status(201).json(newRequest);
});

// Delete request
app.delete("/api/requests/:id", (req, res) => {
  const id = parseInt(req.params.id);
  requests = requests.filter(r => r.id !== id);
  fs.writeFileSync(dataFilePath, JSON.stringify(requests, null, 2));
  res.status(200).json({ message: "Request deleted" });
});

// Update request (mark collected, etc.)
app.put("/api/requests/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const request = requests.find(r => r.id === id);

  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }

  if (status) {
    request.status = status;
  }

  fs.writeFileSync(dataFilePath, JSON.stringify(requests, null, 2));
  res.json(request);
});

// Pincode lookup
const pincodeData = {
  "560001": { area: "Bangalore GPO", city: "Bangalore", state: "Karnataka" },
  "110001": { area: "Connaught Place", city: "New Delhi", state: "Delhi" },
  "400001": { area: "Fort", city: "Mumbai", state: "Maharashtra" },
  // add more pincodes as needed
};

app.get("/api/pincode/:code", (req, res) => {
  const code = req.params.code;
  if (pincodeData[code]) {
    res.json(pincodeData[code]);
  } else {
    res.status(404).json({ error: "Pincode not found" });
  }
});

// ----------------------
// Serve Frontend
// ----------------------
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ----------------------
// Server Start
// ----------------------
const PORT = process.env.PORT || 2001;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
