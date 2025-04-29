const express = require('express');
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getComplaintsByRestaurant,
  getUserComplaints,
  sendSMS
} = require('../controllers/complaint.controller.js');

const router = express.Router();

router.post('/', createComplaint);
router.get('/', getAllComplaints);
router.get('/:id', getComplaintById);
router.put('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);
router.get('/restaurant/:restaurantId', getComplaintsByRestaurant);
router.get('/user/:userId', getUserComplaints);

router.post(
  '/:id/send-sms',sendSMS
);
module.exports = router;