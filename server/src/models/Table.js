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
    shape: {
      type: String,
      enum: ['rectangle', 'square', 'round'],
      required: [true, 'Table shape is required'],
      default: 'rectangle'
    },
    location: {
      type: String,
      enum: ['window', 'center', 'terrace', 'main lounge'],
      required: [true, 'Table location is required'],
      default: 'center'
    },
    view: {
      type: String,
      enum: ['sea', 'pool', 'city', 'garden', 'none'],
      required: [true, 'Table view is required'],
      default: 'none'
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
    features: {
      type: [String],
      enum: ['USB charger', 'TV screen', 'smoking area', 'private'],
      required: true,
      default: [] 
    }
  },
  {
    timestamps: true,
    validateModifiedOnly: true,
  }
);

TableSchema.index({ restauId: 1, nbtable: 1 }, { unique: true });
TableSchema.index({ restauId: 1 });

module.exports = mongoose.model('Table', TableSchema);
