// Direct script to drop the qrcode index
require('dotenv').config();
const mongoose = require('mongoose');

async function dropIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Get the Table collection
    const db = mongoose.connection.db;
    const collection = db.collection('tables');
    
    // Drop all qrcode-related indexes
    try {
      await collection.dropIndex('qrcode_1');
      console.log('Successfully dropped qrcode_1 index');
    } catch (err) {
      console.log('Error dropping qrcode_1 index:', err.message);
    }
    
    try {
      await collection.dropIndex('unique_qrcode');
      console.log('Successfully dropped unique_qrcode index');
    } catch (err) {
      console.log('Error dropping unique_qrcode index:', err.message);
    }
    
    // List all indexes to verify
    const indexes = await collection.indexes();
    console.log('Current indexes on tables collection:', indexes);
    
    console.log('Script completed successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
dropIndex();
