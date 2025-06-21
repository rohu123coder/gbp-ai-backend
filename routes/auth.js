// routes/auth.js
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

// ⭐⭐ NEW: Add this route for login status check
router.get('/check', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// ⭐⭐ (OPTIONAL) Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(
      process.env.NODE_ENV === 'production'
        ? 'https://gbp-ai-frontend.vercel.app/'
        : 'http://localhost:3000/'
    );
  });
});

module.exports = router;
