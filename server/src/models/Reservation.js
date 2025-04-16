const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  reservationDate: { type: Date, required: true },
  partySize: { type: Number, required: true, min: 1 },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending' 
  },
  specialRequests: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Index for efficient querying by restaurant and date
reservationSchema.index({ restaurant: 1, reservationDate: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);