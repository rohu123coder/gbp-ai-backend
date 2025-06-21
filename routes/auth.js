const express = require('express');
const router = express.Router();
const passport = require('passport');

// Google OAuth Start
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/business.manage'],
  accessType: 'offline',
  prompt: 'consent'
}));

// Google OAuth Callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
  session: true
}), (req, res) => {
  // ✅ Dynamic frontend redirect
  const redirectUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://gbp-ai-frontend.vercel.app/dashboard'
      : 'http://localhost:3000/dashboard';

  console.log('[Auth.js] Redirecting after successful login to:', redirectUrl);
  res.redirect(redirectUrl);
});

module.exports = router;

