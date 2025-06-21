const axios = require('axios');
const qs = require('querystring');

// Step 1: Start Google OAuth
exports.googleAuth = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/business.manage&access_type=offline&prompt=consent`;
  res.redirect(url);
};

// Step 2: Handle Google OAuth Callback
exports.googleCallback = async (req, res) => {
  console.log("==== Google OAuth Callback ====");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  const { code } = req.query;
  console.log("Google code param:", code);

  if (!code) {
    console.error("[Google OAuth] No code found in callback!");
    return res.status(400).json({ message: 'No code in callback' });
  }

  try {
    // Prepare URL-encoded params for token exchange
    const params = qs.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    // Exchange code for tokens
    const { data } = await axios.post(
      'https://oauth2.googleapis.com/token',
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    // Debug token data (remove/comment out in production)
    console.log('Google OAuth Token Response:', data);

    // Smart redirect: local vs production
    const redirectUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://gbp-ai-frontend.vercel.app/dashboard'
        : 'http://localhost:3000/dashboard';

    console.log("Redirecting to:", redirectUrl);
    res.redirect(redirectUrl);

  } catch (e) {
    console.error('OAuth Error:', e.response?.data || e.message);
    res.status(500).json({
      message: 'Auth callback failed',
      error: e.response?.data || e.message,
    });
  }
};
