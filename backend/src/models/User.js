const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    image: { type: String, required: false }, // URL to image
    phone: { type: String, required: false },
    address: { type: String, required: false },
    birthday: { type: Date, required: false },
    password: { type: String, required: true }, // Hashed password
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" }, // Reference to Role
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: false,
    }, // Only for Admins/Employees
  },
  { timestamps: true },
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
