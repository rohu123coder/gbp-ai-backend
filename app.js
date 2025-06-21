require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('./passport'); // Make sure this exports passport setup
const authRoutes = require('./routes/auth');

const app = express();

// 👇 Update: ONLY those frontend origins you ACTUALLY want to allow
const allowedOrigins = [
  'http://localhost:3000',                   // Local React dev
  'https://gbp-ai-frontend.vercel.app'       // Vercel production frontend
  // REMOVE 'https://localspark.clickfox.in' unless you use it!
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
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
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// IMPORTANT: Session ke baad passport initialize karo
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Auth routes
app.use('/api/auth', authRoutes);

// Root test route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from GBP AI Backend!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
