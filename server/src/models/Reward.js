// models/Reward.js
const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Free Dessert"
  description: { type: String },
  pointsCost: { type: Number, required: true }, // how many points needed to redeem
  isActive: { type: Boolean, default: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
