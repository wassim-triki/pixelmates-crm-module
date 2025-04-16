const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { restaurantId, tableId, reservationDate, partySize, specialRequests } = req.body;
    
    // Validate input
    if (!restaurantId || !tableId || !reservationDate || !partySize) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if table belongs to restaurant
    if (!restaurant.tables.includes(tableId)) {
      return res.status(400).json({ message: 'Invalid table for this restaurant' });
    }

    // Check for conflicting reservations
    const conflictingReservation = await Reservation.findOne({
      restaurant: restaurantId,
      table: tableId,
      reservationDate: {
        $gte: new Date(reservationDate).setHours(0, 0, 0, 0),
        $lte: new Date(reservationDate).setHours(23, 59, 59, 999)
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingReservation) {
      return res.status(400).json({ message: 'Table already reserved for this time' });
    }

    const reservation = new Reservation({
      user: req.user._id, // Assuming user is authenticated and ID is available
      restaurant: restaurantId,
      table: tableId,
      reservationDate: new Date(reservationDate),
      partySize,
      specialRequests
    });

    await reservation.save();

    // Add reservation to restaurant
    restaurant.reservations.push(reservation._id);
    await restaurant.save();

    res.status(201).json({ message: 'Reservation created successfully', reservation });
  } catch (error) {
    res.status(500).json({ message: 'Error creating reservation', error: error.message });
  }
};

// Get all reservations for a restaurant
exports.getRestaurantReservations = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { date } = req.query; // Optional date filter

    const query = { restaurant: restaurantId };
    if (date) {
      query.reservationDate = {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59, 999)
      };
    }

    const reservations = await Reservation.find(query)
      .populate('user', 'name email')
      .populate('table')
      .sort({ reservationDate: 1 });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
};

// Get user's reservations
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('restaurant', 'name address')
      .populate('table')
      .sort({ reservationDate: -1 });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user reservations', error: error.message });
  }
};

// Cancel a reservation
exports.cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const reservation = await Reservation.findOne({
      _id: reservationId,
      user: req.user._id
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found or unauthorized' });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: 'Reservation already cancelled' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling reservation', error: error.message });
  }
};

// Update reservation status (for restaurant owners/managers)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Verify user has permission to update (e.g., restaurant owner)
    const restaurant = await Restaurant.findById(reservation.restaurant);
    // Add your authorization logic here (e.g., check if req.user is restaurant owner)

    reservation.status = status;
    await reservation.save();

    res.status(200).json({ message: 'Reservation status updated', reservation });
  } catch (error) {
    res.status(500).json({ message: 'Error updating reservation status', error: error.message });
  }
};