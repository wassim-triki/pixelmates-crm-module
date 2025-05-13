const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
    },
    covers: {
      type: Number,
      required: [true, 'Number of covers is required'],
      min: [1, 'At least one cover required'],
    },
    start: {
      type: Date,
      required: [true, 'Reservation start time is required'],
    },
    end: {
      type: Date,
      required: [true, 'Reservation end time is required'],
      validate: {
        validator: function (v) {
          return v > this.start;
        },
        message: '`end` must be after `start`',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent overlapping (non-cancelled) reservations on the same table
ReservationSchema.index(
  { table: 1, start: 1, end: 1 },
  {
    partialFilterExpression: { status: { $ne: 'cancelled' } },
  }
);

module.exports = mongoose.model('Reservation', ReservationSchema);
