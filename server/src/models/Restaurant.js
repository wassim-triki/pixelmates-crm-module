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
    // Thumbnail image URL
    thumbnail: { type: String },
    // Gallery images URLs
    images: [{ type: String }],
    // Legacy logo field (if still used elsewhere)
    logo: { type: String },
    promotion: { type: String },
    payCashMethod: { type: String },
    tables: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
      },
    ],
    waitingList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
