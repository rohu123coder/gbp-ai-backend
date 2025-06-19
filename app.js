const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors({ origin: 'https://localspark.clickfox.in', credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB Connected'));

app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log('Backend running on 5000'));
