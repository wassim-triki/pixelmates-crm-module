const { default: mongoose } = require("mongoose");

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

module.exports = mongoose.model("User", UserSchema);
