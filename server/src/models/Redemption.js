// models/Redemption.js
const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reward: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward', required: true },
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }, // optional, if tied to reservation
  redeemedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Redemption', redemptionSchema);
