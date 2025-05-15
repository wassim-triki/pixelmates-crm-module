const mongoose = require('mongoose');

// Define a schema for status history
const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Closed'],
    required: true
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String
  }
}, { _id: true });

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Closed'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  category: {
    type: String,
  enum: [
    'Food Quality',
    'Service',
    'Cleanliness',
    'Billing',
    'Delivery Delay',
    'Order Missing',
    'Wrong Order',
    'Cold Food',
    'Rude Staff',
    'Long Wait Time',
    'Unhygienic Packaging',
    'Spoiled Food',
    'Overpriced Items',
    'Unavailable Menu Item',
    'Small Portions',
    'Late Response',
    'Technical Issue',
    'App Crash',
    'Promo Code Issue',
    'Double Charge',
    'Missing Utensils',
    'Incorrect Billing',
    'Bad Online Experience',
    'Inadequate Seating',
    'Noisy Environment',
    'Parking Issues',
    'Unfriendly Reception',
    'Food Allergy Ignored',
    'Food Not Fresh',
    'Delivery Personnel Misbehavior',
    'Unclear Menu',
    'Poor Customer Support',
    'Other'

  ],
    default: 'Other',
    required: true
  },
  response: {
    type: String,
    enum: ['Refund', 'Replacement', 'Apology', 'Discount', 'No Action'],
    default: null
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  statusHistory: [statusHistorySchema],
  comments: [{
    text: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  satisfactionRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date,
    default: null
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update `updatedAt` timestamp and track status changes on save
complaintSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  // If this is a new document, add the initial status to history
  if (this.isNew) {
    this.statusHistory = [{
      status: this.status,
      timestamp: new Date(),
      note: 'Complaint created'
    }];
  }
  // If this is an existing document and status has changed
  else if (this.isModified('status')) {
    // Add the new status to the history
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      // If changedBy is not provided, it will be null
      changedBy: this._changedBy || null,
      note: this._statusNote || `Status changed to ${this.status}`
    });

    // If status changed to 'Resolved', set followUpDate to 7 days from now
    if (this.status === 'Resolved' && !this.followUpDate) {
      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + 7);
      this.followUpDate = followUpDate;
      this.followUpRequired = true;
    }
  }

  next();
});

// Method to set who changed the status and why
complaintSchema.methods.setStatusChange = function(userId, note) {
  this._changedBy = userId;
  this._statusNote = note;
  return this;
};

module.exports = mongoose.model('Complaint', complaintSchema);