import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data.json");

function loadRequests() {
  if (fs.existsSync(dataFilePath)) {
    return JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  }
  return [];
}

function saveRequests(requests) {
  fs.writeFileSync(dataFilePath, JSON.stringify(requests, null, 2));
}

export default function handler(req, res) {
  let requests = loadRequests();

  if (req.method === "GET") {
    return res.status(200).json(requests);
  }

  if (req.method === "POST") {
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
    saveRequests(requests);

    return res.status(201).json(newRequest);
  }

  if (req.method === "DELETE") {
    const id = parseInt(req.query.id);
    requests = requests.filter(r => r.id !== id);
    saveRequests(requests);
    return res.status(200).json({ message: "Request deleted" });
  }

  if (req.method === "PUT") {
    const id = parseInt(req.query.id);
    const { status } = req.body;
    const request = requests.find(r => r.id === id);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (status) {
      request.status = status;
    }

    saveRequests(requests);
    return res.status(200).json(request);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
