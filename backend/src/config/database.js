const mongoose = require("mongoose");
require("dotenv").config();

const ENV = process.env.NODE_ENV || "development";
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/themenufy-dev";

mongoose.set("strictQuery", false); // Avoid future deprecation warnings

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected to ${mongoURI}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Handle auto-reconnection in case of disconnection
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB Disconnected! Attempting to Reconnect...");
  connectDB();
});

module.exports = connectDB;
