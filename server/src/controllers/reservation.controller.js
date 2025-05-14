const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');
const Table = require('../models/Table');

//add
const User = require('../models/User');

const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const Role = require('../models/Role');

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
    if (
      !restaurant.openingHours ||
      !isWithinOpeningHours(restaurant, date, time)
    ) {
      return res
        .status(400)
        .json({ message: 'Restaurant fermé à cet horaire' });
    }

    // 2. Trouver les tables correspondantes
    const matchingTables = await Table.find({
      restauId: restaurantId,
      chairnb: { $gte: partySize },
      ...preferences,
    });

    // 3. Vérifier disponibilité
    const availableTables = await Promise.all(
      matchingTables.map(async (table) => {
        const conflicts = await Reservation.find({
          table: table._id,
          reservationDate: date,
          $or: [
            { startTime: { $lt: time.end }, endTime: { $gt: time.start } },
            { status: { $in: ['confirmed', 'pending'] } },
          ],
        });
        return conflicts.length === 0 ? table : null;
      })
    );

    // 4. Classement par préférences
    const filteredTables = availableTables
      .filter((t) => t)
      .sort(
        (a, b) =>
          b.features.includes('private') - a.features.includes('private') ||
          (b.view !== 'none' - a.view) !== 'none'
      );

    res.json({
      available: filteredTables,
      nextAvailableSlot:
        filteredTables.length > 0
          ? null
          : await findNextAvailableSlot(restaurantId),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erreur de vérification', error: error.message });
  }
};

const RESERVATION_DURATION_MINUTES = 90;

exports.createReservation = asyncHandler(async (req, res) => {
  const { guests, date, time, tableId, userId: bodyUserId } = req.body;

  // ─── A) DETERMINE WHO THIS RESERVATION IS FOR ─────────────
  // 1) get caller’s own userId
  let targetUserId = req.user.userId;

  // 2) load their role document
  const callerRole = await Role.findById(req.user.role);
  const roleName = callerRole?.name || 'Client';

  // 3) only Admin/SuperAdmin may override userId
  if (
    bodyUserId &&
    bodyUserId !== targetUserId &&
    (roleName === 'Admin' || roleName === 'SuperAdmin')
  ) {
    if (!mongoose.Types.ObjectId.isValid(bodyUserId)) {
      return res.status(400).json({ message: 'Invalid override userId' });
    }
    targetUserId = bodyUserId;
  }

  // ─── B) PARSE & VALIDATE START ─────────────────────────────
  const start = new Date(`${date}T${time}:00`);
  if (isNaN(start)) {
    return res.status(400).json({ message: 'Invalid date or time format' });
  }
  if (start < Date.now()) {
    return res.status(400).json({ message: 'Cannot book in the past' });
  }

  // ─── C) COMPUTE END ────────────────────────────────────────
  const end = new Date(start.getTime() + RESERVATION_DURATION_MINUTES * 60_000);

  // ─── D) LOAD & CHECK TABLE ─────────────────────────────────
  const table = await Table.findById(tableId);
  if (!table || table.isAvailable === false) {
    return res.status(404).json({ message: 'Table not found or unavailable' });
  }

  // ─── E) LOAD & CHECK RESTAURANT ────────────────────────────
  const restaurant = await Restaurant.findById(table.restaurant);
  if (!restaurant || restaurant.isPublished === false) {
    return res
      .status(403)
      .json({ message: 'Restaurant not accepting reservations' });
  }

  // ─── F) ENFORCE OPEN HOURS ─────────────────────────────────
  const [openH, openM] = restaurant.workFrom.split(':').map(Number);
  const [closeH, closeM] = restaurant.workTo.split(':').map(Number);
  const open = new Date(start);
  open.setHours(openH, openM, 0, 0);
  const close = new Date(start);
  close.setHours(closeH, closeM, 0, 0);

  if (start < open || end > close) {
    return res.status(400).json({
      message: `Reservations are between ${restaurant.workFrom} and ${restaurant.workTo}`,
    });
  }

  // ─── G) VALIDATE GUEST COUNT ───────────────────────────────
  if (guests < table.minCovers || guests > table.maxCovers) {
    return res.status(400).json({
      message: `Guests must be between ${table.minCovers} and ${table.maxCovers}`,
    });
  }

  // ─── H) CHECK FOR OVERLAPS ─────────────────────────────────
  const conflict = await Reservation.findOne({
    table: table._id,
    status: { $ne: 'cancelled' },
    start: { $lt: end },
    end: { $gt: start },
  });
  if (conflict) {
    return res
      .status(409)
      .json({ message: 'That time slot is already booked' });
  }

  // ─── I) CREATE & RESPOND ───────────────────────────────────
  const reservation = await Reservation.create({
    user: targetUserId,
    restaurant: restaurant._id,
    table: table._id,
    covers: guests,
    start,
    end,
  });

  return res.status(201).json(reservation);
});

exports.updateReservation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    guests,
    date,
    time,
    tableId: newTableId,
    status,
    userId: bodyUserId,
  } = req.body;

  // A) Find existing
  const reservation = await Reservation.findById(id);
  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  // B) Determine target user
  let targetUserId = reservation.user.toString();
  const callerRole = await Role.findById(req.user.role);
  const roleName = callerRole?.name || 'Client';
  if (
    bodyUserId &&
    bodyUserId !== targetUserId &&
    (roleName === 'Admin' || roleName === 'SuperAdmin')
  ) {
    if (!mongoose.Types.ObjectId.isValid(bodyUserId)) {
      return res.status(400).json({ message: 'Invalid override userId' });
    }
    targetUserId = bodyUserId;
  }

  // C) Parse & validate new start
  const start = new Date(`${date}T${time}:00`);
  if (isNaN(start)) {
    return res.status(400).json({ message: 'Invalid date or time format' });
  }
  if (start < Date.now()) {
    return res.status(400).json({ message: 'Cannot book in the past' });
  }

  // D) Compute new end
  const end = new Date(start.getTime() + RESERVATION_DURATION_MINUTES * 60_000);

  // E) Load & check table
  const tableToUse = newTableId
    ? await Table.findById(newTableId)
    : await Table.findById(reservation.table);
  if (!tableToUse || tableToUse.isAvailable === false) {
    return res.status(404).json({ message: 'Table not found or unavailable' });
  }

  // F) Load & check restaurant
  const restaurant = await Restaurant.findById(tableToUse.restaurant);
  if (!restaurant || restaurant.isPublished === false) {
    return res
      .status(403)
      .json({ message: 'Restaurant not accepting reservations' });
  }

  // G) Enforce open hours
  const [openH, openM] = restaurant.workFrom.split(':').map(Number);
  const [closeH, closeM] = restaurant.workTo.split(':').map(Number);
  const openTime = new Date(start);
  const closeTime = new Date(start);
  openTime.setHours(openH, openM, 0, 0);
  closeTime.setHours(closeH, closeM, 0, 0);
  if (start < openTime || end > closeTime) {
    return res.status(400).json({
      message: `Reservations are between ${restaurant.workFrom} and ${restaurant.workTo}`,
    });
  }

  // H) Validate guest count
  const numGuests = guests ?? reservation.covers;
  if (numGuests < tableToUse.minCovers || numGuests > tableToUse.maxCovers) {
    return res.status(400).json({
      message: `Guests must be between ${tableToUse.minCovers} and ${tableToUse.maxCovers}`,
    });
  }

  // I) Check overlaps, but ignore THIS reservation itself
  const conflict = await Reservation.findOne({
    table: tableToUse._id,
    status: { $ne: 'cancelled' },
    start: { $lt: end },
    end: { $gt: start },
    _id: { $ne: reservation._id },
  });
  // if (conflict) {
  //   return res
  //     .status(409)
  //     .json({ message: 'That time slot is already booked' });
  // }

  // J) Apply & save
  reservation.user = targetUserId;
  reservation.table = tableToUse._id;
  reservation.covers = numGuests;
  reservation.start = start;
  reservation.end = end;
  if (status) reservation.status = status;
  await reservation.save();

  // K) Re-fetch with your usual populates
  const populated = await Reservation.findById(reservation._id)
    .populate('user', 'firstName lastName email')
    .populate('restaurant', 'name')
    .populate('table', 'number');

  return res.status(200).json(populated);
});

exports.getReservations = asyncHandler(async (req, res) => {
  // 1) figure out caller’s role name
  const callerRole = await Role.findById(req.user.role);
  const roleName = callerRole?.name || 'Client';

  // 2) build filter
  let filter = {};
  if (roleName === 'SuperAdmin') {
    // no filter → all
  } else if (roleName === 'Admin') {
    const caller = await User.findById(req.user.userId);
    if (!caller?.restaurantId) {
      return res
        .status(403)
        .json({ message: 'No restaurant assigned to this admin' });
    }
    filter = { restaurant: caller.restaurantId };
  } else {
    // Client or any other
    filter = { user: req.user.userId };
  }

  // 3) query + populate
  const reservations = await Reservation.find(filter)
    .sort('-start')
    .populate('user', 'firstName lastName email')
    .populate('restaurant', 'name')
    .populate('table', 'number');

  // 4) send it back
  res.json({ success: true, count: reservations.length, data: reservations });
});
// added by chaher
/*exports.createReservation = async (req, res) => {
  try {
    const { user, restaurant, table, reservationDate, startTime, endTime, partySize, specialRequests } = req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurant) || 
        !mongoose.Types.ObjectId.isValid(table) || 
        !mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    // Vérification de conflit
    const existingReservation = await Reservation.findOne({
      table,
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

    // 🟡 Calcul des points gagnés (exemple : 10 points par personne)
    const earnedPoints = partySize * 10;

    // 🔵 Création de la réservation avec les points
    const newReservation = await Reservation.create({
      user,
      restaurant,
      table,
      reservationDate: new Date(reservationDate),
      startTime,
      endTime,
      partySize,
      specialRequests,
      status: 'confirmed',
      points: earnedPoints // Optional: store it in reservation
    });

    // 🔴 Mise à jour des points utilisateur
    await User.findByIdAndUpdate(user, { $inc: { points: earnedPoints } });

    res.status(201).json({
      message: 'Réservation créée avec succès',
      reservation: newReservation,
      earnedPoints
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
*/

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
      await processWaitingList(
        reservation.restaurant,
        reservation.reservationDate
      );
    }

    res.json({ message: 'Réservation annulée', reservation });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erreur d annulation', error: error.message });
  }
};

// Obtenir les réservations d'un restaurant
exports.getRestaurantReservations = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reservations = await Reservation.find({ restaurant: restaurantId });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des réservations',
      error: error.message,
    });
  }
};

// Obtenir les réservations de l'utilisateur connecté
exports.getUserReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await Reservation.find({ user: userId });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des réservations utilisateur',
      error: error.message,
    });
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
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message,
    });
  }
};
