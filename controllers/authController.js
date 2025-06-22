// controllers/authController.js
const axios = require('axios');
const qs = require('querystring');
const jwt = require('jsonwebtoken');

// 1. Start Google OAuth (redirect user to Google consent screen)
exports.googleAuth = (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID
    }&redirect_uri=${process.env.REDIRECT_URI
    }&response_type=code&scope=https://www.googleapis.com/auth/business.manage%20profile%20email%20openid&access_type=offline&prompt=consent`;
  res.redirect(authUrl);
};

// 2. Handle Google OAuth Callback
exports.googleCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ message: 'No code in callback' });

  try {
    // Exchange code for tokens
    const params = qs.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const tokenRes = await axios.post(
      'https://oauth2.googleapis.com/token',
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, refresh_token, expires_in, id_token } = tokenRes.data;

    // Get user info from Google
    let userInfo = {};
    if (access_token) {
      const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      userInfo = userRes.data;
    }

    // Generate JWT with user info & Google tokens
    const jwtToken = jwt.sign(
      {
        user: {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        },
        access_token,      // GBP API call ke liye
        refresh_token
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Redirect to frontend with token as query param
    const redirectUrl =
      process.env.NODE_ENV === 'production'
        ? `https://gbp-ai-frontend.vercel.app/dashboard?token=${jwtToken}`
        : `http://localhost:3000/dashboard?token=${jwtToken}`;

    res.redirect(redirectUrl);

  } catch (e) {
    res.status(500).json({
      message: 'Auth callback failed',
      error: e.response?.data || e.message,
    });
  }
};
