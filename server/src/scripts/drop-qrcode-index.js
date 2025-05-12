// Script to drop the qrcode index from the Table collection
const mongoose = require('mongoose');
require('dotenv').config();

async function dropQRCodeIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Get the Table collection
    const db = mongoose.connection.db;
    const collection = db.collection('tables');
    
    // Drop the qrcode index
    try {
      await collection.dropIndex('qrcode_1');
      console.log('Successfully dropped qrcode_1 index');
    } catch (indexError) {
      console.log('Index qrcode_1 might not exist or could not be dropped:', indexError.message);
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
dropQRCodeIndex();
