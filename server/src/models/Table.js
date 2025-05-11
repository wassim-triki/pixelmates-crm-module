const mongoose = require('mongoose');
const validator = require('validator');

const TableSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, 'Table number is required'],
      trim: true,
      validate: {
        validator: (v) => /^[a-zA-Z0-9-_]+$/.test(v),
        message: 'Invalid table number format',
      },
    },
    minCovers: {
      type: Number,
      required: [true, 'Minimum covers is required'],
      min: [1, 'Minimum covers must be at least 1'],
      default: 1,
    },
    maxCovers: {
      type: Number,
      required: [true, 'Maximum covers is required'],
      min: [1, 'Maximum covers must be at least 1'],
      default: 1,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    x: {
      type: Number,
      required: [true, 'X position is required'],
      min: [0, 'X position must be at least 0'],
    },
    y: {
      type: Number,
      required: [true, 'Y position is required'],
      min: [0, 'Y position must be at least 0'],
    },
    w: {
      type: Number,
      required: [true, 'Width is required'],
      min: [1, 'Width must be at least 1'],
    },
    h: {
      type: Number,
      required: [true, 'Height is required'],
      min: [1, 'Height must be at least 1'],
    },
    shape: {
      type: String,
      enum: ['rectangle', 'circle'],
      required: [true, 'Table shape is required'],
      default: 'rectangle',
    },

    // qrcode: {
    //   type: String,
    //   required: [true, 'QR code is required'],
    //   unique: true,
    //   trim: true,
    //   validate: {
    //     validator: function (v) {
    //       return /^[a-zA-Z0-9-_]+$/.test(v) || validator.isURL(v);
    //     },
    //     message: 'Invalid QR code format',
    //   },
    // },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
    },
  },
  {
    timestamps: true,
    validateModifiedOnly: true,
  }
);

// Compound index: number unique *per restaurant*
TableSchema.index(
  { restaurant: 1, number: 1 },
  { unique: true, name: 'unique_number_per_restaurant' }
);

module.exports = mongoose.model('Table', TableSchema);
