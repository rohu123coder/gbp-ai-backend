// passport.js
const passport = require('./controllers/passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure your Google OAuth strategy here
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.REDIRECT_URI
  },
  (accessToken, refreshToken, profile, done) => {
    // Save user info as needed
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
