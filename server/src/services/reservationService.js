const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

// Gestion dynamique des préférences
const buildTablePreferencesQuery = (preferences) => {
  const query = {};
  if (preferences.shape) query.shape = preferences.shape;
  if (preferences.location) query.location = preferences.location;
  if (preferences.view && preferences.view !== 'any') query.view = preferences.view;
  if (preferences.features) query.features = { $all: preferences.features.split(',') };
  return query;
};

// Trouver le prochain créneau disponible
exports.findNextAvailableSlot = async (restaurantId) => {
  const reservations = await Reservation.find({ restaurant: restaurantId })
    .sort({ reservationDate: 1 })
    .limit(10);

  // Logique de détection des trous dans l agenda
  // [Implémentez votre logique de détection de créneaux ici]
  return nextAvailableSlots;
};

// Mise à jour automatique de la liste d'attente
exports.processWaitingList = async (restaurantId, date) => {
  const restaurant = await Restaurant.findById(restaurantId).populate('waitingList');
  const nextInLine = restaurant.waitingList
    .filter(r => r.reservationDate.getTime() === new Date(date).getTime())
    .sort((a, b) => a.waitingListPosition - b.waitingListPosition)[0];

  if (nextInLine) {
    nextInLine.status = 'confirmed';
    await nextInLine.save();
    
    // Mettre à jour la liste d'attente
    restaurant.waitingList = restaurant.waitingList.filter(r => r._id !== nextInLine._id);
    await restaurant.save();
  }
};