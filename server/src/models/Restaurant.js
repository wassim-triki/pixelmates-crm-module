// models/Restaurant.js
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    address: { type: String },
    cuisineType: { type: String },
    taxeTPS: { type: Number },
    taxeTVQ: { type: Number },
    color: { type: String },
    thumbnail: { type: String },
    images: [{ type: String }],

    // **NEW** optional geolocation field
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },

    logo: { type: String },
    promotion: { type: String },
    payCashMethod: { type: String },
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }],
    waitingList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
