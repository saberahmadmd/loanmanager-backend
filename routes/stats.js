const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Get dashboard statistics
router.get('/dashboard', statsController.getDashboardStats);

module.exports = router;