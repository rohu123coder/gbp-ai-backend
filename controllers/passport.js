const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// User session serialize/deserialize
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.REDIRECT_URI
},
(accessToken, refreshToken, profile, done) => {
  // Sab token/profile info session me save kar lo
  // User object = { ...profile, accessToken, refreshToken }
  const user = {
    ...profile._json,
    accessToken,
    refreshToken
  };
  return done(null, user);
}));

module.exports = passport;
