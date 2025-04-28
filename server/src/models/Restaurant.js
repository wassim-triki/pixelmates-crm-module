// models/Restaurant.js
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  cuisineType: { type: String },
  taxeTPS: { type: Number },
  taxeTVQ: { type: Number },
  color: { type: String },
  logo: { type: String },
  promotion: { type: String },
  payCashMethod: { type: String },
  images: [String],
  tables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }],
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
