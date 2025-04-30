const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');
const Table = require('../models/Table');
const mongoose = require('mongoose');
const calculateEndTime = (dateString, startTime) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const date = new Date(dateString);
  date.setHours(hours + 2, minutes);
  const formatted = date.toTimeString().split(' ')[0].slice(0, 5); // "HH:mm"
  return formatted;
};
function isWithinOpeningHours(restaurant, dateString, time) {
  const dayOfWeek = new Date(dateString).getDay(); // 0 = dimanche, 1 = lundi, ...
  const openingHours = restaurant.openingHours?.[dayOfWeek];

  if (!openingHours || !openingHours.start || !openingHours.end) return false;

  // Comparer les heures
  return time >= openingHours.start && time <= openingHours.end;
}

// Nouvelle fonction de vérification de disponibilité
exports.checkAvailability = async (req, res) => {
  try {
    const { restaurantId, date, time, partySize, preferences } = req.body;
   
    // 1. Vérifier les horaires d'ouverture
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant.openingHours || !isWithinOpeningHours(restaurant, date, time)) {
      return res.status(400).json({ message: 'Restaurant fermé à cet horaire' });
    }

    // 2. Trouver les tables correspondantes
    const matchingTables = await Table.find({
      restauId: restaurantId,
      chairnb: { $gte: partySize },
      ...preferences
    });

    // 3. Vérifier disponibilité
    const availableTables = await Promise.all(
      matchingTables.map(async table => {
        const conflicts = await Reservation.find({
          table: table._id,
          reservationDate: date,
          $or: [
            { startTime: { $lt: time.end }, endTime: { $gt: time.start } },
            { status: { $in: ['confirmed', 'pending'] } }
          ]
        });
        return conflicts.length === 0 ? table : null;
      })
    );

    // 4. Classement par préférences
    const filteredTables = availableTables.filter(t => t).sort((a, b) => 
      (b.features.includes('private') - a.features.includes('private')) ||
      (b.view !== 'none' - a.view !== 'none')
    );

    res.json({ 
      available: filteredTables,
      nextAvailableSlot: filteredTables.length > 0 ? null : await findNextAvailableSlot(restaurantId)
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Erreur de vérification', error: error.message });
  }
};

// Modification de createReservation avec gestion liste d'attente
exports.createReservation = async (req, res) => {
  try {
    const { user, restaurant, table, reservationDate, startTime, endTime, partySize, specialRequests } = req.body;
    if (!mongoose.Types.ObjectId.isValid(restaurant) || 
        !mongoose.Types.ObjectId.isValid(table) || 
        !mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const existingReservation = await Reservation.findOne({
      table,
      reservationDate: new Date(reservationDate),
      reservationDate: new Date(reservationDate),
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
      status: { $in: ['confirmed', 'pending'] }
      
    });

    if (existingReservation) {
      return res.status(409).json({
        message: 'Conflit de réservation',
        conflictingSlot: {
          start: existingReservation.startTime,
          end: existingReservation.endTime
        }
      });
    }

    const newReservation = await Reservation.create({
      user,
      restaurant,
      table,
      reservationDate: new Date(reservationDate),
      startTime,
      endTime,
      partySize,
      specialRequests,
      status: 'confirmed'
    });

    res.status(201).json({
      message: 'Réservation créée avec succès',
      reservation: newReservation
    });
  } catch (error) {
    console.error('Erreur de réservation:', error);
    res.status(500).json({
      message: 'Erreur serveur',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Gestion annulation avec mise à jour liste d'attente
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    // Si annulation d'une réservation confirmée, libérer la table
    if (reservation.status === 'confirmed') {
      await processWaitingList(reservation.restaurant, reservation.reservationDate);
    }

    res.json({ message: 'Réservation annulée', reservation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur d annulation', error: error.message });
  }
};

// Obtenir les réservations d'un restaurant
exports.getRestaurantReservations = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reservations = await Reservation.find({ restaurant: restaurantId });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations', error: error.message });
  }
};

// Obtenir les réservations de l'utilisateur connecté
exports.getUserReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await Reservation.find({ user: userId });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations utilisateur', error: error.message });
  }
};

// Mettre à jour le statut d'une réservation (confirmée, refusée, etc.)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { status } = req.body;

    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { status },
      { new: true }
    );

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
  }
};
