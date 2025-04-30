const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Debug imports (peuvent être retirés après débogage)
console.log('reservationController:', reservationController);
console.log('checkAvailability:', reservationController.checkAvailability);
console.log('createReservation:', reservationController.createReservation);
console.log('authMiddleware:', authMiddleware);
console.log('authMiddleware.protect:', authMiddleware.protect);

// Create a new reservation
router.post('/', authMiddleware.protect, reservationController.createReservation);

// Get all reservations for a restaurant
router.get('/restaurant/:restaurantId', authMiddleware.protect, reservationController.getRestaurantReservations);

// Get user's reservations

// Cancel a reservation (PUT version)
router.put('/cancel/:reservationId', authMiddleware.protect, reservationController.cancelReservation);

// Update reservation status (for restaurant owners/managers)
router.put('/status/:reservationId', authMiddleware.protect, reservationController.updateReservationStatus);

// Check availability
router.get('/availability', authMiddleware.protect, reservationController.checkAvailability);
// Get current user's reservations
router.get('/myReservations', authMiddleware.protect, reservationController.getUserReservations);

// Remove DELETE version of cancel (optional: keep only one way to cancel)
module.exports = router;
