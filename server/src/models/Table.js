const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema(
  {
    // Field used in Restaurant.jsx
    nbtable: {
      type: Number,
      required: [true, 'Table number is required'],
      min: [1, 'Table number must be at least 1'],
      validate: {
        validator: function(v) {
          return v !== null && v !== undefined && !isNaN(v);
        },
        message: 'Table number cannot be null or NaN'
      }
    },
    // Field used in FloorConfiguration.jsx
    number: {
      type: String,
      required: false, // nbtable is the primary field
    },
    // Field used in Restaurant.jsx
    chairnb: {
      type: Number,
      required: [true, 'Chair count is required'],
      min: [1, 'Chair count must be at least 1'],
    },
    // Fields used in FloorConfiguration.jsx
    minCovers: {
      type: Number,
      required: false,
      min: [1, 'Minimum covers must be at least 1'],
      default: 1,
    },
    maxCovers: {
      type: Number,
      required: false,
      min: [1, 'Maximum covers must be at least 1'],
      default: 1,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Support both restaurant and restauId for backward compatibility
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
    },
    restauId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
    },
    isReserved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    validateModifiedOnly: true,
  }
);

// We don't need to define indexes here as they are created in the database directly
// This prevents conflicts with existing indexes

// Pre-save hook to ensure nbtable is a number and sync with number field
TableSchema.pre('save', function(next) {
  // Handle nbtable field
  if (this.nbtable === null || this.nbtable === undefined || isNaN(this.nbtable)) {
    // Try to get from number field if nbtable is missing
    if (this.number) {
      const parsed = parseInt(this.number);
      if (!isNaN(parsed)) {
        this.nbtable = parsed;
      } else {
        return next(new Error('Table number must be a valid number'));
      }
    } else {
      return next(new Error('Table number cannot be null, undefined, or NaN'));
    }
  }

  // Convert to number if it's a string
  if (typeof this.nbtable === 'string') {
    const parsed = parseInt(this.nbtable);
    if (!isNaN(parsed)) {
      this.nbtable = parsed;
    } else {
      return next(new Error('Table number must be a valid number'));
    }
  }

  // Sync number field with nbtable
  this.number = String(this.nbtable);

  // Sync chairnb with maxCovers if needed
  if (!this.chairnb && this.maxCovers) {
    this.chairnb = this.maxCovers;
  }

  // Sync maxCovers with chairnb if needed
  if (!this.maxCovers && this.chairnb) {
    this.maxCovers = this.chairnb;
    this.minCovers = 1;
  }

  next();
});

module.exports = mongoose.model('Table', TableSchema);
