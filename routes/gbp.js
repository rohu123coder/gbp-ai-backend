// routes/gbp.js
const express = require('express');
const router = express.Router();
const gbpController = require('../controllers/gbpController');

// GBP locations list
router.get('/locations', gbpController.getLocations);

module.exports = router;
