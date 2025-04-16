const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Debug imports
console.log('reservationController:', reservationController);
console.log('createReservation:', reservationController.createReservation);
console.log('authMiddleware:', authMiddleware);
console.log('authMiddleware.protect:', authMiddleware.protect);

// Create a new reservation
router.post('/', authMiddleware.protect, reservationController.createReservation);

// Get all reservations for a restaurant
router.get('/restaurant/:restaurantId', authMiddleware.protect, reservationController.getRestaurantReservations);

// Get user's reservations
router.get('/user', authMiddleware.protect, reservationController.getUserReservations);

// Cancel a reservation
router.put('/cancel/:reservationId', authMiddleware.protect, reservationController.cancelReservation);

// Update reservation status (for restaurant owners/managers)
router.put('/status/:reservationId', authMiddleware.protect, reservationController.updateReservationStatus);

module.exports = router;