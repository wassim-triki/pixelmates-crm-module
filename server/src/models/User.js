const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    image: { type: String }, // Profile picture URL
    phone: { type: String },
    address: { type: String },
    birthday: { type: Date },
    points: { type: Number, default: 0 },
    password: { type: String, select: false }, // Hide password when querying users
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    refreshToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    status: {
      type: String,
      enum: ['Active', 'Banned', 'Blocked'],
      default: 'Active',
    },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpire: { type: Date },
    provider: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      default: 'local',
    },
    providerId: { type: String }, // Google or Facebook user ID
    facebookId: { type: String }, // Facebook user ID
    facebookAccessToken: { type: String }, // facultatif, utile pour API Facebook

  },
  { timestamps: true }
);

// Hash password before saving (only for local users)
UserSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    // ✅ Ensure password exists
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    return false; // Prevents checking password for Google users
  }

  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
