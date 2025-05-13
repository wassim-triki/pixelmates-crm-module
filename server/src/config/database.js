const mongoose = require("mongoose");
require("dotenv").config();

const ENV = process.env.NODE_ENV || "development";
const mongoURI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/themenufy-dev';

mongoose.set("strictQuery", false); // Avoid future deprecation warnings

async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`✅ MongoDB Connected to ${mongoURI}`);
    }
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

// Désactivez la reconnexion automatique en mode test
if (process.env.NODE_ENV !== 'test') {
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB Disconnected! Attempting to Reconnect...");
    connectDB();
  });
}



module.exports = connectDB;
