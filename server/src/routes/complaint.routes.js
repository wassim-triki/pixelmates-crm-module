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
const { sendTestSMS } = require('../utils/sms');

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

// Test SMS route
router.post('/test-sms', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    console.log(`Test SMS requested for phone number: ${phoneNumber}`);
    const result = await sendTestSMS(phoneNumber);

    res.status(200).json({
      message: 'Test SMS sent successfully',
      sid: result.sid
    });
  } catch (error) {
    console.error('Error sending test SMS:', error);
    res.status(500).json({
      message: error.message || 'Error sending test SMS'
    });
  }
});

module.exports = router;