const axios = require('axios');

exports.googleAuth = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/business.manage&access_type=offline&prompt=consent`;
  res.redirect(url);
};

exports.googleCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ message: 'No code in callback' });
  try {
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    });
    res.redirect('https://localspark.clickfox.in/dashboard');
  } catch (e) {
    console.error('OAuth Error:', e.response?.data || e.message);
    res.status(500).json({ message: 'Auth callback failed', error: e.response?.data || e.message });
  }
};
