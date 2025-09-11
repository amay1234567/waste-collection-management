const pincodeData = {
  "560001": { area: "Bangalore GPO", city: "Bangalore", state: "Karnataka" },
  "110001": { area: "Connaught Place", city: "New Delhi", state: "Delhi" },
  "400001": { area: "Fort", city: "Mumbai", state: "Maharashtra" },
  "600001": { area: "Parrys Corner", city: "Chennai", state: "Tamil Nadu" },
  "600028": { area: "Mylapore", city: "Chennai", state: "Tamil Nadu" },
  "600100": { area: "Guindy", city: "Chennai", state: "Tamil Nadu" },

  "700001": { area: "BBD Bagh", city: "Kolkata", state: "West Bengal" },
  "700019": { area: "Ballygunge", city: "Kolkata", state: "West Bengal" },
  "700091": { area: "Salt Lake", city: "Kolkata", state: "West Bengal" },

  "500001": { area: "Hyderabad GPO", city: "Hyderabad", state: "Telangana" },
  "500081": { area: "Madhapur", city: "Hyderabad", state: "Telangana" },
  "500032": { area: "Gachibowli", city: "Hyderabad", state: "Telangana" },

  "302001": { area: "Jaipur GPO", city: "Jaipur", state: "Rajasthan" },
  "302017": { area: "Malviya Nagar", city: "Jaipur", state: "Rajasthan" },
  "302020": { area: "Vaishali Nagar", city: "Jaipur", state: "Rajasthan" },
  "570001": { area: "Mysore GPO", city: "Mysore", state: "Karnataka" },
  "570017": { area: "Vijayanagar", city: "Mysore", state: "Karnataka" },
  "570023": { area: "Hebbal", city: "Mysore", state: "Karnataka" },

  // Mangalore
  "575001": { area: "Hampankatta", city: "Mangalore", state: "Karnataka" },
  "575006": { area: "Kadri", city: "Mangalore", state: "Karnataka" },
  "575014": { area: "Surathkal", city: "Mangalore", state: "Karnataka" },

  // Hubli
  "580020": { area: "Vidya Nagar", city: "Hubli", state: "Karnataka" },
  "580031": { area: "Navanagar", city: "Hubli", state: "Karnataka" },

  // Dharwad
  "580001": { area: "Dharwad GPO", city: "Dharwad", state: "Karnataka" },
  "580008": { area: "Saptapur", city: "Dharwad", state: "Karnataka" },

  // Belgaum
  "590001": { area: "Belgaum GPO", city: "Belgaum", state: "Karnataka" },
  "590006": { area: "Tilakwadi", city: "Belgaum", state: "Karnataka" },

  // Davangere
  "577001": { area: "Davangere GPO", city: "Davangere", state: "Karnataka" },
  "577004": { area: "Vidyanagar", city: "Davangere", state: "Karnataka" },

  // Shimoga
  "577201": { area: "Shimoga GPO", city: "Shimoga", state: "Karnataka" },
  "577204": { area: "Sagar", city: "Shimoga", state: "Karnataka" }
};

export default function handler(req, res) {
  const { code } = req.query;

  if (pincodeData[code]) {
    return res.status(200).json(pincodeData[code]);
  } else {
    return res.status(404).json({ error: "Pincode not found" });
  }
}
