// controllers/gbpController.js
const axios = require('axios');
const getAccessToken = require('../utils/getAccessToken'); // <-- Correct import

exports.getLocations = async (req, res) => {
  const accessToken = getAccessToken(req);
  if (!accessToken) return res.status(401).json({ message: "Not logged in!" });

  try {
    // Google Business Profile API endpoint for locations (accounts)
    const { data } = await axios.get(
      'https://mybusinessbusinessinformation.googleapis.com/v1/accounts',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    res.json(data); // You can shape/filter the response as needed
  } catch (err) {
    console.error("GBP API Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
};
