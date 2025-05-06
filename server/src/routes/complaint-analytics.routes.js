const express = require('express');
const {
  getComplaintsByStatus,
  getComplaintsByCategory,
  getComplaintsByTimePeriod,
  getAverageResolutionTime,
  getSatisfactionRatings,
  getAllAnalytics
} = require('../controllers/complaint-analytics.controller.js');

const router = express.Router();

// Get complaint statistics by status
router.get('/by-status', getComplaintsByStatus);

// Get complaint statistics by category
router.get('/by-category', getComplaintsByCategory);

// Get complaint statistics by time period
router.get('/by-time', getComplaintsByTimePeriod);

// Get average resolution time
router.get('/resolution-time', getAverageResolutionTime);

// Get satisfaction ratings
router.get('/satisfaction', getSatisfactionRatings);

// Get all analytics data in a single request (to avoid rate limiting)
router.get('/all', getAllAnalytics);

module.exports = router;
