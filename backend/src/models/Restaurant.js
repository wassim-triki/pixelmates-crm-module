const { default: mongoose } = require("mongoose");
const validator = require('validator');

// Custom validation function for images array
function arrayLimit(val) {
  return val.length <= 10;
}

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    cuisineType: {
      type: String,
      required: true,
      enum: [
        "Italian",
        "Mexican",
        "Asian",
        "French",
        "American",
        "Fusion",
        "Other",
      ],
      default: "Other",
    },
    taxeTPS: {
      type: String,
      required: true,
      match: [/^\d+(\.\d+)?%$/, "TPS format should be like '5%' or '5.5%'"],
    },
    taxeTVQ: {
      type: String,
      required: true,
      match: [/^\d+(\.\d+)?%$/, "TVQ format should be like '9.975%'"],
    },
    color: {
      type: String,
      default: "#FFFFFF",
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color code"],
    },
    logo: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v, { protocols: ["http", "https"] }),
        message: "Invalid logo URL",
      },
    },
    promotion: {
      type: String,
      maxlength: 500,
    },
    payCashMethod: {
      type: String,
      enum: ["accepted", "not-accepted", "on-request"],
      default: "not-accepted",
    },
    images: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },
  },
  { 
    timestamps: true,
    validateModifiedOnly: true // Only validate modified fields
  }
);

// Indexes for faster queries
RestaurantSchema.index({ name: 1 });
RestaurantSchema.index({ cuisineType: 1 });

module.exports = mongoose.model("Restaurant", RestaurantSchema);