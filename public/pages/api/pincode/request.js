// api/requests.js
let requests = []; // In-memory (resets on each deploy)

export default function handler(req, res) {
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
    return res.status(201).json(newRequest);
  }

  if (req.method === "PUT") {
    const { id, status } = req.body;
    const request = requests.find(r => r.id === id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (status) request.status = status;
    return res.status(200).json(request);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    requests = requests.filter(r => r.id !== parseInt(id));
    return res.status(200).json({ message: "Deleted" });
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}