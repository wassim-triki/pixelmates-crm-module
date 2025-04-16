const mongoose = require('mongoose');
const validator = require('validator');

const TableSchema = new mongoose.Schema(
  {
    nbtable: {
      type: Number,
      required: [true, 'Table number is required'],
      min: [1, 'Table number must be at least 1'],
    },
    chairnb: {
      type: Number,
      required: [true, 'Number of chairs is required'],
      min: [1, 'Number of chairs must be at least 1'],
      max: [20, 'Number of chairs cannot exceed 20'],
    },
    qrcode: {
      type: String,
      required: [true, 'QR code is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9-_]+$/.test(v) || validator.isURL(v);
        },
        message: 'Invalid QR code format',
      },
    },
    restauId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
    },
    isReserved: {
      type: Boolean,
      default: false, // Par défaut, la table n'est pas réservée
      select: true 
      
    }

  },
  {
    timestamps: true,
    validateModifiedOnly: true,
  }
);

// Compound index for unique table numbers per restaurant
TableSchema.index({ restauId: 1, nbtable: 1 }, { unique: true });
// Index for restaurant queries
TableSchema.index({ restauId: 1 });

module.exports = mongoose.model('Table', TableSchema);