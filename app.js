require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('./controllers/passport'); // Passport setup
const authRoutes = require('./routes/auth');
const gbpRoutes = require('./routes/gbp'); // GBP routes

const app = express();
app.set('trust proxy', 1);

// ======= FRONTEND URLS YOU ALLOW ======
const allowedOrigins = [
  'http://localhost:3000',              // Local dev
  'https://gbp-ai-frontend.vercel.app'  // Vercel production
];

// ======= CORS SETUP ==========
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ======= SESSION SETUP ========
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'none',   // For cross-domain (Vercel <-> Render)
    secure: true        // For HTTPS (LIVE deploy only)
    // local testing? Use: sameSite: 'lax', secure: false
  }
}));

// ======= PASSPORT SETUP ========
app.use(passport.initialize());
app.use(passport.session());

// ======= MONGODB CONNECT =======
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// ======= ROUTES =======
app.use('/api/auth', authRoutes); // Google OAuth etc.
app.use('/api/gbp', gbpRoutes);   // GBP APIs

// ======= HEALTH CHECK =======
app.get('/', (req, res) => {
  res.json({ message: 'Hello from GBP AI Backend!' });
});

// ======= START SERVER =======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
