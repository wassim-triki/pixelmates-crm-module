const mongoose = require('mongoose');

const LoyaltyProgramSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  points: { type: Number, default: 0 },
  level: { type: String, default: 'Bronze' },
  totalReservations: { type: Number, default: 0 },
  lastReservationDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('LoyaltyProgram', LoyaltyProgramSchema);


/*

function calculateLevel(points) {
  if (points >= 1000) return 'Platinum';
  if (points >= 500) return 'Gold';
  if (points >= 200) return 'Silver';
  return 'Bronze';
}


*/