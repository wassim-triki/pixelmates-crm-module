const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Role = require('./Role');

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, unique: true, required: true },
    image: { type: String, required: false }, // URL to image
    phone: { type: String, required: false },
    address: { type: String, required: false },
    birthday: { type: Date, required: false },
    password: { type: String, required: true }, // Hashed password
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }, // Reference to Role
    refreshToken: { type: String }, // Refresh token for JWT
    resetPasswordToken: { type: String }, // Token for resetting password
    resetPasswordExpire: { type: Date }, // Expiration date for reset password token
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: false,
    }, // Only for Admins/Employees
    status: { 
      type: String, 
      enum: ['Active', 'Banned', 'Blocked'], 
      default: 'Active' // Default value is 'active'
    }
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // Hash only if password is modified
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
