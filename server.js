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

// Routes
app.get("/api/requests", (req, res) => {
  res.json(requests);
});

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

// Dynamic port (important for Render!)
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
