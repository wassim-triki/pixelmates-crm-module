const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
  createReservation,
  getReservations,
} = require('../controllers/reservation.controller');

// Create a new reservation
router
  .route('/')
  .post(protect, createReservation)
  .get(protect, getReservations);

// Get all reservations for a restaurant
// router.get(
//   '/restaurant/:restaurantId',
//   authMiddleware.protect,
//   reservationController.getRestaurantReservations
// );

// // Get user's reservations

// // Cancel a reservation (PUT version)
// router.put(
//   '/cancel/:reservationId',
//   authMiddleware.protect,
//   reservationController.cancelReservation
// );

// // Update reservation status (for restaurant owners/managers)
// router.put(
//   '/status/:reservationId',
//   authMiddleware.protect,
//   reservationController.updateReservationStatus
// );

// // Check availability
// router.get(
//   '/availability',
//   authMiddleware.protect,
//   reservationController.checkAvailability
// );
// // Get current user's reservations
// router.get(
//   '/myReservations',
//   authMiddleware.protect,
//   reservationController.getUserReservations
// );

// Remove DELETE version of cancel (optional: keep only one way to cancel)
module.exports = router;
