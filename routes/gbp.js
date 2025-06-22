const express = require('express');
const router = express.Router();
const gbpController = require('../controllers/gbpController');
const auth = require('../middleware/auth'); // This must decode JWT and attach jwtUser to req

// Secure route to fetch GBP locations
router.get('/locations', auth, gbpController.getLocations);

module.exports = router;
