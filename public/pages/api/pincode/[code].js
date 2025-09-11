// pages/api/pincode/[code].js
const pincodeData = {
  "560001": { area: "Bangalore GPO", city: "Bangalore", state: "Karnataka" },
  "110001": { area: "Connaught Place", city: "New Delhi", state: "Delhi" },
  "400001": { area: "Fort", city: "Mumbai", state: "Maharashtra" },
};

export default function handler(req, res) {
  const { code } = req.query;

  console.log("Pincode requested:", code); // debug log

  if (pincodeData[code]) {
    res.status(200).json(pincodeData[code]);
  } else {
    res.status(404).json({ error: "Pincode not found" });
  }
}
