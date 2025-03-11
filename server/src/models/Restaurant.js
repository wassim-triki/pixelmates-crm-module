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
      trim: true,
      maxlength: 100,
      default: null, // Allow null values
    },
    address: {
      type: String,
      trim: true,
      default: null, // Allow null values
    },
    cuisineType: {
      type: String,
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
       // Allow null values
        },
        taxeTPS: {
          type: String,
          match: [/^\d+(\.\d+)?%$/, "TPS format should be like '5%' or '5.5%'"],
          default: null, // Allow null values
        },
        taxeTVQ: {
          type: String,
          match: [/^\d+(\.\d+)?%$/, "TVQ format should be like '9.975%'"],
           // Allow null values
            },
            color: {
              type: String,
              match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color code"],
              default: null, // Allow null values
    },
    logo: {
      type: String,
      validate: {
        validator: function(v) {
          // Allow empty strings or valid URLs
          return v === '' || validator.isURL(v, { 
            protocols: ["http", "https"],
            require_protocol: true // Ensures protocol is present
          });
        },
        message: "Invalid logo URL - must be empty or valid URL"
      },
      default: null, // Allow null values
    },
    promotion: {
      type: String,
      maxlength: 500,
      default: null, // Allow null values
    },
    payCashMethod: {
      type: String,
      enum: ["accepted", "not-accepted", "on-request"],
      default: "not-accepted",
      null: true, // Allow null values
    },
    images: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
      default: [] // Default to an empty array if not provided
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