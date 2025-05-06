const express = require('express');
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getComplaintsByRestaurant,
  getUserComplaints,
  sendSMS,
  addComment,
  rateComplaint,
  processFollowUps
} = require('../controllers/complaint.controller.js');

const router = express.Router();

// Basic CRUD operations
router.post('/', createComplaint);
router.get('/', getAllComplaints);
router.get('/:id', getComplaintById);
router.put('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);

// Filtering routes
router.get('/restaurant/:restaurantId', getComplaintsByRestaurant);
router.get('/user/:userId', getUserComplaints);

// Notification routes
router.post('/:id/send-sms', sendSMS);

// Comment functionality
router.post('/:id/comments', addComment);

// Rating functionality
router.post('/:id/rate', rateComplaint);

// Follow-up processing
router.post('/process-followups', processFollowUps);

module.exports = router;