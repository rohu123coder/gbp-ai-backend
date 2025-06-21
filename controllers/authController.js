// controllers/authController.js
const axios = require('axios');
const qs = require('querystring');

// 1. Start Google OAuth (redirect user to Google consent screen)
exports.googleAuth = (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID
    }&redirect_uri=${process.env.REDIRECT_URI
    }&response_type=code&scope=https://www.googleapis.com/auth/business.manage%20profile%20email%20openid&access_type=offline&prompt=consent`;
  res.redirect(authUrl);
};

// 2. Handle Google OAuth Callback
exports.googleCallback = async (req, res) => {
  console.log("==== [Google OAuth Callback] ====");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  const { code } = req.query;
  console.log("Google code param:", code);

  if (!code) {
    console.error("[Google OAuth] No code found in callback!");
    return res.status(400).json({ message: 'No code in callback' });
  }

  try {
    // Exchange 'code' for access_token & refresh_token
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
    console.log('[Google OAuth] Token Response:', tokenRes.data);

    // Optionally, get user info (email/profile) -- useful for user DB entry
    let userInfo = {};
    if (access_token) {
      const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      userInfo = userRes.data;
      console.log("[Google User Info]", userInfo);
    }

    // 🔐 TODO: Save tokens & user info to session/db here for login persistence
    // req.session.access_token = access_token;
    // req.session.refresh_token = refresh_token;
    // req.session.user = userInfo;

    // Smart redirect: dev vs prod
    const redirectUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://gbp-ai-frontend.vercel.app/dashboard'
        : 'http://localhost:3000/dashboard';

    console.log("[Google OAuth] Redirecting to:", redirectUrl);
    res.redirect(redirectUrl);

  } catch (e) {
    console.error('[Google OAuth Error]', e.response?.data || e.message);
    res.status(500).json({
      message: 'Auth callback failed',
      error: e.response?.data || e.message,
    });
  }
};

