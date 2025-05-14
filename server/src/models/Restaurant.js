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
    workFrom: {
      type: String,
      default: '07:00',
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'must be HH:mm'],
    },
    workTo: {
      type: String,
      default: '22:00',
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'must be HH:mm'],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },

    logo: { type: String },
    promotion: { type: String },
    payCashMethod: { type: String },
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }],
    waitingList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
    tags: {
      type: [String],
      default: []
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
