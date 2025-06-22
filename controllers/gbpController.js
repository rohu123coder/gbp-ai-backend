// controllers/gbpController.js
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Middleware: JWT verify for GBP routes (add this to your routes/gbp.js)
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.jwtUser = decoded; // Attach to req
      next();
    });
  } else {
    res.status(401).json({ message: "Missing or invalid token" });
  }
};

exports.getLocations = async (req, res) => {
  const accessToken = req.jwtUser?.access_token;

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized – Please login first." });
  }

  try {
    // Step 1: Get list of accounts
    const { data: accountsData } = await axios.get(
      'https://mybusinessbusinessinformation.googleapis.com/v1/accounts',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    // Step 2: Get locations for the first account found (you can loop if needed)
    const accountName = accountsData.accounts?.[0]?.name;

    if (!accountName) {
      return res.status(404).json({ message: "No account found for this user." });
    }

    const { data: locationsData } = await axios.get(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    res.json(locationsData);
  } catch (err) {
    console.error("Error fetching GBP data:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data?.error || err.message,
      message: "Failed to fetch GBP account or locations."
    });
  }
};
