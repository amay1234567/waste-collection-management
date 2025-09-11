// api/requests.js
let requests = []; // ⚠️ Resets on every serverless function call (not permanent storage)

export default function handler(req, res) {
  const { method, query, body } = req;

  // 🔹 GET /api/requests
  if (method === "GET") {
    return res.status(200).json(requests);
  }

  // 🔹 POST /api/requests
  if (method === "POST") {
    const { location, wasteType } = body;
    if (!location || !wasteType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRequest = {
      id: Date.now(),
      location,
      wasteType,
      status: "Pending",
      timestamp: new Date().toISOString(),
    };

    requests.push(newRequest);
    return res.status(201).json(newRequest);
  }

  // 🔹 PUT /api/requests?id=123
  if (method === "PUT") {
    const id = parseInt(query.id);
    const { status } = body;

    const request = requests.find(r => r.id === id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (status) {
      request.status = status;
    }

    return res.status(200).json(request);
  }

  // 🔹 DELETE /api/requests?id=123
  if (method === "DELETE") {
    const id = parseInt(query.id);
    const index = requests.findIndex(r => r.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Request not found" });
    }

    requests.splice(index, 1);
    return res.status(200).json({ message: "Request deleted" });
  }

  // ❌ Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}
