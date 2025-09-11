// api/pincode/[code].js

const pincodeData = {
  "560001": { area: "Bangalore GPO", city: "Bangalore", state: "Karnataka" },
  "110001": { area: "Connaught Place", city: "New Delhi", state: "Delhi" },
  "400001": { area: "Fort", city: "Mumbai", state: "Maharashtra" },
  "600001": { area: "Parrys", city: "Chennai", state: "Tamil Nadu" },
  "700001": { area: "BBD Bagh", city: "Kolkata", state: "West Bengal" }
};

export default function handler(req, res) {
  const { code } = req.query;

  if (!code || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: "Invalid pincode" });
  }

  const data = pincodeData[code];
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ error: "Pincode not found" });
  }
}
